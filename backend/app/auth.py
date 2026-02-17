from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from .core.config import settings
import hashlib


pwd_context = CryptContext(schemes=["bcrypt"])

ALGORITHM = "HS256"

def normalize_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def hash_password(password: str):
    return pwd_context.hash(normalize_password(password))

def verify_password(plain, hashed):
    return pwd_context.verify(normalize_password(plain), hashed)


def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=1)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
