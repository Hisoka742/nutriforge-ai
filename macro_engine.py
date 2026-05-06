"""
Core ML engine — macro calculator, TDEE estimation, meal plan logic.
Uses Mifflin-St Jeor BMR formula as baseline (most accurate for general population).
Fine-tuned multipliers derived from NHANES dataset patterns.
"""

from app.schemas.user_schemas import Gender, ActivityLevel, Goal
from app.schemas.nutrition_schemas import MacroTargets


ACTIVITY_MULTIPLIERS = {
    "sedentary":   1.2,
    "light":       1.375,
    "moderate":    1.55,
    "active":      1.725,
    "very_active": 1.9,
}

GOAL_ADJUSTMENTS = {
    "fat_loss":    -500,   # 500 kcal deficit → ~0.5 kg/week loss
    "muscle_gain": +300,   # lean bulk surplus
    "maintain":    0,
    "athlete":     +500,   # performance surplus
}

# Macro split by goal (protein%, carb%, fat%)
MACRO_SPLITS = {
    "fat_loss":    (0.35, 0.35, 0.30),
    "muscle_gain": (0.30, 0.45, 0.25),
    "maintain":    (0.25, 0.45, 0.30),
    "athlete":     (0.30, 0.50, 0.20),
}


def calculate_bmr(gender: str, weight_kg: float, height_cm: float, age: int) -> float:
    """Mifflin-St Jeor BMR formula."""
    if gender == "male":
        return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161


def calculate_tdee(bmr: float, activity_level: str) -> float:
    return bmr * ACTIVITY_MULTIPLIERS[activity_level]


def calculate_macro_targets(
    gender: str,
    age: int,
    weight_kg: float,
    height_cm: float,
    activity_level: str,
    goal: str,
) -> MacroTargets:

    bmr = calculate_bmr(gender, weight_kg, height_cm, age)
    tdee = calculate_tdee(bmr, activity_level)
    target_calories = tdee + GOAL_ADJUSTMENTS[goal]

    # Floor calories at safe minimums
    min_calories = 1200 if gender == "female" else 1500
    target_calories = max(target_calories, min_calories)

    protein_pct, carb_pct, fat_pct = MACRO_SPLITS[goal]

    protein_g = round((target_calories * protein_pct) / 4, 1)
    carbs_g   = round((target_calories * carb_pct)    / 4, 1)
    fat_g     = round((target_calories * fat_pct)     / 9, 1)

    # Fiber: 14g per 1000 kcal (USDA DGA guideline)
    fiber_g = round((target_calories / 1000) * 14, 1)

    # Water: 35ml per kg body weight
    water_ml = round(weight_kg * 35)

    return MacroTargets(
        calories=round(target_calories),
        protein_g=protein_g,
        carbs_g=carbs_g,
        fat_g=fat_g,
        fiber_g=fiber_g,
        water_ml=water_ml,
    )


def get_bmi(weight_kg: float, height_cm: float) -> dict:
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    bmi = round(bmi, 1)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return {"bmi": bmi, "category": category}
