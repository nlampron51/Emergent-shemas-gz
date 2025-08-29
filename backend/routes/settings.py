from fastapi import APIRouter, HTTPException
from datetime import datetime
from models.settings import CourseSettings, CourseSettingsUpdate
from utils.database import db, DatabaseManager

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/", response_model=CourseSettings)
async def get_course_settings():
    """Get course settings"""
    settings = await db.course_settings.find_one()
    if not settings:
        # Create default settings if none exist
        default_settings = {
            "total_hours": 110,
            "total_weeks": 18,
            "hours_per_week": 6.1,
            "start_date": "2025-01-15",
            "end_date": "2025-05-30",
            "course_title": "ICD201 - Technologies numériques et innovations",
            "course_description": "Technologies numériques et innovations dans un monde en évolution",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db.course_settings.insert_one(default_settings)
        settings = await db.course_settings.find_one({"_id": result.inserted_id})
    
    return DatabaseManager.serialize_doc(settings)

@router.put("/", response_model=CourseSettings)
async def update_course_settings(settings_update: CourseSettingsUpdate):
    """Update course settings"""
    existing_settings = await db.course_settings.find_one()
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if existing_settings:
        await db.course_settings.update_one(
            {"_id": existing_settings["_id"]},
            {"$set": update_data}
        )
        updated_settings = await db.course_settings.find_one({"_id": existing_settings["_id"]})
    else:
        # Create new settings if none exist
        default_settings = {
            "total_hours": 110,
            "total_weeks": 18,
            "hours_per_week": 6.1,
            "start_date": "2025-01-15",
            "end_date": "2025-05-30",
            "course_title": "ICD201 - Technologies numériques et innovations",
            "course_description": "Technologies numériques et innovations dans un monde en évolution",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        default_settings.update(update_data)
        result = await db.course_settings.insert_one(default_settings)
        updated_settings = await db.course_settings.find_one({"_id": result.inserted_id})
    
    return DatabaseManager.serialize_doc(updated_settings)