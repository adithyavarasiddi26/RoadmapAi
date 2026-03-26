from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user_from_cookie
from schema.database_schema import DailyTask
from database.db_connection import session

router = APIRouter()

@router.get("/api/daily_tasks")
async def daily_tasks(current_user = Depends(get_current_user_from_cookie)):
    db = session()
    try:
        tasks = db.query(DailyTask).filter(DailyTask.user_id == current_user.id, DailyTask.completed == False).all()
        print(f"Fetched {len(tasks)} daily tasks for user_id {current_user.id}")
        return tasks
    finally:
        db.close()