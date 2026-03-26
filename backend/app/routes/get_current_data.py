from fastapi import APIRouter, Depends, HTTPException
from database.db_connection import session
from auth import get_current_user_from_cookie
from schema.database_schema import Current



router = APIRouter()

@router.get("/api/current_data")
async def get_current_data(current_user = Depends(get_current_user_from_cookie)):
    print("Fetching current data for user_id:", current_user.id)
    db = session()
    try:
        current_data = db.query(Current).filter(Current.user_id == current_user.id).first()
        if not current_data:
            return {"message": "No current data found for the user"}
        print("Current data fetched:", current_data)
        return current_data
    finally:
        db.close()