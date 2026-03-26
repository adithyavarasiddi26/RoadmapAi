
from fastapi import APIRouter, Depends
from schema.database_schema import Roadmap, user_data, Phase, Topic, Capstone, DailyTask, Current
import json
from schema.model import RoadmapRequest
from database.db_connection import session
from database.db_connection import engine
from auth import get_current_user_from_cookie
from .generate_rm_llm import generate_roadmap_llm
from routes.daily_tasks import get_daily_tasks

router = APIRouter()

@router.post("/generate_roadmap")
async def generate_roadmap(request: RoadmapRequest, current_user = Depends(get_current_user_from_cookie)):
    print("Received request:", request)
    result = await generate_roadmap_llm(request)
    roadmap_json = json.loads(result)  # Parse the JSON string into a Python dictionary
    print("Generated roadmap:", result)
    db = session()
    try:
        # Save the request to the database
        new_data = user_data(
            user_id=current_user.id,
            goal=request.goal,
            target_role=request.target_role,
            current_level=request.current_level,
            prog_score=request.prog_score,
            db_score=request.db_score,
            dsa_score=request.dsa_score,
            sd_score=request.sd_score,
            experience=request.experience,
            weekly_hours=request.weekly_hours,
            deadline=request.deadline,  
            learning_style=request.learning_style
        )
        db.add(new_data)
        db.flush()  # Get the new_data.id for the generated roadmap
        # Save the generated roadmap JSON to the database
        new_roadmap = Roadmap(
            user_id=current_user.id,
            roadmap_title=roadmap_json.get("roadmap_title"),
            total_duration_weeks=roadmap_json.get("total_duration_weeks", 0),
            progress_percentage=0,
            status="active"
        )
        db.add(new_roadmap)
        db.flush()  # Get the new_roadmap.id

        for index, phase_data in enumerate(roadmap_json["phases"]):
            phase = Phase(
                user_id=current_user.id,
                roadmap_id=new_roadmap.id,
                phase_name=phase_data["phase_name"],
                focus_area=phase_data["focus_area"],
                duration_weeks=phase_data["duration_weeks"],
                expected_outcome=phase_data["expected_outcome"],
                status=phase_data["status"],
                order_index=index
            )

            db.add(phase)
            db.flush()

            for topic_name in phase_data["topics"]:
                topic = Topic(
                    user_id=current_user.id,
                    phase_id=phase.id,
                    topic_name=topic_name,
                    days_completed = 0,
                    days_to_complete = (phase.duration_weeks*7)/len(phase_data["topics"])
                )   
                db.add(topic)
            db.flush()
        capstone_data = roadmap_json["final_capstone"]

        capstone = Capstone(
            user_id=current_user.id,
            roadmap_id=new_roadmap.id,
            title=capstone_data["title"],
            description=capstone_data["description"],
            skills_validated=capstone_data["skills_validated"]
        )

        db.add(capstone)
        db.flush()
        new_current_data = Current(
            user_id = current_user.id,
            current_phase_id = db.query(Phase).filter(Phase.roadmap_id == new_roadmap.id).order_by(Phase.order_index).first().id,
            current_topic_id = db.query(Topic).filter(Topic.phase_id == db.query(Phase).filter(Phase.roadmap_id == new_roadmap.id).order_by(Phase.order_index).first().id).first().id,
            total_days = roadmap_json.get("total_duration_weeks", 0) * 7,
            days_count = 0,

            current_topic = db.query(Topic).filter(Topic.phase_id == db.query(Phase).filter(Phase.roadmap_id == new_roadmap.id).order_by(Phase.order_index).first().id).first().topic_name,
            current_phase = db.query(Phase).filter(Phase.roadmap_id == new_roadmap.id).order_by(Phase.order_index).first().phase_name

        )
        db.add(new_current_data)
        db.flush()
        # Store needed attributes before session closes
        current_topic_id = new_current_data.current_topic_id
        current_topic_name = new_current_data.current_topic

    except Exception as e:
        return {"error": f"Failed to save roadmap request: {str(e)}"}
    finally:
        db.commit()
        db.close()

    try:
        db = session()
        daily_tasks_from_llm = await get_daily_tasks(current_user)
        print("Generated daily tasks after roadmap creation:", daily_tasks_from_llm)
        for task in daily_tasks_from_llm:
            print("[DEBUG] type of task:", type(task))
            print("[DEBUG] task content:", task["duration"], task["title"], task["description"])
            first_daily_tasks = DailyTask(
                user_id = current_user.id,
                topic_id = current_topic_id,
                day_number = 1,
                title = task["title"],
                description = task["description"],
                duration = task["duration"],
                category = task["category"],
                # icon = task["icon"],
                priority = task["priority"]
            )
            db.add(first_daily_tasks)
        db.flush()
    except Exception as e:
        return {"error": f"Failed to save daily tasks: {str(e)}"}
    finally:
        db.commit()
        db.close()

    return {"message": "Roadmap request received and saved successfully."}