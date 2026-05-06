from pydantic import BaseModel
from typing import Optional


class MacroTargets(BaseModel):
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    water_ml: float


class FoodItem(BaseModel):
    fdc_id: Optional[int] = None
    name: str
    amount_g: float
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: Optional[float] = 0


class Meal(BaseModel):
    meal_type: str
    foods: list[FoodItem]
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float


class DayPlan(BaseModel):
    day: int
    day_name: str
    meals: list[Meal]
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float


class WeeklyMealPlan(BaseModel):
    days: list[DayPlan]
    macro_targets: MacroTargets


class FoodSearchRequest(BaseModel):
    query: str
    max_results: int = 10


class FoodLog(BaseModel):
    food_name: str
    amount_g: float
    meal_type: str