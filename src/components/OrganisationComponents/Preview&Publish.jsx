// import { useEffect, useState } from 'react';
// import Onavbar from './Onavbar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PreviewAndPublish = () => {
//   const [loggedInUser, setLoggedInUser] = useState('');
//   const [jobPostData, setJobPostData] = useState(null);
//   const [formattedQuestionsData, setFormattedQuestionsData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const dataforAi = location.state?.jobData;
//   const dataforquestion = location.state?.formattedQuestions || []; // Default to empty array
//   const { formattedQuestions } = location.state || {};

//   // const parsedData = dataforAi ? JSON.parse(dataforAi) : {};
//   const parsedData = dataforAi || {};

//   useEffect(() => {
//     const user = localStorage.getItem('loggedInUser');
//     console.log('Logged in user:', user);

//     if (user) {
//       setLoggedInUser(user);
//     }
//   }, []);

//   console.log('Data on Preview and Publish:', parsedData);

//   const handlenavigateAi = () => {
//     navigate('/Aiquestion', {
//       state: {dataforAi, formattedQuestions },
//     });
//   };

//   const handlenavigateJobinfo=()=>{
//     navigate('/jobpost', {
//       state: {dataforAi}
//     });
//   }
//   const fetchUserId = async () => {
//     const token = localStorage.getItem('token');
//     console.log('Token:', token);

//     try {
//       const response = await fetch('https://jubilant-fortnight-node-backend.onrender.com/jobs/api/user-id', {

//         method: 'POST',
//         headers: {
//           authorization: `${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify({ token }), // Send token in request body
//       });

//       console.log('Response Status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Error: ${response.status} - ${errorText}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error('Invalid response format: Not JSON');
//       }

//       const data = await response.json();
//       console.log('User Data:', data);

//       console.log('User ID:', data.userId);
//       return data.userId;
//     } catch (error) {
//       console.error('Error fetching user ID:', error.message);
//       return null;
//     }
//   };

//   const questionsArray = dataforquestion.map(({ question }) => ({
//     questionText: question,
//   }));
//   console.log('Questions Array:', questionsArray);

//   const handleSubmit = async (status) => {
//     setLoading(true);
//     const userId = await fetchUserId();
//     if (!userId) {
//       console.error('User ID not found, cannot proceed.');
//       return;
//     }

//     const jobData = {
//       jobTitle: parsedData.jobTitle,
//       status,
//       plainTextJobDescription: parsedData.jobDescription,
//       questions: questionsArray,
//       createdAt: new Date().toISOString(),
//       userId,
//     };

//     console.log('Job Data:', jobData);

//     try {
//       const response = await fetch('https://jubilant-fortnight-node-backend.onrender.com/jobs/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(jobData),
//       });

//       const result = await response.json();
//       console.log('Server Response:', result);
//       if (!response.ok) {
//   if (response.status === 403) {
//     toast.error("Job limit reached. Upgrade your plan.");
//     navigate("/PricingPage");
//   } else {
//     toast.error(result.message || "Something went wrong");
//   }
//   setLoading(false);

//  } else {
//         localStorage.removeItem("aiQuestions");
//         localStorage.removeItem("jobPostData");
//         toast.success("Job successfully created!");
//         navigate('/alljobs');
//       }
//     } catch (error) {
//       console.error('Request failed:', error);
//       toast.error('An error occurred. Please try again.');
//       setLoading(false);

//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-100">
//       {/* Navbar */}
//       <Onavbar />

//       {/* Main Content */}
//       <div className="flex-grow min-h-screen bg-gray-50 p-6">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//         <div className="max-w-6xl mx-auto">
//           {/* Header Section */}
//           <div className="text-center mb-8">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               Interview Questions ✨
//             </h1>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-6">
//             {/* Left Section: Interview Questions */}
//             <div className="col-span-2">
//               <div className="bg-white shadow-md rounded-lg p-6">
//                 <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
//                   Interview Questions
//                 </h2>
//                 <ul>
//                   {dataforquestion.map((item, index) => (
//                     <li key={item.id} className="border-b py-3 space-y-1 md:space-y-0">
//                       <span
//                         className={`${
//                           item.category === 'CultureFit'
//                             ? 'text-blue-600'
//                             : item.category === 'SoftSkills'
//                             ? 'text-purple-600'
//                             : item.category === 'TechnicalSkills'
//                             ? 'text-green-600'
//                             : item.category === 'XFactor'
//                             ? 'text-yellow-600'
//                             : 'text-gray-600'
//                         } font-medium`}
//                       >
//                         {item.category}
//                       </span>
//                       <p className="mt-1 text-gray-600">{item.question}</p>
//                     </li>
//                   ))}
//                 </ul>

