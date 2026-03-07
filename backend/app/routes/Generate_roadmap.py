
from fastapi import APIRouter, Depends
from schema.database_schema import Roadmap, user_data, Phase, Topic, Capstone
import json
from schema.model import RoadmapRequest
from database.db_connection import session
from database.db_connection import engine
from auth import get_current_user_from_cookie
from .generate_rm_llm import generate_roadmap_llm

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
                    phase_id=phase.id,
                    topic_name=topic_name
                )   
                db.add(topic)
        db.flush()
        capstone_data = roadmap_json["final_capstone"]

        capstone = Capstone(
            roadmap_id=new_roadmap.id,
            title=capstone_data["title"],
            description=capstone_data["description"],
            skills_validated=capstone_data["skills_validated"]
        )

        db.add(capstone)
        db.flush()

    except Exception as e:
        return {"error": f"Failed to save roadmap request: {str(e)}"}
    finally:
        
        db.commit()
        db.close()
    
    
    return {"message": "Roadmap request received and saved successfully."}