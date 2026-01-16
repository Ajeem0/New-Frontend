import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  User, Calendar, Users, BookOpen, MapPin, Clock, Bell, Settings, LogOut,
  Plus, Edit, Trash2, Filter, Search, Star, ChevronDown, ChevronRight,
  Home, FileText, Upload, Download, BarChart3,Grid, AlertCircle, CheckCircle,
  X, Save, Eye, EyeOff, Lock, RefreshCw, Send, MessageSquare, Building,
  GraduationCap, Computer, FlaskConical, Presentation, Phone, Mail, ArrowRight,
  Info, ChevronUp,
  TrendingUp, PieChart, Activity
} from 'lucide-react';

// ==================== CONTEXT & HOOKS ====================
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ==================== API SERVICE ====================





class APIService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
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
    const currentToken = localStorage.getItem('token');
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

  //changes start here
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
  async getOptimizationSuggestions(batch) { return this.request(`/optimization/suggestions/${batch}`); }
  
  async applyOptimization(data) { return this.request('/optimization/apply', { method: 'POST', body: JSON.stringify(data) }); }
  async getRealTimeDashboard() {
    return this.request('/dashboard/real-time');
  }

  // Substitute faculty
  async getSubstituteFaculty() { return this.request('/substitute-faculty'); }
  async addSubstituteFaculty(data) { return this.request('/substitute-faculty', { method: 'POST', body: JSON.stringify(data) }); }

  // Reschedule queue
  async getRescheduleQueue() { return this.request('/reschedule-queue'); }
  async processRescheduleItem(id, data) { return this.request(`/reschedule-queue/${id}/process`, { method: 'POST', body: JSON.stringify(data) }); }

  // Real-time dashboard
  async getRealTimeDashboard() { return this.request('/dashboard/real-time'); }

  
  // Authentication
  async login(credentials) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); }
  async register(userData) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }); }

  // Faculty
  async getFaculty() { return this.request('/faculty'); }
  async addFaculty(data) { return this.request('/faculty', { method: 'POST', body: JSON.stringify(data) }); }
  async updateFaculty(id, data) { return this.request(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteFaculty(id) { return this.request(`/faculty/${id}`, { method: 'DELETE' }); }
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

  // Faculty Subject Assignment methods
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
  async getStudents() { return this.request('/students'); }
  async getStudentsByBatch(batch) { return this.request(`/students/batch/${batch}`); }
  async addStudent(data) { return this.request('/students', { method: 'POST', body: JSON.stringify(data) }); }

  // Rooms
  async getRooms() { return this.request('/rooms'); }
  async addRoom(data) { return this.request('/rooms', { method: 'POST', body: JSON.stringify(data) }); }
  async getRoomAvailability(date, timeSlot) { return this.request(`/rooms/availability?date=${date}&time_slot=${timeSlot}`); }

  // Subjects
  async getSubjects() { return this.request('/subjects'); }
  async addSubject(data) { return this.request('/subjects', { method: 'POST', body: JSON.stringify(data) }); }

  // Timetable
  async getTimetable(batch) { return this.request(`/timetable/batch/${batch}`); }
  async getFacultyTimetable(facultyId) { return this.request(`/timetable/faculty/${facultyId}`); }
  async generateTimetable(params) { return this.request('/timetable/generate', { method: 'POST', body: JSON.stringify(params) }); }
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
  async getSwapRequests() { return this.request('/swap-requests'); }
  // async createSwapRequest(data) { return this.request('/swap-requests', { method: 'POST', body: JSON.stringify(data) }); }
  async updateSwapRequest(id, data) { return this.request(`/swap-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  // Advanced Swap Request methods
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
  async getRoomUtilization() { return this.request('/analytics/room-heatmap'); }
  async getFacultyWorkload() { return this.request('/analytics/faculty-trends'); }
  async getStudentLoad() { return this.request('/analytics/student-load'); }
  async getRealTimeAnalytics(batch = null) { return this.request(`/analytics/real-time${batch ? `?batch=${batch}` : ''}`); }

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

// ==================== COMPONENTS ====================

//changes start fromm here
// Optimization endpoints
// const LeaveManagement = () => {
//   const { user } = useAuth();
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [impactAnalysis, setImpactAnalysis] = useState(null);
//   const [formData, setFormData] = useState({
//     leave_type: 'Casual',
//     start_date: '',
//     end_date: '',
//     reason: ''
//   });

//   const api = new APIService();

//   useEffect(() => {
//     loadLeaveRequests();
//   }, []);

//   const loadLeaveRequests = async () => {
//     try {
//       const data = await api.getLeaveRequests();
//       setLeaveRequests(data);
//     } catch (error) {
//       console.error('Failed to load leave requests:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLeave = async () => {
//     try {
//       const result = await api.createLeaveRequest(formData);
//       setImpactAnalysis(result.impactAnalysis);
//       loadLeaveRequests();
//       setFormData({ leave_type: 'Casual', start_date: '', end_date: '', reason: '' });

//       if (result.impactAnalysis.affectedClassesCount > 0) {
//         alert(`Leave request created. ${result.impactAnalysis.affectedClassesCount} classes will be affected.`);
//       }
//     } catch (error) {
//       alert('Failed to create leave request: ' + error.message);
//     }
//   };

//   const handleApproveReject = async (id, status, notes = '') => {
//     try {
//       await api.updateLeaveRequest(id, { status, admin_notes: notes });
//       loadLeaveRequests();
//       alert(`Leave request ${status} successfully`);
//     } catch (error) {
//       alert(`Failed to ${status} leave request: ` + error.message);
//     }
//   };

//   if (loading) return <LoadingSpinner size="lg" />;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Enhanced Leave Management</h1>
//         {user?.role === 'faculty' && (
//           <Button onClick={() => setShowCreateModal(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Apply for Leave
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {leaveRequests.map((request) => (
//           <Card key={request.id} className="p-6">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-3 mb-2">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     {request.faculty_name}
//                   </h3>
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
//                       request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                     {request.status}
//                   </span>
//                   {request.auto_rescheduled && (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       Auto-rescheduled
//                     </span>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                   <div>
//                     <span className="font-medium">Type:</span> {request.leave_type}
//                   </div>
//                   <div>
//                     <span className="font-medium">Duration:</span> {request.start_date} to {request.end_date}
//                   </div>
//                   <div>
//                     <span className="font-medium">Affected Classes:</span> {request.affected_classes_count || 0}
//                   </div>
//                 </div>

//                 <p className="text-gray-600 mt-2">{request.reason}</p>

//                 {request.reschedule_details && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <h4 className="font-medium text-blue-900">Auto-rescheduling Results:</h4>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
//                       <div>Substitutes: <span className="font-medium">{request.reschedule_details.substitutes_assigned}</span></div>
//                       <div>Rescheduled: <span className="font-medium">{request.reschedule_details.rescheduled}</span></div>
//                       <div>Cancelled: <span className="font-medium">{request.reschedule_details.cancelled}</span></div>
//                       <div>Total: <span className="font-medium">{request.reschedule_details.total_affected}</span></div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {user?.role === 'admin' && request.status === 'pending' && (
//                 <div className="flex space-x-2">
//                   <Button
//                     size="sm"
//                     variant="success"
//                     onClick={() => handleApproveReject(request.id, 'approved')}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="danger"
//                     onClick={() => handleApproveReject(request.id, 'rejected')}
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Create Leave Modal */}
//       <Modal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         title="Apply for Leave"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
//             <select
//               value={formData.leave_type}
//               onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="Casual">Casual Leave</option>
//               <option value="Sick">Sick Leave</option>
//               <option value="Earned">Earned Leave</option>
//               <option value="Emergency">Emergency Leave</option>
//               <option value="Conference">Conference/Seminar</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 value={formData.start_date}
//                 onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//               <input
//                 type="date"
//                 value={formData.end_date}
//                 onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
//             <textarea
//               value={formData.reason}
//               onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               placeholder="Please provide reason for leave..."
//             />
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3 mt-6">
//           <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleCreateLeave}>
//             Apply for Leave
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// 3. Enhanced Dashboard with Real-time Features
// Enhanced Dashboard with Real-time Features - FIXED VERSION
const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [realTimeData, setRealTimeData] = useState(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('CS2023');
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [activeOptimization, setActiveOptimization] = useState(null);

  const api = new APIService();

  useEffect(() => {
    loadRealTimeData();
    if (user?.role === 'admin') {
      loadOptimizationSuggestions();
    }

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      if (!activeOptimization) {
        loadRealTimeData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedBatch]);

  const loadRealTimeData = async () => {
    try {
      const data = await api.getRealTimeDashboard();
      console.log('Real-time data loaded:', data);
      setRealTimeData(data);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
      // Set default empty data
      setRealTimeData({
        metrics: [
          { metric_type: 'leave_requests', pending_count: 0, active_count: 0, total_count: 0 },
          { metric_type: 'reschedule_queue', pending_count: 0, active_count: 0, total_count: 0 },
          { metric_type: 'conflicts', pending_count: 0, active_count: 0, total_count: 0 }
        ],
        conflicts: [],
        recentChanges: []
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOptimizationSuggestions = async () => {
    if (user?.role !== 'admin') return;

    try {
      console.log('Loading optimization suggestions for batch:', selectedBatch);
      const suggestions = await api.getOptimizationSuggestions(selectedBatch);
      console.log('Optimization suggestions loaded:', suggestions);
      setOptimizationSuggestions(suggestions || []);
    } catch (error) {
      console.error('Failed to load optimization suggestions:', error);
      setOptimizationSuggestions([]);
    }
  };

  const handleOptimization = async (optimizationType) => {
    if (!window.confirm(`Are you sure you want to run ${optimizationType} optimization? This will modify the timetable.`)) {
      return;
    }

    setActiveOptimization(optimizationType);

    try {
      console.log('Starting optimization:', optimizationType);

      const result = await api.applyOptimization({
        batch: selectedBatch,
        academic_year: '2024-25',
        optimization_type: optimizationType
      });

      console.log('Optimization result:', result);

      alert(`✅ Optimization completed!\n\n` +
        `Score: ${result.stats.optimization_score}%\n` +
        `Improvements: ${result.stats.improvements_made}\n` +
        `Gaps Reduced: ${result.stats.gaps_reduced}\n` +
        `Utilization Improved: ${result.stats.utilization_improved}%`);

      // Reload data
      await loadRealTimeData();
      await loadOptimizationSuggestions();
      setShowOptimizationModal(false);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('❌ Optimization failed: ' + error.message);
    } finally {
      setActiveOptimization(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Smart Dashboard</h1>
          <p className="text-gray-600">Real-time insights and dynamic optimization</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">Live</span>
          </div>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="CS2023">CS 2023</option>
            <option value="MATH2023">Math 2023</option>
            <option value="PHY2023">Physics 2023</option>
          </select>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {realTimeData?.metrics && realTimeData.metrics.length > 0 ? (
          realTimeData.metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {metric.metric_type.replace(/_/g, ' ')}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.pending_count || 0}
                    </span>
                    {metric.active_count > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {metric.active_count} active
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.pending_count > 0 ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                  {metric.metric_type === 'leave_requests' && <Calendar className="w-6 h-6 text-orange-600" />}
                  {metric.metric_type === 'reschedule_queue' && <RefreshCw className="w-6 h-6 text-blue-600" />}
                  {metric.metric_type === 'conflicts' && <AlertCircle className="w-6 h-6 text-red-600" />}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leave Requests</p>
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reschedule Queue</p>
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conflicts</p>
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Optimization Panel */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Smart Optimization</h2>
              <button
                onClick={() => setShowOptimizationModal(true)}
                disabled={activeOptimization}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeOptimization
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                {activeOptimization ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Run Optimization
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {optimizationSuggestions && optimizationSuggestions.length > 0 ? (
                optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900">
                          {suggestion.details?.description || 'Optimization available'}
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Priority: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${suggestion.details?.priority === 'high' ? 'bg-red-100 text-red-800' :
                              suggestion.details?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                            {suggestion.details?.priority || 'low'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="font-medium">No optimization suggestions</p>
                  <p className="text-sm mt-1">Your timetable is well optimized!</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Changes</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realTimeData?.recentChanges && realTimeData.recentChanges.length > 0 ? (
                realTimeData.recentChanges.map((change, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${change.change_type === 'rescheduled' ? 'bg-orange-500' :
                        change.change_type === 'modified' ? 'bg-blue-500' :
                          change.change_type === 'cancelled' ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {change.subject_name || 'System Update'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {change.change_type} - {change.day_of_week} {change.time_slot}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(change.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${change.change_type === 'rescheduled' ? 'bg-orange-100 text-orange-800' :
                        change.change_type === 'modified' ? 'bg-blue-100 text-blue-800' :
                          change.change_type === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                      }`}>
                      {change.change_type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No recent changes</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Conflicts Alert */}
      {realTimeData?.conflicts && realTimeData.conflicts.length > 0 && (
        <Card className="p-6 border-l-4 border-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Active Conflicts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realTimeData.conflicts.map((conflict, index) => (
              <div key={index} className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-900 capitalize">
                    {conflict.conflict_type.replace(/_/g, ' ')}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {conflict.count}
                  </span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Severity: {conflict.severity}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optimization Modal */}
      {showOptimizationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowOptimizationModal(false)}
            ></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Choose Optimization Type</h3>
                <button
                  onClick={() => setShowOptimizationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleOptimization('minimize_gaps')}
                  disabled={activeOptimization}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Minimize Gaps</h4>
                      <p className="text-sm text-gray-600">Reduce empty periods between classes</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleOptimization('maximize_utilization')}
                  disabled={activeOptimization}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Maximize Utilization</h4>
                      <p className="text-sm text-gray-600">Optimize room and faculty usage</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleOptimization('balanced')}
                  disabled={activeOptimization}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Balanced Optimization</h4>
                      <p className="text-sm text-gray-600">Balance all factors for optimal schedule</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowOptimizationModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// Utility Components
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${error ? 'border-red-500' : ''
        } ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Authentication Hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return { user, login, logout, loading };
};

// Login Component
const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const api = new APIService();
      const response = await api.login(formData);
      login(response.user, response.token);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Scheduler</h1>
          <p className="text-gray-600 mt-2">Classroom Management System</p>
        </div>

        <div onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </Card>
    </div>
  );
};


const FacultyLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const api = new APIService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login with email instead of username for faculty
      const response = await api.login({
        username: formData.email.split('@')[0], // Use email prefix as username
        password: formData.password,
        role: 'faculty'
      });

      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Login</h1>
          <p className="text-gray-600 mt-2">Access Smart Scheduler</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="faculty@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>First time login?</strong> Use your registered email and default password: <code className="bg-blue-100 px-1 rounded">faculty123</code>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              You will be prompted to change your password after first login.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In as Faculty'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble logging in?{' '}
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
              Contact Admin
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};


const FacultyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const api = new APIService();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.request('/faculty/profile');
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      await api.request('/faculty/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      {/* Profile Information */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.designation || 'Faculty'}</p>
            <p className="text-gray-600">{profile.department} Department</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Hours/Week</p>
                <p className="font-medium text-gray-900">{profile.max_hours_per_week} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Workload</p>
                <p className="font-medium text-gray-900">
                  {profile.weekly_hours ? profile.weekly_hours : '0'} hours
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="font-medium text-gray-900">{profile.total_classes || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Subjects Teaching */}
      {profile.subjects && profile.subjects.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects Teaching</h3>
          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((subject, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {subject}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Change Password Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          <Button
            variant="secondary"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>

        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">Password changed successfully!</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button type="submit">Save New Password</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!showChangePassword && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Last password change: <span className="font-medium">Never changed</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For security, we recommend changing your password regularly
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

const FacultyLoginManagement = () => {
  const [loginStatus, setLoginStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBulkRegister, setShowBulkRegister] = useState(false);
  const [bulkRegistering, setBulkRegistering] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);
  const [resettingPassword, setResettingPassword] = useState(null);

  const api = new APIService();

  useEffect(() => {
    loadLoginStatus();
  }, []);

  const loadLoginStatus = async () => {
    try {
      const data = await api.request('/faculty/login-status');
      setLoginStatus(data);
    } catch (error) {
      console.error('Failed to load login status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkRegister = async () => {
    setBulkRegistering(true);
    try {
      const results = await api.request('/faculty/bulk-register', {
        method: 'POST'
      });
      setBulkResults(results);
      await loadLoginStatus();
    } catch (error) {
      alert('Bulk registration failed: ' + error.message);
    } finally {
      setBulkRegistering(false);
    }
  };

  const handleResetPassword = async (facultyId, facultyName) => {
    if (!window.confirm(`Reset password for ${facultyName}?\nNew password will be: faculty123`)) {
      return;
    }

    setResettingPassword(facultyId);
    try {
      const result = await api.request(`/faculty/${facultyId}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: 'faculty123' })
      });

      alert(`Password reset successfully for ${result.facultyName}\nNew password: ${result.newPassword}`);
      await loadLoginStatus();
    } catch (error) {
      alert('Failed to reset password: ' + error.message);
    } finally {
      setResettingPassword(null);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm('This will create user accounts for ALL faculty members who don\'t have one.\n\nDefault password: faculty123\n\nContinue?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.request('/admin/migrate-faculty-accounts', {
        method: 'POST'
      });

      alert(`Migration completed!\n\nCreated: ${result.summary.accounts_created}\nExisting: ${result.summary.already_existed}\nFailed: ${result.summary.failed}`);
      await loadLoginStatus();
    } catch (error) {
      alert('Migration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Login Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty user accounts and credentials</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleMigration} variant="secondary">
            <User className="w-4 h-4 mr-2" />
            Run Migration
          </Button>
          <Button onClick={() => setShowBulkRegister(true)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Bulk Register
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {loginStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600">Total Faculty</p>
            <p className="text-2xl font-bold text-gray-900">{loginStatus.summary.total_faculty}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600">With Login</p>
            <p className="text-2xl font-bold text-green-600">{loginStatus.summary.with_login}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600">Without Login</p>
            <p className="text-2xl font-bold text-red-600">{loginStatus.summary.without_login}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600">Never Logged In</p>
            <p className="text-2xl font-bold text-orange-600">{loginStatus.summary.never_logged_in}</p>
          </Card>
        </div>
      )}

      {/* Faculty List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Accounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Login Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loginStatus && loginStatus.faculty.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{faculty.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{faculty.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{faculty.department}</td>
                  <td className="px-4 py-3 text-center">
                    {faculty.has_login ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        No Account
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">
                    {faculty.last_login 
                      ? new Date(faculty.last_login).toLocaleDateString()
                      : faculty.has_login ? 'Never' : '-'
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    {faculty.has_login && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleResetPassword(faculty.id, faculty.name)}
                        disabled={resettingPassword === faculty.id}
                      >
                        {resettingPassword === faculty.id ? 'Resetting...' : 'Reset Password'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bulk Register Modal */}
      <Modal
        isOpen={showBulkRegister}
        onClose={() => {
          setShowBulkRegister(false);
          setBulkResults(null);
        }}
        title="Bulk Register Faculty"
      >
        {!bulkResults ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This will create user accounts for all faculty members who don't have one yet.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Important</p>
                  <p className="text-xs text-yellow-800 mt-1">
                    All accounts will be created with default password: <code className="bg-yellow-100 px-1 rounded">faculty123</code>
                  </p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Faculty should change their password on first login.
                  </p>
                </div>
              </div>
            </div>
            {loginStatus && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Faculty without accounts:</strong> {loginStatus.summary.without_login}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowBulkRegister(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleBulkRegister} disabled={bulkRegistering}>
                {bulkRegistering ? 'Registering...' : 'Register All'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bulk Registration Complete</h3>
                <p className="text-sm text-gray-600">User accounts have been created</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{bulkResults.results.created}</p>
                <p className="text-xs text-green-700">Created</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{bulkResults.results.total}</p>
                <p className="text-xs text-gray-700">Total</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{bulkResults.results.failed}</p>
                <p className="text-xs text-red-700">Failed</p>
              </div>
            </div>

            {bulkResults.results.errors && bulkResults.results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-red-900 mb-2">Errors:</p>
                <div className="space-y-1">
                  {bulkResults.results.errors.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-700">
                      • {error.faculty} ({error.email}): {error.error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Default Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{bulkResults.defaultPassword}</code>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {bulkResults.note}
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => {
                setShowBulkRegister(false);
                setBulkResults(null);
                loadLoginStatus();
              }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Smart Dashboard', icon: Home },
    { id: 'leave', label: 'Leave Management', icon: Calendar }, // New
    { id: 'multi-section', label: 'Multi-Section', icon: Users }, // NEW
    { id: 'multi-section-import', label: 'Import Data', icon: Upload },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'faculty-management', label: 'Faculty Accounts', icon: Users },
    { id: 'optimization', label: 'Optimization', icon: TrendingUp }, // New
    { id: 'faculty-subjects', label: 'Faculty Subjects', icon: BookOpen }, // NEW
    { id: 'swap-request', label: 'Swap Request', icon: Calendar }, // NEW
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'rooms', label: 'Rooms', icon: Building },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'requests', label: 'Requests', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'faculty-profile', label: 'My Profile', icon: User },
     { id: 'my-timetable', label: 'My Timetable', icon: Calendar },
  ];

  // const menuItemsWithMulti = [
  //   ...menuItems.slice(0, 2), // dashboard, timetable
  //   { id: 'multi-section', label: 'Multi-Section', icon: Users }, // NEW
  //   { id: 'multi-section-import', label: 'Import Data', icon: Upload },
  //   ...menuItems.slice(2) // rest of items
  // ];

  const getVisibleItems = () => {
    switch (user?.role) {
      case 'student':
        return menuItems.filter(item => ['dashboard', 'timetable'].includes(item.id));
      case 'faculty':
        return menuItems.filter(item => ['dashboard', 'timetable', 'multi-section', 'requests', 'settings','faculty-profile','my-timetable','swap-request','leave'].includes(item.id));
      case 'admin':
        const updated_menu =  menuItems.slice(0,16);
        return updated_menu; // CHANGED from menuItems to menuItemsWithMulti
      default:
        return [];
    }
  };

  // const getVisibleItems = () => {
  //   switch (user?.role) {
  //     case 'student':
  //       return menuItems.filter(item => ['dashboard', 'timetable'].includes(item.id));
  //     case 'faculty':
  //       return menuItems.filter(item => ['dashboard', 'timetable', 'requests', 'settings'].includes(item.id));
  //     case 'admin':
  //       return menuItems;
  //     default:
  //       return [];
  //   }
  // };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} min-h-screen flex flex-col`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center'}`}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            {isExpanded && <span className="font-semibold text-gray-900">Smart Scheduler</span>}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {getVisibleItems().map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  } ${!isExpanded && 'justify-center'}`}
              >
                <Icon className="w-5 h-5" />
                {isExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className={`flex items-center space-x-3 mb-4 ${!isExpanded && 'justify-center'}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          {isExpanded && (
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={`w-full ${!isExpanded && 'px-2'}`}
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    totalRooms: 0,
    totalSubjects: 0,
    activeTimetables: 0,
    pendingSwapRequests: 0,
    pendingLeaveRequests: 0,
    roomUtilization: 0
  });
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('CS2023');

  const api = new APIService();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd have a dashboard analytics endpoint
      setStats({
        totalFaculty: 25,
        totalStudents: 450,
        totalRooms: 20,
        totalSubjects: 35,
        activeTimetables: 12,
        pendingSwapRequests: 5,
        pendingLeaveRequests: 3,
        roomUtilization: 75.5
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimetable = async (algorithm = 'balanced') => {
    setGenerateLoading(true);
    try {
      const generateData = {
        department: 'Computer Science',
        semester: 3,
        batch: selectedBatch,
        algorithm: algorithm // Add algorithm selection
      };

      const response = await api.generateTimetable(generateData);
      alert(`Timetable generated successfully using ${algorithm} algorithm! ${response.classesGenerated || 0} classes created.`);
      setShowGenerateModal(false);
    } catch (error) {
      console.error('Failed to generate timetable:', error);
      alert('Failed to generate timetable. Error: ' + (error.message || 'Please check your backend server.'));
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleImportData = async (file, type) => {
    try {
      const response = await api.uploadFile(type, file);
      alert(`${type} data imported successfully! ${response.recordsInserted || 0} records processed.`);
      setShowImportModal(false);
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data. Please check your file format and backend server.');
    }
  };

  const handleExportReports = () => {
    // Create sample CSV data
    const csvData = [
      ['Room Name', 'Type', 'Capacity', 'Utilization %'],
      ['Room 101', 'Classroom', '50', '85'],
      ['Lab 201', 'Lab', '30', '92'],
      ['Room 301', 'Classroom', '60', '65']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `room_utilization_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
    alert('Report exported successfully!');
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'Faculty', value: stats.totalFaculty, icon: Users, color: 'blue' },
    { label: 'Students', value: stats.totalStudents, icon: GraduationCap, color: 'green' },
    { label: 'Rooms', value: stats.totalRooms, icon: Building, color: 'purple' },
    { label: 'Subjects', value: stats.totalSubjects, icon: BookOpen, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          };

          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => setShowGenerateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Timetable
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={handleExportReports}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Analytics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Room Utilization</span>
                <span className="text-sm font-medium text-gray-900">{stats.roomUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${stats.roomUtilization}%` }}
                >
                  <span className="text-xs text-white font-medium">{stats.roomUtilization}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Faculty Workload</span>
                <span className="text-sm font-medium text-gray-900">82%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full flex items-center justify-end pr-2"
                  style={{ width: '82%' }}
                >
                  <span className="text-xs text-white font-medium">82%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Requests</span>
                <span className="text-sm font-medium text-gray-900">{stats.pendingSwapRequests + stats.pendingLeaveRequests}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{stats.activeTimetables}</div>
                  <div className="text-xs text-blue-500">Active Schedules</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">98%</div>
                  <div className="text-xs text-green-500">System Uptime</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Generate Timetable Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Timetable"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CS2023">CS 2023</option>
              <option value="MATH2023">Math 2023</option>
              <option value="PHY2023">Physics 2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Generation Algorithm</label>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 cursor-pointer"
                onClick={() => handleGenerateTimetable('efficiency')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Efficiency Optimized</h3>
                    <p className="text-sm text-gray-500">Minimizes gaps between classes and maximizes consecutive scheduling</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 cursor-pointer"
                onClick={() => handleGenerateTimetable('utilization')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Room Utilization</h3>
                    <p className="text-sm text-gray-500">Maximizes room usage and minimizes conflicts</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Building className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 cursor-pointer"
                onClick={() => handleGenerateTimetable('workload')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Balanced Workload</h3>
                    <p className="text-sm text-gray-500">Evenly distributes faculty teaching hours across the week</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 cursor-pointer"
                onClick={() => handleGenerateTimetable('elective')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Open Elective Friendly</h3>
                    <p className="text-sm text-gray-500">Reserves time slots for cross-department electives</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Data Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload CSV or Excel files to import faculty, students, rooms, or subjects data.
          </p>
          <div className="space-y-3">
            {['faculty', 'students', 'rooms', 'subjects'].map((type) => (
              <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImportData(file, type);
                    }}
                    className="hidden"
                  />
                  <Button size="sm" variant="secondary">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload
                  </Button>
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button variant="secondary" onClick={() => setShowImportModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Faculty Management Component
const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', subjects: []
  });

  const api = new APIService();

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const data = await api.getFaculty();
      setFaculty(data);
    } catch (error) {
      console.error('Failed to load faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingFaculty) {
        await api.updateFaculty(editingFaculty.id, formData);
      } else {
        await api.addFaculty(formData);
      }
      loadFaculty();
      setShowAddModal(false);
      setEditingFaculty(null);
      setFormData({ name: '', email: '', department: '', subjects: [] });
    } catch (error) {
      console.error('Failed to save faculty:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await api.deleteFaculty(id);
        loadFaculty();
      } catch (error) {
        console.error('Failed to delete faculty:', error);
      }
    }
  };

  const filteredFaculty = faculty.filter(f =>
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Faculty</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Subjects</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {member.subjects?.filter(s => s).join(', ') || 'No subjects assigned'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingFaculty(member);
                          setFormData({
                            name: member.name,
                            email: member.email,
                            department: member.department,
                            subjects: member.subjects || []
                          });
                          setShowAddModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingFaculty(null);
          setFormData({ name: '', email: '', department: '', subjects: [] });
        }}
        title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {editingFaculty ? 'Update' : 'Add'} Faculty
            </Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Students Management Component
const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', batch: '', semester: 1, department: ''
  });

  const api = new APIService();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.addStudent(formData);
      loadStudents();
      setShowAddModal(false);
      setFormData({ name: '', email: '', batch: '', semester: 1, department: '' });
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = filterBatch === 'all' || s.batch === filterBatch;
    return matchesSearch && matchesBatch;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Batches</option>
              <option value="CS2023">CS 2023</option>
              <option value="MATH2023">Math 2023</option>
              <option value="PHY2023">Physics 2023</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Batch</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Semester</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.batch}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.semester}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Student"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Batch"
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Add Student
            </Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Rooms Management Component
const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: 'Classroom', capacity: '', department: '', location: ''
  });

  const api = new APIService();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.addRoom(formData);
      loadRooms();
      setShowAddModal(false);
      setFormData({ name: '', type: 'Classroom', capacity: '', department: '', location: '' });
    } catch (error) {
      console.error('Failed to add room:', error);
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || r.type === filterType;
    return matchesSearch && matchesType;
  });

  const getRoomIcon = (type) => {
    switch (type) {
      case 'Lab': return Computer;
      case 'Auditorium': return Presentation;
      case 'Seminar Hall': return Users;
      default: return Building;
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Classroom">Classroom</option>
              <option value="Lab">Laboratory</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Seminar Hall">Seminar Hall</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredRooms.map((room) => {
            const Icon = getRoomIcon(room.type);
            return (
              <Card key={room.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className="text-sm font-medium text-gray-900">{room.capacity} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="text-sm font-medium text-gray-900">{room.department}</span>
                  </div>
                  {room.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium text-gray-900">{room.location}</span>
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Room"
      >
        <div className="space-y-4">
          <Input
            label="Room Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Classroom">Classroom</option>
              <option value="Lab">Laboratory</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Seminar Hall">Seminar Hall</option>
            </select>
          </div>
          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          />
          <Input
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Add Room
            </Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Subjects Management Component
const SubjectsManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', code: '', department: '', credits: 1, type: 'Theory'
  });

  const api = new APIService();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await api.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.addSubject(formData);
      loadSubjects();
      setShowAddModal(false);
      setFormData({ name: '', code: '', department: '', credits: 1, type: 'Theory' });
    } catch (error) {
      console.error('Failed to add subject:', error);
    }
  };

  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || s.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Subjects Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{subject.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{subject.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{subject.credits}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subject.type === 'Theory' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Subject"
      >
        <div className="space-y-4">
          <Input
            label="Subject Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Subject Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
          <Input
            label="Credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Enhanced Timetable Component
const Timetable = () => {
  const { user } = useAuth();
  const api = new APIService();
  const [timetable, setTimetable] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('CS2023');
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (user?.role === 'faculty') {
      loadFacultyTimetable();
    } else {
      loadTimetable(selectedBatch);
    }
  }, [selectedBatch, user]);

  const loadTimetable = async (batch) => {
    setLoading(true);
    try {
      const data = await api.getTimetable(batch);
      setTimetable(data);
    } catch (error) {
      console.error('Failed to load timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFacultyTimetable = async () => {
    setLoading(true);
    try {
      const data = await api.getFacultyTimetable(user.id);
      setTimetable(data);
    } catch (error) {
      console.error('Failed to load faculty timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimetable = async () => {
    setGenerateLoading(true);
    try {
      const generateData = {
        department: 'Computer Science',
        semester: 3,  // Make sure semester is included
        batch: selectedBatch
      };

      console.log('Generating timetable with data:', generateData);

      // Call the generate API
      const response = await api.generateTimetable(generateData);
      console.log('Generate response:', response);

      // Show success message
      alert(`Timetable generated successfully! ${response.classesGenerated || 0} classes created.`);

      // Reload the timetable
      await loadTimetable(selectedBatch);
      setShowGenerateModal(false);
    } catch (error) {
      console.error('Failed to generate timetable:', error);
      alert('Failed to generate timetable. Error: ' + (error.message || 'Please check your backend server and database connection.'));
    } finally {
      setGenerateLoading(false);
    }
  };

  const getClassForSlot = (day, timeSlot) => {
    return timetable.find(
      (item) => item.day_of_week === day && item.time_slot === timeSlot
    );
  };
  //  ot = (day, timeSlot) => {
  //   return timetable.find(
  //     (item) => item.day_of_week === day && item.time_slot === timeSlot
  //   );
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'faculty' ? 'My Timetable' : 'Timetable'}
        </h1>
        <div className="flex items-center space-x-4">
          {user?.role !== 'faculty' && (
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CS2023">CS 2023</option>
              <option value="MATH2023">Math 2023</option>
              <option value="PHY2023">Physics 2023</option>
            </select>
          )}
          {user?.role === 'admin' && (
            <Button onClick={() => setShowGenerateModal(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Timetable
            </Button>
          )}
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase w-32">Time</th>
                  {days.map((day) => (
                    <th key={day} className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{timeSlot}</td>
                    {days.map((day) => {
                      const classData = getClassForSlot(day, timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="px-6 py-4">
                          {classData ? (
                            <div className="bg-indigo-100 p-3 rounded-lg border-l-4 border-indigo-600">
                              <p className="text-sm font-medium text-indigo-900">{classData.subject_name}</p>
                              <p className="text-xs text-indigo-700">{classData.subject_code}</p>
                              <p className="text-xs text-indigo-600 mt-1">{classData.faculty_name}</p>
                              <p className="text-xs text-indigo-600">{classData.room_name}</p>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm text-center py-3">Free</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Timetable"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will generate a new timetable for {selectedBatch}. All existing schedules will be replaced.
          </p>
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleGenerateTimetable} disabled={generateLoading}>
              {generateLoading ? 'Generating...' : 'Generate'}
            </Button>
            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};



const MultiSectionTimetable = () => {
  const api = new APIService();
  const { user } = useAuth();

  
  const [selectedBatch, setSelectedBatch] = useState('CS2023');
  const [selectedSection, setSelectedSection] = useState('A');
  const [sections, setSections] = useState(['A', 'B', 'C']);
  const [availableSections, setAvailableSections] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S']);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // NEW
  const [deleteTarget, setDeleteTarget] = useState({ all: false, sections: [] }); // NEW
  const [generateLoading, setGenerateLoading] = useState(false);
  const [validationReport, setValidationReport] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sectionsConfig, setSectionsConfig] = useState([]); // NEW
  const [showDayOffModal, setShowDayOffModal] = useState(false); // NEW

  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadSectionTimetable();
  }, [selectedBatch, selectedSection]);

  const loadSectionTimetable = async () => {
    setLoading(true);
    try {
      const data = await api.getSectionTimetable(selectedBatch, selectedSection);
      setTimetable(data);
    } catch (error) {
      console.error('Failed to load section timetable:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateMultiSection = async () => {
    setGenerateLoading(true);
    try {
      const response = await api.generateMultiSectionTimetable({
        batch: selectedBatch,
        sections: sections,
        sections_config: sectionsConfig, // NEW: Include day off config
        department: 'Computer Science',
        semester: 3,
        academic_year: '2024-25',
        algorithm: 'csp'
      });

      alert(`Multi-Section Generated!\nTotal Classes: ${response.summary.total_classes_generated}\nConflicts: ${response.summary.total_conflicts}`);
      await loadSectionTimetable();
      setShowGenerateModal(false);
      setShowDayOffModal(false); // Close day off modal
    } catch (error) {
      alert('Failed to generate: ' + error.message);
    } finally {
      setGenerateLoading(false);
    }
  };

  // const handleGenerateMultiSection = async () => {
  //   setGenerateLoading(true);
  //   try {
  //     const response = await api.generateMultiSectionTimetable({
  //       batch: selectedBatch,
  //       sections: sections,
  //       department: 'Computer Science',
  //       semester: 3,
  //       academic_year: '2024-25',
  //       algorithm: 'csp'
  //     });

  //     alert(`Multi-Section Generated!\nTotal Classes: ${response.summary.total_classes_generated}\nConflicts: ${response.summary.total_conflicts}`);
  //     await loadSectionTimetable();
  //     setShowGenerateModal(false);
  //   } catch (error) {
  //     alert('Failed to generate: ' + error.message);
  //   } finally {
  //     setGenerateLoading(false);
  //   }
  // };

  const handleValidateMultiSection = async () => {
    setLoading(true);
    setShowValidationModal(true);
    try {
      const data = await api.validateMultiSection(selectedBatch);
      setValidationReport(data);
    } catch (error) {
      alert('Failed to validate: ' + error.message);
      setShowValidationModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = async () => {
    setLoading(true);
    setShowSummaryModal(true);
    try {
      const data = await api.getMultiSectionSummary(selectedBatch);
      setSummaryData(data);
    } catch (error) {
      alert('Failed to load summary: ' + error.message);
      setShowSummaryModal(false);
    } finally {
      setLoading(false);
    }
  };

  //NEW
  const handleConfigureDayOff = () => {
    // Initialize config for selected sections
    const initialConfig = sections.map(section => ({
      section,
      day_off: null
    }));
    setSectionsConfig(initialConfig);
    setShowDayOffModal(true);
  };

  

  const handleExportSection = async () => {
    try {
      const blob = await api.exportSectionCSV(selectedBatch, selectedSection);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedBatch}_Section_${selectedSection}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert('Exported successfully!');
    } catch (error) {
      alert('Failed to export: ' + error.message);
    }
  };

   // NEW: Handle delete click
  const handleDeleteClick = (deleteAll = false) => {
    if (deleteAll) {
      setDeleteTarget({ all: true, sections: [] });
    } else {
      setDeleteTarget({ all: false, sections: [selectedSection] });
    }
    setShowDeleteModal(true);
  };

  // NEW: Confirm delete
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const sectionsToDelete = deleteTarget.all ? null : deleteTarget.sections;
      
      const response = await api.deleteMultiSectionTimetable(
        selectedBatch,
        sectionsToDelete,
        '2024-25'
      );

      alert(
        `✅ Deleted successfully!\n\n` +
        `Total classes deleted: ${response.deleted_count}\n` +
        `Sections affected: ${response.sections_affected}\n\n` +
        Object.entries(response.details)
          .map(([sec, count]) => `Section ${sec}: ${count} classes`)
          .join('\n')
      );

      // Reload timetable
      await loadSectionTimetable();
      setShowDeleteModal(false);
    } catch (error) {
      alert('❌ Failed to delete: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getClassForSlot = (day, timeSlot) => {
    return timetable.find(
      (item) => item.day_of_week === day && item.time_slot === timeSlot
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Section Timetable</h1>
          <p className="text-gray-600 mt-1">Manage timetables for multiple sections</p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex items-center space-x-3">
            {/* NEW: Delete buttons */}
            <Button 
              onClick={() => handleDeleteClick(false)} 
              variant="danger"
              disabled={!timetable || timetable.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Section {selectedSection}
            </Button>
            <Button 
              onClick={() => handleDeleteClick(true)} 
              variant="danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Sections
            </Button>
            {/* Existing buttons */}
            <Button onClick={handleValidateMultiSection} variant="secondary">
              <CheckCircle className="w-4 h-4 mr-2" />
              Validate All
            </Button>
            <Button onClick={handleViewSummary} variant="secondary">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Summary
            </Button>
            <Button onClick={() => setShowGenerateModal(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Multi-Section
            </Button>
          </div>
        )}

        

      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CS2023">CS 2023</option>
              <option value="MATH2023">Math 2023</option>
              <option value="PHY2023">Physics 2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <div className="flex flex-wrap gap-2">
              {availableSections.slice(0, 10).map(section => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${selectedSection === section
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {section}
                </button>
              ))}
              {availableSections.length > 10 && (
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg"
                >
                  <option value="">More...</option>
                  {availableSections.slice(10).map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'
                  }`}
              >
                List
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <Button onClick={handleExportSection} variant="secondary" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card>
        {loading ? (
          <div className="p-8"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold">Time / Day</th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-4 text-center text-sm font-bold">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-sm text-gray-700 bg-gray-50">
                      {timeSlot}
                    </td>
                    {days.map((day) => {
                      const classData = getClassForSlot(day, timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="px-2 py-2">
                          {classData ? (
                            <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                              <p className="text-sm font-bold text-gray-900">{classData.subject_code}</p>
                              <p className="text-xs text-gray-800">{classData.subject_name}</p>
                              <p className="text-xs text-gray-600 mt-1">{classData.faculty_name}</p>
                              <p className="text-xs text-gray-600">{classData.room_name}</p>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400 text-xs">Free</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* <Card className="p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Faculty-Subject Assignments</h2>
  {summaryData?.faculty_assignments && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(summaryData.faculty_assignments).map(([subjectId, facultyId]) => {
        const subject = subjects.find(s => s.id === parseInt(subjectId));
        const faculty = facultyList.find(f => f.id === parseInt(facultyId));
        return (
          <div key={subjectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{subject?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{subject?.code}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">{faculty?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{faculty?.department}</p>
            </div>
          </div>
        );
      })}
    </div>
  )}
</Card> */}

      {/* {user?.role === 'admin' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Constraint Validation</h2>
            <Button onClick={handleValidateConstraints} size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Validate Constraints
            </Button>
          </div>
          
          {validationResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${validationResults.allSubjectsScheduled ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-2">
                    {validationResults.allSubjectsScheduled ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">All Subjects Scheduled</span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${validationResults.noBackToBackClasses ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-2">
                    {validationResults.noBackToBackClasses ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">No Back-to-Back Classes</span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${validationResults.subjectDayGaps ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-2">
                    {validationResults.subjectDayGaps ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">Subject Day Gaps</span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${validationResults.noRoomConflicts ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-2">
                    {validationResults.noRoomConflicts ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">No Room Conflicts</span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${validationResults.facultyWorkloadBalanced ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-2">
                    {validationResults.facultyWorkloadBalanced ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">Workload Balanced</span>
                  </div>
                </div>
              </div>
              
              {validationResults.violations && validationResults.violations.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-red-900 mb-2">Violations Found:</h3>
                  <div className="space-y-2">
                    {validationResults.violations.map((violation, idx) => (
                      <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                        <span className="font-medium text-red-800">{violation.type}:</span>
                        <span className="text-red-700 ml-2">
                          {JSON.stringify(violation).substring(0, 100)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )} */}

      {/* Generate Modal - UPDATE */}
      <Modal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} title="Generate Multi-Section">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate timetables for multiple sections
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CS2023">CS 2023</option>
              <option value="MATH2023">Math 2023</option>
              <option value="PHY2023">Physics 2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Sections</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <div className="grid grid-cols-5 gap-2">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(section => (
                  <label key={section} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections.includes(section)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSections([...sections, section].sort());
                        } else {
                          setSections(sections.filter(s => s !== section));
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm">{section}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {sections.join(', ') || 'None'}
            </p>
          </div>

          {/* NEW: Day Off Configuration Button */}
          {sections.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Configure Day Off (Optional)</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Assign different off-days for each section
                  </p>
                </div>
                <Button onClick={handleConfigureDayOff} size="sm" variant="secondary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Days Off
                </Button>
              </div>
              
              {/* Show current config */}
              {sectionsConfig.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs font-medium text-blue-800 mb-2">Current Configuration:</p>
                  <div className="flex flex-wrap gap-2">
                    {sectionsConfig.map(config => (
                      config.day_off && (
                        <span key={config.section} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          Section {config.section}: {config.day_off}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateMultiSection}
            disabled={generateLoading || sections.length === 0}
          >
            {generateLoading ? 'Generating...' : `Generate for ${sections.length} sections`}
          </Button>
        </div>
      </Modal>

      {/* NEW: Day Off Configuration Modal */}
      <Modal 
        isOpen={showDayOffModal} 
        onClose={() => setShowDayOffModal(false)} 
        title="Configure Day Off for Each Section"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select which day each section should have off. Leave empty for no day off.
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sectionsConfig.map((config, index) => (
              <div key={config.section} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-20">
                  <span className="text-sm font-medium text-gray-900">Section {config.section}</span>
                </div>
                <select
                  value={config.day_off || ''}
                  onChange={(e) => {
                    const newConfig = [...sectionsConfig];
                    newConfig[index] = {
                      ...config,
                      day_off: e.target.value || null
                    };
                    setSectionsConfig(newConfig);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No day off</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Tips:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Each section can have a different day off</li>
                  <li>• No classes will be scheduled on the selected day</li>
                  <li>• Classes will be distributed across remaining days</li>
                  <li>• Leave empty if section should have classes all days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowDayOffModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowDayOffModal(false)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Apply Configuration
          </Button>
        </div>
    </Modal>
  

      {/* Summary Modal */}
      <Modal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)} title="Multi-Section Summary">
        {summaryData && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summaryData.summary_stats?.total_sections || 0}
                </div>
                <div className="text-xs text-blue-700">Sections</div>
              </div>
              <div className="bg-green-50 p-4 rounded text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summaryData.summary_stats?.avg_classes_per_section?.toFixed(0) || 0}
                </div>
                <div className="text-xs text-green-700">Avg Classes</div>
              </div>
              <div className="bg-orange-50 p-4 rounded text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {summaryData.summary_stats?.total_conflicts || 0}
                </div>
                <div className="text-xs text-orange-700">Conflicts</div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>Close</Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        title="⚠️ Confirm Delete"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Warning: This action cannot be undone!</h3>
                <p className="text-sm text-red-700 mt-1">
                  {deleteTarget.all 
                    ? `You are about to delete ALL timetable data for batch ${selectedBatch}.`
                    : `You are about to delete timetable data for ${selectedBatch} - Section ${deleteTarget.sections.join(', ')}.`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">What will be deleted:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All class schedules</li>
              <li>• Faculty assignments</li>
              <li>• Room allocations</li>
              <li>• Time slot bookings</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Students, faculty, rooms, and subjects will NOT be deleted. 
              Only the timetable schedule will be removed.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> You can generate a new timetable after deletion.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Yes, Delete {deleteTarget.all ? 'All' : 'Section'}
              </>
            )}
          </Button>
        </div>
      </Modal>


    </div>
  );
};

const FacultyMyTimetable = () => {
  const api = new APIService();
  const { user } = useAuth();
  
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week'); // week, day, list
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [filters, setFilters] = useState({
    batch: 'all',
    section: 'all',
    subject: 'all'
  });
  const [stats, setStats] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', 
    '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  useEffect(() => {
    loadFacultyTimetable();
  }, [filters]);

  const loadFacultyTimetable = async () => {
    setLoading(true);
    try {
      // Get faculty profile to get faculty ID
      const profile = await api.getFacultyProfile();
      
      // Get timetable for this faculty
      const data = await api.getFacultyTimetable(profile.id);
      setTimetable(data);
      
      // Calculate statistics
      calculateStats(data);
    } catch (error) {
      console.error('Failed to load faculty timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const filteredData = applyFilters(data);
    
    const uniqueBatches = [...new Set(filteredData.map(c => c.batch))];
    const uniqueSections = [...new Set(filteredData.map(c => `${c.batch}-${c.section || 'A'}`))];
    const uniqueSubjects = [...new Set(filteredData.map(c => c.subject_name))];
    const totalClasses = filteredData.length;
    const totalHours = filteredData.reduce((sum, c) => sum + (c.duration_minutes / 60), 0);
    
    setStats({
      totalClasses,
      totalHours: totalHours,
      uniqueBatches: uniqueBatches.length,
      uniqueSections: uniqueSections.length,
      uniqueSubjects: uniqueSubjects.length,
      batches: uniqueBatches,
      sections: uniqueSections,
      subjects: uniqueSubjects
    });
  };

  const applyFilters = (data) => {
    return data.filter(item => {
      if (filters.batch !== 'all' && item.batch !== filters.batch) return false;
      if (filters.section !== 'all' && item.section !== filters.section) return false;
      if (filters.subject !== 'all' && item.subject_name !== filters.subject) return false;
      return true;
    });
  };

  const getClassForSlot = (day, timeSlot) => {
    const filteredData = applyFilters(timetable);
    return filteredData.filter(
      (item) => item.day_of_week === day && item.time_slot === timeSlot
    );
  };

  const handleExport = () => {
    const filteredData = applyFilters(timetable);
    
    let csv = 'My Timetable\n\n';
    csv += 'Day,Time,Subject,Batch,Section,Room,Type,Duration\n';
    
    filteredData.forEach(item => {
      csv += `"${item.day_of_week}","${item.time_slot}","${item.subject_name}","${item.batch}","${item.section || 'A'}","${item.room_name}","${item.session_type}","${item.duration_minutes} min"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_timetable_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600 mt-1">View your class schedule across all sections</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadFacultyTimetable} variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Batches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueBatches}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueSections}</p>
              </div>
              <Grid className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueSubjects}</p>
              </div>
              <BookOpen className="w-8 h-8 text-indigo-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters & View Controls */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Batch Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Batch
            </label>
            <select
              value={filters.batch}
              onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Batches</option>
              {stats?.batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sections</option>
              {stats?.sections.map(section => (
                <option key={section} value={section.split('-')[1]}>{section}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {stats?.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('week')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setFilters({ batch: 'all', section: 'all', subject: 'all' })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Week View */}
      {viewMode === 'week' && (
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold sticky left-0 bg-indigo-600">
                  Time
                </th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-center text-sm font-semibold min-w-[200px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timeSlots.map((timeSlot, idx) => (
                <tr key={timeSlot} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold text-sm text-gray-700 whitespace-nowrap sticky left-0 bg-gray-100">
                    {timeSlot}
                  </td>
                  {days.map((day) => {
                    const classes = getClassForSlot(day, timeSlot);
                    return (
                      <td key={`${day}-${timeSlot}`} className="px-2 py-2">
                        {classes.length > 0 ? (
                          <div className="space-y-2">
                            {classes.map((classData, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border-l-4 ${
                                  classData.session_type === 'Lab'
                                    ? 'bg-purple-50 border-purple-500'
                                    : classData.session_type === 'Tutorial'
                                    ? 'bg-green-50 border-green-500'
                                    : 'bg-blue-50 border-blue-500'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                      {classData.subject_code}
                                    </p>
                                    <p className="text-xs text-gray-700 mt-1">
                                      {classData.subject_name}
                                    </p>
                                  </div>
                                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                                    classData.session_type === 'Lab'
                                      ? 'bg-purple-200 text-purple-800'
                                      : classData.session_type === 'Tutorial'
                                      ? 'bg-green-200 text-green-800'
                                      : 'bg-blue-200 text-blue-800'
                                  }`}>
                                    {classData.session_type}
                                  </span>
                                </div>
                                
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center text-xs text-gray-600">
                                    <Users className="w-3 h-3 mr-1" />
                                    {classData.batch}-{classData.section || 'A'}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {classData.room_name}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {classData.duration_minutes} min
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400 text-xs">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {days.map(day => {
            const dayClasses = applyFilters(timetable).filter(c => c.day_of_week === day);
            
            if (dayClasses.length === 0) return null;
            
            return (
              <Card key={day} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                  {day}
                  <span className="ml-auto text-sm font-normal text-gray-600">
                    {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {dayClasses.sort((a, b) => a.time_slot.localeCompare(b.time_slot)).map((classData, idx) => (
                    <div
                      key={idx}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">
                        {classData.time_slot}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {classData.subject_code}
                          </p>
                          <p className="text-xs text-gray-600">{classData.subject_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-700">
                            <Users className="w-4 h-4 inline mr-1" />
                            {classData.batch}-{classData.section || 'A'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-700">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {classData.room_name}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            classData.session_type === 'Lab'
                              ? 'bg-purple-100 text-purple-800'
                              : classData.session_type === 'Tutorial'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {classData.session_type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {classData.duration_minutes}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {applyFilters(timetable).length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900">No Classes Found</h3>
          <p className="text-gray-600 mt-2">
            {timetable.length === 0
              ? 'No classes have been assigned to you yet.'
              : 'No classes match the selected filters.'}
          </p>
          {filters.batch !== 'all' || filters.section !== 'all' || filters.subject !== 'all' ? (
            <Button
              className="mt-4"
              onClick={() => setFilters({ batch: 'all', section: 'all', subject: 'all' })}
            >
              Clear Filters
            </Button>
          ) : null}
        </Card>
      )}
    </div>
  );
};




// Add to your React file after the existing imports

const MultiSectionDataImport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [importResults, setImportResults] = useState(null);

  const api = new APIService();

  const dataTypes = [
    { id: 'faculty', label: 'Faculty', icon: Users, color: 'blue' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, color: 'green' },
    { id: 'rooms', label: 'Rooms', icon: Building, color: 'purple' },
    { id: 'sections', label: 'Sections', icon: Users, color: 'orange' },
    { id: 'students', label: 'Students', icon: GraduationCap, color: 'indigo' }
  ];

  const handleFileUpload = async (type, file) => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting upload:', {
      type,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setLoading(true);
    setUploadProgress({ ...uploadProgress, [type]: 0 });

    try {
      console.log('Calling API uploadFile...');
      const response = await api.uploadFile(type, file);
      console.log('Upload response:', response);

      setUploadProgress({ ...uploadProgress, [type]: 100 });
      setImportResults(prev => ({
        ...prev,
        [type]: {
          success: true,
          recordsInserted: response.recordsInserted,
          recordsTotal: response.recordsTotal,
          recordsSkipped: response.recordsSkipped,
          errors: response.errors || []
        }
      }));

      alert(`✅ ${type} data imported successfully!\n${response.recordsInserted} records added.`);
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        error: error
      });
      setImportResults(prev => ({
        ...prev,
        [type]: {
          success: false,
          error: error.message
        }
      }));
      alert(`❌ Failed to import ${type}: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress({ ...uploadProgress, [type]: null });
    }
  };

  const downloadTemplate = (type) => {
    console.log('Downloading template for:', type);
    const templates = {
      faculty: 'name,email,department,designation,max_hours_per_week\nDr. John Doe,john@university.edu,Computer Science,Professor,25\nProf. Jane Smith,jane@university.edu,Mathematics,Associate Professor,25\n',

      subjects: 'name,code,department,semester,credits,type,lecture_hours,lab_hours\nData Structures,CS301,Computer Science,3,4,Theory,3,0\nDatabase Systems,CS401,Computer Science,4,4,Theory,3,0\nProgramming Lab,CS302L,Computer Science,3,2,Practical,0,4\n',

      rooms: 'name,type,capacity,department,building,floor\nRoom 101,Classroom,50,Computer Science,Block A,1\nLab 201,Lab,30,Computer Science,Block A,2\nRoom 301,Classroom,60,Mathematics,Block B,3\n',

      sections: 'batch,section,department,semester,academic_year,total_students\nCS2023,A,Computer Science,3,2024-25,60\nCS2023,B,Computer Science,3,2024-25,55\nCS2023,C,Computer Science,3,2024-25,58\nCS2023,D,Computer Science,3,2024-25,52\nCS2023,E,Computer Science,3,2024-25,57\n',

      students: 'name,email,roll_number,batch,section,semester,department\nJohn Smith,john@student.edu,CS2023A001,CS2023,A,3,Computer Science\nJane Doe,jane@student.edu,CS2023A002,CS2023,A,3,Computer Science\nBob Wilson,bob@student.edu,CS2023B001,CS2023,B,3,Computer Science\n'
    };

    const csvContent = templates[type] || '';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    console.log('Template downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Section Data Import</h1>
          <p className="text-gray-600 mt-1">Import data for multi-section timetable generation</p>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload CSV or Excel files to import data for faculty, subjects, rooms, sections, and students.
          Download templates below to ensure correct format.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataTypes.map((dataType) => {
            const Icon = dataType.icon;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200',
              green: 'bg-green-50 border-green-200',
              purple: 'bg-purple-50 border-purple-200',
              orange: 'bg-orange-50 border-orange-200',
              indigo: 'bg-indigo-50 border-indigo-200'
            };

            const iconColors = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              purple: 'text-purple-600',
              orange: 'text-orange-600',
              indigo: 'text-indigo-600'
            };

            return (
              <div key={dataType.id} className={`p-6 border-2 rounded-lg ${colorClasses[dataType.color]}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-white border-2 ${colorClasses[dataType.color]}`}>
                    <Icon className={`w-6 h-6 ${iconColors[dataType.color]}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dataType.label}</h3>
                    {importResults?.[dataType.id] && (
                      <span className={`text-xs ${importResults[dataType.id].success ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {importResults[dataType.id].success
                          ? `${importResults[dataType.id].recordsInserted} imported`
                          : 'Failed'}
                      </span>
                    )}
                  </div>
                </div>

                {uploadProgress[dataType.id] !== null && uploadProgress[dataType.id] !== undefined && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[dataType.id]}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress[dataType.id]}%</p>
                  </div>
                )}

                <div className="space-y-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id={`file-input-${dataType.id}`}
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      console.log('File selected:', e.target.files[0]);
                      const file = e.target.files[0];
                      if (file) {
                        console.log('Calling handleFileUpload for', dataType.id);
                        handleFileUpload(dataType.id, file);
                      }
                      // Reset input
                      e.target.value = '';
                    }}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Upload button clicked for', dataType.id);
                      const input = document.getElementById(`file-input-${dataType.id}`);
                      if (input) {
                        input.click();
                      } else {
                        console.error('File input not found');
                      }
                    }}
                    disabled={loading}
                    className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
                      }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {loading ? 'Uploading...' : 'Upload File'}
                  </button>

                  {/* Download template button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Download template clicked for', dataType.id);
                      downloadTemplate(dataType.id);
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-gray-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                </div>

                {importResults?.[dataType.id]?.errors && importResults[dataType.id].errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    <p className="font-semibold mb-1">Errors:</p>
                    {importResults[dataType.id].errors.slice(0, 3).map((err, idx) => (
                      <p key={idx}>• {err}</p>
                    ))}
                    {importResults[dataType.id].errors.length > 3 && (
                      <p>...and {importResults[dataType.id].errors.length - 3} more</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Import Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">📄 File Format</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Supported formats: CSV, XLSX, XLS</li>
              <li>• First row must be headers</li>
              <li>• Use exact column names from templates</li>
              <li>• UTF-8 encoding recommended</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">✅ Data Requirements</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Email addresses must be unique</li>
              <li>• Section must be A, B, C, D, or E</li>
              <li>• Semester must be between 1-8</li>
              <li>• Room capacity must be positive number</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    eligible: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
    approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
  };

  const { bg, text, icon: Icon } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};


//Swap Management
const AdvancedSwapRequestManagement = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [approving, setApproving] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem('token');
  const api = new APIService(token);

  // Form state
  const [formData, setFormData] = useState({
    requesting_faculty_id: null,
    target_faculty_id: '',
    original_timetable_id: '',
    requested_day: 'Monday',
    requested_time_slot: '09:00-10:00',
    reason: ''
  });

  const [selectedClass, setSelectedClass] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadSwapRequests();
  }, [filterStatus]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);

      await Promise.all([
        loadSwapRequests(),
        loadFaculty(),
        ...(userData.role === 'faculty' ? [loadMyClasses(userData.id)] : [])
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      alert('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSwapRequests = async () => {
    try {
      const statusFilter = filterStatus === 'all' ? null : filterStatus;
      const facultyId = user?.role === 'faculty' ? user.id : null;
      const data = await api.getDetailedSwapRequests(statusFilter, facultyId);
      setSwapRequests(data || []);
    } catch (error) {
      console.error('Failed to load swap requests:', error);
    }
  };

  const loadFaculty = async () => {
    try {
      const data = await api.getFaculty();
      setFaculty(data || []);
    } catch (error) {
      console.error('Failed to load faculty:', error);
    }
  };

  const loadMyClasses = async (userId) => {
    try {
      const profile = await api.getFacultyProfile();
      const classes = await api.getFacultyTimetable(profile.id);
      setMyClasses(classes || []);
      setFormData(prev => ({ ...prev, requesting_faculty_id: profile.id }));
    } catch (error) {
      console.error('Failed to load my classes:', error);
    }
  };

  const handleValidateRequest = async () => {
    if (!selectedClass || !formData.target_faculty_id || !formData.requested_day || !formData.requested_time_slot) {
      alert('Please fill in all required fields');
      return;
    }

    setValidating(true);
    try {
      const validation = await api.validateSwapRequest({
        requesting_faculty_id: formData.requesting_faculty_id,
        original_timetable_id: selectedClass.id,
        target_faculty_id: parseInt(formData.target_faculty_id),
        requested_day: formData.requested_day,
        requested_time_slot: formData.requested_time_slot,
        academic_year: '2024-25'
      });

      setValidationResult(validation);
      setShowValidationModal(true);
    } catch (error) {
      alert('Validation failed: ' + error.message);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!validationResult || validationResult.recommendation === 'REJECT') {
      alert('Cannot submit request with blocking conflicts');
      return;
    }

    if (!formData.reason.trim()) {
      alert('Please provide a reason for the swap request');
      return;
    }

    try {
      await api.createSwapRequest({
        requesting_faculty_id: formData.requesting_faculty_id,
        target_faculty_id: parseInt(formData.target_faculty_id),
        original_timetable_id: selectedClass.id,
        requested_day: formData.requested_day,
        requested_time_slot: formData.requested_time_slot,
        reason: formData.reason
      });

      alert('✅ Swap request submitted successfully!\n\nAdmin will review and validate your request.');
      resetForm();
      loadSwapRequests();
    } catch (error) {
      alert('Failed to submit request: ' + error.message);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm('⚠️ Approve Swap Request?\n\nThis will:\n✓ Update the master timetable\n✓ Change faculty assignments\n✓ Update section schedules\n✓ Recalculate workload analytics\n\nContinue?')) {
      return;
    }

    setApproving(requestId);
    try {
      const notes = window.prompt('Add admin notes (optional):');
      const result = await api.approveSwapRequest(requestId, notes || 'Approved');
      
      alert('✅ Swap Request Approved!\n\n' +
            `Timetable ID: ${result.updated_class?.timetable_id}\n` +
            `New Day: ${result.updated_class?.new_day}\n` +
            `New Time: ${result.updated_class?.new_time}\n\n` +
            'All schedules updated automatically!');
      
      loadSwapRequests();
    } catch (error) {
      alert('❌ Approval failed: ' + error.message);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (requestId) => {
    const notes = window.prompt('⚠️ Reject Swap Request\n\nPlease provide reason for rejection:');
    if (notes === null) return;
    
    if (!notes.trim()) {
      alert('Rejection reason is required');
      return;
    }

    try {
      await api.rejectSwapRequest(requestId, notes);
      alert('Swap request rejected. Faculty will be notified.');
      loadSwapRequests();
    } catch (error) {
      alert('Failed to reject: ' + error.message);
    }
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setShowValidationModal(false);
    setValidationResult(null);
    setSelectedClass(null);
    setFormData({
      requesting_faculty_id: formData.requesting_faculty_id,
      target_faculty_id: '',
      original_timetable_id: '',
      requested_day: 'Monday',
      requested_time_slot: '09:00-10:00',
      reason: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading swap requests...</p>
        </div>
      </div>
    );
  }

  // Statistics
  const stats = {
    total: swapRequests.length,
    pending: swapRequests.filter(r => r.status === 'pending').length,
    approved: swapRequests.filter(r => r.status === 'approved').length,
    rejected: swapRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔄 Advanced Swap Request Management</h1>
          <p className="text-gray-600 mt-1">Intelligent validation • Automatic updates • Conflict resolution</p>
        </div>
        {user?.role === 'faculty' && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Swap Request
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <X className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="ghost" onClick={loadSwapRequests}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Swap Requests List */}
      <div className="space-y-4">
        {swapRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No Swap Requests</h3>
            <p className="text-gray-600 mt-2">
              {filterStatus === 'all' ? 'No swap requests found.' : `No ${filterStatus} requests found.`}
            </p>
          </Card>
        ) : (
          swapRequests.map(request => (
            <Card key={request.id} className="overflow-hidden">
              {/* Request Header */}
              <div 
                className="p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Request #{request.id}
                      </h3>
                      <StatusBadge status={request.status} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 text-xs">Requesting Faculty:</span>
                        <p className="font-medium text-gray-900">{request.requesting_faculty_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-xs">Target Faculty:</span>
                        <p className="font-medium text-gray-900">{request.target_faculty_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-xs">Class:</span>
                        <p className="font-medium text-gray-900">{request.subject_code} - {request.batch}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-xs">Room:</span>
                        <p className="font-medium text-gray-900">{request.room_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600 flex-wrap gap-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {request.original_day} {request.original_time}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="flex items-center text-indigo-600 font-medium">
                        <Calendar className="w-4 h-4 mr-1" />
                        {request.requested_day} {request.requested_time_slot}
                      </span>
                    </div>
                  </div>
                  
                  <button>
                    {expandedRequest === request.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRequest === request.id && (
                <div className="p-6 border-t border-gray-200 bg-white space-y-4">
                  {/* Reason */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{request.reason}</p>
                  </div>

                  {/* Admin Notes */}
                  {request.admin_notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Admin Notes:</p>
                          <p className="text-sm text-blue-700 mt-1">{request.admin_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {user?.role === 'admin' && request.status === 'pending' && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button variant="danger" onClick={() => handleReject(request.id)}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        variant="success" 
                        onClick={() => handleApprove(request.id)}
                        disabled={approving === request.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {approving === request.id ? 'Approving...' : 'Approve & Update'}
                      </Button>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                    <span>Created: {new Date(request.created_at).toLocaleString()}</span>
                    {request.updated_at && (
                      <span>Updated: {new Date(request.updated_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={resetForm} title="Create Swap Request">
        <div className="space-y-6">
          {/* Step 1: Select Current Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1️⃣ Select Your Current Class to Swap
            </label>
            <select
              value={selectedClass?.id || ''}
              onChange={(e) => {
                const classObj = myClasses.find(c => c.id === parseInt(e.target.value));
                setSelectedClass(classObj);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a class...</option>
              {myClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.subject_name} ({cls.subject_code}) - {cls.day_of_week} {cls.time_slot}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <>
              {/* Current Class Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">📋 Current Class Details:</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Subject:</span>
                    <p className="font-medium">{selectedClass.subject_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Code:</span>
                    <p className="font-medium">{selectedClass.subject_code}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Batch-Section:</span>
                    <p className="font-medium">{selectedClass.batch}-{selectedClass.section || 'A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Room:</span>
                    <p className="font-medium">{selectedClass.room_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Slot:</span>
                    <p className="font-medium">{selectedClass.day_of_week} {selectedClass.time_slot}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{selectedClass.session_type}</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Target Faculty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2️⃣ Select Target Faculty (Who will take this class)
                </label>
                <select
                  value={formData.target_faculty_id}
                  onChange={(e) => setFormData({ ...formData, target_faculty_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select faculty...</option>
                  {faculty.filter(f => f.id !== formData.requesting_faculty_id).map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} - {f.department} ({f.max_hours_per_week}h/week max)
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Requested Slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3️⃣ Select Requested Time Slot
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.requested_day}
                    onChange={(e) => setFormData({ ...formData, requested_day: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={formData.requested_time_slot}
                    onChange={(e) => setFormData({ ...formData, requested_time_slot: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4️⃣ Reason for Swap
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Provide detailed reason for the swap request..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleValidateRequest} 
                  disabled={validating}
                >
                  {validating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Validate Request
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Validation Modal */}
      <Modal isOpen={showValidationModal} onClose={() => setShowValidationModal(false)} title="Swap Request Validation">
        {validationResult && (
          <div className="space-y-6">
            {/* Overall Recommendation */}
            <div className={`p-4 rounded-lg border-2 ${
              validationResult.recommendation === 'APPROVE' 
                ? 'bg-green-50 border-green-200' 
                : validationResult.recommendation === 'REJECT'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start space-x-3">
                {validationResult.recommendation === 'APPROVE' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : validationResult.recommendation === 'REJECT' ? (
                  <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {validationResult.recommendation === 'APPROVE' ? '✅ Approved for Submission' :
                     validationResult.recommendation === 'REJECT' ? '❌ Request Cannot Proceed' :
                     '⚠️ Review Required'}
                  </h3>
                  <p className="text-sm mt-1">{validationResult.recommendation_message}</p>
                </div>
              </div>
            </div>

            {/* Original Class */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Original Class:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-blue-700">Subject:</span> <span className="font-medium">{validationResult.original_class?.subject_name}</span></div>
                <div><span className="text-blue-700">Faculty:</span> <span className="font-medium">{validationResult.original_class?.faculty_name}</span></div>
                <div><span className="text-blue-700">Current Slot:</span> <span className="font-medium">{validationResult.original_class?.day_of_week} {validationResult.original_class?.time_slot}</span></div>
                <div><span className="text-blue-700">Room:</span> <span className="font-medium">{validationResult.original_class?.room_name}</span></div>
              </div>
            </div>

            {/* Requested Slot */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-900 mb-2">Requested Swap Slot:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-indigo-700">Day:</span> <span className="font-medium">{validationResult.requested_slot?.day}</span></div>
                <div><span className="text-indigo-700">Time:</span> <span className="font-medium">{validationResult.requested_slot?.time}</span></div>
              </div>
            </div>

            {/* Conflicts */}
            {validationResult.conflicts && validationResult.conflicts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🚨 Detected Conflicts:</h4>
                <div className="space-y-2">
                  {validationResult.conflicts.map((conflict, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">{conflict.type}</p>
                        <p className="text-xs text-red-700 mt-1">{conflict.message}</p>
                        {conflict.severity && (
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded font-medium ${
                            conflict.severity === 'high' ? 'bg-red-200 text-red-800' :
                            conflict.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {conflict.severity.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {validationResult.suggestions && validationResult.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">💡 Alternative Slots Suggested:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {validationResult.suggestions.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          {slot.day} - {slot.time_slot}
                        </p>
                        <p className="text-xs text-green-700">
                          Subject gap: {slot.subject_gap_days} days {slot.is_optimal && '✓ Optimal'}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-green-600">Score: {slot.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
                Back
              </Button>
              {validationResult.recommendation !== 'REJECT' && (
                <Button onClick={handleSubmitRequest}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};


//Leave Management
const LeaveManagement = () =>  {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(null);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    leave_type: 'Casual',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const [impactAnalysis, setImpactAnalysis] = useState(null);

  const token = localStorage.getItem('token');
  const api = new APIService(token);

  const leaveTypes = [
    { value: 'Casual', label: '🗓️ Casual Leave', color: 'blue' },
    { value: 'Sick', label: '🏥 Sick Leave', color: 'red' },
    { value: 'Earned', label: '💼 Earned Leave', color: 'green' },
    { value: 'Emergency', label: '⚠️ Emergency Leave', color: 'orange' },
    { value: 'Conference', label: '📚 Conference/Seminar', color: 'purple' },
    { value: 'Sabbatical', label: '📖 Sabbatical', color: 'indigo' }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadLeaveRequests();
  }, [filterStatus]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      await loadLeaveRequests();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaveRequests = async () => {
    try {
      const data = await api.getLeaveRequests();
      setLeaveRequests(data || []);
    } catch (error) {
      console.error('Failed to load leave requests:', error);
      alert('Failed to load leave requests: ' + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leave_type.trim()) {
      newErrors.leave_type = 'Leave type is required';
    }
    if (!formData.start_date.trim()) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date.trim()) {
      newErrors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateLeave = async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing('create');
    try {
      const result = await api.createLeaveRequest({
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason
      });

      setImpactAnalysis(result.impactAnalysis);

      if (result.impactAnalysis?.affectedClassesCount > 0) {
        alert(`✅ Leave request submitted!\n\n⚠️ ${result.impactAnalysis.affectedClassesCount} classes will be affected.\n📋 Affected Students: ${result.impactAnalysis.totalAffectedStudents}\n\nAdmin will arrange substitute faculty.`);
      } else {
        alert('✅ Leave request submitted successfully!');
      }

      // Reset form
      setFormData({
        leave_type: 'Casual',
        start_date: '',
        end_date: '',
        reason: ''
      });
      setErrors({});
      setShowCreateModal(false);
      await loadLeaveRequests();
    } catch (error) {
      alert('❌ Failed to create leave request: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveReject = async (id, status, notes = '') => {
    if (!window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this leave request?`)) {
      return;
    }

    setProcessing(id);
    try {
      const result = await api.updateLeaveRequest(id, {
        status,
        admin_notes: notes || `Leave request ${status}`
      });

      if (result.rescheduleStats) {
        alert(`✅ Leave request ${status}!\n\n📊 Rescheduling Summary:\n` +
              `Substitutes: ${result.rescheduleStats.substitutes_assigned}\n` +
              `Rescheduled: ${result.rescheduleStats.rescheduled}\n` +
              `Cancelled: ${result.rescheduleStats.cancelled}\n` +
              `Total Affected: ${result.rescheduleStats.total_affected}`);
      } else {
        alert(`✅ Leave request ${status} successfully!`);
      }

      await loadLeaveRequests();
    } catch (error) {
      alert(`❌ Failed to ${status} leave request: ` + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const calculateLeaveDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredRequests = leaveRequests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = !searchTerm || 
      req.faculty_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leave_type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty leave requests and schedule substitutes</p>
        </div>
        {user?.role === 'faculty' && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Apply for Leave
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <X className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 flex-wrap gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by faculty name or leave type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Refresh */}
          <Button variant="ghost" onClick={loadLeaveRequests}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No Leave Requests</h3>
            <p className="text-gray-600 mt-2">
              {filterStatus === 'all' ? 'No leave requests found.' : `No ${filterStatus} requests found.`}
            </p>
          </Card>
        ) : (
          filteredRequests.map(request => {
            const leaveDays = calculateLeaveDays(request.start_date, request.end_date);
            const isExpanded = expandedRequest === request.id;

            return (
              <Card key={request.id} className="overflow-hidden">
                {/* Request Header */}
                <div 
                  className="p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.faculty_name || 'Faculty'}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs block">Leave Type</span>
                          <p className="font-medium text-gray-900">{request.leave_type}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs block">Duration</span>
                          <p className="font-medium text-gray-900">
                            {request.start_date} to {request.end_date}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs block">Leave Days</span>
                          <p className="font-medium text-gray-900">{leaveDays} day(s)</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs block">Department</span>
                          <p className="font-medium text-gray-900">{request.department || 'N/A'}</p>
                        </div>
                      </div>

                      {request.auto_rescheduled && (
                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Auto-rescheduled
                        </div>
                      )}
                    </div>

                    <button>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-gray-200 bg-white space-y-4">
                    {/* Reason */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{request.reason}</p>
                    </div>

                    {/* Impact Analysis */}
                    {request.affected_classes_count > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-orange-900">Leave Impact Analysis</h4>
                            <div className="mt-2 space-y-1 text-sm text-orange-700">
                              <p>📚 Affected Classes: <span className="font-medium">{request.affected_classes_count}</span></p>
                              <p>👥 Total Students Impacted: <span className="font-medium">{request.affected_classes_count * 30}</span></p>
                              <p>👨‍🏫 Substitutes Required: <span className="font-medium">Pending</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rescheduling Results */}
                    {request.reschedule_details && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">✅ Rescheduling Results</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-green-700 text-xs">Substitutes</span>
                            <p className="font-medium text-green-900">{request.reschedule_details.substitutes_assigned}</p>
                          </div>
                          <div>
                            <span className="text-green-700 text-xs">Rescheduled</span>
                            <p className="font-medium text-green-900">{request.reschedule_details.rescheduled}</p>
                          </div>
                          <div>
                            <span className="text-green-700 text-xs">Cancelled</span>
                            <p className="font-medium text-green-900">{request.reschedule_details.cancelled}</p>
                          </div>
                          <div>
                            <span className="text-green-700 text-xs">Total Handled</span>
                            <p className="font-medium text-green-900">{request.reschedule_details.total_affected}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {request.admin_notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Admin Notes:</p>
                            <p className="text-sm text-blue-700 mt-1">{request.admin_notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {user?.role === 'admin' && request.status === 'pending' && (
                      <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button 
                          variant="danger" 
                          onClick={() => {
                            const notes = window.prompt('Reason for rejection:');
                            if (notes) handleApproveReject(request.id, 'rejected', notes);
                          }}
                          disabled={processing === request.id}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          variant="success" 
                          onClick={() => {
                            const notes = window.prompt('Approval notes:');
                            handleApproveReject(request.id, 'approved', notes || '');
                          }}
                          disabled={processing === request.id}
                        >
                          {processing === request.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve & Auto-Schedule
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                      <span>Created: {new Date(request.created_at).toLocaleString()}</span>
                      {request.reviewed_at && (
                        <span>Reviewed: {new Date(request.reviewed_at).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Create Leave Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setFormData({ leave_type: 'Casual', start_date: '', end_date: '', reason: '' });
          setErrors({});
        }} 
        title="Apply for Leave"
        size="lg"
      >
        <div className="space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {leaveTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFormData({ ...formData, leave_type: type.value });
                    setErrors({ ...errors, leave_type: '' });
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.leave_type === type.value
                      ? `border-indigo-500 bg-indigo-50`
                      : `border-gray-200 hover:border-gray-300 hover:bg-gray-50`
                  }`}
                >
                  <p className="text-sm font-medium">{type.label}</p>
                </button>
              ))}
            </div>
            {errors.leave_type && <p className="text-xs text-red-600 mt-1">{errors.leave_type}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => {
                setFormData({ ...formData, start_date: e.target.value });
                setErrors({ ...errors, start_date: '' });
              }}
              error={errors.start_date}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => {
                setFormData({ ...formData, end_date: e.target.value });
                setErrors({ ...errors, end_date: '' });
              }}
              error={errors.end_date}
              required
            />
          </div>

          {/* Leave Days Display */}
          {formData.start_date && formData.end_date && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                📅 Total Leave Days: <span className="font-bold">{calculateLeaveDays(formData.start_date, formData.end_date)}</span>
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value });
                setErrors({ ...errors, reason: '' });
              }}
              rows="4"
              placeholder="Provide detailed reason for leave..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.reason && <p className="text-xs text-red-600 mt-1">{errors.reason}</p>}
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Important Information</h4>
                <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                  <li>✓ Substitute faculty will be automatically assigned</li>
                  <li>✓ Your classes will be rescheduled or covered</li>
                  <li>✓ Students will be notified of any changes</li>
                  <li>✓ Admin will review and approve your request</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowCreateModal(false);
                setFormData({ leave_type: 'Casual', start_date: '', end_date: '', reason: '' });
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateLeave}
              disabled={processing === 'create'}
            >
              {processing === 'create' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Apply for Leave
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};



// Requests Management Component
// Requests Management Component
const RequestsManagement = () => {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('swap');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    target_faculty_id: '',
    original_time_slot: '',
    requested_time_slot: '',
    requested_day: 'Monday',
    reason: ''
  });

  const api = new APIService();

  useEffect(() => {
    loadSwapRequests();
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const data = await api.getFaculty();
      setFaculty(data);
    } catch (error) {
      console.error('Failed to load faculty:', error);
    }
  };

  const loadSwapRequests = async () => {
    try {
      const data = await api.getSwapRequests();
      setSwapRequests(data);
    } catch (error) {
      console.error('Failed to load swap requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    try {
      // Validate all fields are filled
      if (!formData.target_faculty_id || !formData.original_time_slot || !formData.requested_time_slot || !formData.requested_day || !formData.reason.trim()) {
        alert('Please fill in all fields before submitting.');
        return;
      }

      const requestData = {
        target_faculty_id: parseInt(formData.target_faculty_id),
        original_time_slot: formData.original_time_slot,
        requested_time_slot: formData.requested_time_slot,
        requested_day: formData.requested_day,
        reason: formData.reason.trim()
      };

      console.log('Sending swap request data:', requestData);

      await api.createSwapRequest(requestData);
      loadSwapRequests();
      setShowCreateModal(false);
      setFormData({
        target_faculty_id: '',
        original_time_slot: '',
        requested_time_slot: '',
        requested_day: 'Monday',
        reason: ''
      });
      alert('Swap request created successfully!');
    } catch (error) {
      console.error('Failed to create swap request:', error);
      alert(`Failed to create swap request. Error: ${error.message}`);
    }
  };

  const handleUpdateRequest = async (id, status, admin_notes = '') => {
    try {
      await api.updateSwapRequest(id, { status, admin_notes });
      loadSwapRequests();
    } catch (error) {
      console.error('Failed to update swap request:', error);
    }
  };

  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Requests Management</h1>
        {user?.role === 'faculty' && (
          <Button onClick={() => {
            setFormData({
              target_faculty_id: '',
              original_time_slot: '',
              requested_time_slot: '',
              requested_day: 'Monday',
              reason: ''
            });
            setShowCreateModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('swap')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'swap'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Swap Requests
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'leave'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Leave Requests
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'swap' && (
            <div className="space-y-4">
              {swapRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Faculty Swap Request #{request.id}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{request.reason}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Original: {request.original_time_slot} → Requested: {request.requested_time_slot}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Created: {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {request.status}
                      </span>
                      {user?.role === 'admin' && request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleUpdateRequest(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUpdateRequest(request.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="text-center py-8 text-gray-500">
              Leave requests functionality will be implemented based on backend support.
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Swap Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Faculty</label>
            <select
              value={formData.target_faculty_id}
              onChange={(e) => setFormData({ ...formData, target_faculty_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Faculty</option>
              {faculty.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requested Day</label>
            <select
              value={formData.requested_day}
              onChange={(e) => setFormData({ ...formData, requested_day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Time Slot</label>
              <select
                value={formData.original_time_slot}
                onChange={(e) => setFormData({ ...formData, original_time_slot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requested Time Slot</label>
              <select
                value={formData.requested_time_slot}
                onChange={(e) => setFormData({ ...formData, requested_time_slot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="3"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Please provide a reason for the swap request..."
            ></textarea>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button onClick={handleCreateRequest}>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Analytics Component with Charts
const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const api = new APIService();

  useEffect(() => {
    loadRealTimeAnalytics();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadRealTimeAnalytics, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedBatch, autoRefresh]);

  const loadRealTimeAnalytics = async () => {
    try {
      const data = await api.getRealTimeAnalytics(selectedBatch === 'all' ? null : selectedBatch);
      setAnalytics(data);
      
      try {
        const suggestionsData = await api.getOptimizationSuggestions(selectedBatch === 'all' ? null : selectedBatch);
        setSuggestions(suggestionsData || []);
      } catch (err) {
        console.log('Could not load suggestions:', err);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const { summary, faculty_workload, room_utilization, alerts, conflicts } = analytics;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <HeaderSection 
        timestamp={analytics.timestamp}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        onRefresh={loadRealTimeAnalytics}
      />

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <AlertsSection alerts={alerts} />
      )}

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* View Tabs */}
      <ViewTabs 
        activeView={activeView} 
        setActiveView={setActiveView}
        suggestionsCount={suggestions.length}
      />

      {/* Content Views */}
      {activeView === 'overview' && (
        <OverviewView 
          faculty_workload={faculty_workload}
          room_utilization={room_utilization}
          conflicts={conflicts}
        />
      )}

      {activeView === 'faculty' && (
        <FacultyWorkloadView faculty_workload={faculty_workload} />
      )}

      {activeView === 'rooms' && (
        <RoomUtilizationView room_utilization={room_utilization} />
      )}

      {activeView === 'suggestions' && (
        <SuggestionsView suggestions={suggestions} />
      )}
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

const HeaderSection = ({ timestamp, autoRefresh, setAutoRefresh, selectedBatch, setSelectedBatch, onRefresh }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics Dashboard</h1>
      <p className="text-gray-600 mt-1">
        Last updated: {new Date(timestamp).toLocaleTimeString()}
      </p>
    </div>
    <div className="flex items-center space-x-3">
      <label className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
          className="rounded"
        />
        <span>Auto-refresh</span>
      </label>
      <select
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Batches</option>
        <option value="CS2023">CS 2023</option>
        <option value="MATH2023">Math 2023</option>
        <option value="PHY2023">Physics 2023</option>
      </select>
      <Button onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  </div>
);

const AlertsSection = ({ alerts }) => (
  <div className="space-y-3">
    {alerts.map((alert, idx) => (
      <Card key={idx} className={`p-4 border-l-4 ${
        alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
        alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
        'border-blue-500 bg-blue-50'
      }`}>
        <div className="flex items-start space-x-3">
          <AlertCircle className={`w-5 h-5 mt-0.5 ${
            alert.severity === 'critical' ? 'text-red-600' :
            alert.severity === 'warning' ? 'text-yellow-600' :
            'text-blue-600'
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${
              alert.severity === 'critical' ? 'text-red-900' :
              alert.severity === 'warning' ? 'text-yellow-900' :
              'text-blue-900'
            }`}>
              {alert.message}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {JSON.stringify(alert.details).substring(0, 100)}...
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
            alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {alert.type.replace(/_/g, ' ')}
          </span>
        </div>
      </Card>
    ))}
  </div>
);

const SummaryCards = ({ summary }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <SummaryCard
      title="Avg Faculty Load"
      value={`${summary.avg_faculty_utilization}%`}
      subtitle={`${summary.overloaded_faculty} overloaded`}
      icon={Users}
      color="blue"
      progressValue={summary.avg_faculty_utilization}
      progressColor={
        summary.avg_faculty_utilization > 90 ? 'bg-red-500' :
        summary.avg_faculty_utilization > 70 ? 'bg-yellow-500' :
        'bg-green-500'
      }
    />
    
    <SummaryCard
      title="Avg Room Usage"
      value={`${summary.avg_room_utilization}%`}
      subtitle={`${summary.high_utilization_rooms} highly used`}
      icon={Building}
      color="green"
      progressValue={summary.avg_room_utilization}
      progressColor="bg-green-500"
    />
    
    <SummaryCard
      title="Total Conflicts"
      value={summary.total_conflicts}
      subtitle={`${summary.critical_conflicts} critical`}
      icon={AlertCircle}
      color="red"
      progressValue={null}
    />
    
    <SummaryCard
      title="Active Resources"
      value={summary.total_faculty + summary.total_rooms}
      subtitle={`${summary.total_faculty} faculty, ${summary.total_rooms} rooms`}
      icon={Activity}
      color="purple"
      progressValue={null}
    />
  </div>
);

const SummaryCard = ({ title, value, subtitle, icon: Icon, color, progressValue, progressColor }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {progressValue !== null && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${progressColor}`}
            style={{ width: `${Math.min(progressValue, 100)}%` }}
          />
        </div>
      )}
    </Card>
  );
};

const ViewTabs = ({ activeView, setActiveView, suggestionsCount }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'faculty', label: 'Faculty Workload' },
    { id: 'rooms', label: 'Room Utilization' },
    { id: 'suggestions', label: `Suggestions ${suggestionsCount > 0 ? `(${suggestionsCount})` : ''}` }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveView(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeView === tab.id 
              ? 'bg-white text-gray-900 shadow' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const FacultySubjectAssignment = () => {
    const api = new APIService();
    const { user } = useAuth();
    
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [facultyDetails, setFacultyDetails] = useState(null);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [teachingStats, setTeachingStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [assignMode, setAssignMode] = useState('single'); // 'single' or 'bulk'

    useEffect(() => {
        loadFaculty();
    }, []);

    useEffect(() => {
        if (selectedFaculty) {
            loadFacultyDetails();
            loadAvailableSubjects();
            loadTeachingStats();
        }
    }, [selectedFaculty, filterDepartment]);

    const loadFaculty = async () => {
        setLoading(true);
        try {
            const data = await api.getFaculty();
            setFaculty(data);
        } catch (error) {
            console.error('Failed to load faculty:', error);
            alert('Failed to load faculty: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadFacultyDetails = async () => {
        if (!selectedFaculty) return;
        
        try {
            const data = await api.getFacultySubjects(selectedFaculty.id);
            setFacultyDetails(data);
        } catch (error) {
            console.error('Failed to load faculty details:', error);
        }
    };

    const loadAvailableSubjects = async () => {
        if (!selectedFaculty) return;
        
        try {
            const data = await api.getAvailableSubjects(
                selectedFaculty.id, 
                filterDepartment === 'all' ? null : filterDepartment
            );
            setAvailableSubjects(data);
        } catch (error) {
            console.error('Failed to load available subjects:', error);
        }
    };

    const loadTeachingStats = async () => {
        if (!selectedFaculty) return;
        
        try {
            const data = await api.getFacultyTeachingStats(selectedFaculty.id);
            setTeachingStats(data);
        } catch (error) {
            console.error('Failed to load teaching stats:', error);
        }
    };

    const handleAssignSubject = async (subjectId, isPrimary = false) => {
        try {
            await api.assignSubjectToFaculty(selectedFaculty.id, subjectId, isPrimary);
            alert('✅ Subject assigned successfully!');
            loadFacultyDetails();
            loadAvailableSubjects();
            setShowAssignModal(false);
        } catch (error) {
            alert('Failed to assign subject: ' + error.message);
        }
    };

    const handleBulkAssign = async () => {
        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        if (!window.confirm(`Assign ${selectedSubjects.length} subjects to ${selectedFaculty.name}?`)) {
            return;
        }

        try {
            const result = await api.bulkAssignSubjects(
                selectedFaculty.id, 
                selectedSubjects,
                false // Don't replace existing
            );
            
            alert(
                `✅ Bulk assignment completed!\n\n` +
                `Added: ${result.added}\n` +
                `Skipped: ${result.skipped}\n` +
                `Total: ${result.total}`
            );
            
            loadFacultyDetails();
            loadAvailableSubjects();
            setShowBulkAssignModal(false);
            setSelectedSubjects([]);
        } catch (error) {
            alert('Failed to bulk assign: ' + error.message);
        }
    };

    const handleRemoveSubject = async (subjectId, subjectName) => {
        if (!window.confirm(`Remove "${subjectName}" from ${selectedFaculty.name}?`)) {
            return;
        }

        try {
            await api.removeSubjectFromFaculty(selectedFaculty.id, subjectId);
            alert('✅ Subject removed successfully!');
            loadFacultyDetails();
            loadAvailableSubjects();
            loadTeachingStats();
        } catch (error) {
            if (error.message.includes('active timetable')) {
                alert('❌ Cannot remove: This subject is currently assigned in the active timetable.');
            } else {
                alert('Failed to remove subject: ' + error.message);
            }
        }
    };

    const handleTogglePrimary = async (subjectId, currentPrimary) => {
        try {
            await api.updateFacultySubjectAssignment(
                selectedFaculty.id, 
                subjectId, 
                !currentPrimary
            );
            loadFacultyDetails();
        } catch (error) {
            alert('Failed to update: ' + error.message);
        }
    };

    const filteredFaculty = faculty.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unassignedSubjects = availableSubjects.filter(s => !s.is_assigned);
    const departments = [...new Set(faculty.map(f => f.department))];

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Subject Assignment</h1>
                    <p className="text-gray-600 mt-1">Assign subjects to faculty members for teaching</p>
                </div>
                {selectedFaculty && (
                    <Button onClick={() => setShowBulkAssignModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Bulk Assign Subjects
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Faculty List */}
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Faculty</h2>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search faculty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Faculty List */}
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {filteredFaculty.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedFaculty(member)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    selectedFaculty?.id === member.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{member.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{member.department}</p>
                                        <p className="text-xs text-gray-400 truncate">{member.email}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Subject Details */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedFaculty ? (
                        <>
                            {/* Faculty Info Card */}
                            <Card className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedFaculty.name}</h2>
                                            <p className="text-gray-600">{selectedFaculty.designation || 'Faculty'}</p>
                                            <p className="text-sm text-gray-500">{selectedFaculty.department} Department</p>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setShowAssignModal(true)}
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Assign Subject
                                    </Button>
                                </div>

                                {/* Teaching Stats */}
                                {teachingStats && (
                                    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {teachingStats.subjects_teaching || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Subjects Teaching</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {teachingStats.sections_teaching || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Sections</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {teachingStats.total_classes || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Total Classes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {teachingStats.weekly_hours ? parseFloat(teachingStats.weekly_hours).toFixed(1) : '0.0'}
                                            </div>
                                            <div className="text-xs text-gray-600">Weekly Hours</div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Assigned Subjects */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Assigned Subjects ({facultyDetails?.assigned_subjects?.length || 0})
                                </h3>
                                
                                {facultyDetails?.assigned_subjects && facultyDetails.assigned_subjects.length > 0 ? (
                                    <div className="space-y-3">
                                        {facultyDetails.assigned_subjects.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                        assignment.subject_type === 'Practical'
                                                            ? 'bg-purple-100'
                                                            : assignment.subject_type === 'Tutorial'
                                                            ? 'bg-green-100'
                                                            : 'bg-blue-100'
                                                    }`}>
                                                        <BookOpen className={`w-6 h-6 ${
                                                            assignment.subject_type === 'Practical'
                                                                ? 'text-purple-600'
                                                                : assignment.subject_type === 'Tutorial'
                                                                ? 'text-green-600'
                                                                : 'text-blue-600'
                                                        }`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {assignment.subject_name}
                                                            </h4>
                                                            {assignment.is_primary && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    <Star className="w-3 h-3 mr-1" />
                                                                    Primary
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                            <span>{assignment.subject_code}</span>
                                                            <span>•</span>
                                                            <span>{assignment.subject_type}</span>
                                                            <span>•</span>
                                                            <span>{assignment.credits} Credits</span>
                                                            <span>•</span>
                                                            <span>{assignment.department}</span>
                                                            <span>•</span>
                                                            <span>Sem {assignment.semester}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleTogglePrimary(assignment.subject_id, assignment.is_primary)}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            assignment.is_primary
                                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                        }`}
                                                        title={assignment.is_primary ? 'Remove as primary' : 'Set as primary'}
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveSubject(assignment.subject_id, assignment.subject_name)}
                                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                        title="Remove subject"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <h3 className="text-lg font-medium text-gray-900">No Subjects Assigned</h3>
                                        <p className="text-gray-600 mt-2">
                                            Click "Assign Subject" to add subjects to this faculty member
                                        </p>
                                        <Button 
                                            onClick={() => setShowAssignModal(true)}
                                            className="mt-4"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Assign First Subject
                                        </Button>
                                    </div>
                                )}
                            </Card>

                            {/* Available Subjects */}
                            {unassignedSubjects.length > 0 && (
                                <Card className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Available Subjects ({unassignedSubjects.length})
                                        </h3>
                                        <select
                                            value={filterDepartment}
                                            onChange={(e) => setFilterDepartment(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="all">All Departments</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                        {unassignedSubjects.map((subject) => (
                                            <button
                                                key={subject.id}
                                                onClick={() => handleAssignSubject(subject.id)}
                                                className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                                                            <span>{subject.code}</span>
                                                            <span>•</span>
                                                            <span>{subject.type}</span>
                                                            <span>•</span>
                                                            <span>{subject.credits} Credits</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {subject.department} • Sem {subject.semester}
                                                        </div>
                                                    </div>
                                                    <Plus className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Card className="p-12 text-center">
                            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900">Select a Faculty Member</h3>
                            <p className="text-gray-600 mt-2">
                                Choose a faculty member from the list to view and manage their subject assignments
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Single Assign Modal */}
            <Modal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                title={`Assign Subject to ${selectedFaculty?.name}`}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Department
                        </label>
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {unassignedSubjects.length > 0 ? (
                            unassignedSubjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    onClick={() => handleAssignSubject(subject.id)}
                                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                                                <span>{subject.code}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded ${
                                                    subject.type === 'Practical' ? 'bg-purple-100 text-purple-700' :
                                                    subject.type === 'Tutorial' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {subject.type}
                                                </span>
                                                <span>•</span>
                                                <span>{subject.credits} Credits</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {subject.department} • Semester {subject.semester}
                                            </div>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No available subjects to assign</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Bulk Assign Modal */}
            <Modal
                isOpen={showBulkAssignModal}
                onClose={() => {
                    setShowBulkAssignModal(false);
                    setSelectedSubjects([]);
                }}
                title={`Bulk Assign Subjects to ${selectedFaculty?.name}`}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Select multiple subjects to assign at once
                        </p>
                        <span className="text-sm font-medium text-indigo-600">
                            {selectedSubjects.length} selected
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Department
                        </label>
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="border-t border-b border-gray-200 py-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedSubjects.length === unassignedSubjects.length && unassignedSubjects.length > 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedSubjects(unassignedSubjects.map(s => s.id));
                                    } else {
                                        setSelectedSubjects([]);
                                    }
                                }}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Select All ({unassignedSubjects.length})
                            </span>
                        </label>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {unassignedSubjects.map((subject) => (
                            <label
                                key={subject.id}
                                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    selectedSubjects.includes(subject.id)
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(subject.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedSubjects([...selectedSubjects, subject.id]);
                                        } else {
                                            setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id));
                                        }
                                    }}
                                    className="mt-1 w-4 h-4 text-indigo-600 rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                                        <span>{subject.code}</span>
                                        <span>•</span>
                                        <span className={`px-2 py-0.5 rounded ${
                                            subject.type === 'Practical' ? 'bg-purple-100 text-purple-700' :
                                            subject.type === 'Tutorial' ? 'bg-green-100 text-green-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {subject.type}
                                        </span>
                                        <span>•</span>
                                        <span>{subject.credits} Credits</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {subject.department} • Semester {subject.semester}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowBulkAssignModal(false);
                                setSelectedSubjects([]);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBulkAssign}
                            disabled={selectedSubjects.length === 0}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Assign {selectedSubjects.length} Subject{selectedSubjects.length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// ==================== VIEW COMPONENTS ====================

const OverviewView = ({ faculty_workload, room_utilization, conflicts }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <FacultyDistributionChart faculty_workload={faculty_workload} />
    <RoomTypeUtilizationChart room_utilization={room_utilization} />
    {conflicts && conflicts.length > 0 && <ConflictsSummary conflicts={conflicts} />}
    <TopPerformers faculty_workload={faculty_workload} room_utilization={room_utilization} />
  </div>
);

const FacultyDistributionChart = ({ faculty_workload }) => {
  const statuses = ['overloaded', 'very_high', 'high', 'optimal', 'underutilized'];
  const colors = {
    overloaded: 'bg-red-500',
    very_high: 'bg-orange-500',
    high: 'bg-yellow-500',
    optimal: 'bg-green-500',
    underutilized: 'bg-blue-500'
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Workload Distribution</h3>
      <div className="space-y-3">
        {statuses.map(status => {
          const count = faculty_workload.filter(f => f.load_status === status).length;
          const percentage = faculty_workload.length > 0 ? (count / faculty_workload.length) * 100 : 0;
          
          return (
            <div key={status} className="flex items-center space-x-3">
              <div className="w-32 text-sm text-gray-600 capitalize">
                {status.replace('_', ' ')}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6">
                <div
                  className={`${colors[status]} h-6 rounded-full flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                >
                  <span className="text-xs text-white font-medium">{count}</span>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const RoomTypeUtilizationChart = ({ room_utilization }) => {
  const roomTypes = ['Classroom', 'Lab', 'Auditorium', 'Seminar Hall'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Type Utilization</h3>
      <div className="space-y-4">
        {roomTypes.map(type => {
          const rooms = room_utilization.filter(r => r.type === type);
          const avgUtil = rooms.length > 0
            ? rooms.reduce((sum, r) => sum + parseFloat(r.utilization_percentage || 0), 0) / rooms.length
            : 0;
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{type}</span>
                <span className="text-sm text-gray-600">{rooms.length} rooms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(avgUtil, 3)}%` }}
                >
                  <span className="text-xs text-white font-medium">{avgUtil.t}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const ConflictsSummary = ({ conflicts }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conflicts Detected</h3>
    <div className="space-y-3">
      {conflicts.map((conflict, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              conflict.severity === 'high' ? 'bg-red-500' :
              conflict.severity === 'medium' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}></div>
            <div>
              <p className="text-sm font-medium text-gray-900">{conflict.conflict_type}</p>
              <p className="text-xs text-gray-500">Severity: {conflict.severity}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {conflict.count}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

const TopPerformers = ({ faculty_workload, room_utilization }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Highly Utilized Resources</h3>
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Faculty</p>
        {faculty_workload.slice(0, 5).map((faculty, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">{faculty.name}</span>
            <span className={`text-sm font-medium ${
              faculty.load_status === 'overloaded' ? 'text-red-600' :
              faculty.load_status === 'very_high' ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {faculty.utilization_percentage}%
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Rooms</p>
        {room_utilization.slice(0, 5).map((room, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">{room.name}</span>
            <span className="text-sm font-medium text-gray-900">
              {room.utilization_percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const FacultyWorkloadView = ({ faculty_workload }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Workload Details</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Classes</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sections</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hours/Week</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Max Hours</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Utilization</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {faculty_workload.map((faculty, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{faculty.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{faculty.department}</td>
              <td className="px-4 py-3 text-sm text-center">{faculty.total_classes}</td>
              <td className="px-4 py-3 text-sm text-center">{faculty.sections_teaching}</td>
              <td className="px-4 py-3 text-sm text-center font-medium">
                {faculty.total_weekly_hours ? faculty.total_weekly_hours: '0'}
              </td>
              <td className="px-4 py-3 text-sm text-center">{faculty.max_hours_per_week}</td>
              <td className="px-4 py-3 text-sm text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        faculty.load_status === 'overloaded' ? 'bg-red-500' :
                        faculty.load_status === 'very_high' ? 'bg-orange-500' :
                        faculty.load_status === 'high' ? 'bg-yellow-500' :
                        faculty.load_status === 'optimal' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(faculty.utilization_percentage || 0, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{faculty.utilization_percentage}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  faculty.load_status === 'overloaded' ? 'bg-red-100 text-red-800' :
                  faculty.load_status === 'very_high' ? 'bg-orange-100 text-orange-800' :
                  faculty.load_status === 'high' ? 'bg-yellow-100 text-yellow-800' :
                  faculty.load_status === 'optimal' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {faculty.load_status.replace('_', ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const RoomUtilizationView = ({ room_utilization }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Utilization Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {room_utilization.map((room, idx) => (
        <div key={idx} className={`p-4 rounded-lg border-2 ${
          room.utilization_percentage > 80 ? 'border-red-200 bg-red-50' :
          room.utilization_percentage > 50 ? 'border-yellow-200 bg-yellow-50' :
          'border-green-200 bg-green-50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{room.name}</h4>
              <p className="text-xs text-gray-600">{room.type} • {room.building}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              room.utilization_percentage > 80 ? 'bg-red-100' :
              room.utilization_percentage > 50 ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              <Building className={`w-5 h-5 ${
                room.utilization_percentage > 80 ? 'text-red-600' :
                room.utilization_percentage > 50 ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium">{room.capacity} students</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bookings:</span>
              <span className="font-medium">{room.total_bookings} / 36</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sections:</span>
              <span className="font-medium">{room.sections_using}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium">{room.available_slots} slots</span>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Utilization</span>
              <span className="text-xs font-medium">{room.utilization_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  room.utilization_percentage > 80 ? 'bg-red-500' :
                  room.utilization_percentage > 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(room.utilization_percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const SuggestionsView = ({ suggestions }) => (
  <div className="space-y-4">
    {suggestions.length === 0 ? (
      <Card className="p-12 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">All Systems Optimal</h3>
        <p className="text-gray-600 mt-2">No optimization suggestions at this time</p>
      </Card>
    ) : (
      suggestions.map((suggestion, idx) => (
        <Card key={idx} className={`p-6 border-l-4 ${
          suggestion.priority === 'high' ? 'border-red-500' :
          suggestion.priority === 'medium' ? 'border-yellow-500' :
          'border-blue-500'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{suggestion.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {suggestion.priority} priority
                </span>
              </div>
              <p className="text-gray-600 mb-3">{suggestion.description}</p>
              
              {suggestion.details && suggestion.details.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Details:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {suggestion.details.slice(0, 5).map((detail, detailIdx) => (
                      <div key={detailIdx} className="text-sm text-gray-600">
                        • {JSON.stringify(detail).substring(0, 100)}
                      </div>
                    ))}
                    {suggestion.details.length > 5 && (
                      <p className="text-xs text-gray-500">
                        ...and {suggestion.details.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Recommendation:</span> {suggestion.recommendation}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))
    )}
  </div>
);

// Settings Component
const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: { email: true, push: false, sms: false },
    preferences: { theme: 'dark', language: 'english', timezone: 'UTC+05:30' },
    profile: { name: user?.username || '', email: user?.email || '' }
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <Input
              label="Name"
              value={settings.profile.name}
              onChange={(e) => setSettings({
                ...settings,
                profile: { ...settings.profile, name: e.target.value }
              })}
            />
            <Input
              label="Email"
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings({
                ...settings,
                profile: { ...settings.profile, email: e.target.value }
              })}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{key} notifications</span>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [key]: !value }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${value ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={settings.preferences.theme}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, theme: e.target.value }
                })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={settings.preferences.language}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, language: e.target.value }
                })}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System</h2>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            <Button variant="danger" className="w-full justify-start">
              <AlertCircle className="w-4 h-4 mr-2" />
              Reset Settings
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

// Main App Component
const SmartSchedulerApp = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'faculty-profile': return <FacultyProfile />;  // NEW
      case 'faculty-management': return <FacultyLoginManagement />;  //NEW
      case 'my-timetable': return <FacultyMyTimetable />;    //NEW
      case 'faculty-subjects': return <FacultySubjectAssignment />; // NEW
      case 'swap-request' : return <AdvancedSwapRequestManagement />; //NEW
      case 'optimization': return <EnhancedDashboard />;
      case 'leave': return <LeaveManagement />;
      case 'timetable': return <Timetable />;
      case 'multi-section': return <MultiSectionTimetable />;
      case 'multi-section-import': return <MultiSectionDataImport />;
      case 'faculty': return <FacultyManagement />;
      case 'students': return <StudentsManagement />;
      case 'rooms': return <RoomsManagement />;
      case 'subjects': return <SubjectsManagement />;
      case 'requests': return <RequestsManagement />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ user }}>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default SmartSchedulerApp;