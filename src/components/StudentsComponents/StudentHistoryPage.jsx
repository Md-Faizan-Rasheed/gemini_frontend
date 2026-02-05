// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   ArrowLeft,
//   FileText,
//   LogOut,
//   Star,
//   X,
// } from "lucide-react";
// import { useToast } from "../Context/ToastContext.jsx";

// const formatHistoryDate = (value) => {
//   if (!value) return "Unknown date";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "Unknown date";
//   return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
// };

// const getReportRating = (item) => {
//   return (
//     item?.overallRating ??
//     item?.overall_Rating ??
//     item?.structuredReport?.overallRating ??
//     null
//   );
// };

// const getReportText = (item) => {
//   return (
//     item?.rawReportText ||
//     item?.reportText ||
//     item?.report ||
//     item?.aiContent ||
//     ""
//   );
// };

// export default function StudentHistoryPage() {
//   const [loading, setLoading] = useState(false);
//   const [historyError, setHistoryError] = useState(null);
//   const [interviewHistory, setInterviewHistory] = useState([]);
//   const [studentProfileSkills, setStudentProfileSkills] = useState([]);
//   const [activeReport, setActiveReport] = useState(null);

//   const navigate = useNavigate();
//   const { studentId } = useParams();
//   const { showToast } = useToast();

//   const api = axios.create({
//     baseURL: "https://jubilant-fortnight-node-backend.onrender.com/students",
//     withCredentials: true,
//   });

//   // Auth check
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/check-auth", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!res.data.success) {
//           navigate("/StudentSignin");
//         }
//       } catch {
//         navigate("/StudentSignin");
//       }
//     };
//     checkAuth();
//   }, [navigate]);

//   useEffect(() => {
//     if (!studentId) return;

//     const fetchHistory = async () => {
//       setLoading(true);
//       setHistoryError(null);
//       try {
//         const skillsRes = await fetch(
//           `https://jubilant-fortnight-node-backend.onrender.com/students/student-skill/${studentId}`,
//           { method: "GET" }
//         );
//         const skillsJson = await skillsRes.json();
//         setStudentProfileSkills(skillsJson?.student?.skills || []);

//         const reportsRes = await fetch(
//           `https://jubilant-fortnight-node-backend.onrender.com/students/student-report/${studentId}`,
//           {
//             headers: {
//               authorization: localStorage.getItem("token"),
//             },
//           }
//         );
//         const reportsJson = await reportsRes.json();
//         if (reportsJson?.success) {
//           setInterviewHistory(Array.isArray(reportsJson.data) ? reportsJson.data : []);
//         } else {
//           setInterviewHistory([]);
//         }
//       } catch (err) {
//         console.error("History fetch error:", err);
//         setHistoryError("Unable to load interview history right now.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [studentId]);

//   const handleLogout = async () => {
//     try {
//       await api.post("/logout");
//       localStorage.removeItem("studentId");
//       localStorage.removeItem("token");
//       localStorage.removeItem("interviewDraft");
//       navigate("/StudentSignin");
//     } catch {
//       showToast("Logout failed", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
//       <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3 min-w-0">
//             <button
//               onClick={() => navigate(`/StudentHomePage/${studentId}`)}
//               className="p-2 rounded-lg hover:bg-gray-100 transition"
//               title="Back"
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-700" />
//             </button>
//             <div className="min-w-0">
//               <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
//                 Student History
//               </h1>
//               <p className="text-xs sm:text-sm text-gray-500 truncate">
//                 Reports, scores, and interview insights
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 transition"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
//         <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Star className="w-5 h-5 text-blue-600" />
//             <h2 className="text-sm sm:text-base font-semibold text-gray-900">Your Skills</h2>
//           </div>
//           {studentProfileSkills.length === 0 ? (
//             <p className="text-xs sm:text-sm text-gray-500">
//               No skills found yet. Start an interview to add your skills.
//             </p>
//           ) : (
//             <div className="flex flex-wrap gap-2">
//               {studentProfileSkills.map((skill, idx) => (
//                 <span
//                   key={`${skill.skill}-${idx}`}
//                   className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
//                 >
//                   {skill.skill} · {skill.level}
//                 </span>
//               ))}
//             </div>
//           )}
//         </section>

