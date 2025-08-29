from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CourseSettings(BaseModel):
    total_hours: int = 110
    total_weeks: int = 18
    hours_per_week: float = 6.1
    start_date: str = "2025-01-15"
    end_date: str = "2025-05-30"
    course_title: str = "ICD201 - Technologies numériques et innovations"
    course_description: str = "Technologies numériques et innovations dans un monde en évolution"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CourseSettingsUpdate(BaseModel):
    total_hours: Optional[int] = None
    total_weeks: Optional[int] = None
    hours_per_week: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    course_title: Optional[str] = None
    course_description: Optional[str] = None

class PDFExportOptions(BaseModel):
    include_objectives: bool = True
    include_lessons: bool = True
    include_resources: bool = True
    include_schedule: bool = True
    include_activities: bool = True
    detail_level: str = "detailed"  # "summary", "detailed", "custom"
    selected_units: list = []