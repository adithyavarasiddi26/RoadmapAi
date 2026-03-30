from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user_from_cookie
from database.db_connection import session
from schema.database_schema import Current, DailyTask, Roadmap, Topic
from schema.model import OverviewResponse

router = APIRouter()

@router.get("/api/overview")
async def get_overview(current_user = Depends(get_current_user_from_cookie)):
    db = session()
    try:
        active_roadmaps = db.query(Current).filter(Current.user_id == current_user.id).count()
        tasks_done = db.query(DailyTask).filter(DailyTask.user_id == current_user.id, DailyTask.completed == True).count()
        study_streak = db.query(Current).filter(Current.user_id == current_user.id).first().days_count if db.query(Current).filter(Current.user_id == current_user.id).first() else 0
        total_days = db.query(Current).filter(Current.user_id == current_user.id).first().total_days if db.query(Current).filter(Current.user_id == current_user.id).first() else 0
        completion_rate = round((study_streak / total_days) * 100,1) if total_days > 0 else 0

        current_roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first().roadmap_title if db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first() else "No active roadmap"
        current_instance = db.query(Current).filter(Current.user_id == current_user.id).first()
        current_phase = current_instance.current_phase if current_instance else "N/A"
        current_topic = current_instance.current_topic if current_instance else "N/A"
        current_topic_completed_days = 0
        current_topic_total_days = 0
        if current_instance:
            topic = db.query(Topic).filter(Topic.user_id == current_user.id, Topic.id == current_instance.current_topic_id).first()
            if topic:
                current_topic_completed_days = topic.days_completed
                current_topic_total_days = topic.days_to_complete
        current_phase_remaining_topics = db.query(Topic).filter(Topic.user_id == current_user.id, Topic.phase_id == current_instance.current_phase_id if current_instance else None).filter(Topic.days_completed < Topic.days_to_complete).count()
        if not current_phase:
            raise HTTPException(status_code=404, detail="Current phase not found for the user")
    


        response = OverviewResponse(
            active_roadmaps = active_roadmaps,
            completion_rate = completion_rate,
            study_streak = study_streak,
            total_days = total_days,
            tasks_done = tasks_done,
            current_roadmap = current_roadmap,
            current_phase = current_phase if current_phase is not None else "N/A",
            current_topic = current_topic if current_topic is not None else "N/A",
            current_topic_days_completed = current_topic_completed_days if current_topic_completed_days is not None else 0,
            current_topic_total_days = current_topic_total_days if current_topic_total_days is not None else 0,
            current_phase_remaining_topics = current_phase_remaining_topics if current_phase_remaining_topics is not None else 0
        )
        return response
    finally:
        db.close()