//         <section className="space-y-3">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm sm:text-base font-semibold text-gray-900">Interview Reports</h2>
//             <button
//               onClick={() => navigate(`/StudentHomePage/${studentId}`)}
//               className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
//             >
//               Continue Interview
//             </button>
//           </div>

//           {loading && (
//             <div className="bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-600 flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//               Loading history...
//             </div>
//           )}
//           {historyError && (
//             <div className="bg-white rounded-xl border border-red-100 p-4 text-xs sm:text-sm text-red-600">
//               {historyError}
//             </div>
//           )}
//           {!loading && !historyError && interviewHistory.length === 0 && (
//             <div className="bg-white rounded-xl border border-gray-100 p-4 text-xs sm:text-sm text-gray-500">
//               No interview reports found yet.
//             </div>
//           )}

//           {!loading && !historyError && interviewHistory.length > 0 && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {interviewHistory.map((item, idx) => {
//                 const reportId = item?._id || `report-${idx}`;
//                 const rating = getReportRating(item);
//                 const scores = item?.scores || item?.structuredReport?.scores || {};
//                 const strengths = item?.strengths || item?.structuredReport?.strengths || [];
//                 const weaknesses = item?.weaknesses || item?.structuredReport?.weaknesses || [];
//                 return (
//                   <div
//                     key={reportId}
//                     className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm flex flex-col gap-3"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {item?.jobTitle || item?.job_name || "Interview Report"}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {formatHistoryDate(item?.createdAt || item?.created_date || item?.date)}
//                         </p>
//                       </div>
//                       {rating !== null && (
//                         <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
//                           {rating}/10
//                         </span>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700">
//                       <div className="bg-gray-50 rounded-lg p-2 text-center">
//                         <p className="font-semibold">Technical</p>
//                         <p>{scores.technical ?? "—"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-2 text-center">
//                         <p className="font-semibold">Communication</p>
//                         <p>{scores.communication ?? "—"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-2 text-center">
//                         <p className="font-semibold">Problem</p>
//                         <p>{scores.problemSolving ?? "—"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-2 text-center">
//                         <p className="font-semibold">Confidence</p>
//                         <p>{scores.confidence ?? "—"}</p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
//                       <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
//                         <p className="font-semibold text-emerald-700">Strengths</p>
//                         {strengths.length > 0 ? (
//                           <ul className="mt-1 text-emerald-700">
//                             {strengths.slice(0, 3).map((s, i) => (
//                               <li key={`${reportId}-s-${i}`}>• {s}</li>
//                             ))}
//                           </ul>
//                         ) : (
//                           <p className="text-emerald-700 mt-1">No strengths listed</p>
//                         )}
//                       </div>
//                       <div className="bg-rose-50 border border-rose-100 rounded-lg p-2">
//                         <p className="font-semibold text-rose-700">Weaknesses</p>
//                         {weaknesses.length > 0 ? (
//                           <ul className="mt-1 text-rose-700">
//                             {weaknesses.slice(0, 3).map((w, i) => (
//                               <li key={`${reportId}-w-${i}`}>• {w}</li>
//                             ))}
//                           </ul>
//                         ) : (
//                           <p className="text-rose-700 mt-1">No weaknesses listed</p>
//                         )}
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => setActiveReport(item)}
//                       className="mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
//                     >
//                       <FileText className="w-4 h-4" />
//                       Show Report
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </main>

