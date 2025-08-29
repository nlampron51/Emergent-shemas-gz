from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Lesson(BaseModel):
    id: int
    title: str
    duration: int  # hours
    resources: List[str] = []  # resource IDs
    activities: List[str] = []
    content: str

class LessonCreate(BaseModel):
    title: str
    duration: int
    resources: List[str] = []
    activities: List[str] = []
    content: str

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    duration: Optional[int] = None
    resources: Optional[List[str]] = None
    activities: Optional[List[str]] = None
    content: Optional[str] = None

class Unit(BaseModel):
    id: int
    title: str
    duration: int  # hours
    description: str
    objectives: List[str] = []
    lessons: List[Lesson] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UnitCreate(BaseModel):
    title: str
    duration: int
    description: str
    objectives: List[str] = []

class UnitUpdate(BaseModel):
    title: Optional[str] = None
    duration: Optional[int] = None
    description: Optional[str] = None
    objectives: Optional[List[str]] = None