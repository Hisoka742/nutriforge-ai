from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from app.models.user_model import User, UserProfile
from app.schemas.user_schemas import UserCreate, UserLogin, Token, UserOut, ProfileCreate, ProfileOut
from app.services.auth_service import (
    hash_password, verify_password, create_access_token, get_current_user
)

Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/profile", response_model=ProfileOut, status_code=201)
def save_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    allergies_str = ",".join(profile.allergies) if profile.allergies else ""

    if existing:
        for field, value in profile.model_dump(exclude={"allergies"}).items():
            setattr(existing, field, value)
        existing.allergies = allergies_str
        db.commit()
        db.refresh(existing)
        return existing

    new_profile = UserProfile(
        user_id=current_user.id,
        **profile.model_dump(exclude={"allergies"}),
        allergies=allergies_str,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile


@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return {
            "id": profile.id,
            "user_id": profile.user_id,
            "gender": profile.gender.value if hasattr(profile.gender, 'value') else profile.gender,
            "age": profile.age,
            "weight_kg": profile.weight_kg,
            "height_cm": profile.height_cm,
            "activity_level": profile.activity_level.value if hasattr(profile.activity_level, 'value') else profile.activity_level,
            "goal": profile.goal.value if hasattr(profile.goal, 'value') else profile.goal,
            "diet_style": profile.diet_style,
            "allergies": profile.allergies.split(",") if profile.allergies else [],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))