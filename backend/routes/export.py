from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import List
import io
from datetime import datetime
from models.settings import PDFExportOptions
from utils.database import db, DatabaseManager
from services.pdf_generator import PDFGenerator

router = APIRouter(prefix="/api/export", tags=["export"])

@router.post("/pdf")
async def export_pdf(options: PDFExportOptions):
    """Generate and download PDF of course schema"""
    try:
        # Get course data
        settings = await db.course_settings.find_one()
        if not settings:
            raise HTTPException(status_code=404, detail="Course settings not found")
        
        # Get units (filter if specific units selected)
        if options.selected_units:
            units = await db.units.find({"id": {"$in": options.selected_units}}).to_list(1000)
        else:
            units = await db.units.find().to_list(1000)
        
        if not units:
            raise HTTPException(status_code=404, detail="No units found")
        
        # Get resources if needed
        resources = []
        if options.include_resources:
            resources = await db.resources.find().to_list(1000)
        
        # Get calendar events if needed
        events = []
        if options.include_schedule:
            events = await db.calendar_events.find().sort("date", 1).to_list(1000)
        
        # Generate PDF
        pdf_generator = PDFGenerator()
        pdf_buffer = pdf_generator.generate_course_pdf(
            settings=settings,
            units=units,
            resources=resources,
            events=events,
            options=options
        )
        
        # Create response
        filename = f"schema_cours_icd201_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return StreamingResponse(
            io.BytesIO(pdf_buffer),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@router.post("/preview")
async def preview_export(options: PDFExportOptions):
    """Get preview of what will be included in PDF export"""
    try:
        # Get course settings
        settings = await db.course_settings.find_one()
        if not settings:
            raise HTTPException(status_code=404, detail="Course settings not found")
        
        # Get units
        if options.selected_units:
            units = await db.units.find({"id": {"$in": options.selected_units}}).to_list(1000)
        else:
            units = await db.units.find().to_list(1000)
        
        # Calculate totals
        total_hours = sum(unit.get("duration", 0) for unit in units)
        total_lessons = sum(len(unit.get("lessons", [])) for unit in units)
        
        # Get resource usage if needed
        resource_usage = []
        if options.include_resources:
            resources = await db.resources.find().to_list(1000)
            for resource in resources:
                usage_hours = 0
                for unit in units:
                    for lesson in unit.get("lessons", []):
                        if resource.get("id") in lesson.get("resources", []):
                            usage_hours += lesson.get("duration", 0)
                
                resource_usage.append({
                    "resource_name": resource.get("name"),
                    "usage_hours": usage_hours
                })
        
        # Get calendar summary if needed
        calendar_summary = {}
        if options.include_schedule:
            events = await db.calendar_events.find().to_list(1000)
            calendar_summary = {
                "total_events": len(events),
                "scheduled_hours": sum(event.get("duration", 0) for event in events)
            }
        
        preview = {
            "course_info": {
                "title": settings.get("course_title"),
                "description": settings.get("course_description"),
                "total_hours": settings.get("total_hours"),
                "total_weeks": settings.get("total_weeks")
            },
            "export_summary": {
                "selected_units": len(units),
                "total_hours": total_hours,
                "total_lessons": total_lessons,
                "sections_included": []
            },
            "units_preview": [
                {
                    "id": unit.get("id"),
                    "title": unit.get("title"),
                    "duration": unit.get("duration"),
                    "lessons_count": len(unit.get("lessons", [])),
                    "objectives_count": len(unit.get("objectives", []))
                }
                for unit in units
            ]
        }
        
        # Add sections that will be included
        if options.include_objectives:
            preview["export_summary"]["sections_included"].append("Objectifs d'apprentissage")
        if options.include_lessons:
            preview["export_summary"]["sections_included"].append("Détail des leçons")
        if options.include_resources:
            preview["export_summary"]["sections_included"].append("Ressources technologiques")
            preview["resource_usage"] = resource_usage
        if options.include_schedule:
            preview["export_summary"]["sections_included"].append("Calendrier et planification")
            preview["calendar_summary"] = calendar_summary
        if options.include_activities:
            preview["export_summary"]["sections_included"].append("Activités pédagogiques")
        
        return preview
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating preview: {str(e)}")