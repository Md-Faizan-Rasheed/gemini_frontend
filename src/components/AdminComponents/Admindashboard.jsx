import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, FileText, MessageSquare,
  Calendar, CreditCard, Settings, LogOut, Search, Filter,
  Download, Eye, Edit, Trash2, CheckCircle, XCircle,
  TrendingUp, UserCheck, Clock, Award, BarChart3,
  ChevronDown, ChevronRight, RefreshCw, Mail, Phone,
  MapPin, Star, Target, AlertCircle, PlusCircle
} from 'lucide-react';

// Import detailed view components
import { DetailedStudentsView, DetailedInterviewsView } from './Admindetailedviews';

const API_BASE = 'http://localhost:8080/admin';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInterviews: 0,
    pendingReviews: 0,
    successRate: 0,
    activeJobs: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await fetch('http://localhost:8080/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        if (!isMounted) return;

        setStats({
          totalStudents: data.totalStudents ?? 0,
          totalInterviews: data.totalInterviews ?? 0,
          pendingReviews: data.pendingReviews ?? 0,
          successRate: data.successRate ?? 0,
          activeJobs: data.activeJobs ?? 0,
          totalRevenue: data.totalRevenue ?? 0
        });
        setRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : []);
        setTopPerformers(Array.isArray(data.topPerformers) ? data.topPerformers : []);
      } catch (err) {
        if (!isMounted) return;
        setStatsError(err.message || 'Failed to load dashboard stats');
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'students', icon: Users, label: 'Students', badge: stats.totalStudents },
    { id: 'interviews', icon: Calendar, label: 'Interview Sessions', badge: stats.pendingReviews },
    { id: 'reports', icon: FileText, label: 'Interview Reports', badge: null },
    { id: 'feedback', icon: MessageSquare, label: 'Feedbacks', badge: null },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', badge: stats.activeJobs },
    { id: 'payments', icon: CreditCard, label: 'Payments', badge: null },
    { id: 'users', icon: UserCheck, label: 'Admin Users', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden font-sans`}>
      {/* Mobile Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? '80px' : '280px' }}
        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all duration-300 relative z-40 md:z-20 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative inset-y-0 left-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">InterviewAI</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hidden md:inline-flex"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-gray-600 dark:text-gray-400`
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isActive ? 'bg-white/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                    )}
                </motion.button>
              );
            })}
          </nav>

        {/* User Profile */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`min-h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 md:px-6 py-3`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className={`p-2 rounded-lg md:hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0">
            {/* Search */}
            <div className="relative w-full md:w-64 order-1 md:order-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              🔔
            </button>

            {/* Logout */}
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto justify-center md:ml-auto">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                recentActivity={recentActivity}
                topPerformers={topPerformers}
                loading={statsLoading}
                error={statsError}
                darkMode={darkMode}
              />
            )}
            {activeTab === 'students' && <DetailedStudentsView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'interviews' && <DetailedInterviewsView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'reports' && <ReportsView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'feedback' && <FeedbackView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'jobs' && <JobsView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'payments' && <PaymentsView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'users' && <UsersView darkMode={darkMode} searchTerm={searchTerm} />}
            {activeTab === 'settings' && <SettingsView darkMode={darkMode} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Dashboard View
const DashboardView = ({ stats, recentActivity, topPerformers, loading, error, darkMode }) => {
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

  const fallbackActivity = [
    { action: 'New student registered', time: '5 min ago', type: 'success' },
    { action: 'Interview completed', time: '12 min ago', type: 'info' },
    { action: 'Payment received', time: '25 min ago', type: 'success' },
    { action: 'Report generated', time: '1 hour ago', type: 'info' },
    { action: 'Job posted', time: '2 hours ago', type: 'warning' },
  ];

  const fallbackPerformers = [
    { name: 'John Doe', score: 9.5, interviews: 5 },
    { name: 'Jane Smith', score: 9.2, interviews: 7 },
    { name: 'Mike Johnson', score: 8.8, interviews: 4 },
    { name: 'Sarah Williams', score: 8.5, interviews: 6 },
    { name: 'Tom Brown', score: 8.3, interviews: 3 },
  ];

  const activityList = recentActivity?.length ? recentActivity : fallbackActivity;
  const performersList = topPerformers?.length ? topPerformers : fallbackPerformers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents}
          change="+12%"
          color="blue"
          darkMode={darkMode}
        />
        <StatCard
          icon={Calendar}
          label="Total Interviews"
          value={stats.totalInterviews}
          change="+8%"
          color="green"
          darkMode={darkMode}
        />
        <StatCard
          icon={Clock}
          label="Pending Reviews"
          value={stats.pendingReviews}
          change="-3%"
          color="orange"
          darkMode={darkMode}
        />
        <StatCard
          icon={Award}
          label="Success Rate"
          value={`${stats.successRate}%`}
          change="+5%"
          color="purple"
          darkMode={darkMode}
        />
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.activeJobs}
          change="+2"
          color="indigo"
          darkMode={darkMode}
        />
        <StatCard
          icon={CreditCard}
          label="Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          change="+15%"
          color="emerald"
          darkMode={darkMode}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activityList.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h3>
          <div className="space-y-4">
            {performersList.map((student, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.interviews} interviews</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-500">{student.score}</p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color, darkMode }) => {
  const colors = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    orange: 'from-orange-400 to-orange-600',
    purple: 'from-purple-400 to-purple-600',
    indigo: 'from-indigo-400 to-indigo-600',
    emerald: 'from-emerald-400 to-emerald-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
};

// Similar views for other tabs (simplified for brevity)
const ReportsView = ({ darkMode }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE}/reports`);
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Interview Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 text-left">Job Title</th>
                <th className="px-4 py-3 text-left">AI Model</th>
                <th className="px-4 py-3 text-left">Overall Rating</th>
                <th className="px-4 py-3 text-left">Decision</th>
                <th className="px-4 py-3 text-left">Generated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{r.jobTitle || '-'}</td>
                  <td className="px-4 py-3">{r.aiModel || '-'}</td>
                  <td className="px-4 py-3">{r.overallRating ?? '-'}</td>
                  <td className="px-4 py-3">{r.recommendation?.decision || '-'}</td>
                  <td className="px-4 py-3">{r.generatedAt ? new Date(r.generatedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const FeedbackView = ({ darkMode }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_BASE}/feedback`);
        if (!res.ok) throw new Error('Failed to fetch feedback');
        const data = await res.json();
        setFeedback(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Interview Feedbacks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Fairness</th>
                <th className="px-4 py-3 text-left">AI Quality</th>
                <th className="px-4 py-3 text-left">Overall</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {feedback.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{f.studentId || '-'}</td>
                  <td className="px-4 py-3">{f.difficulty ?? '-'}</td>
                  <td className="px-4 py-3">{f.fairness ?? '-'}</td>
                  <td className="px-4 py-3">{f.aiQuality ?? '-'}</td>
                  <td className="px-4 py-3">{f.overallExperience ?? '-'}</td>
                  <td className="px-4 py-3">{f.createdAt ? new Date(f.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const JobsView = ({ darkMode }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Job Listings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Questions</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.map((j) => (
                <tr key={j._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{j.jobTitle || '-'}</td>
                  <td className="px-4 py-3">{j.status || '-'}</td>
                  <td className="px-4 py-3">{Array.isArray(j.questions) ? j.questions.length : '-'}</td>
                  <td className="px-4 py-3">{j.createdAt ? new Date(j.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentsView = ({ darkMode }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE}/payments`);
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Currency</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{p.razorpayOrderId || '-'}</td>
                  <td className="px-4 py-3">{p.razorpayPaymentId || '-'}</td>
                  <td className="px-4 py-3">{p.amount ?? '-'}</td>
                  <td className="px-4 py-3">{p.currency || '-'}</td>
                  <td className="px-4 py-3">{p.status || '-'}</td>
                  <td className="px-4 py-3">{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const UsersView = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Admin Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Field</th>
                <th className="px-4 py-3 text-left">Employees</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{u.company_name || '-'}</td>
                  <td className="px-4 py-3">{u.email || '-'}</td>
                  <td className="px-4 py-3">{u.field_of_work || '-'}</td>
                  <td className="px-4 py-3">{u.emp_size ?? '-'}</td>
                  <td className="px-4 py-3">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsView = ({ darkMode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
    <h3 className="text-xl font-bold mb-4">Settings</h3>
    <p className="text-gray-500">Configure system settings and preferences...</p>
  </motion.div>
);

export default AdminDashboard;

