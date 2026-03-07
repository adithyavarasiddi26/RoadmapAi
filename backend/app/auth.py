from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from datetime import datetime, timedelta
from database.db_connection import session
from schema.database_schema import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECURITY_KEY = "your_secret_key"  # In production, load from env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECURITY_KEY, algorithm=ALGORITHM)
    return encoded_jwt


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def verify_token(token: str):
    try:
        print(f"[DEBUG] Verifying token: {token[:50]}...")
        payload = jwt.decode(token, SECURITY_KEY, algorithms=[ALGORITHM])
        print(f"[DEBUG] Decoded payload: {payload}")
        email: str = payload.get("sub")
        if not email:
            print("[DEBUG] No email in payload")
            raise credentials_exception
        return payload
    except JWTError as e:
        print(f"[DEBUG] JWT decode error: {e}")
        raise credentials_exception


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    user_email = payload.get("sub")
    db = session()
    try:
        user = db.query(User).filter(User.email == user_email).first()
    finally:
        db.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_current_user_from_cookie(request: Request):
    # First, check for session-based auth (Google OAuth)
    user_id = request.session.get("user_id")
    if user_id:
        db = session()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
        finally:
            db.close()

    # Fallback to JWT cookie auth (regular login)
    token = request.cookies.get("access_token")
    if not token:
        print("[DEBUG] No token in cookie - raising exception")
        raise credentials_exception
    payload = verify_token(token)
    user_email = payload.get("sub")

    db = session()
    try:
        user = db.query(User).filter(User.email == user_email).first()
        print(f"[DEBUG] User found: {user}")
    finally:
        db.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user