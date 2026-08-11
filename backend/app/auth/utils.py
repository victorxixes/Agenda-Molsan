from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "super_secret_key_123"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_minutes: int = 1440):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
