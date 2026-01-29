// import React, { useEffect, useState } from 'react';
// import Onavbar from './Onavbar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Sparkles, Loader2, Trash2, Plus, Save, Edit3, MessageSquare, ChevronDown, ArrowRight, Check, Zap } from 'lucide-react';
// import { AI_PROMPT } from './constants/options';
// import { chatSession } from "./service/ai/chatSession.js";

// const Aiquestion = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [newQuestion, setNewQuestion] = useState({
//     category: "Culture",
//     question: "",
//   });

//   const loadJobPostData = () => {
//     const savedData = localStorage.getItem('jobPostData');
//     const parsedData = savedData ? JSON.parse(savedData) : location.state?.jobData || null;
//     return parsedData?.jobDescription ? parsedData : null;
//   };

//   const loadInitialQuestions = () => {
//     const savedQuestions = localStorage.getItem('aiQuestions');
//     return savedQuestions && JSON.parse(savedQuestions).length > 0
//       ? JSON.parse(savedQuestions)
//       : [{ id: "1", position: 1, category: "Culture", question: "" }];
//   };

//   const [jobPostData, setJobPostData] = useState(() => loadJobPostData());
//   const [questions, setQuestions] = useState(() => loadInitialQuestions());

//   useEffect(() => {
//     localStorage.setItem('aiQuestions', JSON.stringify(questions));
//   }, [questions]);

//   const dataforAi = JSON.stringify(jobPostData, null, 2);
//   const FINAL_PROMPT = AI_PROMPT.replace("{acutal_data}", dataforAi || "N/A");

//   const generateQuestions = async () => {
//     setIsLoading(true);
//     try {
//       const result = await chatSession(FINAL_PROMPT);
//       const responseText = result;
//       const parseData = responseText;
//       const interviewQuestionsData = JSON.parse(parseData);
//       const aiData = interviewQuestionsData;

//       const formattedQuestions = Object.entries(aiData).flatMap(([category, items], index) =>
//         items.map((item, i) => ({
//           id: `${category}-${i + 1}`,
//           position: index * 10 + i + 1,
//           category: category.charAt(0).toUpperCase() + category.slice(1),
//           question: item,
//           expectedResponse: "",
//         }))
//       );
      
//       setQuestions(formattedQuestions);
//     } catch (error) {
//       console.error("Error while generating questions:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveAndNext = () => {
//     localStorage.setItem('aiQuestions', JSON.stringify(questions));
//     navigate('/preview-and-publish', { 
//       state: { 
//         jobData: jobPostData, 
//         formattedQuestions: questions 
//       } 
//     });
//   };

//   const categoryConfig = {
//     Culture: { 
//       gradient: "from-emerald-50 to-teal-50",
//       text: "text-emerald-700",
//       bg: "bg-emerald-50",
//       border: "border-emerald-200",
//       icon: "🌱"
//     },
//     Technical: { 
//       gradient: "from-blue-50 to-cyan-50",
//       text: "text-blue-700",
//       bg: "bg-blue-50",
//       border: "border-blue-200",
//       icon: "⚡"
//     },
//     Leadership: { 
//       gradient: "from-violet-50 to-purple-50",
//       text: "text-violet-700",
//       bg: "bg-violet-50",
//       border: "border-violet-200",
//       icon: "👑"
//     },
//     SoftSkills: { 
//       gradient: "from-amber-50 to-yellow-50",
//       text: "text-amber-700",
//       bg: "bg-amber-50",
//       border: "border-amber-200",
//       icon: "💡"
//     },
//     XFactor: { 
//       gradient: "from-rose-50 to-pink-50",
//       text: "text-rose-700",
//       bg: "bg-rose-50",
//       border: "border-rose-200",
//       icon: "✨"
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
//       <Onavbar />

//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
//           {/* Header Section */}
//           <div className="mb-8 sm:mb-12">
//             <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-green-50 to-lime-50 border border-green-100 rounded-full mb-4 shadow-sm">
//               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
//               <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">AI Interview Builder</span>
//             </div>
            
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
//               Generate Interview Questions
//             </h1>
//             <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
//               Let our AI analyze your job posting and create tailored questions across multiple categories
//             </p>
//           </div>

//           {/* AI Generator Card */}
//           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6 hover:shadow-md transition-all duration-300">
//             <div className="flex flex-col sm:flex-row items-start gap-6">
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
//                 <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
//               </div>
              
//               <div className="flex-1">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
//                   AI-Powered Question Generation
//                 </h2>
//                 <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
//                   Our advanced AI analyzes your job requirements and generates relevant interview questions tailored to your needs. Generate multiple times to explore different question sets.
//                 </p>

