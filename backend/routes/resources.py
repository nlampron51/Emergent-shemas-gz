from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from models.resource import Resource, ResourceCreate, ResourceUpdate, ResourceUsage
from utils.database import db, DatabaseManager

router = APIRouter(prefix="/api/resources", tags=["resources"])

@router.get("/", response_model=List[Resource])
async def get_resources():
    """Get all resources"""
    resources = await db.resources.find().to_list(1000)
    return DatabaseManager.serialize_docs(resources)

@router.get("/{resource_id}", response_model=Resource)
async def get_resource(resource_id: str):
    """Get a specific resource by ID"""
    resource = await db.resources.find_one({"id": resource_id})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return DatabaseManager.serialize_doc(resource)

@router.post("/", response_model=Resource)
async def create_resource(resource: ResourceCreate):
    """Create a new resource"""
    # Check if resource ID already exists
    existing = await db.resources.find_one({"id": resource.id})
    if existing:
        raise HTTPException(status_code=400, detail="Resource ID already exists")
    
    resource_dict = resource.dict()
    resource_dict.update({
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db.resources.insert_one(resource_dict)
    created_resource = await db.resources.find_one({"_id": result.inserted_id})
    return DatabaseManager.serialize_doc(created_resource)

@router.put("/{resource_id}", response_model=Resource)
async def update_resource(resource_id: str, resource_update: ResourceUpdate):
    """Update an existing resource"""
    existing_resource = await db.resources.find_one({"id": resource_id})
    if not existing_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    update_data = {k: v for k, v in resource_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.resources.update_one(
        {"id": resource_id},
        {"$set": update_data}
    )
    
    updated_resource = await db.resources.find_one({"id": resource_id})
    return DatabaseManager.serialize_doc(updated_resource)

@router.delete("/{resource_id}")
async def delete_resource(resource_id: str):
    """Delete a resource"""
    result = await db.resources.delete_one({"id": resource_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Remove resource from all units/lessons and calendar events
    await db.units.update_many(
        {},
        {"$pull": {"lessons.$[].resources": resource_id}}
    )
    
    await db.calendar_events.update_many(
        {},
        {"$pull": {"resources": resource_id}}
    )
    
    return {"message": "Resource deleted successfully"}

@router.get("/{resource_id}/usage", response_model=ResourceUsage)
async def get_resource_usage(resource_id: str):
    """Get usage statistics for a resource"""
    resource = await db.resources.find_one({"id": resource_id})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Get all units
    units = await db.units.find().to_list(1000)
    
    total_hours = 0
    lessons_count = 0
    units_using = []
    
    for unit in units:
        unit_uses_resource = False
        for lesson in unit.get("lessons", []):
            if resource_id in lesson.get("resources", []):
                total_hours += lesson.get("duration", 0)
                lessons_count += 1
                unit_uses_resource = True
        
        if unit_uses_resource:
            units_using.append({
                "unit_id": unit.get("id"),
                "unit_title": unit.get("title")
            })
    
    # Calculate utilization percentage (assuming 110 total course hours)
    utilization_percentage = (total_hours / 110) * 100 if total_hours > 0 else 0
    
    return ResourceUsage(
        resource_id=resource_id,
        resource_name=resource.get("name", ""),
        total_hours=total_hours,
        lessons_count=lessons_count,
        units_using=units_using,
        utilization_percentage=round(utilization_percentage, 2)
    )