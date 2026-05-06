from fastapi import APIRouter
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os

router = APIRouter()

BASE = r"C:\Users\Salman A\Downloads\fitness_app\nutriforge-api\app\ml\models"

RISK_MAP      = {0: "Low", 1: "Medium", 2: "High"}
INTENSITY_MAP = {0: "Light", 1: "Moderate", 2: "Active", 3: "Intense"}
GOAL_MAP      = {0: "Lose Weight", 1: "Maintain", 2: "Gain Muscle"}

class PredictRequest(BaseModel):
    gender:           str   = Field(..., description="male or female")
    age:              int   = Field(..., ge=15, le=80)
    weight_kg:        float = Field(..., ge=30, le=250)
    height_cm:        float = Field(..., ge=130, le=230)
    experience_level: int   = Field(..., ge=1, le=3)
    goal:             int   = Field(..., ge=0, le=2)
    session_hours:    float = Field(1.0)
    avg_bpm:          int   = Field(130)
    resting_bpm:      int   = Field(65)

def make_row(feature_list, values):
    row = {f: 0 for f in feature_list}
    row.update({k: v for k, v in values.items() if k in feature_list})
    return pd.DataFrame([row])[feature_list]

@router.post("/predict")
def predict(req: PredictRequest):
    cal_model  = joblib.load(os.path.join(BASE, "calorie_predictor.pkl"))
    mac_model  = joblib.load(os.path.join(BASE, "macro_recommender.pkl"))
    risk_model = joblib.load(os.path.join(BASE, "health_risk_classifier.pkl"))
    wo_model   = joblib.load(os.path.join(BASE, "workout_intensity_recommender.pkl"))
    cal_feats  = joblib.load(os.path.join(BASE, "calorie_features.pkl"))
    mac_feats  = joblib.load(os.path.join(BASE, "macro_features.pkl"))
    ob_feats   = joblib.load(os.path.join(BASE, "obesity_features.pkl"))
    wo_feats   = joblib.load(os.path.join(BASE, "workout_features.pkl"))

    bmi = round(req.weight_kg / (req.height_cm / 100) ** 2, 2)
    g   = 1 if req.gender.lower() == "male" else 0

    values = dict(
        age=req.age, gender_num=g, weight_kg=req.weight_kg,
        height_cm=req.height_cm, bmi=bmi,
        experience_level=req.experience_level, goal=req.goal,
        session_duration_hours=req.session_hours,
        avg_bpm=req.avg_bpm, resting_bpm=req.resting_bpm,
        weight=req.weight_kg, height=req.height_cm / 100
    )

    calories = float(cal_model.predict(make_row(cal_feats, values))[0])
    macros   = mac_model.predict(make_row(mac_feats, values))[0]
    risk     = int(risk_model.predict(make_row(ob_feats, values))[0])
    intensity = int(wo_model.predict(make_row(wo_feats, values))[0])

    return {
        "bmi":                     bmi,
        "calories_burned_session": round(calories),
        "daily_protein_g":         round(float(macros[0])),
        "daily_fat_g":             round(float(macros[1])),
        "daily_carbs_g":           round(float(macros[2])),
        "daily_calories_target":   round(float(macros[3])),
        "health_risk":             RISK_MAP[risk],
        "workout_intensity":       INTENSITY_MAP[intensity],
        "goal_label":              GOAL_MAP[req.goal],
    }