
from pydantic_settings import BaseSettings # type: ignore
print(BaseSettings)


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./images.db"
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    S3_BUCKET_NAME: str
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()