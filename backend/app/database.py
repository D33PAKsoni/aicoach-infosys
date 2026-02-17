from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .core.config import settings

DATABASE_URL = f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}/{settings.MYSQL_DB}"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
