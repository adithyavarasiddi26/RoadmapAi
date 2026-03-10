from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user_from_cookie
from schema.database_schema import Phase, Roadmap, Topic, Current, user_data
from database.db_connection import session
from .daily_tasks_llm import generate_daily_tasks_llm
from schema.model import DailyTaskRequest
import json

router = APIRouter()

# @router.post("/daily_tasks")
async def get_daily_tasks(current_user):
    print("[DEBUG] from get daily tasks, current_user:", current_user.id)
    db = session()
    try:
        user_details = db.query(user_data).filter(user_data.user_id == current_user.id).first()
        print("[DEBUG] User details:", user_details)
        if not user_details:
            raise HTTPException(status_code=404, detail="user_details not found for the user")
        user_goal = user_details.goal
        target_role = user_details.target_role
        current_level = user_details.current_level
        current_data = db.query(Current).filter(Current.user_id == current_user.id).first()
        if not current_data:
            raise HTTPException(status_code=404, detail="Current progress data not found for the user")
        current_topic = current_data.Current_topic
        current_phase = db.query(Phase).filter(Phase.id == current_data.Current_phase_id).first()
        if not current_phase:
            raise HTTPException(status_code=404, detail="Current phase data not found for the user")
        topic = db.query(Topic).filter(Topic.id == current_data.Current_topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Current topic data not found for the user")
        current_day = topic.days_completed + 1
        total_days = topic.days_to_complete
        progress_percentage = (topic.days_completed / topic.days_to_complete) * 100 if topic.days_to_complete > 0 else 0

        request_data = DailyTaskRequest(
            topic=current_topic,
            user_goal=user_goal,
            target_role=target_role,
            current_level=current_level,
            current_phase=current_phase.phase_name,
            total_days=total_days,
            current_day=current_day,
            progress_percentage=progress_percentage
        )
        print("Request data for LLM:", request_data)
        daily_tasks = await generate_daily_tasks_llm(request_data)
        print ("Generated daily tasks:", daily_tasks)
        print("Type of daily tasks:", type(daily_tasks))
        daily_tasks_array = json.loads(daily_tasks)
        print("title of first task:", daily_tasks_array[0]['title'] if daily_tasks_array else "No tasks generated")
        return daily_tasks_array
    finally:
        db.close()