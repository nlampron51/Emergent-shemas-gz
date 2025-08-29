from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import io
from datetime import datetime
from typing import List, Dict, Any

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading2',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceBefore=20,
            spaceAfter=12,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading3',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.blue
        ))
    
    def generate_course_pdf(self, settings: Dict, units: List[Dict], 
                          resources: List[Dict], events: List[Dict], 
                          options) -> bytes:
        """Generate complete course PDF"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        story = []
        
        # Title page
        story.extend(self._create_title_page(settings))
        story.append(PageBreak())
        
        # Table of contents
        if options.detail_level == "detailed":
            story.extend(self._create_table_of_contents(units, options))
            story.append(PageBreak())
        
        # Course overview
        story.extend(self._create_course_overview(settings, units))
        story.append(Spacer(1, 20))
        
        # Units sections
        for unit in units:
            story.extend(self._create_unit_section(unit, options))
            story.append(Spacer(1, 15))
        
        # Resources section
        if options.include_resources and resources:
            story.extend(self._create_resources_section(resources, units))
            story.append(Spacer(1, 20))
        
        # Calendar section
        if options.include_schedule and events:
            story.extend(self._create_calendar_section(events, units))
            story.append(Spacer(1, 20))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def _create_title_page(self, settings: Dict) -> List:
        """Create PDF title page"""
        story = []
        
        # Course title
        title = Paragraph(
            settings.get("course_title", "Schéma de Cours"),
            self.styles['CustomTitle']
        )
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Course description
        description = Paragraph(
            settings.get("course_description", ""),
            self.styles['Heading3']
        )
        story.append(description)
        story.append(Spacer(1, 40))
        
        # Course info table
        course_data = [
            ['Durée totale:', f"{settings.get('total_hours', 0)} heures"],
            ['Période:', f"{settings.get('total_weeks', 0)} semaines"],
            ['Heures par semaine:', f"{settings.get('hours_per_week', 0)} heures"],
            ['Date de début:', settings.get('start_date', '')],
            ['Date de fin:', settings.get('end_date', '')],
        ]
        
        course_table = Table(course_data, colWidths=[2*inch, 2*inch])
        course_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey)
        ]))
        
        story.append(course_table)
        story.append(Spacer(1, 40))
        
        # Generation info
        generation_info = Paragraph(
            f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
            self.styles['Normal']
        )
        story.append(generation_info)
        
        return story
    
    def _create_table_of_contents(self, units: List[Dict], options) -> List:
        """Create table of contents"""
        story = []
        
        story.append(Paragraph("Table des matières", self.styles['CustomHeading2']))
        story.append(Spacer(1, 20))
        
        toc_data = [['Section', 'Page']]
        
        # Add course overview
        toc_data.append(['Vue d\'ensemble du cours', '3'])
        
        # Add units
        page_num = 4
        for unit in units:
            toc_data.append([f"Unité {unit.get('id')}: {unit.get('title')}", str(page_num)])
            if options.include_lessons:
                for lesson in unit.get('lessons', []):
                    toc_data.append([f"  - {lesson.get('title')}", str(page_num)])
            page_num += 1
        
        if options.include_resources:
            toc_data.append(['Ressources technologiques', str(page_num)])
            page_num += 1
        
        if options.include_schedule:
            toc_data.append(['Planification calendaire', str(page_num)])
        
        toc_table = Table(toc_data, colWidths=[4*inch, 1*inch])
        toc_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, 0), 1, colors.black),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.black)
        ]))
        
        story.append(toc_table)
        return story
    
    def _create_course_overview(self, settings: Dict, units: List[Dict]) -> List:
        """Create course overview section"""
        story = []
        
        story.append(Paragraph("Vue d'ensemble du cours", self.styles['CustomHeading2']))
        story.append(Spacer(1, 15))
        
        # Course statistics
        total_lessons = sum(len(unit.get('lessons', [])) for unit in units)
        total_objectives = sum(len(unit.get('objectives', [])) for unit in units)
        
        stats_data = [
            ['Nombre d\'unités:', str(len(units))],
            ['Nombre de leçons:', str(total_lessons)],
            ['Objectifs d\'apprentissage:', str(total_objectives)],
            ['Heures totales:', f"{settings.get('total_hours', 0)} heures"]
        ]
        
        stats_table = Table(stats_data, colWidths=[2.5*inch, 1.5*inch])
        stats_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey)
        ]))
        
        story.append(stats_table)
        story.append(Spacer(1, 20))
        
        # Units summary
        story.append(Paragraph("Résumé des unités", self.styles['CustomHeading3']))
        story.append(Spacer(1, 10))
        
        units_data = [['Unité', 'Titre', 'Durée', 'Leçons']]
        for unit in units:
            units_data.append([
                str(unit.get('id', '')),
                unit.get('title', ''),
                f"{unit.get('duration', 0)}h",
                str(len(unit.get('lessons', [])))
            ])
        
        units_table = Table(units_data, colWidths=[0.7*inch, 3*inch, 0.8*inch, 0.8*inch])
        units_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey)
        ]))
        
        story.append(units_table)
        return story
    
    def _create_unit_section(self, unit: Dict, options) -> List:
        """Create individual unit section"""
        story = []
        
        # Unit title
        title = f"Unité {unit.get('id')}: {unit.get('title')}"
        story.append(Paragraph(title, self.styles['CustomHeading2']))
        story.append(Spacer(1, 10))
        
        # Unit description
        description = unit.get('description', '')
        story.append(Paragraph(description, self.styles['Normal']))
        story.append(Spacer(1, 15))
        
        # Unit info
        info_data = [
            ['Durée:', f"{unit.get('duration', 0)} heures"],
            ['Nombre de leçons:', str(len(unit.get('lessons', [])))]
        ]
        
        info_table = Table(info_data, colWidths=[1.5*inch, 2*inch])
        info_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6)
        ]))
        
        story.append(info_table)
        story.append(Spacer(1, 15))
        
        # Objectives
        if options.include_objectives and unit.get('objectives'):
            story.append(Paragraph("Objectifs d'apprentissage", self.styles['CustomHeading3']))
            story.append(Spacer(1, 8))
            
            for i, objective in enumerate(unit.get('objectives', []), 1):
                obj_text = f"{i}. {objective}"
                story.append(Paragraph(obj_text, self.styles['Normal']))
                story.append(Spacer(1, 4))
            
            story.append(Spacer(1, 15))
        
        # Lessons
        if options.include_lessons and unit.get('lessons'):
            story.append(Paragraph("Leçons", self.styles['CustomHeading3']))
            story.append(Spacer(1, 10))
            
            lessons_data = [['#', 'Titre', 'Durée', 'Ressources']]
            
            for lesson in unit.get('lessons', []):
                resources_str = ', '.join(lesson.get('resources', []))
                if len(resources_str) > 30:
                    resources_str = resources_str[:30] + '...'
                
                lessons_data.append([
                    str(lesson.get('id', '')),
                    lesson.get('title', ''),
                    f"{lesson.get('duration', 0)}h",
                    resources_str
                ])
            
            lessons_table = Table(lessons_data, colWidths=[0.5*inch, 2.5*inch, 0.7*inch, 1.5*inch])
            lessons_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey)
            ]))
            
            story.append(lessons_table)
            
            # Detailed lesson content if requested
            if options.detail_level == "detailed":
                story.append(Spacer(1, 15))
                for lesson in unit.get('lessons', []):
                    story.append(Paragraph(f"Leçon: {lesson.get('title')}", self.styles['Heading4']))
                    story.append(Spacer(1, 6))
                    
                    if lesson.get('content'):
                        story.append(Paragraph(lesson.get('content'), self.styles['Normal']))
                        story.append(Spacer(1, 8))
                    
                    if options.include_activities and lesson.get('activities'):
                        activities_text = "Activités: " + ", ".join(lesson.get('activities', []))
                        story.append(Paragraph(activities_text, self.styles['Normal']))
                        story.append(Spacer(1, 10))
        
        return story
    
    def _create_resources_section(self, resources: List[Dict], units: List[Dict]) -> List:
        """Create resources section"""
        story = []
        
        story.append(Paragraph("Ressources technologiques", self.styles['CustomHeading2']))
        story.append(Spacer(1, 15))
        
        resources_data = [['Ressource', 'Quantité', 'Description', 'Statut']]
        
        for resource in resources:
            resources_data.append([
                resource.get('name', ''),
                str(resource.get('quantity', 0)),
                resource.get('description', '')[:50] + ('...' if len(resource.get('description', '')) > 50 else ''),
                resource.get('availability', '')
            ])
        
        resources_table = Table(resources_data, colWidths=[1.5*inch, 0.8*inch, 2.2*inch, 1.2*inch])
        resources_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP')
        ]))
        
        story.append(resources_table)
        return story
    
    def _create_calendar_section(self, events: List[Dict], units: List[Dict]) -> List:
        """Create calendar section"""
        story = []
        
        story.append(Paragraph("Planification calendaire", self.styles['CustomHeading2']))
        story.append(Spacer(1, 15))
        
        # Group events by month for better organization
        events_by_month = {}
        for event in events:
            date_str = event.get('date', '')
            if date_str:
                month_key = date_str[:7]  # YYYY-MM format
                if month_key not in events_by_month:
                    events_by_month[month_key] = []
                events_by_month[month_key].append(event)
        
        for month, month_events in sorted(events_by_month.items()):
            # Month header
            month_name = datetime.strptime(month + "-01", "%Y-%m-%d").strftime("%B %Y")
            story.append(Paragraph(month_name, self.styles['CustomHeading3']))
            story.append(Spacer(1, 10))
            
            # Events table for this month
            events_data = [['Date', 'Événement', 'Durée', 'Ressources']]
            
            for event in sorted(month_events, key=lambda x: x.get('date', '')):
                date_obj = datetime.strptime(event.get('date'), '%Y-%m-%d')
                formatted_date = date_obj.strftime('%d/%m')
                
                resources_str = ', '.join(event.get('resources', []))
                if len(resources_str) > 25:
                    resources_str = resources_str[:25] + '...'
                
                events_data.append([
                    formatted_date,
                    event.get('title', ''),
                    f"{event.get('duration', 0)}h",
                    resources_str
                ])
            
            events_table = Table(events_data, colWidths=[0.8*inch, 2.5*inch, 0.6*inch, 1.3*inch])
            events_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey)
            ]))
            
            story.append(events_table)
            story.append(Spacer(1, 15))
        
        return story