from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date

class CalendarEvent(BaseModel):
    id: int
    title: str
    unit_id: int
    lesson_id: Optional[int] = None
    date: str  # ISO date string
    duration: int  # hours
    resources: List[str] = []  # resource IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CalendarEventCreate(BaseModel):
    title: str
    unit_id: int
    lesson_id: Optional[int] = None
    date: str
    duration: int
    resources: List[str] = []

class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None
    date: Optional[str] = None
    duration: Optional[int] = None
    resources: Optional[List[str]] = None

class WeekView(BaseModel):
    week_number: int
    start_date: str
    end_date: str
    events: List[CalendarEvent] = []
    total_hours: int = 0