//                 <button
//                   onClick={generateQuestions}
//                   disabled={isLoading}
//                   className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
//                       <span>Generating Questions...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Zap className="w-5 h-5" strokeWidth={2.5} />
//                       <span>Generate Questions with AI</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Questions Management Section */}
//           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
            
//             {/* Section Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
//                   Interview Questions
//                 </h2>
//                 <p className="text-sm text-gray-600">
//                   Review, edit, or customize AI-generated questions
//                 </p>
//               </div>
              
//               <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-green-50 to-lime-50 border border-green-100 rounded-xl">
//                 <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
//                 <span className="text-sm font-bold text-green-700">
//                   {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
//                 </span>
//               </div>
//             </div>

//             {/* Questions List */}
//             <div className="space-y-4 mb-8">
//               {questions.map((item, index) => {
//                 const config = categoryConfig[item.category] || categoryConfig.Culture;
                
//                 return (
//                   <div 
//                     key={item.id} 
//                     className="group bg-gradient-to-br from-gray-50/50 to-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:border-green-200 hover:shadow-md hover:shadow-green-500/5 transition-all duration-300"
//                   >
//                     <div className="flex flex-col sm:flex-row gap-4">
                      
//                       {/* Position Badge */}
//                       <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold text-base shadow-sm">
//                         {index + 1}
//                       </div>

//                       <div className="flex-1 space-y-4">
                        
//                         {/* Category Selector */}
//                         <div className="relative">
//                           <select
//                             value={item.category}
//                             onChange={(e) =>
//                               setQuestions((prev) =>
//                                 prev.map((q) =>
//                                   q.id === item.id ? { ...q, category: e.target.value } : q
//                                 )
//                               )
//                             }
//                             className={`w-full sm:w-auto pl-10 pr-10 py-2.5 bg-gradient-to-r ${config.gradient} ${config.text} border ${config.border} rounded-xl font-semibold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm`}
//                           >
//                             <option value="Culture">Culture</option>
//                             <option value="Technical">Technical</option>
//                             <option value="Leadership">Leadership</option>
//                             <option value="SoftSkills">Soft Skills</option>
//                             <option value="XFactor">X-Factor</option>
//                           </select>
//                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
//                             {config.icon}
//                           </span>
//                           <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${config.text} pointer-events-none`} strokeWidth={2.5} />
//                         </div>

//                         {/* Question Input */}
//                         <div className="relative">
//                           <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
//                           <input
//                             type="text"
//                             value={item.question}
//                             onChange={(e) =>
//                               setQuestions((prev) =>
//                                 prev.map((q) =>
//                                   q.id === item.id ? { ...q, question: e.target.value } : q
//                                 )
//                               )
//                             }
//                             placeholder="Enter your question here..."
//                             className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
//                           />
//                         </div>
//                       </div>

//                       {/* Delete Button */}
//                       <button
//                         onClick={() => setQuestions((prev) => prev.filter((q) => q.id !== item.id))}
//                         className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:border-red-200 hover:text-red-600 transition-all flex items-center justify-center self-start sm:self-center shadow-sm"
//                         title="Delete question"
//                       >
//                         <Trash2 className="w-4 h-4" strokeWidth={2} />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Add Custom Question Section */}
//             <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 sm:p-6 hover:border-green-400 hover:bg-green-50/30 transition-all duration-300">
//               <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide uppercase">
//                 <Plus className="w-4 h-4 text-green-600" strokeWidth={2.5} />
//                 <span className="text-green-700">Add Custom Question</span>
//               </h3>
              
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="relative sm:w-52">
//                   <select
//                     value={newQuestion.category}
//                     onChange={(e) =>
//                       setNewQuestion((prev) => ({
//                         ...prev,
//                         category: e.target.value,
//                       }))
//                     }
//                     className="w-full pl-10 pr-10 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none appearance-none cursor-pointer shadow-sm"
//                   >
//                     <option value="Culture">🌱 Culture</option>
//                     <option value="Technical">⚡ Technical</option>
//                     <option value="Leadership">👑 Leadership</option>
//                     <option value="SoftSkills">💡 Soft Skills</option>
//                     <option value="XFactor">✨ X-Factor</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
//                 </div>

//                 <input
//                   type="text"
//                   value={newQuestion.question}
//                   onChange={(e) =>
//                     setNewQuestion((prev) => ({
//                       ...prev,
//                       question: e.target.value,
//                     }))
//                   }
//                   placeholder="Type your custom question here..."
//                   className="flex-1 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base shadow-sm"
//                 />

