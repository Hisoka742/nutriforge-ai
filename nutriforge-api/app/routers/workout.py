from fastapi import APIRouter
from app.schemas.user_schemas import ProfileCreate
from app.schemas.workout_schemas import WorkoutPlan
from app.ml.workout_engine import build_workout_plan, EXERCISE_DB

router = APIRouter()


@router.post("/plan", response_model=WorkoutPlan)
def get_workout_plan(profile: ProfileCreate):
    return build_workout_plan(
        goal=profile.goal,
        gender=profile.gender,
        sessions_per_week=4,
        equipment="full_gym",
    )


@router.get("/exercises/{muscle_group}")
def get_exercises_by_muscle(muscle_group: str):
    exercises = EXERCISE_DB.get(muscle_group.lower())
    if not exercises:
        return {"error": f"No exercises found for: {muscle_group}"}
    return {"muscle_group": muscle_group, "exercises": exercises}


@router.get("/muscle-groups")
def list_muscle_groups():
    return {"muscle_groups": list(EXERCISE_DB.keys())}