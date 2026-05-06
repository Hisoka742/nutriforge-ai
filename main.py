from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, nutrition, workout, supplements, progress, chat, ml_predictions
from app.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered fitness and nutrition API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router,          prefix="/api/users",       tags=["Users"])
app.include_router(nutrition.router,      prefix="/api/nutrition",   tags=["Nutrition"])
app.include_router(workout.router,        prefix="/api/workout",     tags=["Workout"])
app.include_router(supplements.router,    prefix="/api/supplements", tags=["Supplements"])
app.include_router(progress.router,       prefix="/api/progress",    tags=["Progress"])
app.include_router(chat.router,           prefix="/api/chat",        tags=["Chat"])
app.include_router(ml_predictions.router, prefix="/api/ml",          tags=["ML"])

@app.get("/")
def root():
    return {"message": "NutriForge API is running", "version": settings.APP_VERSION}

@app.get("/health")
def health():
    return {"status": "ok"}
