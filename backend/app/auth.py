import bcrypt
import hashlib
from jose import jwt
from datetime import datetime, timedelta, timezone
from .core.config import settings

ALGORITHM = "HS256"

def normalize_password(password: str):
    """Keep this the same to match existing database hashes."""
    return hashlib.sha256(password.encode()).hexdigest()

def hash_password(password: str):
    """Hashes the password using bcrypt directly."""
    password_bytes = normalize_password(password).encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str):
    """Verifies a plain password against a hashed version."""
    password_bytes = normalize_password(plain).encode('utf-8')
    hashed_bytes = hashed.encode('utf-8')
    try:
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