//                 <div
//                   onClick={handlenavigateAi}
//                   className="mt-4 font-bold cursor-pointer border-black p-2 w-full flex justify-center align-middle border-dotted border-2"
//                 >
//                   🖉 Edit AI Questions
//                 </div>
//               </div>
//             </div>

//             {/* Right Section: Job Information */}
//             <div className="lg:col-span-1 bg-white shadow-md rounded-lg border border-gray-200 p-6 space-y-4">
//               {/* Header with logo and title */}
//               <div className="flex items-center space-x-4">
//                 <img
//                   src="https://via.placeholder.com/50"
//                   alt="Company Logo"
//                   className="h-12 w-12 rounded-full"
//                 />
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {parsedData.jobTitle || 'Job Title'}
//                   </h3>
//                   <p className="text-sm text-gray-500">{loggedInUser}</p>
//                 </div>
//               </div>

//               {/* Job Information */}
//               <div className="space-y-3">
//                 <h4 className="text-md font-medium text-gray-700">Job Information</h4>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Job Title:</span> {parsedData.jobTitle}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Job Organization:</span> {loggedInUser}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Job Category:</span> {parsedData.category}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Job SubCategory:</span> {parsedData.subcategory}
//                 </p>
//               </div>

//               {/* Job Description */}
//               <div className="space-y-3">
//                 <h4 className="text-md font-medium text-gray-700">Job Description</h4>
//                 <p className="text-sm text-gray-600">
//                   <div
//                     dangerouslySetInnerHTML={{
//                       __html: parsedData.jobDescription
//                         ? parsedData.jobDescription.split(/\s+/).slice(0, 30).join(' ') + '...'
//                         : 'No job description available.',
//                     }}
//                   ></div>
//                 </p>
//               </div>

//               {/* Additional Details */}
//               <div className="space-y-3">
//                 <h4 className="text-md font-medium text-gray-700">Additional Details</h4>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Job Type:</span>{' '}
//                   {parsedData.selectedJobTypes?.join(', ') || 'N/A'}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Experience Level:</span>{' '}
//                   {parsedData.selectedExperienceLevel}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Schedule:</span>{' '}
//                   {parsedData.selectedSchedules?.join(', ') || 'N/A'}
//                 </p>
//               </div>

//               {/* Compensation */}
//               <div className="space-y-3">
//                 <h4 className="text-md font-medium text-gray-700">Compensation</h4>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Display Compensation:</span>{' '}
//                   {parsedData.showCompensation ? 'Yes' : 'No'}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Pay:</span> {parsedData.payRange?.min || 'N/A'} -{' '}
//                   {parsedData.payRange?.max || 'N/A'}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Benefits:</span>{' '}
//                   {parsedData.benefits?.join(', ') || 'N/A'}
//                 </p>
//               </div>
//               <div className="mt-4 font-bold cursor-pointer border-black p-2 w-full flex justify-center align-middle border-dotted border-2"
//                onClick={handlenavigateJobinfo}
//               >
//                 🖉 Edit Job Information
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Section */}
//         <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
//           <button className="invisible">Hidden Element</button>
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//             <div className="flex gap-2">
//               <button
//                   disabled={loading}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//                 onClick={() => handleSubmit('Drafted')}
//               >
//               {loading ? "Saving..." : "Save Job"}
//               </button>
//               <button
//                 disabled={loading}
//                 className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
//                 onClick={() => handleSubmit('Published')}
//               >
//              {loading ? "Publishing..." : "Publish Job"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreviewAndPublish;


import { useEffect, useState } from 'react';
import Onavbar from './Onavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Eye,
  Edit3,
  Save,
  Send,
  ArrowLeft,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  MapPin,
  Award,
  Zap
} from 'lucide-react';

