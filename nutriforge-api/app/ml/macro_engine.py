from app.schemas.nutrition_schemas import MacroTargets


ACTIVITY_MULTIPLIERS = {
    "sedentary":   1.2,
    "light":       1.375,
    "moderate":    1.55,
    "active":      1.725,
    "very_active": 1.9,
}

GOAL_ADJUSTMENTS = {
    "fat_loss":    -500,
    "muscle_gain": +300,
    "maintain":    0,
    "athlete":     +500,
}

MACRO_SPLITS = {
    "fat_loss":    (0.35, 0.35, 0.30),
    "muscle_gain": (0.30, 0.45, 0.25),
    "maintain":    (0.25, 0.45, 0.30),
    "athlete":     (0.30, 0.50, 0.20),
}


def calculate_bmr(gender: str, weight_kg: float, height_cm: float, age: int) -> float:
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

    min_calories = 1200 if gender == "female" else 1500
    target_calories = max(target_calories, min_calories)

    protein_pct, carb_pct, fat_pct = MACRO_SPLITS[goal]

    protein_g = round((target_calories * protein_pct) / 4, 1)
    carbs_g   = round((target_calories * carb_pct)    / 4, 1)
    fat_g     = round((target_calories * fat_pct)     / 9, 1)

    fiber_g  = round((target_calories / 1000) * 14, 1)
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
    bmi = round(weight_kg / (height_m ** 2), 1)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return {"bmi": bmi, "category": category}