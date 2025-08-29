from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from models.unit import Unit, UnitCreate, UnitUpdate, Lesson, LessonCreate, LessonUpdate
from utils.database import db, DatabaseManager

router = APIRouter(prefix="/api/units", tags=["units"])

@router.get("/", response_model=List[Unit])
async def get_units():
    """Get all course units"""
    units = await db.units.find().to_list(1000)
    return DatabaseManager.serialize_docs(units)

@router.get("/{unit_id}", response_model=Unit)
async def get_unit(unit_id: int):
    """Get a specific unit by ID"""
    unit = await db.units.find_one({"id": unit_id})
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return DatabaseManager.serialize_doc(unit)

@router.post("/", response_model=Unit)
async def create_unit(unit: UnitCreate):
    """Create a new unit"""
    # Get the next unit ID
    last_unit = await db.units.find_one(sort=[("id", -1)])
    next_id = (last_unit["id"] + 1) if last_unit else 1
    
    unit_dict = unit.dict()
    unit_dict.update({
        "id": next_id,
        "lessons": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db.units.insert_one(unit_dict)
    created_unit = await db.units.find_one({"_id": result.inserted_id})
    return DatabaseManager.serialize_doc(created_unit)

@router.put("/{unit_id}", response_model=Unit)
async def update_unit(unit_id: int, unit_update: UnitUpdate):
    """Update an existing unit"""
    # Check if unit exists
    existing_unit = await db.units.find_one({"id": unit_id})
    if not existing_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    update_data = {k: v for k, v in unit_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.units.update_one(
        {"id": unit_id},
        {"$set": update_data}
    )
    
    updated_unit = await db.units.find_one({"id": unit_id})
    return DatabaseManager.serialize_doc(updated_unit)

@router.delete("/{unit_id}")
async def delete_unit(unit_id: int):
    """Delete a unit"""
    result = await db.units.delete_one({"id": unit_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Also delete related calendar events
    await db.calendar_events.delete_many({"unit_id": unit_id})
    
    return {"message": "Unit deleted successfully"}

@router.post("/{unit_id}/lessons", response_model=Unit)
async def add_lesson(unit_id: int, lesson: LessonCreate):
    """Add a lesson to a unit"""
    unit = await db.units.find_one({"id": unit_id})
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Get next lesson ID
    existing_lessons = unit.get("lessons", [])
    next_lesson_id = max([l.get("id", 0) for l in existing_lessons], default=0) + 1
    
    lesson_dict = lesson.dict()
    lesson_dict["id"] = next_lesson_id
    
    await db.units.update_one(
        {"id": unit_id},
        {
            "$push": {"lessons": lesson_dict},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    updated_unit = await db.units.find_one({"id": unit_id})
    return DatabaseManager.serialize_doc(updated_unit)

@router.put("/{unit_id}/lessons/{lesson_id}", response_model=Unit)
async def update_lesson(unit_id: int, lesson_id: int, lesson_update: LessonUpdate):
    """Update a lesson in a unit"""
    unit = await db.units.find_one({"id": unit_id})
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Find the lesson to update
    lessons = unit.get("lessons", [])
    lesson_index = next((i for i, l in enumerate(lessons) if l.get("id") == lesson_id), None)
    
    if lesson_index is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Update lesson fields
    update_data = {k: v for k, v in lesson_update.dict().items() if v is not None}
    
    # Update the specific lesson using positional operator
    set_fields = {}
    for key, value in update_data.items():
        set_fields[f"lessons.{lesson_index}.{key}"] = value
    
    set_fields["updated_at"] = datetime.utcnow()
    
    await db.units.update_one(
        {"id": unit_id, "lessons.id": lesson_id},
        {"$set": set_fields}
    )
    
    updated_unit = await db.units.find_one({"id": unit_id})
    return DatabaseManager.serialize_doc(updated_unit)

@router.delete("/{unit_id}/lessons/{lesson_id}", response_model=Unit)
async def delete_lesson(unit_id: int, lesson_id: int):
    """Delete a lesson from a unit"""
    unit = await db.units.find_one({"id": unit_id})
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    await db.units.update_one(
        {"id": unit_id},
        {
            "$pull": {"lessons": {"id": lesson_id}},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    # Also delete related calendar events
    await db.calendar_events.delete_many({"unit_id": unit_id, "lesson_id": lesson_id})
    
    updated_unit = await db.units.find_one({"id": unit_id})
    return DatabaseManager.serialize_doc(updated_unit)