const PreviewAndPublish = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [jobPostData, setJobPostData] = useState(null);
  const [formattedQuestionsData, setFormattedQuestionsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dataforAi = location.state?.jobData;
  const dataforquestion = location.state?.formattedQuestions || [];
  const { formattedQuestions } = location.state || {};

  const parsedData = dataforAi || {};

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    console.log('Logged in user:', user);

    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  console.log('Data on Preview and Publish:', parsedData);

  const handlenavigateAi = () => {
    navigate('/Aiquestion', {
      state: { dataforAi, formattedQuestions },
    });
  };

  const handlenavigateJobinfo = () => {
    navigate('/jobpost', {
      state: { dataforAi }
    });
  };

  const fetchUserId = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    try {
      const response = await fetch('https://jubilant-fortnight-node-backend.onrender.com/jobs/api/user-id', {
        method: 'POST',
        headers: {
          authorization: `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      console.log('Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format: Not JSON');
      }

      const data = await response.json();
      console.log('User Data:', data);

      console.log('User ID:', data.userId);
      return data.userId;
    } catch (error) {
      console.error('Error fetching user ID:', error.message);
      return null;
    }
  };

  const questionsArray = dataforquestion.map(({ question }) => ({
    questionText: question,
  }));
  console.log('Questions Array:', questionsArray);

  const handleSubmit = async (status) => {
    setLoading(true);
    const userId = await fetchUserId();
    if (!userId) {
      console.error('User ID not found, cannot proceed.');
      toast.error('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    const jobData = {
      jobTitle: parsedData.jobTitle,
      status,
      plainTextJobDescription: parsedData.jobDescription,
      questions: questionsArray,
      createdAt: new Date().toISOString(),
      userId,
    };

    console.log('Job Data:', jobData);

    try {
      const response = await fetch('https://jubilant-fortnight-node-backend.onrender.com/jobs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();
      console.log('Server Response:', result);
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Job limit reached. Upgrade your plan.");
          setTimeout(() => navigate("/PricingPage"), 2000);
        } else {
          toast.error(result.message || "Something went wrong");
        }
        setLoading(false);
      } else {
        localStorage.removeItem("aiQuestions");
        localStorage.removeItem("jobPostData");
        toast.success("Job successfully created!");
        setTimeout(() => navigate('/alljobs'), 1500);
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const categoryConfig = {
    Culture: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "🌱"
    },
    CultureFit: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "🌱"
    },
    Technical: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "⚡"
    },
    TechnicalSkills: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "⚡"
    },
    Leadership: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
      icon: "👑"
    },
    SoftSkills: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: "💡"
    },
    XFactor: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: "✨"
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Sidebar Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <Onavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          
          {/* Mobile Header with Back Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-lime-50 border border-green-100 rounded-full mb-3 sm:mb-4">
              <Eye className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
                Preview & Publish
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight leading-tight">
              Review Your Job Post
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Review your job details and interview questions before publishing
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 mb-6">
            
            {/* Left Section: Interview Questions */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">
              
              {/* Questions Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                        Interview Questions
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        {dataforquestion.length} questions ready
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3 sm:space-y-4 mb-6">
                  {dataforquestion.length > 0 ? (
                    dataforquestion.map((item, index) => {
                      const config = categoryConfig[item.category] || categoryConfig.Culture;
                      
                      return (
                        <div 
                          key={item.id} 
                          className="group bg-gradient-to-br from-gray-50/50 to-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 hover:border-green-200 hover:shadow-md hover:shadow-green-500/5 transition-all duration-300"
                        >
                          <div className="flex gap-3 sm:gap-4">
                            {/* Question Number */}
                            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm shadow-sm">
                              {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Category Badge */}
                              <div className="mb-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.bg} ${config.text} ${config.border} border rounded-lg text-xs sm:text-sm font-semibold`}>
                                  <span>{config.icon}</span>
                                  <span>{item.category}</span>
                                </span>
                              </div>

                              {/* Question Text */}
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                {item.question}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">No questions added yet</p>
                    </div>
                  )}
                </div>

                {/* Edit Questions Button */}
                <button
                  onClick={handlenavigateAi}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50/50 transition-all group text-sm sm:text-base font-semibold text-gray-700 hover:text-green-700"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span>Edit Interview Questions</span>
                </button>
              </div>
            </div>

            {/* Right Section: Job Information */}
            <div className="lg:col-span-1 space-y-5 sm:space-y-6">
              
              {/* Job Info Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
                
                {/* Company Header */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-100 to-lime-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
                      {parsedData.jobTitle || 'Job Title'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {loggedInUser || 'Company Name'}
                    </p>
                  </div>
                </div>

                {/* Job Details Sections */}
                <div className="space-y-5 sm:space-y-6">
                  
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-green-600" strokeWidth={2} />
                      <span>Job Information</span>
                    </h4>
                    <div className="space-y-2.5">
                      <InfoRow icon={<Award className="w-4 h-4" />} label="Title" value={parsedData.jobTitle} />
                      <InfoRow icon={<Building2 className="w-4 h-4" />} label="Organization" value={loggedInUser} />
                      <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Category" value={parsedData.category} />
                      <InfoRow icon={<ChevronRight className="w-4 h-4" />} label="SubCategory" value={parsedData.subcategory} />
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" strokeWidth={2} />
                      <span>Description</span>
                    </h4>
                    <div className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parsedData.jobDescription
                            ? parsedData.jobDescription.split(/\s+/).slice(0, 30).join(' ') + '...'
                            : 'No job description available.',
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" strokeWidth={2} />
                      <span>Details</span>
                    </h4>
                    <div className="space-y-2.5">
                      <InfoRow 
                        icon={<Briefcase className="w-4 h-4" />} 
                        label="Type" 
                        value={parsedData.selectedJobTypes?.join(', ') || 'N/A'} 
                      />
                      <InfoRow 
                        icon={<Award className="w-4 h-4" />} 
                        label="Experience" 
                        value={parsedData.selectedExperienceLevel} 
                      />
                      <InfoRow 
                        icon={<Clock className="w-4 h-4" />} 
                        label="Schedule" 
                        value={parsedData.selectedSchedules?.join(', ') || 'N/A'} 
                      />
                    </div>
                  </div>

                  {/* Compensation */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" strokeWidth={2} />
                      <span>Compensation</span>
                    </h4>
                    <div className="space-y-2.5">
                      <InfoRow 
                        icon={<CheckCircle2 className="w-4 h-4" />} 
                        label="Display" 
                        value={parsedData.showCompensation ? 'Yes' : 'No'} 
                      />
                      <InfoRow 
                        icon={<DollarSign className="w-4 h-4" />} 
                        label="Pay Range" 
                        value={`${parsedData.payRange?.min || 'N/A'} - ${parsedData.payRange?.max || 'N/A'}`} 
                      />
                      <InfoRow 
                        icon={<Zap className="w-4 h-4" />} 
                        label="Benefits" 
                        value={parsedData.benefits?.join(', ') || 'N/A'} 
                      />
                    </div>
                  </div>
                </div>

                {/* Edit Job Info Button */}
                <button
                  onClick={handlenavigateJobinfo}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50/50 transition-all group text-sm sm:text-base font-semibold text-gray-700 hover:text-green-700"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span>Edit Job Information</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons - Mobile Fixed Bottom */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('Drafted')}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" strokeWidth={2.5} />
                    <span>Save Draft</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleSubmit('Published')}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex flex-row justify-end gap-4 pb-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              Back
            </button>
            <button
              onClick={() => handleSubmit('Drafted')}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Draft...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" strokeWidth={2.5} />
                  <span>Save as Draft</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleSubmit('Published')}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing Job...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" strokeWidth={2.5} />
                  <span>Publish Job</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Bottom Padding */}
          <div className="lg:hidden h-20"></div>
        </div>
      </div>
    </div>
  );
};

// Helper component for info rows
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-xs sm:text-sm">
    <div className="flex-shrink-0 mt-0.5 text-gray-400">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <span className="font-medium text-gray-700">{label}:</span>{' '}
      <span className="text-gray-600 break-words">{value || 'N/A'}</span>
    </div>
  </div>
);

export default PreviewAndPublish;