//                 <button
//                   onClick={() => {
//                     if (newQuestion.question.trim()) {
//                       setQuestions((prev) => [
//                         ...prev,
//                         {
//                           id: `${newQuestion.category}-${prev.length + 1}`,
//                           position: prev.length + 1,
//                           category: newQuestion.category,
//                           question: newQuestion.question.trim(),
//                         },
//                       ]);
//                       setNewQuestion({ category: "Culture", question: "" });
//                     }
//                   }}
//                   className="flex-shrink-0 px-6 py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" strokeWidth={2.5} />
//                   <span className="hidden sm:inline">Add Question</span>
//                   <span className="sm:hidden">Add</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleSaveAndNext}
//               disabled={questions.length === 0}
//               className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
//             >
//               <Save className="w-5 h-5" strokeWidth={2.5} />
//               <span>Save & Continue</span>
//               <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Aiquestion;



import React, { useEffect, useState } from 'react';
import Onavbar from './Onavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Loader2, 
  Trash2, 
  Plus, 
  Save, 
  Edit3, 
  ChevronDown, 
  ArrowRight, 
  Check, 
  Zap,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { AI_PROMPT } from './constants/options';
import { chatSession } from "./service/ai/chatSession.js";

const Aiquestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [newQuestion, setNewQuestion] = useState({
    category: "Culture",
    question: "",
  });

  const loadJobPostData = () => {
    const savedData = localStorage.getItem('jobPostData');
    const parsedData = savedData ? JSON.parse(savedData) : location.state?.jobData || null;
    return parsedData?.jobDescription ? parsedData : null;
  };

  const loadInitialQuestions = () => {
    const savedQuestions = localStorage.getItem('aiQuestions');
    return savedQuestions && JSON.parse(savedQuestions).length > 0
      ? JSON.parse(savedQuestions)
      : [{ id: "1", position: 1, category: "Culture", question: "" }];
  };

  const [jobPostData, setJobPostData] = useState(() => loadJobPostData());
  const [questions, setQuestions] = useState(() => loadInitialQuestions());

  useEffect(() => {
    localStorage.setItem('aiQuestions', JSON.stringify(questions));
  }, [questions]);

  const dataforAi = JSON.stringify(jobPostData, null, 2);
  const FINAL_PROMPT = AI_PROMPT.replace("{acutal_data}", dataforAi || "N/A");

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await chatSession(FINAL_PROMPT);
      const responseText = result;
      const parseData = responseText;
      const interviewQuestionsData = JSON.parse(parseData);
      const aiData = interviewQuestionsData;

      const formattedQuestions = Object.entries(aiData).flatMap(([category, items], index) =>
        items.map((item, i) => ({
          id: `${category}-${i + 1}`,
          position: index * 10 + i + 1,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          question: item,
          expectedResponse: "",
        }))
      );
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error while generating questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndNext = () => {
    localStorage.setItem('aiQuestions', JSON.stringify(questions));
    navigate('/preview-and-publish', { 
      state: { 
        jobData: jobPostData, 
        formattedQuestions: questions 
      } 
    });
  };

  const categoryConfig = {
    Culture: { 
      gradient: "from-emerald-500 to-teal-500",
      lightGradient: "from-emerald-50 to-teal-50",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "🌱",
      label: "Culture"
    },
    Technical: { 
      gradient: "from-blue-500 to-cyan-500",
      lightGradient: "from-blue-50 to-cyan-50",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "⚡",
      label: "Technical"
    },
    Leadership: { 
      gradient: "from-violet-500 to-purple-500",
      lightGradient: "from-violet-50 to-purple-50",
      text: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "👑",
      label: "Leadership"
    },
    SoftSkills: { 
      gradient: "from-amber-500 to-yellow-500",
      lightGradient: "from-amber-50 to-yellow-50",
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "💡",
      label: "Soft Skills"
    },
    XFactor: { 
      gradient: "from-rose-500 to-pink-500",
      lightGradient: "from-rose-50 to-pink-50",
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "✨",
      label: "X-Factor"
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
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
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
                AI Interview Builder
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight leading-tight">
              Generate Interview Questions
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Let our AI analyze your job posting and create tailored questions across multiple categories
            </p>
          </div>

          {/* AI Generator Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8 mb-5 sm:mb-6 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 w-full">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                  AI-Powered Question Generation
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  Our advanced AI analyzes your job requirements and generates relevant interview questions tailored to your needs.
                </p>

                <button
                  onClick={generateQuestions}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Generate Questions with AI</span>
                      <span className="sm:hidden">Generate Questions</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Questions Management Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8 mb-5 sm:mb-6">
            
            {/* Section Header */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-1.5 tracking-tight">
                    Interview Questions
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Review, edit, or customize AI-generated questions
                  </p>
                </div>
                
                <div className="flex-shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-50 to-lime-50 border border-green-100 rounded-lg sm:rounded-xl">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" strokeWidth={2.5} />
                  <span className="text-xs sm:text-sm font-bold text-green-700 whitespace-nowrap">
                    {questions.length} {questions.length === 1 ? 'Q' : 'Qs'}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {questions.map((item, index) => {
                const config = categoryConfig[item.category] || categoryConfig.Culture;
                
                return (
                  <div 
                    key={item.id} 
                    className="group bg-gradient-to-br from-gray-50/50 to-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 lg:p-6 hover:border-green-200 hover:shadow-md hover:shadow-green-500/5 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-3 sm:gap-4">
                      
                      {/* Header Row: Position + Category + Delete */}
                      <div className="flex items-center gap-3">
                        {/* Position Badge */}
                        <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm sm:text-base shadow-sm">
                          {index + 1}
                        </div>

                        {/* Category Selector */}
                        <div className="relative flex-1 min-w-0">
                          <select
                            value={item.category}
                            onChange={(e) =>
                              setQuestions((prev) =>
                                prev.map((q) =>
                                  q.id === item.id ? { ...q, category: e.target.value } : q
                                )
                              )
                            }
                            className={`w-full pl-9 pr-9 py-2 sm:py-2.5 bg-gradient-to-r ${config.lightGradient} ${config.text} border ${config.border} rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm`}
                          >
                            <option value="Culture">Culture</option>
                            <option value="Technical">Technical</option>
                            <option value="Leadership">Leadership</option>
                            <option value="SoftSkills">Soft Skills</option>
                            <option value="XFactor">X-Factor</option>
                          </select>
                          <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-base">
                            {config.icon}
                          </span>
                          <ChevronDown className={`absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 ${config.text} pointer-events-none`} strokeWidth={2.5} />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => setQuestions((prev) => prev.filter((q) => q.id !== item.id))}
                          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:border-red-200 hover:text-red-600 transition-all flex items-center justify-center shadow-sm active:scale-95"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Question Input */}
                      <div className="relative">
                        <Edit3 className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) =>
                            setQuestions((prev) =>
                              prev.map((q) =>
                                q.id === item.id ? { ...q, question: e.target.value } : q
                              )
                            )
                          }
                          placeholder="Enter your question here..."
                          className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Question Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-green-400 hover:bg-green-50/30 transition-all duration-300">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 tracking-wide uppercase">
                <Plus className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                <span className="text-green-700">Add Custom Question</span>
              </h3>
              
              <div className="flex flex-col gap-3">
                {/* Category Selector */}
                <div className="relative">
                  <select
                    value={newQuestion.category}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full pl-9 pr-9 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-700 font-medium text-xs sm:text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="Culture">🌱 Culture</option>
                    <option value="Technical">⚡ Technical</option>
                    <option value="Leadership">👑 Leadership</option>
                    <option value="SoftSkills">💡 Soft Skills</option>
                    <option value="XFactor">✨ X-Factor</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                </div>

                {/* Question Input */}
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  placeholder="Type your custom question here..."
                  className="w-full px-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base shadow-sm"
                />

                {/* Add Button */}
                <button
                  onClick={() => {
                    if (newQuestion.question.trim()) {
                      setQuestions((prev) => [
                        ...prev,
                        {
                          id: `${newQuestion.category}-${prev.length + 1}`,
                          position: prev.length + 1,
                          category: newQuestion.category,
                          question: newQuestion.question.trim(),
                        },
                      ]);
                      setNewQuestion({ category: "Culture", question: "" });
                    }
                  }}
                  className="w-full sm:w-auto sm:ml-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  <span>Add Question</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons - Mobile Fixed Bottom */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
            <div className="flex gap-3">
              {/* <button
                onClick={() => navigate(-1)}
                className="flex-1 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-sm"
              >
                Back
              </button> */}
              <button
                onClick={handleSaveAndNext}
                disabled={questions.length === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
              >
                <Save className="w-4 h-4" strokeWidth={2.5} />
                <span>Save & Continue</span>
              </button>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex flex-row justify-end gap-3 pb-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              Back
            </button>
            <button
              onClick={handleSaveAndNext}
              disabled={questions.length === 0}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save className="w-5 h-5" strokeWidth={2.5} />
              <span>Save & Continue</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile Bottom Padding */}
          <div className="lg:hidden h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Aiquestion;