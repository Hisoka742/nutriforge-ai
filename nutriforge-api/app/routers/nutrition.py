from fastapi import APIRouter, HTTPException
from app.schemas.user_schemas import ProfileCreate
from app.schemas.nutrition_schemas import MacroTargets, FoodSearchRequest
from app.ml.macro_engine import calculate_macro_targets, get_bmi
import httpx
from app.config import settings

router = APIRouter()


@router.post("/macros", response_model=MacroTargets)
def get_macro_targets(profile: ProfileCreate):
    return calculate_macro_targets(
        gender=profile.gender,
        age=profile.age,
        weight_kg=profile.weight_kg,
        height_cm=profile.height_cm,
        activity_level=profile.activity_level,
        goal=profile.goal,
    )


@router.get("/bmi")
def get_bmi_info(weight_kg: float, height_cm: float):
    return get_bmi(weight_kg, height_cm)


@router.post("/food/search")
async def search_food(request: FoodSearchRequest):
    if not settings.USDA_API_KEY:
        return {
            "message": "Configure USDA_API_KEY in .env to enable real food search",
            "mock_result": {
                "query": request.query,
                "foods": [
                    {"name": "Chicken breast (cooked)", "calories_per_100g": 165, "protein_g": 31, "carbs_g": 0,  "fat_g": 3.6},
                    {"name": "Brown rice (cooked)",     "calories_per_100g": 112, "protein_g": 2.6,"carbs_g": 24, "fat_g": 0.9},
                    {"name": "Salmon (grilled)",        "calories_per_100g": 208, "protein_g": 20, "carbs_g": 0,  "fat_g": 13},
                    {"name": "Sweet potato (baked)",    "calories_per_100g": 90,  "protein_g": 2,  "carbs_g": 21, "fat_g": 0.1},
                    {"name": "Eggs (whole, boiled)",    "calories_per_100g": 155, "protein_g": 13, "carbs_g": 1.1,"fat_g": 11},
                ]
            }
        }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.USDA_BASE_URL}/foods/search",
            params={
                "query": request.query,
                "pageSize": request.max_results,
                "api_key": settings.USDA_API_KEY,
            },
        )
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="USDA API error")

        data = response.json()
        foods = []
        for f in data.get("foods", []):
            nutrients = {n["nutrientName"]: n["value"] for n in f.get("foodNutrients", [])}
            foods.append({
                "fdc_id":    f.get("fdcId"),
                "name":      f.get("description"),
                "calories":  nutrients.get("Energy", 0),
                "protein_g": nutrients.get("Protein", 0),
                "carbs_g":   nutrients.get("Carbohydrate, by difference", 0),
                "fat_g":     nutrients.get("Total lipid (fat)", 0),
                "fiber_g":   nutrients.get("Fiber, total dietary", 0),
            })

        return {"query": request.query, "foods": foods}


@router.post("/meal-plan")
def get_meal_plan(profile: ProfileCreate):
    macros = calculate_macro_targets(
        gender=profile.gender,
        age=profile.age,
        weight_kg=profile.weight_kg,
        height_cm=profile.height_cm,
        activity_level=profile.activity_level,
        goal=profile.goal,
    )

    return {
        "macro_targets": macros,
        "note": "Full meal plan generation connects to USDA FoodData in Phase 2.",
        "sample_day": {
            "breakfast": f"Oats 80g + whey protein 30g + banana — ~{round(macros.calories * 0.25)} kcal",
            "lunch":     f"Chicken breast 200g + brown rice 150g + salad — ~{round(macros.calories * 0.35)} kcal",
            "dinner":    f"Salmon 180g + sweet potato 200g + broccoli — ~{round(macros.calories * 0.30)} kcal",
            "snacks":    f"Greek yogurt 150g + almonds 30g — ~{round(macros.calories * 0.10)} kcal",
        }
    }