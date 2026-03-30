


from schema.database_schema import Roadmap, Capstone
from database.db_connection import session


def get_capstone_as_task(current_user):
    db = session()
    try:
        roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id).first()
        if not roadmap:
            return None

        capstone = db.query(Capstone).filter(Capstone.roadmap_id == roadmap.id).first()
        if not capstone:
            return None

        return {
            "id" : capstone.id,
            "completed": capstone.completed,
            "category": "Capstone Project",
            "priority": "high",
            "title": capstone.title,
            "description": capstone.description,
            "duration": "N/A",  # Estimated duration in minutes
        }
    finally:
        db.close()