import os
from dotenv import load_dotenv

load_dotenv()

class Settings:

    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_DB = os.getenv("MYSQL_DB")

    SECRET_KEY = os.getenv("SECRET_KEY")

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

settings = Settings()