//       <AnimatePresence>
//         {activeReport && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setActiveReport(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.96, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.96, opacity: 0 }}
//               transition={{ type: "spring", damping: 20 }}
//               className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900">
//                     {activeReport?.jobTitle || activeReport?.job_name || "Interview Report"}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {formatHistoryDate(activeReport?.createdAt || activeReport?.created_date || activeReport?.date)}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setActiveReport(null)}
//                   className="p-2 rounded-lg hover:bg-gray-100 transition"
//                 >
//                   <X className="w-4 h-4 text-gray-600" />
//                 </button>
//               </div>
//               <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
//                 <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700">
//                   {getReportText(activeReport) || "No report text available."}
//                 </pre>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  LogOut,
  Star,
  X,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../Context/ToastContext.jsx";

const formatHistoryDate = (value) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getReportRating = (item) => {
  return (
    item?.overallRating ??
    item?.overall_Rating ??
    item?.structuredReport?.overallRating ??
    null
  );
};

const getReportText = (item) => {
  return (
    item?.rawReportText ||
    item?.reportText ||
    item?.report ||
    item?.aiContent ||
    ""
  );
};

export default function StudentHistoryPage() {
  const [loading, setLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [studentProfileSkills, setStudentProfileSkills] = useState([]);
  const [activeReport, setActiveReport] = useState(null);

  const navigate = useNavigate();
  const { studentId } = useParams();
  const { showToast } = useToast();

  const api = axios.create({
    baseURL: "https://jubilant-fortnight-node-backend.onrender.com/students",
    withCredentials: true,
  });

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check-auth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.data.success) {
          navigate("/StudentSignin");
        }
      } catch {
        navigate("/StudentSignin");
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!studentId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setHistoryError(null);
      try {
        const skillsRes = await fetch(
          `https://jubilant-fortnight-node-backend.onrender.com/students/student-skill/${studentId}`,
          { method: "GET" }
        );
        const skillsJson = await skillsRes.json();
        setStudentProfileSkills(skillsJson?.student?.skills || []);

        const reportsRes = await fetch(
          `https://jubilant-fortnight-node-backend.onrender.com/students/student-report/${studentId}`,
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
        const reportsJson = await reportsRes.json();
        if (reportsJson?.success) {
          setInterviewHistory(Array.isArray(reportsJson.data) ? reportsJson.data : []);
        } else {
          setInterviewHistory([]);
        }
      } catch (err) {
        console.error("History fetch error:", err);
        setHistoryError("Unable to load interview history right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [studentId]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("studentId");
      localStorage.removeItem("token");
      localStorage.removeItem("interviewDraft");
      navigate("/StudentSignin");
    } catch {
      showToast("Logout failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate(`/StudentHomePage/${studentId}`)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 shrink-0"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  My History
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Track your interview progress
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors duration-200 shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Your Skills</h2>
                  <p className="text-xs sm:text-sm text-blue-100">
                    {studentProfileSkills.length} skill{studentProfileSkills.length !== 1 ? 's' : ''} acquired
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {studentProfileSkills.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No skills added yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Complete interviews to build your skill profile
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {studentProfileSkills.map((skill, idx) => (
                    <motion.span
                      key={`${skill.skill}-${idx}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-medium hover:shadow-md transition-shadow duration-200"
                    >
                      <span className="font-semibold">{skill.skill}</span>
                      <span className="text-blue-500">•</span>
                      <span className="text-blue-600">{skill.level}</span>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Interview Reports Section */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Interview Reports
                </h2>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {interviewHistory.length} report{interviewHistory.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/StudentHomePage/${studentId}`)}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>New Interview</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 text-center"
            >
              <div className="inline-flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600 font-medium">Loading your history...</span>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {historyError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6"
            >
              <p className="text-sm text-red-700 font-medium">{historyError}</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !historyError && interviewHistory.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-8 sm:p-12 text-center"
            >
              <div className="max-w-sm mx-auto">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Reports Yet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Complete your first interview to see your performance reports here
                </p>
                <button
                  onClick={() => navigate(`/StudentHomePage/${studentId}`)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start First Interview
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Reports Grid */}
          {!loading && !historyError && interviewHistory.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {interviewHistory.map((item, idx) => {
                const reportId = item?._id || `report-${idx}`;
                const rating = getReportRating(item);
                const scores = item?.scores || item?.structuredReport?.scores || {};
                const strengths = item?.strengths || item?.structuredReport?.strengths || [];
                const weaknesses = item?.weaknesses || item?.structuredReport?.weaknesses || [];
                
                return (
                  <motion.div
                    key={reportId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                            <p className="text-xs text-gray-500">
                              {formatHistoryDate(item?.createdAt || item?.created_date || item?.date)}
                            </p>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                            {item?.jobTitle || item?.job_name || "Interview Report"}
                          </h3>
                        </div>
                        {rating !== null && (
                          <div className="shrink-0">
                            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-md">
                              <span className="text-sm sm:text-base font-bold text-white">
                                {rating}/10
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scores Grid */}
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {[
                          { label: "Technical", value: scores.technical, color: "blue" },
                          { label: "Communication", value: scores.communication, color: "purple" },
                          { label: "Problem Solving", value: scores.problemSolving, color: "orange" },
                          { label: "Confidence", value: scores.confidence, color: "green" },
                        ].map((score, i) => (
                          <div
                            key={i}
                            className={`bg-${score.color}-50 border border-${score.color}-100 rounded-xl p-3 text-center transition-transform duration-200 hover:scale-105`}
                          >
                            <p className={`text-xs font-semibold text-${score.color}-700 mb-1`}>
                              {score.label}
                            </p>
                            <p className={`text-lg sm:text-xl font-bold text-${score.color}-600`}>
                              {score.value ?? "—"}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Strengths */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                              Strengths
                            </p>
                          </div>
                          {strengths.length > 0 ? (
                            <ul className="space-y-1">
                              {strengths.slice(0, 3).map((s, i) => (
                                <li
                                  key={`${reportId}-s-${i}`}
                                  className="text-xs text-emerald-700 flex items-start gap-1.5"
                                >
                                  <span className="text-emerald-500 mt-0.5">•</span>
                                  <span className="flex-1">{s}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-emerald-600 italic">No strengths listed</p>
                          )}
                        </div>

                        {/* Weaknesses */}
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <p className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                              Areas to Improve
                            </p>
                          </div>
                          {weaknesses.length > 0 ? (
                            <ul className="space-y-1">
                              {weaknesses.slice(0, 3).map((w, i) => (
                                <li
                                  key={`${reportId}-w-${i}`}
                                  className="text-xs text-rose-700 flex items-start gap-1.5"
                                >
                                  <span className="text-rose-500 mt-0.5">•</span>
                                  <span className="flex-1">{w}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-rose-600 italic">No weaknesses listed</p>
                          )}
                        </div>
                      </div>

                      {/* View Report Button */}
                      <button
                        onClick={() => setActiveReport(item)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-[1.02]"
                      >
                        <FileText className="w-4 h-4" />
                        View Full Report
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Report Modal */}
      <AnimatePresence>
        {activeReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setActiveReport(null)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full sm:max-w-4xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 sm:py-5 border-b border-blue-700 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                      <p className="text-xs sm:text-sm text-blue-100">
                        {formatHistoryDate(activeReport?.createdAt || activeReport?.created_date || activeReport?.date)}
                      </p>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                      {activeReport?.jobTitle || activeReport?.job_name || "Interview Report"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveReport(null)}
                    className="p-2 rounded-xl hover:bg-white/20 transition-colors duration-200 shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="prose prose-sm sm:prose max-w-none">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 font-sans leading-relaxed bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    {getReportText(activeReport) || "No report text available."}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 shrink-0">
                <button
                  onClick={() => setActiveReport(null)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}