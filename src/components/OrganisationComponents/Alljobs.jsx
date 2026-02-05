import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, ExternalLink, Copy, Trash2, Plus, Search, Filter, Calendar, CheckCircle, Clock, Eye, MoreVertical, X } from 'lucide-react';
import Onavbar from './Onavbar';
import { useToast } from '../Context/ToastContext';

const Alljobs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const { showToast } = useToast();

    const fetchUserId = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/jobs/api/user-id', {
                method: 'POST',
                headers: {
                    'authorization': `${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format: Not JSON');
            }

            const data = await response.json();
            return data.userId;
        } catch (error) {
            console.error('Error fetching user ID:', error.message);
            return null;
        }
    };

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No authentication token found");
                return [];
            }

            const response = await fetch("http://localhost:8080/jobs/api/all-jobs", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch jobs: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadUserAndJobs = async () => {
            const fetchedUserId = await fetchUserId();

            if (!fetchedUserId) {
                setLoading(false);
                return;
            }
            setUserId(fetchedUserId);

            const allJobs = await fetchJobs();
            if (allJobs.length > 0) {
                const userJobs = allJobs.filter((job) => job.userId === fetchedUserId);
                setJobs(userJobs);
            }
            setLoading(false);
        };

        loadUserAndJobs();
    }, []);

    const handleCopy = async (url) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                showToast('Link copied to clipboard!', 'success');
                setActiveMenuId(null);
            })
            .catch((err) => console.error('Failed to copy the text: ', err));
    };

    const handleJobClick = (_id) => {
        navigate(`/jobs/${_id}?companyId=${userId}`);
        setActiveMenuId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                showToast('You need to be logged in to delete a job.', 'warning');
                return;
            }

            const response = await fetch(`http://localhost:8080/jobs/api/delete-job/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete job: ${response.statusText}`);
            }

            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
            showToast('Job deleted successfully!', 'success');
            setActiveMenuId(null);
        } catch (error) {
            console.error('Failed to delete job:', error);
            showToast('Error deleting job. Please try again.', 'error');
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        total: jobs.length,
        published: jobs.filter(j => j.status === 'Published').length,
        draft: jobs.filter(j => j.status !== 'Published').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="text-center px-4">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
                        <div className="relative w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 text-base font-medium">Loading your jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Onavbar />
            
            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    
                    {/* Header Section */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                                    My Jobs
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Manage and track all your job postings
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/jobpost')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-lime-500 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 font-semibold text-sm sm:text-base"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Post New Job</span>
                            </button>
                        </div>

                        {/* Stats Cards - Mobile Optimized */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-2 lg:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-lime-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                    </div>
                                    <div className="lg:flex-1">
                                        <p className="text-gray-600 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">Total</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{statusCounts.total}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-2 lg:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-lime-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                    </div>
                                    <div className="lg:flex-1">
                                        <p className="text-gray-600 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">Published</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{statusCounts.published}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-2 lg:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                                    </div>
                                    <div className="lg:flex-1">
                                        <p className="text-gray-600 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">Draft</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{statusCounts.draft}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section - Mobile Optimized */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by job title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Buttons - Mobile Friendly */}
                            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                        filterStatus === 'all'
                                            ? 'bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Jobs
                                </button>
                                <button
                                    onClick={() => setFilterStatus('published')}
                                    className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                        filterStatus === 'published'
                                            ? 'bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Published
                                </button>
                                <button
                                    onClick={() => setFilterStatus('draft')}
                                    className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                        filterStatus === 'draft'
                                            ? 'bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Draft
                                </button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchTerm || filterStatus !== 'all') && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <span className="text-xs sm:text-sm text-gray-600 font-medium">Active filters:</span>
                                <div className="flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                                            Search: "{searchTerm}"
                                            <button onClick={() => setSearchTerm('')} className="hover:bg-green-100 rounded-full p-0.5 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {filterStatus !== 'all' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                                            Status: {filterStatus}
                                            <button onClick={() => setFilterStatus('all')} className="hover:bg-green-100 rounded-full p-0.5 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Jobs List - Mobile First Cards */}
                    <div className="space-y-3 sm:space-y-4">
                        {filteredJobs.map((job) => (
                            <div 
                                key={job._id} 
                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-4 sm:p-5 lg:p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <button
                                                onClick={() => handleJobClick(job._id)}
                                                className="text-left w-full group"
                                            >
                                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate mb-1.5">
                                                    {job.jobTitle}
                                                </h3>
                                            </button>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                                <span>
                                                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                            job.status === 'Published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {job.status === 'Published' ? (
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            ) : (
                                                <Clock className="w-3.5 h-3.5" />
                                            )}
                                            <span className="hidden sm:inline">{job.status}</span>
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleJobClick(job._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View</span>
                                        </button>
                                        
                                        <a
                                            href={`/jobs/${job._id}?companyId=${userId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </a>
                                        
                                        <button
                                            onClick={() => handleCopy(`${window.location.origin}/jobs/${job._id}?companyId=${userId}`)}
                                            className="flex items-center justify-center p-2.5 text-purple-600 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 rounded-lg transition-colors"
                                            title="Copy link"
                                        >
                                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors"
                                            title="Delete job"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredJobs.length === 0 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-lime-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                    No jobs found
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                    {searchTerm || filterStatus !== 'all' 
                                        ? 'Try adjusting your filters or search term to find what you\'re looking for'
                                        : 'Get started by posting your first job listing and reach talented candidates'}
                                </p>
                                {!searchTerm && filterStatus === 'all' && (
                                    <button 
                                        onClick={() => navigate('/jobpost')}
                                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-lime-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 font-semibold text-sm sm:text-base"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Post Your First Job</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    {filteredJobs.length > 0 && (
                        <div className="mt-6 text-center">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> of <span className="font-semibold text-gray-900">{jobs.length}</span> jobs
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Alljobs;