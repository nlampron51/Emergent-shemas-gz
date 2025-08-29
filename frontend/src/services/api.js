import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.timeout = 10000;

// API service class
class ApiService {
  // Units API
  async getUnits() {
    const response = await axios.get(`${API}/units/`);
    return response.data;
  }

  async getUnit(unitId) {
    const response = await axios.get(`${API}/units/${unitId}`);
    return response.data;
  }

  async createUnit(unitData) {
    const response = await axios.post(`${API}/units`, unitData);
    return response.data;
  }

  async updateUnit(unitId, unitData) {
    const response = await axios.put(`${API}/units/${unitId}`, unitData);
    return response.data;
  }

  async deleteUnit(unitId) {
    const response = await axios.delete(`${API}/units/${unitId}`);
    return response.data;
  }

  async addLesson(unitId, lessonData) {
    const response = await axios.post(`${API}/units/${unitId}/lessons`, lessonData);
    return response.data;
  }

  async updateLesson(unitId, lessonId, lessonData) {
    const response = await axios.put(`${API}/units/${unitId}/lessons/${lessonId}`, lessonData);
    return response.data;
  }

  async deleteLesson(unitId, lessonId) {
    const response = await axios.delete(`${API}/units/${unitId}/lessons/${lessonId}`);
    return response.data;
  }

  // Resources API
  async getResources() {
    const response = await axios.get(`${API}/resources`);
    return response.data;
  }

  async getResource(resourceId) {
    const response = await axios.get(`${API}/resources/${resourceId}`);
    return response.data;
  }

  async createResource(resourceData) {
    const response = await axios.post(`${API}/resources`, resourceData);
    return response.data;
  }

  async updateResource(resourceId, resourceData) {
    const response = await axios.put(`${API}/resources/${resourceId}`, resourceData);
    return response.data;
  }

  async deleteResource(resourceId) {
    const response = await axios.delete(`${API}/resources/${resourceId}`);
    return response.data;
  }

  async getResourceUsage(resourceId) {
    const response = await axios.get(`${API}/resources/${resourceId}/usage`);
    return response.data;
  }

  // Calendar API
  async getCalendarEvents(filters = {}) {
    const params = new URLSearchParams();
    if (filters.unitId) params.append('unit_id', filters.unitId);
    if (filters.resourceId) params.append('resource_id', filters.resourceId);
    
    const response = await axios.get(`${API}/calendar/events?${params}`);
    return response.data;
  }

  async getCalendarEvent(eventId) {
    const response = await axios.get(`${API}/calendar/events/${eventId}`);
    return response.data;
  }

  async createCalendarEvent(eventData) {
    const response = await axios.post(`${API}/calendar/events`, eventData);
    return response.data;
  }

  async updateCalendarEvent(eventId, eventData) {
    const response = await axios.put(`${API}/calendar/events/${eventId}`, eventData);
    return response.data;
  }

  async deleteCalendarEvent(eventId) {
    const response = await axios.delete(`${API}/calendar/events/${eventId}`);
    return response.data;
  }

  async getWeeksView() {
    const response = await axios.get(`${API}/calendar/weeks`);
    return response.data;
  }

  async getCalendarConflicts() {
    const response = await axios.get(`${API}/calendar/conflicts`);
    return response.data;
  }

  // Settings API
  async getCourseSettings() {
    const response = await axios.get(`${API}/settings`);
    return response.data;
  }

  async updateCourseSettings(settingsData) {
    const response = await axios.put(`${API}/settings`, settingsData);
    return response.data;
  }

  // Export API
  async exportToPDF(options) {
    const response = await axios.post(`${API}/export/pdf`, options, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `schema_cours_icd201_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  }

  async getExportPreview(options) {
    const response = await axios.post(`${API}/export/preview`, options);
    return response.data;
  }

  // Utility methods
  async checkConnection() {
    try {
      const response = await axios.get(`${API}/`);
      return { connected: true, message: response.data.message };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Error handler helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.detail || error.response.data.message || 'Une erreur serveur est survenue',
      status: error.response.status
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
      status: null
    };
  } else {
    // Other error
    return {
      message: error.message || 'Une erreur inattendue est survenue',
      status: null
    };
  }
};