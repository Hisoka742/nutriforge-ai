from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.user_model import ProgressLog
from app.services.auth_service import get_current_user
from app.models.user_model import User

router = APIRouter()


class ProgressEntry(BaseModel):
    weight_kg: float
    body_fat_pct: Optional[float] = None
    notes: Optional[str] = None


@router.post("/log")
def log_progress(
    entry: ProgressEntry,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = ProgressLog(
        user_id=current_user.id,
        weight_kg=entry.weight_kg,
        body_fat_pct=entry.body_fat_pct,
        notes=entry.notes,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Progress logged", "id": log.id}


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = db.query(ProgressLog).filter(
        ProgressLog.user_id == current_user.id
    ).order_by(ProgressLog.logged_at).all()
    return {"entries": entries, "count": len(entries)}


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = db.query(ProgressLog).filter(
        ProgressLog.user_id == current_user.id
    ).order_by(ProgressLog.logged_at).all()

    if len(entries) < 2:
        return {"message": "Log at least 2 entries to see your summary"}

    change = round(entries[-1].weight_kg - entries[0].weight_kg, 2)
    return {
        "starting_weight": entries[0].weight_kg,
        "current_weight":  entries[-1].weight_kg,
        "total_change_kg": change,
        "direction":       "lost" if change < 0 else "gained",
        "entries":         len(entries),
    }