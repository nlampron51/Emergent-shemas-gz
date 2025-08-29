#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for ICD201 Course Schema API
Tests all endpoints with realistic data and proper error handling
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://icd-learning-path.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class APITester:
    def __init__(self):
        self.session = None
        self.test_results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            'test': test_name,
            'status': status,
            'success': success,
            'details': details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    async def make_request(self, method: str, url: str, data: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            kwargs = {'timeout': aiohttp.ClientTimeout(total=30)}
            if data:
                kwargs['json'] = data
                
            async with self.session.request(method, url, **kwargs) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                return response.status < 400, response_data, response.status
        except Exception as e:
            return False, str(e), 0
    
    async def test_api_health(self):
        """Test basic API health check"""
        print("\n=== Testing API Health ===")
        
        success, data, status = await self.make_request('GET', f"{API_BASE}/")
        
        if success and isinstance(data, dict) and 'message' in data:
            self.log_result("API Health Check", True, f"Status: {status}, Message: {data['message']}")
            return True
        else:
            self.log_result("API Health Check", False, f"Status: {status}, Response: {data}")
            return False
    
    async def test_units_crud(self):
        """Test Units CRUD operations"""
        print("\n=== Testing Units CRUD ===")
        
        # Test GET all units
        success, units_data, status = await self.make_request('GET', f"{API_BASE}/units/")
        if success and isinstance(units_data, list):
            self.log_result("GET /units - Fetch all units", True, f"Found {len(units_data)} units")
            
            # Verify unit structure
            if units_data and all(key in units_data[0] for key in ['id', 'title', 'duration', 'lessons']):
                self.log_result("Units data structure validation", True, "All required fields present")
            else:
                self.log_result("Units data structure validation", False, "Missing required fields")
        else:
            self.log_result("GET /units - Fetch all units", False, f"Status: {status}, Response: {units_data}")
            return False
        
        # Test GET specific unit
        if units_data:
            unit_id = units_data[0]['id']
            success, unit_data, status = await self.make_request('GET', f"{API_BASE}/units/{unit_id}")
            if success and isinstance(unit_data, dict) and unit_data.get('id') == unit_id:
                self.log_result(f"GET /units/{unit_id} - Fetch specific unit", True, f"Retrieved unit: {unit_data.get('title', 'Unknown')}")
            else:
                self.log_result(f"GET /units/{unit_id} - Fetch specific unit", False, f"Status: {status}")
        
        # Test POST new unit
        new_unit_data = {
            "title": "Test Unit - Technologies Émergentes",
            "duration": 15,
            "description": "Unité de test pour explorer les technologies émergentes comme l'IA et la blockchain",
            "objectives": [
                "Comprendre les principes de l'intelligence artificielle",
                "Explorer les applications de la blockchain",
                "Analyser l'impact des technologies émergentes"
            ]
        }
        
        success, created_unit, status = await self.make_request('POST', f"{API_BASE}/units/", new_unit_data)
        if success and isinstance(created_unit, dict) and 'id' in created_unit:
            test_unit_id = created_unit['id']
            self.log_result("POST /units - Create new unit", True, f"Created unit with ID: {test_unit_id}")
            
            # Test PUT update unit
            update_data = {
                "title": "Test Unit - Technologies Émergentes (Mis à jour)",
                "duration": 20,
                "description": "Description mise à jour avec plus de détails sur l'IA et blockchain"
            }
            
            success, updated_unit, status = await self.make_request('PUT', f"{API_BASE}/units/{test_unit_id}", update_data)
            if success and updated_unit.get('title') == update_data['title']:
                self.log_result(f"PUT /units/{test_unit_id} - Update unit", True, "Unit updated successfully")
            else:
                self.log_result(f"PUT /units/{test_unit_id} - Update unit", False, f"Status: {status}")
            
            # Test lesson management
            await self.test_lesson_management(test_unit_id)
            
        else:
            self.log_result("POST /units - Create new unit", False, f"Status: {status}, Response: {created_unit}")
    
    async def test_lesson_management(self, unit_id: int):
        """Test lesson management within units"""
        print(f"\n=== Testing Lesson Management for Unit {unit_id} ===")
        
        # Test POST add lesson
        lesson_data = {
            "title": "Introduction à l'Intelligence Artificielle",
            "duration": 4,
            "resources": ["ordinateurs", "iPad"],
            "activities": ["Démonstration IA", "Exercices pratiques", "Discussion éthique"],
            "content": "Exploration des concepts fondamentaux de l'IA, des algorithmes d'apprentissage automatique et des implications éthiques"
        }
        
        success, updated_unit, status = await self.make_request('POST', f"{API_BASE}/units/{unit_id}/lessons", lesson_data)
        if success and isinstance(updated_unit, dict):
            lessons = updated_unit.get('lessons', [])
            if lessons:
                lesson_id = lessons[-1]['id']  # Get the last added lesson
                self.log_result(f"POST /units/{unit_id}/lessons - Add lesson", True, f"Added lesson with ID: {lesson_id}")
                
                # Test PUT update lesson
                lesson_update = {
                    "title": "Introduction à l'IA et Machine Learning",
                    "duration": 5,
                    "content": "Contenu étendu incluant des exemples pratiques de ML"
                }
                
                success, updated_unit, status = await self.make_request('PUT', f"{API_BASE}/units/{unit_id}/lessons/{lesson_id}", lesson_update)
                if success:
                    self.log_result(f"PUT /units/{unit_id}/lessons/{lesson_id} - Update lesson", True, "Lesson updated successfully")
                else:
                    self.log_result(f"PUT /units/{unit_id}/lessons/{lesson_id} - Update lesson", False, f"Status: {status}")
            else:
                self.log_result(f"POST /units/{unit_id}/lessons - Add lesson", False, "No lessons found in response")
        else:
            self.log_result(f"POST /units/{unit_id}/lessons - Add lesson", False, f"Status: {status}")
    
    async def test_resources_crud(self):
        """Test Resources CRUD operations"""
        print("\n=== Testing Resources CRUD ===")
        
        # Test GET all resources
        success, resources_data, status = await self.make_request('GET', f"{API_BASE}/resources/")
        if success and isinstance(resources_data, list):
            self.log_result("GET /resources - Fetch all resources", True, f"Found {len(resources_data)} resources")
            
            # Verify resource structure
            if resources_data and all(key in resources_data[0] for key in ['id', 'name', 'quantity', 'availability']):
                self.log_result("Resources data structure validation", True, "All required fields present")
            else:
                self.log_result("Resources data structure validation", False, "Missing required fields")
        else:
            self.log_result("GET /resources - Fetch all resources", False, f"Status: {status}")
            return False
        
        # Test GET specific resource
        if resources_data:
            resource_id = resources_data[0]['id']
            success, resource_data, status = await self.make_request('GET', f"{API_BASE}/resources/{resource_id}")
            if success and isinstance(resource_data, dict) and resource_data.get('id') == resource_id:
                self.log_result(f"GET /resources/{resource_id} - Fetch specific resource", True, f"Retrieved: {resource_data.get('name', 'Unknown')}")
            else:
                self.log_result(f"GET /resources/{resource_id} - Fetch specific resource", False, f"Status: {status}")
        
        # Test POST new resource
        new_resource_data = {
            "id": "casquesVR",
            "name": "Casques de Réalité Virtuelle",
            "quantity": 8,
            "description": "Casques VR pour expériences immersives et développement d'applications 3D",
            "availability": "Réservation requise - Planning hebdomadaire"
        }
        
        success, created_resource, status = await self.make_request('POST', f"{API_BASE}/resources/", new_resource_data)
        if success and isinstance(created_resource, dict):
            self.log_result("POST /resources - Create new resource", True, f"Created resource: {created_resource.get('name', 'Unknown')}")
            
            # Test resource usage statistics
            success, usage_data, status = await self.make_request('GET', f"{API_BASE}/resources/{new_resource_data['id']}/usage")
            if success and isinstance(usage_data, dict):
                self.log_result(f"GET /resources/{new_resource_data['id']}/usage - Resource usage stats", True, 
                              f"Usage: {usage_data.get('total_hours', 0)}h, {usage_data.get('lessons_count', 0)} lessons")
            else:
                self.log_result(f"GET /resources/{new_resource_data['id']}/usage - Resource usage stats", False, f"Status: {status}")
        else:
            self.log_result("POST /resources - Create new resource", False, f"Status: {status}, Response: {created_resource}")
    
    async def test_calendar_operations(self):
        """Test Calendar Events operations"""
        print("\n=== Testing Calendar Operations ===")
        
        # Test GET all events
        success, events_data, status = await self.make_request('GET', f"{API_BASE}/calendar/events")
        if success and isinstance(events_data, list):
            self.log_result("GET /calendar/events - Fetch all events", True, f"Found {len(events_data)} events")
            
            # Verify event structure
            if events_data and all(key in events_data[0] for key in ['id', 'title', 'unit_id', 'date', 'duration']):
                self.log_result("Calendar events data structure validation", True, "All required fields present")
            else:
                self.log_result("Calendar events data structure validation", False, "Missing required fields")
        else:
            self.log_result("GET /calendar/events - Fetch all events", False, f"Status: {status}")
            return False
        
        # Test POST new event
        future_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        new_event_data = {
            "title": "Atelier Réalité Virtuelle - Projet Final",
            "unit_id": 2,  # Innovation unit
            "date": future_date,
            "duration": 6,
            "resources": ["ordinateurs", "casquesVR"]
        }
        
        success, created_event, status = await self.make_request('POST', f"{API_BASE}/calendar/events", new_event_data)
        if success and isinstance(created_event, dict) and 'id' in created_event:
            event_id = created_event['id']
            self.log_result("POST /calendar/events - Create new event", True, f"Created event with ID: {event_id}")
        else:
            self.log_result("POST /calendar/events - Create new event", False, f"Status: {status}, Response: {created_event}")
        
        # Test weeks view
        success, weeks_data, status = await self.make_request('GET', f"{API_BASE}/calendar/weeks")
        if success and isinstance(weeks_data, list):
            self.log_result("GET /calendar/weeks - Weeks view", True, f"Found {len(weeks_data)} weeks")
            
            # Verify week structure
            if weeks_data and all(key in weeks_data[0] for key in ['week_number', 'start_date', 'end_date', 'events']):
                self.log_result("Weeks view data structure validation", True, "All required fields present")
            else:
                self.log_result("Weeks view data structure validation", False, "Missing required fields")
        else:
            self.log_result("GET /calendar/weeks - Weeks view", False, f"Status: {status}")
    
    async def test_settings_operations(self):
        """Test Settings operations"""
        print("\n=== Testing Settings Operations ===")
        
        # Test GET settings
        success, settings_data, status = await self.make_request('GET', f"{API_BASE}/settings/")
        if success and isinstance(settings_data, dict):
            self.log_result("GET /settings - Fetch course settings", True, 
                          f"Course: {settings_data.get('course_title', 'Unknown')}")
            
            # Verify settings structure
            required_fields = ['total_hours', 'total_weeks', 'start_date', 'end_date', 'course_title']
            if all(key in settings_data for key in required_fields):
                self.log_result("Settings data structure validation", True, "All required fields present")
            else:
                self.log_result("Settings data structure validation", False, "Missing required fields")
            
            # Test PUT update settings
            update_data = {
                "course_description": "Cours mis à jour - Technologies numériques et innovations dans un monde en constante évolution, avec focus sur l'IA et la durabilité",
                "hours_per_week": 6.5
            }
            
            success, updated_settings, status = await self.make_request('PUT', f"{API_BASE}/settings/", update_data)
            if success and updated_settings.get('course_description') == update_data['course_description']:
                self.log_result("PUT /settings - Update course settings", True, "Settings updated successfully")
            else:
                self.log_result("PUT /settings - Update course settings", False, f"Status: {status}")
        else:
            self.log_result("GET /settings - Fetch course settings", False, f"Status: {status}")
    
    async def test_export_preview(self):
        """Test Export Preview functionality"""
        print("\n=== Testing Export Preview ===")
        
        # Test export preview
        export_options = {
            "include_objectives": True,
            "include_lessons": True,
            "include_resources": True,
            "include_schedule": True,
            "include_activities": True,
            "detail_level": "detailed",
            "selected_units": []
        }
        
        success, preview_data, status = await self.make_request('POST', f"{API_BASE}/export/preview", export_options)
        if success and isinstance(preview_data, dict):
            self.log_result("POST /export/preview - PDF preview", True, 
                          f"Preview generated for {preview_data.get('export_summary', {}).get('selected_units', 0)} units")
            
            # Verify preview structure
            required_sections = ['course_info', 'export_summary', 'units_preview']
            if all(key in preview_data for key in required_sections):
                self.log_result("Export preview data structure validation", True, "All required sections present")
            else:
                self.log_result("Export preview data structure validation", False, "Missing required sections")
        else:
            self.log_result("POST /export/preview - PDF preview", False, f"Status: {status}, Response: {preview_data}")
    
    async def test_error_handling(self):
        """Test API error handling"""
        print("\n=== Testing Error Handling ===")
        
        # Test 404 errors
        success, data, status = await self.make_request('GET', f"{API_BASE}/units/99999")
        if status == 404:
            self.log_result("404 Error Handling - Non-existent unit", True, "Proper 404 response")
        else:
            self.log_result("404 Error Handling - Non-existent unit", False, f"Expected 404, got {status}")
        
        success, data, status = await self.make_request('GET', f"{API_BASE}/resources/nonexistent")
        if status == 404:
            self.log_result("404 Error Handling - Non-existent resource", True, "Proper 404 response")
        else:
            self.log_result("404 Error Handling - Non-existent resource", False, f"Expected 404, got {status}")
        
        # Test validation errors
        invalid_unit = {
            "title": "",  # Empty title should fail validation
            "duration": -5,  # Negative duration should fail
            "description": ""
        }
        
        success, data, status = await self.make_request('POST', f"{API_BASE}/units/", invalid_unit)
        if not success and status >= 400:
            self.log_result("Validation Error Handling - Invalid unit data", True, f"Proper error response: {status}")
        else:
            self.log_result("Validation Error Handling - Invalid unit data", False, f"Expected error, got {status}")
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"❌ {result['test']}")
                    if result['details']:
                        print(f"   {result['details']}")
        
        print("\n" + "="*60)
        return passed_tests, failed_tests

async def main():
    """Run all API tests"""
    print("Starting ICD201 Course Schema API Tests...")
    print(f"Testing API at: {API_BASE}")
    
    async with APITester() as tester:
        # Run all test suites
        api_healthy = await tester.test_api_health()
        
        if api_healthy:
            await tester.test_units_crud()
            await tester.test_resources_crud()
            await tester.test_calendar_operations()
            await tester.test_settings_operations()
            await tester.test_export_preview()
            await tester.test_error_handling()
        else:
            print("❌ API is not healthy, skipping remaining tests")
        
        # Print final summary
        passed, failed = tester.print_summary()
        
        return passed, failed

if __name__ == "__main__":
    try:
        passed, failed = asyncio.run(main())
        exit(0 if failed == 0 else 1)
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        exit(1)