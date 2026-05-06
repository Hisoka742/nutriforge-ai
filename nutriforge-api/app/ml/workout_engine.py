from app.schemas.workout_schemas import WorkoutPlan, WorkoutDay, Exercise


EXERCISE_DB = {
    "chest": [
        {"name": "Barbell bench press",   "sets": 4, "reps": "6-10",  "rest": 90, "equipment": "barbell"},
        {"name": "Dumbbell flyes",         "sets": 3, "reps": "10-15", "rest": 60, "equipment": "dumbbells"},
        {"name": "Push-ups",               "sets": 3, "reps": "12-20", "rest": 60, "equipment": "bodyweight"},
        {"name": "Incline dumbbell press", "sets": 3, "reps": "8-12",  "rest": 75, "equipment": "dumbbells"},
    ],
    "back": [
        {"name": "Pull-ups / Lat pulldown",    "sets": 4, "reps": "6-10",  "rest": 90, "equipment": "cable"},
        {"name": "Barbell bent-over row",      "sets": 4, "reps": "6-10",  "rest": 90, "equipment": "barbell"},
        {"name": "Seated cable row",           "sets": 3, "reps": "10-12", "rest": 60, "equipment": "cable"},
        {"name": "Dumbbell single-arm row",    "sets": 3, "reps": "10-12", "rest": 60, "equipment": "dumbbells"},
    ],
    "shoulders": [
        {"name": "Overhead press",  "sets": 4, "reps": "6-10",  "rest": 90, "equipment": "barbell"},
        {"name": "Lateral raises",  "sets": 3, "reps": "12-15", "rest": 60, "equipment": "dumbbells"},
        {"name": "Face pulls",      "sets": 3, "reps": "12-15", "rest": 60, "equipment": "cable"},
    ],
    "legs": [
        {"name": "Barbell squat",     "sets": 4, "reps": "5-8",   "rest": 120, "equipment": "barbell"},
        {"name": "Romanian deadlift", "sets": 3, "reps": "8-12",  "rest": 90,  "equipment": "barbell"},
        {"name": "Leg press",         "sets": 3, "reps": "10-15", "rest": 90,  "equipment": "machine"},
        {"name": "Leg curl",          "sets": 3, "reps": "10-12", "rest": 60,  "equipment": "machine"},
        {"name": "Calf raises",       "sets": 4, "reps": "15-20", "rest": 45,  "equipment": "machine"},
    ],
    "glutes": [
        {"name": "Hip thrust",            "sets": 4, "reps": "10-15", "rest": 75, "equipment": "barbell"},
        {"name": "Cable kickback",        "sets": 3, "reps": "12-15", "rest": 45, "equipment": "cable"},
        {"name": "Bulgarian split squat", "sets": 3, "reps": "10-12", "rest": 75, "equipment": "dumbbells"},
        {"name": "Sumo deadlift",         "sets": 3, "reps": "8-10",  "rest": 90, "equipment": "barbell"},
    ],
    "arms": [
        {"name": "Barbell curl",               "sets": 3, "reps": "8-12",  "rest": 60, "equipment": "barbell"},
        {"name": "Tricep pushdown",            "sets": 3, "reps": "10-15", "rest": 60, "equipment": "cable"},
        {"name": "Hammer curl",                "sets": 3, "reps": "10-12", "rest": 60, "equipment": "dumbbells"},
        {"name": "Overhead tricep extension",  "sets": 3, "reps": "10-12", "rest": 60, "equipment": "dumbbells"},
    ],
    "core": [
        {"name": "Plank",        "sets": 3, "reps": "45 sec", "rest": 45, "equipment": "bodyweight"},
        {"name": "Cable crunch", "sets": 3, "reps": "12-15",  "rest": 45, "equipment": "cable"},
        {"name": "Leg raises",   "sets": 3, "reps": "12-15",  "rest": 45, "equipment": "bodyweight"},
    ],
    "cardio_hiit": [
        {"name": "Treadmill intervals (30s sprint / 90s walk)", "sets": 8, "reps": "1 round", "rest": 0,  "equipment": "treadmill"},
        {"name": "Jump rope",    "sets": 5, "reps": "2 min", "rest": 60, "equipment": "jump_rope"},
        {"name": "Rowing machine","sets": 4, "reps": "500m",  "rest": 90, "equipment": "rower"},
    ],
}


SPLITS = {
    "fat_loss": {
        4: [
            {"day": "Monday",   "type": "Upper body strength", "groups": ["chest","back","shoulders","arms"], "duration": 55, "burn": 320},
            {"day": "Tuesday",  "type": "HIIT cardio",         "groups": ["cardio_hiit"],                    "duration": 30, "burn": 280},
            {"day": "Thursday", "type": "Lower body + glutes", "groups": ["legs","glutes","core"],           "duration": 55, "burn": 360},
            {"day": "Saturday", "type": "Full body circuit",   "groups": ["chest","back","legs","core"],     "duration": 50, "burn": 340},
        ],
    },
    "muscle_gain": {
        4: [
            {"day": "Monday",   "type": "Chest + triceps",  "groups": ["chest","arms"],            "duration": 60, "burn": 280},
            {"day": "Tuesday",  "type": "Back + biceps",    "groups": ["back","arms"],             "duration": 60, "burn": 290},
            {"day": "Thursday", "type": "Legs",             "groups": ["legs","glutes"],           "duration": 65, "burn": 350},
            {"day": "Saturday", "type": "Shoulders + core", "groups": ["shoulders","arms","core"], "duration": 55, "burn": 270},
        ],
    },
    "maintain": {
        3: [
            {"day": "Monday",    "type": "Full body A",    "groups": ["chest","back","legs"],              "duration": 50, "burn": 300},
            {"day": "Wednesday", "type": "Cardio + core", "groups": ["cardio_hiit","core"],               "duration": 35, "burn": 250},
            {"day": "Friday",    "type": "Full body B",   "groups": ["shoulders","glutes","arms","core"], "duration": 50, "burn": 300},
        ],
    },
}


def build_workout_plan(
    goal: str,
    gender: str,
    sessions_per_week: int = 4,
    equipment: str = "full_gym",
) -> WorkoutPlan:

    goal_key = goal if goal in SPLITS else "maintain"
    available = SPLITS[goal_key]
    split_key = sessions_per_week if sessions_per_week in available else list(available.keys())[0]
    template = available[split_key]

    days = []
    for t in template:
        exercises = []
        for group in t["groups"]:
            group_exercises = EXERCISE_DB.get(group, [])
            selected = group_exercises[:3] if goal == "muscle_gain" else group_exercises[:2]
            for ex in selected:
                exercises.append(Exercise(
                    name=ex["name"],
                    muscle_group=group,
                    sets=ex["sets"],
                    reps=ex["reps"],
                    rest_seconds=ex["rest"],
                    equipment=ex["equipment"],
                ))

        days.append(WorkoutDay(
            day_name=t["day"],
            session_type=t["type"],
            duration_minutes=t["duration"],
            calories_burned=t["burn"],
            exercises=exercises,
        ))

    return WorkoutPlan(
        weeks=8,
        sessions_per_week=len(days),
        difficulty="intermediate",
        plan=days,
    )