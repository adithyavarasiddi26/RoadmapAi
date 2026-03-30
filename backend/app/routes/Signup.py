

from fastapi import APIRouter, Depends, HTTPException, Response, Request
from schema.Signup_schema import SignupRequest, LoginRequest
from pwdlib import PasswordHash
from database.db_connection import session
from database.db_connection import engine
from schema.database_schema import User, base

from auth import create_access_token, get_current_user_from_cookie

base.metadata.create_all(bind=engine)
router = APIRouter()



password_hasher = PasswordHash.recommended()

@router.get("/api/me")
async def read_current_user(current_user: User = Depends(get_current_user_from_cookie)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    else:
        return {
            "id" : current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }

@router.post("/signup")
async def signup(request: SignupRequest):
    if not request.name or not request.email or not request.password:
        return {"error": "Name, email, and password are required."}
    hashed_password = password_hasher.hash(request.password)
    
    db = session()
    try:
        if db.query(User).filter(User.email == request.email).first():
            return {"error": "Email already registered."}
        new_user = User(
            name=request.name,
            email=request.email,
            password_hash=hashed_password
        )
        db.add(new_user)
        db.commit()
    finally:
        db.close()

    return {"message": f"Signup endpoint for user {request.name} with email {request.email} and password {hashed_password}"}

@router.post("/login")
async def login(request: LoginRequest):
    if not request.email or not request.password:
        return {"error": "Email and password are required."}
    
    db = session()
    try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            return {"error": "Invalid email or password."}
        if not user.password_hash:
            return {"error": "User registered with Google OAuth. Please log in with Google."}
        if not password_hasher.verify(request.password, user.password_hash):
            return {"error": "Invalid email or password."}
        
        access_token = create_access_token(data={"sub": user.email})
        print(f"[DEBUG LOGIN] Created token: {access_token[:50]}...")
        response = Response(
            content=f'{{"access_token": "{access_token}", "token_type": "bearer"}}',
            media_type="application/json"
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # localhost dev only; use True in production
            samesite="lax",
            path="/"
        )
        print(f"[DEBUG LOGIN] Set-Cookie header: {response.headers}")
        return response
    finally:
        db.close()


    # response = Response(content='{"message": "Logged out successfully."}', media_type="application/json")
    # response.delete_cookie(key="access_token", path="/")
    # return response
@router.post("/logout")
async def logout(request: Request, response: Response):
    # clear the session (for Google OAuth users)
    request.session.clear()
    
    # clear the auth cookie (for regular login users)
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=False,  # match development login
        samesite="lax"
    )
    return {"message": "Logged out successfully"}