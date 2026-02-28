from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Database Config
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str
    MYSQL_DB: str
    
    # Auth Config
    SECRET_KEY: str
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # External APIs
    GEMINI_API_KEY: str
    FRONTEND_URL: str

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}/{self.MYSQL_DB}"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()


