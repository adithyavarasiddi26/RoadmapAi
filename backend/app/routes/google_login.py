from fastapi import APIRouter, Request, Depends
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.responses import RedirectResponse
from database.db_connection import session
from schema.database_schema import User
import os
from dotenv import load_dotenv
from auth import get_current_user_from_cookie
load_dotenv()  # Load environment variables from .env file

router = APIRouter()

# Note: SessionMiddleware should be added to the main app, not here

config = Config('../.env')

oauth = OAuth(config)

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"}
)

@router.get("/auth/google")
async def google_auth():
    # Redirect to the login endpoint
    return RedirectResponse(url="/auth/google/login", status_code=302)

    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return user_id
def get_user_by_google_id(google_id):
    # Implement database query to find user by google_id
    db = session()
    try:
        user = db.query(User).filter(User.provider_user_id == google_id, User.provider == "google").first()
        return user
    finally:
        db.close()
    
def get_user_by_email(email):
    # Implement database query to find user by email
    db = session()
    try:
        user = db.query(User).filter(User.email == email).first()
        return user
    finally:
        db.close()

@router.get("/auth/google/login")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Callback endpoint to handle Google's response
@router.get("/auth/google/callback")
async def google_callback(request: Request):

    token = await oauth.google.authorize_access_token(request)
    print(f"[DEBUG] Received token: {token}")
    user_info = token["userinfo"]

    google_id = user_info["sub"]
    email = user_info["email"]
    name = user_info["name"]

    # check if user exists
    user = get_user_by_google_id(google_id)

    if not user:
        user = get_user_by_email(email)

    if not user:
        user = User(
            email=email,
            provider_user_id=google_id,
            name=name,
            provider="google"
        )
        db = session()
        try:
            db.add(user)
            db.commit()
        finally:
            db.close()
    

    # create session
    # print(f"[DEBUG] Logging in user: {user.email} with provider ID: {user.provider_user_id}")
    print(f"[DEBUG] User ID in database: {user.id}")
    request.session["user_id"] = user.id

    return RedirectResponse("http://localhost:5173/dashboard")