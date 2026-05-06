from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class Gender(str, Enum):
    male = "male"
    female = "female"


class Goal(str, Enum):
    fat_loss = "fat_loss"
    muscle_gain = "muscle_gain"
    maintain = "maintain"
    athlete = "athlete"


class ActivityLevel(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    very_active = "very_active"


class DietStyle(str, Enum):
    none = "none"
    vegetarian = "vegetarian"
    vegan = "vegan"
    keto = "keto"
    halal = "halal"
    gluten_free = "gluten_free"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class ProfileCreate(BaseModel):
    gender: Gender
    age: int
    weight_kg: float
    height_cm: float
    activity_level: ActivityLevel
    goal: Goal
    diet_style: DietStyle = DietStyle.none
    allergies: Optional[list[str]] = []


class ProfileOut(ProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True