# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Settings:

#     MYSQL_USER = os.getenv("MYSQL_USER")
#     MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
#     MYSQL_HOST = os.getenv("MYSQL_HOST")
#     MYSQL_DB = os.getenv("MYSQL_DB")

#     SECRET_KEY = os.getenv("SECRET_KEY")

#     GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
#     GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# settings = Settings()



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

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}/{self.MYSQL_DB}"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()


