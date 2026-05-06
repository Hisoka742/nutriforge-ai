from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from app.models.user_model import User, UserProfile
from app.schemas.user_schemas import UserCreate, UserLogin, Token, UserOut, ProfileCreate, ProfileOut
from app.services.auth_service import (
    hash_password, verify_password, create_access_token, get_current_user
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user. Password is bcrypt hashed before storage."""
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
    """Login with email + password. Returns JWT bearer token."""
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user


@router.post("/profile", response_model=ProfileOut, status_code=201)
def save_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save or update the user's fitness profile."""
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


@router.get("/profile", response_model=ProfileOut)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the authenticated user's fitness profile."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found — complete onboarding first")
    return profile
