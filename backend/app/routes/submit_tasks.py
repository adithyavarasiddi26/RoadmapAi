from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user_from_cookie
from schema.model import DailyTaskRequest
from schema.database_schema import Current, DailyTask, Topic, Phase, user_data
from datetime import datetime
from database.db_connection import session
from .daily_tasks_llm import generate_daily_tasks_llm
import json



async def generate_tasks(current_user):
    try:
        db = session()
        current_data = db.query(Current).filter(Current.user_id == current_user.id).first()
        if not current_data:
            raise HTTPException(status_code=404, detail="Current progress data not found for the user")
        current_topic = current_data.current_topic
        current_phase = db.query(Phase).filter(Phase.id == current_data.current_phase_id).first()
        if not current_phase:
            raise HTTPException(status_code=404, detail="Current phase data not found for the user")
        topic = db.query(Topic).filter(Topic.id == current_data.current_topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Current topic data not found for the user")
        current_day = topic.days_completed + 1
        total_days = topic.days_to_complete
        progress_percentage = (topic.days_completed / topic.days_to_complete) * 100 if topic.days_to_complete > 0 else 0
        user_goal = db.query(user_data).filter(user_data.user_id == current_user.id).first().goal
        target_role = db.query(user_data).filter(user_data.user_id == current_user.id).first().target_role
        current_level = db.query(user_data).filter(user_data.user_id == current_user.id).first().current_level

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
        response = await generate_daily_tasks_llm(request_data)
        daily_tasks_array = json.loads(response)
        return daily_tasks_array
    except Exception as e:
        print(f"Error generating daily tasks: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate daily tasks")
    finally:
        db.close()
        


router= APIRouter()

@router.post("/api/submit_tasks")
async def submit_tasks(task_data: dict, current_user = Depends(get_current_user_from_cookie)):
    print("Received task submission:", task_data)
    db = session()
    try:
        for task in task_data.get("tasks", []):
            print(f"Updating task {task['id']} to completed={task['completed']} for user_id {current_user.id}")
            db.query(DailyTask).filter(DailyTask.id == task['id'], DailyTask.user_id == current_user.id).update({"completed": task['completed']})
            
            # if days_completed >= days_to_complete:
            #     db.query(Topic).filter(Topic.id == DailyTask.topic_id, DailyTask.user_id == current_user.id).update({"completed": True, "last_completed_at": datetime.utcnow()})
            #     num_uncompleted_topics_in_phase = db.query(Topic).filter(Topic.phase_id == Topic.phase_id, Topic.completed == False).count()
            #     if num_uncompleted_topics_in_phase == 0:
            #         db.query(Phase).filter(Phase.id == Topic.phase_id).update({"status": "completed"})
            #         db.query(Phase).filter(Phase.roadmap_id == db.query(Phase.roadmap_id).filter(Phase.id == Topic.phase_id).first()).filter(Phase.status == "locked").first().update({"status": "active"})
        
        topic_id = db.query(DailyTask).filter(DailyTask.id == task_data.get("tasks", [])[0]['id'], DailyTask.user_id == current_user.id, ).first().topic_id
        print(f"[DEBUG] Incrementing days_completed for topic_id {topic_id} and user_id {current_user.id} , [DEBUG AGAIN] {task_data.get("tasks", [])[0]['id']}")
        db.query(Topic).filter(Topic.id == topic_id, Topic.user_id == current_user.id).update({"days_completed": Topic.days_completed + 1})
        db.query(Current).filter(Current.user_id == current_user.id).update({"days_count": Current.days_count + 1})
        # Ensure the updated days_completed is saved before we check the condition
        days_completed = db.query(Topic).filter(Topic.id == topic_id, Topic.user_id == current_user.id).first().days_completed
        days_to_complete = db.query(Topic).filter(Topic.id == topic_id, Topic.user_id == current_user.id).first().days_to_complete
        print(f"After incrementing days_completed, topic_id {topic_id} has days_completed={days_completed} and days_to_complete={days_to_complete}")

        if days_completed >= days_to_complete:
            db.query(Topic).filter(Topic.id == topic_id, Topic.user_id == current_user.id).update({"completed": True, "last_completed_at": datetime.utcnow()})
            db.flush()  # Ensure the update is flushed to the database before we query for uncompleted topics

            num_uncompleted_topics_in_phase = db.query(Topic).filter(Topic.phase_id == db.query(Topic).filter(Topic.id == topic_id).first().phase_id, Topic.completed == False).count()
            if num_uncompleted_topics_in_phase == 0:
                # Get current phase
                current_phase = db.query(Phase).filter(Phase.id == db.query(Current).filter(Current.user_id == current_user.id).first().current_phase_id).first()

                if current_phase:
                    # 1. Mark current phase as done
                    current_phase.status = "done"
                    db.add(current_phase)

                    # 2. Reset ALL other active phases (important fix)
                    db.query(Phase).filter(
                        Phase.roadmap_id == current_phase.roadmap_id,
                        Phase.status == "active"
                    ).update({"status": "locked"})

                    # 3. Find next locked phase
                    next_locked_phase = db.query(Phase).filter(
                        Phase.roadmap_id == current_phase.roadmap_id,
                        Phase.status == "locked",
                        Phase.order_index > current_phase.order_index
                    ).order_by(Phase.order_index).first()

                    if next_locked_phase:
                        # 4. Activate ONLY this phase
                        next_locked_phase.status = "active"
                        db.add(next_locked_phase)

                        # 5. Get first topic
                        first_topic = db.query(Topic).filter(
                            Topic.phase_id == next_locked_phase.id
                        ).order_by(Topic.id).first()

                        # 6. Update current table
                        db.query(Current).filter(
                            Current.user_id == current_user.id
                        ).update({
                            "current_phase_id": next_locked_phase.id,
                            "current_topic_id": first_topic.id if first_topic else None,
                            "current_topic": first_topic.topic_name if first_topic else None,
                            "current_phase": next_locked_phase.phase_name
                        })

                    db.commit()
                    daily_tasks_from_llm = await generate_tasks(current_user)
                    for task in daily_tasks_from_llm:
                        print("[DEBUG] type of task:", type(task))
                        print("[DEBUG] task content:", task["duration"], task["title"], task["description"])
                        new_task = DailyTask(
                            user_id=current_user.id,
                            topic_id=first_topic.id,
                            day_number=days_completed + 1,
                            title=task["title"],
                            description=task["description"],
                            duration=task["duration"],
                            category=task["category"],
                            priority=task.get("priority", "medium"),
                            completed=False
                        )
                        db.add(new_task)
                
            else:
                 print(f"Topic_id {topic_id} is completed. {num_uncompleted_topics_in_phase} topics remaining in the phase.")
                 print("[DEBUG NEW]",task_data.get("phase_id"))
                 curr_topic_obj = db.query(Topic).filter(
                     Topic.user_id == current_user.id,
                     Topic.phase_id == db.query(Topic).filter(Topic.id == topic_id).first().phase_id,
                     Topic.completed == False
                 ).order_by(Topic.id).first()
                 if curr_topic_obj:
                     curr_topic_id = curr_topic_obj.id
                     curr_topic = curr_topic_obj.topic_name
                     print(f"[DEBUG] Next uncompleted topic_id in the same phase is {curr_topic_id} with topic name '{curr_topic}'")
                     db.query(Current).filter(Current.user_id == current_user.id).update({
                         "current_topic_id": curr_topic_id,
                         "current_topic": curr_topic
                     })
                     print(f"Updated current topic to the next uncompleted topic in the same phase for user_id {current_user.id}")
                     daily_tasks_from_llm = await generate_tasks(current_user)
                     for task in daily_tasks_from_llm:
                        print("[DEBUG] type of task:", type(task))
                        print("[DEBUG] task content:", task["duration"], task["title"], task["description"])
                        new_task = DailyTask(
                            user_id=current_user.id,
                            topic_id=curr_topic_id,
                            day_number=days_completed + 1,
                            title=task["title"],
                            description=task["description"],
                            duration=task["duration"],
                            category=task["category"],
                            priority=task.get("priority", "medium"),
                            completed=False
                        )
                        db.add(new_task)
                        print("Generated new daily tasks after task submission:", daily_tasks_from_llm)

                     
                 else:
                     print("[DEBUG] No uncompleted topics found in the current phase for this user.")
        else:
            print(f"Topic_id {topic_id} is still in progress with days_completed={days_completed} out of days_to_complete={days_to_complete}. No phase or topic status updates needed.")
            #generate new daily tasks for the same topic since it's not completed yet
            daily_tasks_from_llm = await generate_tasks(current_user)
            for task in daily_tasks_from_llm:
                print("[DEBUG] type of task:", type(task))
                print("[DEBUG] task content:", task["duration"], task["title"], task["description"])
                new_task = DailyTask(
                    user_id=current_user.id,
                    topic_id=topic_id,
                    day_number=days_completed + 1,
                    title=task["title"],
                    description=task["description"],
                    duration=task["duration"],
                    category=task["category"],
                    priority=task.get("priority", "medium"),
                    completed=False
                )
                db.add(new_task)
            print("Generated new daily tasks after task submission:", daily_tasks_from_llm)
    finally:
        db.commit()
        db.close()
    

    # Here you would typically update the database with the submitted task data
    # For now, we just return a success message
    return {"message": "Tasks submitted successfully"}