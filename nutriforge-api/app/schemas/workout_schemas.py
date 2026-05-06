from pydantic import BaseModel
from typing import Optional
from enum import Enum


class Equipment(str, Enum):
    full_gym = "full_gym"
    dumbbells = "dumbbells"
    home_no_equipment = "home_no_equipment"
    resistance_bands = "resistance_bands"


class Exercise(BaseModel):
    name: str
    muscle_group: str
    sets: int
    reps: str
    rest_seconds: int
    equipment: str
    notes: Optional[str] = None


class WorkoutDay(BaseModel):
    day_name: str
    session_type: str
    duration_minutes: int
    calories_burned: int
    exercises: list[Exercise]


class WorkoutPlan(BaseModel):
    weeks: int
    sessions_per_week: int
    difficulty: str
    plan: list[WorkoutDay]


class WorkoutPlanRequest(BaseModel):
    equipment: Equipment = Equipment.full_gym
    sessions_per_week: int = 4
    focus: Optional[str] = None


class Supplement(BaseModel):
    name: str
    dose: str
    timing: str
    reason: str
    priority: str


class SupplementPlan(BaseModel):
    supplements: list[Supplement]
    notes: str