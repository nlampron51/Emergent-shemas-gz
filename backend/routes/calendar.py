from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta
from models.calendar import CalendarEvent, CalendarEventCreate, CalendarEventUpdate, WeekView
from utils.database import db, DatabaseManager

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

@router.get("/events", response_model=List[CalendarEvent])
async def get_events(unit_id: Optional[int] = None, resource_id: Optional[str] = None):
    """Get all calendar events with optional filtering"""
    filter_query = {}
    
    if unit_id:
        filter_query["unit_id"] = unit_id
    
    if resource_id:
        filter_query["resources"] = resource_id
    
    events = await db.calendar_events.find(filter_query).sort("date", 1).to_list(1000)
    return DatabaseManager.serialize_docs(events)

@router.get("/events/{event_id}", response_model=CalendarEvent)
async def get_event(event_id: int):
    """Get a specific calendar event"""
    event = await db.calendar_events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return DatabaseManager.serialize_doc(event)

@router.post("/events", response_model=CalendarEvent)
async def create_event(event: CalendarEventCreate):
    """Create a new calendar event"""
    # Get the next event ID
    last_event = await db.calendar_events.find_one(sort=[("id", -1)])
    next_id = (last_event["id"] + 1) if last_event else 1
    
    # Validate unit exists
    unit = await db.units.find_one({"id": event.unit_id})
    if not unit:
        raise HTTPException(status_code=400, detail="Unit not found")
    
    # Validate lesson exists if lesson_id provided
    if event.lesson_id:
        lessons = unit.get("lessons", [])
        lesson_exists = any(l.get("id") == event.lesson_id for l in lessons)
        if not lesson_exists:
            raise HTTPException(status_code=400, detail="Lesson not found in unit")
    
    # Validate resources exist
    for resource_id in event.resources:
        resource = await db.resources.find_one({"id": resource_id})
        if not resource:
            raise HTTPException(status_code=400, detail=f"Resource {resource_id} not found")
    
    event_dict = event.dict()
    event_dict.update({
        "id": next_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db.calendar_events.insert_one(event_dict)
    created_event = await db.calendar_events.find_one({"_id": result.inserted_id})
    return DatabaseManager.serialize_doc(created_event)

@router.put("/events/{event_id}", response_model=CalendarEvent)
async def update_event(event_id: int, event_update: CalendarEventUpdate):
    """Update an existing calendar event"""
    existing_event = await db.calendar_events.find_one({"id": event_id})
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = {k: v for k, v in event_update.dict().items() if v is not None}
    
    # Validate unit exists if unit_id is being updated
    if "unit_id" in update_data:
        unit = await db.units.find_one({"id": update_data["unit_id"]})
        if not unit:
            raise HTTPException(status_code=400, detail="Unit not found")
    
    # Validate lesson exists if lesson_id is being updated
    if "lesson_id" in update_data and update_data["lesson_id"]:
        unit_id = update_data.get("unit_id", existing_event["unit_id"])
        unit = await db.units.find_one({"id": unit_id})
        lessons = unit.get("lessons", [])
        lesson_exists = any(l.get("id") == update_data["lesson_id"] for l in lessons)
        if not lesson_exists:
            raise HTTPException(status_code=400, detail="Lesson not found in unit")
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.calendar_events.update_one(
        {"id": event_id},
        {"$set": update_data}
    )
    
    updated_event = await db.calendar_events.find_one({"id": event_id})
    return DatabaseManager.serialize_doc(updated_event)

@router.delete("/events/{event_id}")
async def delete_event(event_id: int):
    """Delete a calendar event"""
    result = await db.calendar_events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted successfully"}

@router.get("/weeks", response_model=List[WeekView])
async def get_weeks_view():
    """Get calendar organized by weeks"""
    # Get course settings for date range
    settings = await db.course_settings.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Course settings not found")
    
    start_date = datetime.fromisoformat(settings["start_date"])
    total_weeks = settings["total_weeks"]
    
    weeks = []
    
    for week_num in range(1, total_weeks + 1):
        week_start = start_date + timedelta(weeks=week_num - 1)
        week_end = week_start + timedelta(days=6)
        
        # Get events for this week
        week_events = await db.calendar_events.find({
            "date": {
                "$gte": week_start.strftime("%Y-%m-%d"),
                "$lte": week_end.strftime("%Y-%m-%d")
            }
        }).sort("date", 1).to_list(1000)
        
        total_hours = sum(event.get("duration", 0) for event in week_events)
        
        weeks.append(WeekView(
            week_number=week_num,
            start_date=week_start.strftime("%Y-%m-%d"),
            end_date=week_end.strftime("%Y-%m-%d"),
            events=DatabaseManager.serialize_docs(week_events),
            total_hours=total_hours
        ))
    
    return weeks

@router.get("/conflicts")
async def detect_conflicts():
    """Detect resource conflicts in calendar"""
    conflicts = []
    
    # Get all events grouped by date
    events = await db.calendar_events.find().sort("date", 1).to_list(1000)
    
    # Group events by date
    events_by_date = {}
    for event in events:
        date = event.get("date")
        if date not in events_by_date:
            events_by_date[date] = []
        events_by_date[date].append(event)
    
    # Check for resource conflicts on same day
    for date, day_events in events_by_date.items():
        resource_usage = {}
        
        for event in day_events:
            for resource_id in event.get("resources", []):
                if resource_id not in resource_usage:
                    resource_usage[resource_id] = 0
                resource_usage[resource_id] += 1
        
        # Check if any resource is over-used
        for resource_id, usage_count in resource_usage.items():
            if usage_count > 1:
                resource = await db.resources.find_one({"id": resource_id})
                conflicts.append({
                    "date": date,
                    "resource_id": resource_id,
                    "resource_name": resource.get("name", "") if resource else resource_id,
                    "conflict_count": usage_count,
                    "events": [e for e in day_events if resource_id in e.get("resources", [])]
                })
    
    return {"conflicts": conflicts}