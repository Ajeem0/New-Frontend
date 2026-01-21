class APIService {
  constructor() {
    this.baseURL = 'https://timetable-scheduling.onrender.com/api';
    // Get token dynamically each time
    this.token = localStorage.getItem('token');
    console.log('APIService initialized with token:', this.token ? 'exists' : 'missing');
  }

  // Add method to refresh token
  refreshToken() {
    this.token = localStorage.getItem('token');
    console.log('Token refreshed:', this.token ? 'exists' : 'missing');
    return this.token;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Leave Requests
  async getLeaveRequests() {
    return this.request('/leave-requests');
  }

  async createLeaveRequest(data) {
    return this.request('/leave-requests', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async updateLeaveRequest(id, data) {
    return this.request(`/leave-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Optimization endpoints
  async getOptimizationSuggestions(batch) { 
    return this.request(`/optimization/suggestions/${batch}`); 
  }
  
  async applyOptimization(data) { 
    return this.request('/optimization/apply', { method: 'POST', body: JSON.stringify(data) }); 
  }

  async getRealTimeDashboard() {
    return this.request('/dashboard/real-time');
  }

  // Substitute faculty
  async getSubstituteFaculty() { 
    return this.request('/substitute-faculty'); 
  }

  async addSubstituteFaculty(data) { 
    return this.request('/substitute-faculty', { method: 'POST', body: JSON.stringify(data) }); 
  }

  // Reschedule queue
  async getRescheduleQueue() { 
    return this.request('/reschedule-queue'); 
  }

  async processRescheduleItem(id, data) { 
    return this.request(`/reschedule-queue/${id}/process`, { method: 'POST', body: JSON.stringify(data) }); 
  }

  // Authentication
  async login(credentials) { 
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); 
  }

  async register(userData) { 
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }); 
  }

  // Faculty
  async getFaculty() { 
    return this.request('/faculty'); 
  }

  async addFaculty(data) { 
    return this.request('/faculty', { method: 'POST', body: JSON.stringify(data) }); 
  }

  async updateFaculty(id, data) { 
    return this.request(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(data) }); 
  }

  async deleteFaculty(id) { 
    return this.request(`/faculty/${id}`, { method: 'DELETE' }); 
  }

  async getFacultyProfile() { 
    return this.request('/faculty/profile'); 
  }
  
  async changeFacultyPassword(currentPassword, newPassword) { 
    return this.request('/faculty/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
  
  async getFacultyLoginStatus() { 
    return this.request('/faculty/login-status'); 
  }
  
  async bulkRegisterFaculty() { 
    return this.request('/faculty/bulk-register', { method: 'POST' });
  }
  
  async resetFacultyPassword(facultyId, newPassword) { 
    return this.request(`/faculty/${facultyId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    });
  }
  
  async migrateFacultyAccounts() { 
    return this.request('/admin/migrate-faculty-accounts', { method: 'POST' });
  }

  // Faculty Subject Assignment
  async getFacultySubjects(facultyId) {
    return this.request(`/faculty/${facultyId}/subjects`);
  }

  async getAvailableSubjects(facultyId, department = null) {
    const dept = department ? `?department=${department}` : '';
    return this.request(`/subjects/available/${facultyId}${dept}`);
  }

  async assignSubjectToFaculty(facultyId, subjectId, isPrimary = false) {
    return this.request(`/faculty/${facultyId}/subjects`, {
        method: 'POST',
        body: JSON.stringify({ subject_id: subjectId, is_primary: isPrimary })
    });
  }

  async bulkAssignSubjects(facultyId, subjectIds, replaceExisting = false) {
    return this.request(`/faculty/${facultyId}/subjects/bulk`, {
        method: 'POST',
        body: JSON.stringify({ subject_ids: subjectIds, replace_existing: replaceExisting })
    });
  }

  async removeSubjectFromFaculty(facultyId, subjectId) {
    return this.request(`/faculty/${facultyId}/subjects/${subjectId}`, {
        method: 'DELETE'
    });
  }

  async updateFacultySubjectAssignment(facultyId, subjectId, isPrimary) {
    return this.request(`/faculty/${facultyId}/subjects/${subjectId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_primary: isPrimary })
    });
  }

  async getFacultyTeachingStats(facultyId, academicYear = '2024-25') {
    return this.request(`/faculty/${facultyId}/teaching-stats?academic_year=${academicYear}`);
  }

  // Students
  async getStudents() { 
    return this.request('/students'); 
  }

  async getStudentsByBatch(batch) { 
    return this.request(`/students/batch/${batch}`); 
  }

  async addStudent(data) { 
    return this.request('/students', { method: 'POST', body: JSON.stringify(data) }); 
  }

  // Rooms
  async getRooms() { 
    return this.request('/rooms'); 
  }

  async addRoom(data) { 
    return this.request('/rooms', { method: 'POST', body: JSON.stringify(data) }); 
  }

  async getRoomAvailability(date, timeSlot) { 
    return this.request(`/rooms/availability?date=${date}&time_slot=${timeSlot}`); 
  }

  // Subjects
  async getSubjects() { 
    return this.request('/subjects'); 
  }

  async addSubject(data) { 
    return this.request('/subjects', { method: 'POST', body: JSON.stringify(data) }); 
  }

  // Timetable
  async getTimetable(batch) { 
    return this.request(`/timetable/batch/${batch}`); 
  }

  async getFacultyTimetable(facultyId) { 
    return this.request(`/timetable/faculty/${facultyId}`); 
  }

  async generateTimetable(params) { 
    return this.request('/timetable/generate', { method: 'POST', body: JSON.stringify(params) }); 
  }

  async generateMultiSectionTimetable(data) {
    return this.request('/timetable/generate-multi-section', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getSectionTimetable(batch, section, academic_year = '2024-25') {
    return this.request(`/timetable/section/${batch}/${section}?academic_year=${academic_year}`);
  }

  async getMultiSectionSummary(batch, academic_year = '2024-25') {
    return this.request(`/timetable/multi-section-summary/${batch}?academic_year=${academic_year}`);
  }

  async validateMultiSection(batch, academic_year = '2024-25') {
    return this.request(`/timetable/validate-multi-section/${batch}?academic_year=${academic_year}`);
  }

  async exportSectionCSV(batch, section, academic_year = '2024-25') {
    const response = await fetch(`${this.baseURL}/timetable/export-section/${batch}/${section}/csv?academic_year=${academic_year}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
    return response.blob();
  }

  async deleteMultiSectionTimetable(batch, sections = null, academic_year = '2024-25') {
    return this.request(`/timetable/multi-section/${batch}`, {
        method: 'DELETE',
        body: JSON.stringify({ sections, academic_year })
    });
  }

  // Swap Requests
  async getSwapRequests() { 
    return this.request('/swap-requests'); 
  }

  async updateSwapRequest(id, data) { 
    return this.request(`/swap-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }); 
  }

  async validateSwapRequest(data) {
    return this.request('/swap-requests/validate', {
        method: 'POST',
        body: JSON.stringify(data)
    });
  }

  async createSwapRequest(data) {
    return this.request('/swap-requests/create', {
        method: 'POST',
        body: JSON.stringify(data)
    });
  }

  async getDetailedSwapRequests(status = null, facultyId = null) {
    let url = '/swap-requests/detailed?';
    if (status) url += `status=${status}&`;
    if (facultyId) url += `faculty_id=${facultyId}`;
    return this.request(url);
  }

  async approveSwapRequest(id, adminNotes = '') {
    return this.request(`/swap-requests/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ admin_notes: adminNotes })
    });
  }

  async rejectSwapRequest(id, adminNotes = '') {
    return this.request(`/swap-requests/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ admin_notes: adminNotes })
    });
  }

  // Analytics
  async getRoomUtilization() { 
    return this.request('/analytics/room-heatmap'); 
  }

  async getFacultyWorkload() { 
    return this.request('/analytics/faculty-trends'); 
  }

  async getStudentLoad() { 
    return this.request('/analytics/student-load'); 
  }

  async getRealTimeAnalytics(batch = null) { 
    return this.request(`/analytics/real-time${batch ? `?batch=${batch}` : ''}`); 
  }

  // File Upload
  async uploadFile(type, file) {
    const formData = new FormData();
    formData.append('file', file);

    const currentToken = localStorage.getItem('token');

    const url = `${this.baseURL}/upload/${type}`;

    console.log('=== UPLOAD DEBUG ===');
    console.log('URL:', url);
    console.log('Type:', type);
    console.log('File:', file.name);
    console.log('Token exists:', !!currentToken);
    console.log('Token preview:', currentToken ? currentToken.substring(0, 30) + '...' : 'MISSING');
    console.log('===================');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(this.token && { Authorization: `Bearer ${currentToken}` }),
        },
        body: formData,
      });

      console.log('Response status:', response.status);

      if (response.status === 403) {
        const text = await response.text();
        console.error('403 Response:', text);
        throw new Error('Access denied. Your admin token may have expired. Please logout and login again.');
      }

      if (response.status === 401) {
        throw new Error('Authentication required. Please logout and login again.');
      }

      if (!response.ok) {
        let errorMessage = `Upload failed (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload fetch error:', error);
      throw error;
    }
  }
}

export default APIService;
