from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"


class GoalEnum(str, enum.Enum):
    fat_loss = "fat_loss"
    muscle_gain = "muscle_gain"
    maintain = "maintain"
    athlete = "athlete"


class ActivityEnum(str, enum.Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    very_active = "very_active"


class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, index=True, nullable=False)
    name            = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, nullable=False, index=True)
    gender         = Column(SAEnum(GenderEnum), nullable=False)
    age            = Column(Integer, nullable=False)
    weight_kg      = Column(Float, nullable=False)
    height_cm      = Column(Float, nullable=False)
    activity_level = Column(SAEnum(ActivityEnum), nullable=False)
    goal           = Column(SAEnum(GoalEnum), nullable=False)
    diet_style     = Column(String, default="none")
    allergies      = Column(String, default="")
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, nullable=False, index=True)
    weight_kg    = Column(Float, nullable=False)
    body_fat_pct = Column(Float, nullable=True)
    notes        = Column(String, nullable=True)
    logged_at    = Column(DateTime(timezone=True), server_default=func.now())