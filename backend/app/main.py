from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os

app = FastAPI()
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "your-secret-key"),
    same_site="lax",
    https_only=False
)

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)




import routes.google_login
from routes import Signup, Generate_roadmap, get_roadmap, delete_roadmap, get_tasks, submit_tasks, get_current_data, Overview, get_recent_tasks

app.include_router(Signup.router)
app.include_router(Generate_roadmap.router)
app.include_router(get_roadmap.router)
app.include_router(delete_roadmap.router)
app.include_router(routes.google_login.router)
app.include_router(get_tasks.router)
app.include_router(submit_tasks.router)
app.include_router(get_current_data.router)
app.include_router(Overview.router)
app.include_router(get_recent_tasks.router)