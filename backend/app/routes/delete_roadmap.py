from fastapi import APIRouter, Depends
from auth import get_current_user_from_cookie
from schema.database_schema import Roadmap, Phase, Topic, Capstone, user_data
from database.db_connection import session

router = APIRouter()

@router.delete("/roadmap")
async def delete_roadmap(current_user=Depends(get_current_user_from_cookie)):
    db = session()
    try:
        # Fetch all roadmaps for the user
        roadmaps = db.query(Roadmap).filter(Roadmap.user_id == current_user.id).all()
        
        for roadmap in roadmaps:
            # Delete capstones (explicitly, in case cascade didn't work)
            db.query(Capstone).filter(Capstone.roadmap_id == roadmap.id).delete()
            
            # Delete topics through phases
            phases = db.query(Phase).filter(Phase.roadmap_id == roadmap.id).all()
            for phase in phases:
                db.query(Topic).filter(Topic.phase_id == phase.id).delete()
            
            # Delete phases
            db.query(Phase).filter(Phase.roadmap_id == roadmap.id).delete()
        
        # Finally delete the roadmap
        db.query(Roadmap).filter(Roadmap.user_id == current_user.id).delete()
        db.query(user_data).filter(user_data.user_id == current_user.id).delete()  # Also delete user_data if needed
        db.commit()
    except Exception as e:
        db.rollback()
        return {"error": f"Failed to delete roadmap: {str(e)}"}
    finally:
        db.close()
    
    return {"message": "Roadmap deleted successfully"}