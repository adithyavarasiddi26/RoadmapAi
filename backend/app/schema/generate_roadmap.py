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
    weekly_hours: str
    deadline: str
    learning_style: str