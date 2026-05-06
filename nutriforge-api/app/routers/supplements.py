from fastapi import APIRouter
from app.schemas.user_schemas import ProfileCreate
from app.schemas.workout_schemas import SupplementPlan
from app.ml.supplement_engine import get_supplement_plan

router = APIRouter()


@router.post("/plan", response_model=SupplementPlan)
def get_supplements(profile: ProfileCreate):
    return get_supplement_plan(
        gender=profile.gender,
        goal=profile.goal,
        age=profile.age,
        diet_style=profile.diet_style,
        weight_kg=profile.weight_kg,
    )