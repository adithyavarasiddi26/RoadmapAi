from pydantic import BaseModel

class RoadmapRequest(BaseModel):
    goal: str
    target_role: str
    current_level: str
    prog_score: int
    db_score: int
    dsa_score: int
    sd_score: int
    experience: str
    weekly_hours: int
    deadline: int
    learning_style: str
    constraints: str

class DailyTaskRequest(BaseModel):
    topic: str
    user_goal: str
    target_role: str
    current_level: str
    current_phase: str
    total_days: int
    current_day: int
    progress_percentage: float

class OverviewResponse(BaseModel):
    active_roadmaps: int
    completion_rate: float
    study_streak: int
    total_days: int
    tasks_done: int
    current_roadmap: str
    current_phase: str
    current_topic: str
    current_topic_days_completed : int
    current_topic_total_days: int
    current_phase_remaining_topics: int

