import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Edit, Trash2, Download, Filter, Search, Calendar,
  Star, CheckCircle, XCircle, Clock, MapPin, Phone, Mail,
  Award, TrendingUp, FileText, MessageSquare, DollarSign,
  ChevronDown, ChevronUp, MoreVertical, PlusCircle, X
} from 'lucide-react';


export const DetailedStudentsView = ({ darkMode, searchTerm }) => {
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'good':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'average':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const normalizedSearch = (searchTerm || '').toLowerCase();
  const filteredStudents = students.filter(student => {
    const name = (student.name || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const matchesSearch = name.includes(normalizedSearch) || email.includes(normalizedSearch);
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://jubilant-fortnight-node-backend.onrender.com/admin/students', {
          headers: {    
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle delete
  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await fetch(`https://jubilant-fortnight-node-backend.onrender.com/admin/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Remove from state
      setStudents(students.filter(s => s.id !== studentId));
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Students Management</h2>
          <p className="text-sm text-gray-500 mt-1">Total: {students.length} students</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
          >
            <option value="name">Sort by Name</option>
            <option value="score">Sort by Score</option>
            <option value="interviews">Sort by Interviews</option>
            <option value="date">Sort by Date</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center">
            <PlusCircle className="w-4 h-4" />
            Add Student
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto justify-center">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
            onClick={() => {
              setSelectedStudent(student);
              setShowModal(true);
            }}
          >
            {/* Student Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {(student.name || '?').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{student.name || 'Unknown'}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {student.location}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                student.status === 'active'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {student.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                {student.email}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                {student.phone}
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-1">Interviews</p>
                <p className="text-2xl font-bold text-blue-500">{student.totalInterviews}</p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-green-500">{student.avgScore}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {(student.skills || []).map((skill, idx) => {
                  const label = typeof skill === 'string' ? skill : (skill.skill || skill.name || 'Skill');
                  return (
                  <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                    {label}
                  </span>
                  );
                })}
              </div>
            </div>

            {/* Performance Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getPerformanceColor(student.performance)} text-xs font-semibold`}>
              <Award className="w-3 h-3" />
              {student.performance.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          darkMode={darkMode}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );

};
// Student Detail Modal
const StudentDetailModal = ({ student, darkMode, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {(student.name || '?').charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.name || 'Unknown'}</h2>
              <p className="text-sm text-gray-500">Member since {new Date(student.registeredDate).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{student.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{student.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Performance Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-1">Total Interviews</p>
                <p className="text-3xl font-bold text-blue-500">{student.totalInterviews}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-green-500">{student.avgScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
            View Interview History
          </button>
          <button className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
            Schedule Interview
          </button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ====================
// DETAILED INTERVIEWS VIEW
// ====================
export const DetailedInterviewsView = ({ darkMode, searchTerm }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch('https://jubilant-fortnight-node-backend.onrender.com/admin/interviews');
        if (!res.ok) throw new Error('Failed to fetch interviews');
        const data = await res.json();
        console.log("Inteveiw session detias",data);
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const normalizedSearch = (searchTerm || '').toLowerCase();
  const filteredInterviews = interviews.filter((interview) => {
    const studentName = (interview.studentName || interview.candidateName || '').toLowerCase();
    const jobTitle = (interview.jobTitle || '').toLowerCase();
    return studentName.includes(normalizedSearch) || jobTitle.includes(normalizedSearch);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Interview Sessions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {filteredInterviews.length} sessions
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <PlusCircle className="w-4 h-4 inline mr-2" />
            Schedule Interview
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredInterviews.map((interview) => {
          const displayName = interview.studentName || interview.candidateName || 'Unknown';
          const displayDate = interview.date || interview.scheduledAt || interview.createdAt;
          const displayTime = interview.time || (displayDate ? new Date(displayDate).toLocaleTimeString() : '-');
          const displayDuration = interview.duration ?? interview.durationMinutes ?? 0;
          const displayScore = interview.score ?? interview.overallRating ?? null;
          const statusClass = interview.status === 'completed'
            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            : interview.status === 'scheduled'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
          const typeClass = interview.type === 'practice'
            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';

          return (
            <motion.div
              key={interview.id || interview._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {(displayName || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-gray-500">{interview.jobTitle || '-'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                  {interview.status || '-'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{displayDate ? new Date(displayDate).toLocaleDateString() : '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{displayTime || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Duration</span>
                  <p className="font-medium">{displayDuration ? `${displayDuration} min` : '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Score</span>
                  <p className="font-medium">
                    {displayScore ? `${displayScore}` : '-'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeClass}`}>
                  {interview.type || '-'}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg" title="View Report">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden hidden lg:block`}>
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Job</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInterviews.map((interview) => {
              const displayName = interview.studentName || interview.candidateName || 'Unknown';
              const displayDate = interview.date || interview.scheduledAt || interview.createdAt;
              const displayTime = interview.time || (displayDate ? new Date(displayDate).toLocaleTimeString() : '-');
              const displayDuration = interview.duration ?? interview.durationMinutes ?? 0;
              const displayScore = interview.score ?? interview.overallRating ?? null;
              return (
              <tr key={interview.id || interview._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(displayName || '?').charAt(0)}
                    </div>
                    <span className="font-medium">{displayName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{interview.jobTitle || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{displayDate ? new Date(displayDate).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{displayTime || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {displayDuration ? `${displayDuration} min` : '-'}
                </td>
                <td className="px-6 py-4">
                  {displayScore ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold">
                      <Star className="w-3 h-3" />
                      {displayScore}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    interview.type === 'practice'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {interview.type || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    interview.status === 'completed'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : interview.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {interview.status || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg" title="View Report">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default { DetailedStudentsView, DetailedInterviewsView };
