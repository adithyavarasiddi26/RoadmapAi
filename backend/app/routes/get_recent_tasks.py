from fastapi import APIRouter, Depends, HTTPException
from database.db_connection import session
from auth import get_current_user_from_cookie
from schema.database_schema import Current, DailyTask, Roadmap, Topic

router = APIRouter()

@router.get("/api/recent_tasks")
async def get_recent_tasks(current_user = Depends(get_current_user_from_cookie)):
    print("Fetching recent tasks for user_id:", current_user.id)
    db = session()
    try:
        titles = db.query(DailyTask.title).filter(
            DailyTask.user_id == current_user.id,
            DailyTask.completed == True
        ).order_by(DailyTask.created_at.desc()).limit(5).all()
        if not titles:
            return ["No Task Data"]
        # titles is a list of tuples like [(title1,), (title2,), ...], so extract the first element from each tuple
        title_list = [t[0] for t in titles]
        print("Recent task titles fetched:", title_list)
        return title_list
    finally:
        db.close()