from fastapi import APIRouter, Depends
from auth import get_current_user_from_cookie
from database.db_connection import session
from schema.database_schema import Capstone, Roadmap, user_data, Phase, Topic

router = APIRouter()

@router.get("/roadmap")
async def get_roadmaps(current_user = Depends(get_current_user_from_cookie)):
    db = session()
    try:
        user_roadmaps = db.query(Roadmap).filter(Roadmap.user_id == current_user.id).all()
        for roadmap in user_roadmaps:
            roadmap.phases = db.query(Phase).filter(Phase.roadmap_id == roadmap.id).order_by(Phase.order_index).all()
            for phase in roadmap.phases:
                phase.topics = db.query(Topic).filter(Topic.phase_id == phase.id).all()
            roadmap.final_capstone = db.query(Capstone).filter(Capstone.roadmap_id == roadmap.id).first()
            roadmap.target = db.query(user_data).filter(user_data.user_id == current_user.id).first().target_role
    finally:
        db.close()
    return user_roadmaps