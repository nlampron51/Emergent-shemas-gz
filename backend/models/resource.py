from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Resource(BaseModel):
    id: str
    name: str
    quantity: int
    description: str
    availability: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ResourceCreate(BaseModel):
    id: str
    name: str
    quantity: int
    description: str
    availability: str

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    description: Optional[str] = None
    availability: Optional[str] = None

class ResourceUsage(BaseModel):
    resource_id: str
    resource_name: str
    total_hours: int
    lessons_count: int
    units_using: list
    utilization_percentage: float