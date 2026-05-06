from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "NutriForge AI"
    APP_VERSION: str = "1.0.0"
    SECRET_KEY: str = "nutriforge-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    DATABASE_URL: str = "sqlite:///./nutriforge.db"
    GROQ_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
