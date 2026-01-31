// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Award, TrendingUp, MessageSquare, Lightbulb, Target, 
//   CheckCircle, AlertCircle, Star, Download, FileText 
// } from 'lucide-react';

// const BeautifulReportDisplay = ({ 
//   reportData, 
//   darkMode, 
//   isPracticeMode,
//   engagementMetrics,
//   interviewDuration,
//   onDownloadPDF 
// }) => {
//   // Parse the report text into sections
//   const parseReport = (reportText) => {
//     if (!reportText) return null;

//     const sections = {
//       overallAssessment: '',
//       technicalCompetence: '',
//       communicationSkills: '',
//       problemSolving: '',
//       keyHighlights: [],
//       areasForDevelopment: [],
//       engagementAnalysis: '',
//       finalRecommendation: '',
//       practiceFeedback: ''
//     };

//     // Simple parser - adapt based on your actual report format
//     const lines = reportText.split('\n');
//     let currentSection = '';

//     lines.forEach(line => {
//       const lower = line.toLowerCase();
      
//       if (lower.includes('overall assessment')) {
//         currentSection = 'overallAssessment';
//       } else if (lower.includes('technical competence')) {
//         currentSection = 'technicalCompetence';
//       } else if (lower.includes('communication skills')) {
//         currentSection = 'communicationSkills';
//       } else if (lower.includes('problem-solving') || lower.includes('problem solving')) {
//         currentSection = 'problemSolving';
//       } else if (lower.includes('key highlights')) {
//         currentSection = 'keyHighlights';
//       } else if (lower.includes('areas for development')) {
//         currentSection = 'areasForDevelopment';
//       } else if (lower.includes('engagement analysis')) {
//         currentSection = 'engagementAnalysis';
//       } else if (lower.includes('final recommendation')) {
//         currentSection = 'finalRecommendation';
//       } else if (lower.includes('practice mode feedback')) {
//         currentSection = 'practiceFeedback';
//       } else if (line.trim() && currentSection) {
//         if (currentSection === 'keyHighlights' || currentSection === 'areasForDevelopment') {
//           if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
//             sections[currentSection].push(line.replace(/^[-•]\s*/, '').trim());
//           }
//         } else {
//           sections[currentSection] += line + '\n';
//         }
//       }
//     });

//     return sections;
//   };

//   const sections = parseReport(reportData);

//   // Extract rating from overall assessment (if present)
//   const extractRating = (text) => {
//     const match = text?.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
//     return match ? parseFloat(match[1]) : null;
//   };

//   const overallRating = sections ? extractRating(sections.overallAssessment) : null;

//   const getRatingColor = (rating) => {
//     if (rating >= 8) return 'text-green-600 dark:text-green-400';
//     if (rating >= 6) return 'text-blue-600 dark:text-blue-400';
//     if (rating >= 4) return 'text-yellow-600 dark:text-yellow-400';
//     return 'text-red-600 dark:text-red-400';
//   };

//   const getRatingBg = (rating) => {
//     if (rating >= 8) return 'bg-green-50 dark:bg-green-900/20';
//     if (rating >= 6) return 'bg-blue-50 dark:bg-blue-900/20';
//     if (rating >= 4) return 'bg-yellow-50 dark:bg-yellow-900/20';
//     return 'bg-red-50 dark:bg-red-900/20';
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Overall Score */}
//       {overallRating && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`${getRatingBg(overallRating)} p-6 rounded-2xl border-2 ${
//             overallRating >= 8 ? 'border-green-300 dark:border-green-700' :
//             overallRating >= 6 ? 'border-blue-300 dark:border-blue-700' :
//             overallRating >= 4 ? 'border-yellow-300 dark:border-yellow-700' :
//             'border-red-300 dark:border-red-700'
//           }`}
//         >
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className={`p-4 rounded-full ${
//                 overallRating >= 8 ? 'bg-green-100 dark:bg-green-800' :
//                 overallRating >= 6 ? 'bg-blue-100 dark:bg-blue-800' :
//                 overallRating >= 4 ? 'bg-yellow-100 dark:bg-yellow-800' :
//                 'bg-red-100 dark:bg-red-800'
//               }`}>
//                 <Award className={`w-8 h-8 ${getRatingColor(overallRating)}`} />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                   Overall Performance
//                 </h3>
//                 <div className="flex items-baseline gap-2">
//                   <span className={`text-4xl c font-bold ${getRatingColor(overallRating)}`}>
//                     {overallRating}
//                   </span>
//                   <span className="text-2xl text-gray-500 dark:text-gray-400">/10</span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Visual Rating Bar */}
//             <div className="w-full sm:w-48">
//               <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${overallRating * 10}%` }}
//                   transition={{ duration: 1, delay: 0.3 }}
//                   className={`h-full ${
//                     overallRating >= 8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
//                     overallRating >= 6 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
//                     overallRating >= 4 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
//                     'bg-gradient-to-r from-red-400 to-red-600'
//                   }`}
//                 />
//               </div>
//               <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 <span>Poor</span>
//                 <span>Excellent</span>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//         <MetricCard
//           icon={<MessageSquare className="w-5 h-5" />}
//           label="Responses"
//           value={engagementMetrics.responseCount}
//           color="blue"
//           darkMode={darkMode}
//         />
//         <MetricCard
//           icon={<TrendingUp className="w-5 h-5" />}
//           label="Avg Response"
//           value={`${(engagementMetrics.averageResponseTime / 1000).toFixed(1)}s`}
//           color="green"
//           darkMode={darkMode}
//         />
//         <MetricCard
//           icon={<FileText className="w-5 h-5" />}
//           label="Words"
//           value={engagementMetrics.wordsSpoken}
//           color="purple"
//           darkMode={darkMode}
//         />
//         <MetricCard
//           icon={<Target className="w-5 h-5" />}
//           label="Duration"
//           value={`${Math.floor(interviewDuration / 60)}m`}
//           color="orange"
//           darkMode={darkMode}
//         />
//       </div>

//       {/* Key Highlights */}
//       {sections?.keyHighlights && sections.keyHighlights.length > 0 && (
//         <Section
//           title="Key Highlights"
//           icon={<Star className="w-6 h-6" />}
//           color="green"
//           darkMode={darkMode}
//         >
//           <div className="space-y-2">
//             {sections.keyHighlights.map((highlight, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
//               >
//                 <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm text-gray-700 dark:text-gray-300">{highlight}</p>
//               </motion.div>
//             ))}
//           </div>
//         </Section>
//       )}

//       {/* Technical Competence */}
//       {sections?.technicalCompetence && (
//         <Section
//           title="Technical Competence"
//           icon={<Target className="w-6 h-6" />}
//           color="blue"
//           darkMode={darkMode}
//         >
//           <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
//             {sections.technicalCompetence.trim()}
//           </p>
//         </Section>
//       )}

//       {/* Communication Skills */}
//       {sections?.communicationSkills && (
//         <Section
//           title="Communication Skills"
//           icon={<MessageSquare className="w-6 h-6" />}
//           color="purple"
//           darkMode={darkMode}
//         >
//           <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
//             {sections.communicationSkills.trim()}
//           </p>
//         </Section>
//       )}

//       {/* Problem Solving */}
//       {sections?.problemSolving && (
//         <Section
//           title="Problem-Solving Ability"
//           icon={<Lightbulb className="w-6 h-6" />}
//           color="yellow"
//           darkMode={darkMode}
//         >
//           <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
//             {sections.problemSolving.trim()}
//           </p>
//         </Section>
//       )}

//       {/* Areas for Development */}
//       {sections?.areasForDevelopment && sections.areasForDevelopment.length > 0 && (
//         <Section
//           title="Areas for Development"
//           icon={<TrendingUp className="w-6 h-6" />}
//           color="orange"
//           darkMode={darkMode}
//         >
//           <div className="space-y-2">
//             {sections.areasForDevelopment.map((area, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20"
//               >
//                 <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm text-gray-700 dark:text-gray-300">{area}</p>
//               </motion.div>
//             ))}
//           </div>
//         </Section>
//       )}

//       {/* Final Recommendation */}
//       {sections?.finalRecommendation && (
//         <Section
//           title="Final Recommendation"
//           icon={<Award className="w-6 h-6" />}
//           color="indigo"
//           darkMode={darkMode}
//         >
//           <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500">
//             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
//               {sections.finalRecommendation.trim()}
//             </p>
//           </div>
//         </Section>
//       )}

//       {/* Practice Mode Feedback */}
//       {isPracticeMode && sections?.practiceFeedback && (
//         <Section
//           title="Practice Mode: Detailed Feedback"
//           icon={<Target className="w-6 h-6" />}
//           color="pink"
//           darkMode={darkMode}
//         >
//           <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 border-2 border-dashed border-pink-300 dark:border-pink-700">
//             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
//               {sections.practiceFeedback.trim()}
//             </p>
//           </div>
//         </Section>
//       )}

//       {/* Download Button */}
//       {onDownloadPDF && (
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onDownloadPDF}
//           className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
//         >
//           <Download className="w-5 h-5" />
//           Download Full Report as PDF
//         </motion.button>
//       )}
//     </div>
//   );
// };

// // Metric Card Component
// const MetricCard = ({ icon, label, value, color, darkMode }) => {
//   const colorClasses = {
//     blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
//     green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
//     purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
//     orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`p-4 rounded-xl border ${colorClasses[color]}`}
//     >
//       <div className="flex items-center gap-2 mb-2">
//         {icon}
//         <span className="text-xs font-medium opacity-80">{label}</span>
//       </div>
//       <div className="text-2xl font-bold">{value}</div>
//     </motion.div>
//   );
// };

// // Section Component
// const Section = ({ title, icon, color, darkMode, children }) => {
//   const colorClasses = {
//     blue: 'from-blue-500 to-blue-600',
//     green: 'from-green-500 to-green-600',
//     purple: 'from-purple-500 to-purple-600',
//     orange: 'from-orange-500 to-orange-600',
//     yellow: 'from-yellow-500 to-yellow-600',
//     indigo: 'from-indigo-500 to-indigo-600',
//     pink: 'from-pink-500 to-pink-600',
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`p-5 sm:p-6 rounded-2xl ${
//         darkMode 
//           ? 'bg-gray-800/50 border border-gray-700' 
//           : 'bg-white border border-gray-200'
//       } shadow-lg`}
//     >
//       <div className="flex items-center gap-3 mb-4">
//         <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
//           {icon}
//         </div>
//         <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
//           {title}
//         </h3>
//       </div>
//       {children}
//     </motion.div>
//   );
// };

// export default BeautifulReportDisplay;



import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, MessageSquare, Lightbulb, Target, 
  CheckCircle, AlertCircle, Star, Download, FileText 
} from 'lucide-react';

const BeautifulReportDisplay = ({ 
  reportData, 
  darkMode, 
  isPracticeMode,
  engagementMetrics,
  interviewDuration,
  onDownloadPDF 
}) => {
  // Parse the report text into sections
  const parseReport = (reportText) => {
    if (!reportText) return null;

    const sections = {
      overallAssessment: '',
      technicalCompetence: '',
      communicationSkills: '',
      problemSolving: '',
      keyHighlights: [],
      areasForDevelopment: [],
      engagementAnalysis: '',
      finalRecommendation: '',
      practiceFeedback: ''
    };

    // Simple parser - adapt based on your actual report format
    const lines = reportText.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const lower = line.toLowerCase().trim();
      
      // Skip empty lines
      if (!line.trim()) return;
      
      // Check for section headers
      if (lower.includes('overall assessment') || lower.includes('overall rating')) {
        currentSection = 'overallAssessment';
        return;
      } else if (lower.includes('technical competence') || lower.includes('technical skills')) {
        currentSection = 'technicalCompetence';
        return;
      } else if (lower.includes('communication skills') || lower.includes('communication ability')) {
        currentSection = 'communicationSkills';
        return;
      } else if (lower.includes('problem-solving') || lower.includes('problem solving')) {
        currentSection = 'problemSolving';
        return;
      } else if (lower.includes('key highlights') || lower.includes('strengths')) {
        currentSection = 'keyHighlights';
        return;
      } else if (lower.includes('areas for development') || lower.includes('areas for improvement') || lower.includes('weaknesses')) {
        currentSection = 'areasForDevelopment';
        return;
      } else if (lower.includes('engagement analysis')) {
        currentSection = 'engagementAnalysis';
        return;
      } else if (lower.includes('final recommendation') || lower.includes('recommendation')) {
        currentSection = 'finalRecommendation';
        return;
      } else if (lower.includes('practice mode feedback') || lower.includes('practice feedback')) {
        currentSection = 'practiceFeedback';
        return;
      }
      
      // Add content to current section
      if (currentSection) {
        if (currentSection === 'keyHighlights' || currentSection === 'areasForDevelopment') {
          // Handle list items
          if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
            const cleaned = line.replace(/^[-•\d.]\s*/, '').trim();
            if (cleaned) {
              sections[currentSection].push(cleaned);
            }
          } else if (!line.match(/^\d+\.\s*[A-Z]/)) {
            // If it's not a section header (like "1. OVERALL"), add as text
            sections[currentSection].push(line.trim());
          }
        } else {
          sections[currentSection] += line + '\n';
        }
      }
    });

    return sections;
  };

  const sections = parseReport(reportData);

  // Debug: Log parsed sections
  console.log('📊 Parsed Report Sections:', sections);

  // Check if we have any content
  const hasContent = sections && (
    sections.overallAssessment ||
    sections.technicalCompetence ||
    sections.communicationSkills ||
    sections.problemSolving ||
    sections.keyHighlights.length > 0 ||
    sections.areasForDevelopment.length > 0 ||
    sections.finalRecommendation ||
    sections.practiceFeedback
  );

  // If no parsed content, show raw report
  if (!hasContent && reportData) {
    console.log('⚠️ No structured content found, displaying raw report');
    return (
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Responses"
            value={engagementMetrics.responseCount}
            color="blue"
            darkMode={darkMode}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg Response"
            value={`${(engagementMetrics.averageResponseTime / 1000).toFixed(1)}s`}
            color="green"
            darkMode={darkMode}
          />
          <MetricCard
            icon={<FileText className="w-5 h-5" />}
            label="Words"
            value={engagementMetrics.wordsSpoken}
            color="purple"
            darkMode={darkMode}
          />
          <MetricCard
            icon={<Target className="w-5 h-5" />}
            label="Duration"
            value={`${Math.floor(interviewDuration / 60)}m`}
            color="orange"
            darkMode={darkMode}
          />
        </div>

        {/* Raw Report */}
        <div className={`p-5 sm:p-6 rounded-2xl ${
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
              Interview Report
            </h3>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {reportData}
            </pre>
          </div>
        </div>

        {/* Download Button */}
        {onDownloadPDF && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDownloadPDF}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            Download Full Report as PDF
          </motion.button>
        )}
      </div>
    );
  }

  // Extract rating from overall assessment (if present)
  const extractRating = (text) => {
    const match = text?.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
    return match ? parseFloat(match[1]) : null;
  };

  const overallRating = sections ? extractRating(sections.overallAssessment) : null;

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600 dark:text-green-400';
    if (rating >= 6) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingBg = (rating) => {
    if (rating >= 8) return 'bg-green-50 dark:bg-green-900/20';
    if (rating >= 6) return 'bg-blue-50 dark:bg-blue-900/20';
    if (rating >= 4) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      {overallRating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${getRatingBg(overallRating)} p-6 rounded-2xl border-2 ${
            overallRating >= 8 ? 'border-green-300 dark:border-green-700' :
            overallRating >= 6 ? 'border-blue-300 dark:border-blue-700' :
            overallRating >= 4 ? 'border-yellow-300 dark:border-yellow-700' :
            'border-red-300 dark:border-red-700'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${
                overallRating >= 8 ? 'bg-green-100 dark:bg-green-800' :
                overallRating >= 6 ? 'bg-blue-100 dark:bg-blue-800' :
                overallRating >= 4 ? 'bg-yellow-100 dark:bg-yellow-800' :
                'bg-red-100 dark:bg-red-800'
              }`}>
                <Award className={`w-8 h-8 ${getRatingColor(overallRating)}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Overall Performance
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${getRatingColor(overallRating)}`}>
                    {overallRating}
                  </span>
                  <span className="text-2xl text-gray-500 dark:text-gray-400">/10</span>
                </div>
              </div>
            </div>
            
            {/* Visual Rating Bar */}
            <div className="w-full sm:w-48">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallRating * 10}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full ${
                    overallRating >= 8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    overallRating >= 6 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    overallRating >= 4 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Responses"
          value={engagementMetrics.responseCount}
          color="blue"
          darkMode={darkMode}
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Response"
          value={`${(engagementMetrics.averageResponseTime / 1000).toFixed(1)}s`}
          color="green"
          darkMode={darkMode}
        />
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Words"
          value={engagementMetrics.wordsSpoken}
          color="purple"
          darkMode={darkMode}
        />
        <MetricCard
          icon={<Target className="w-5 h-5" />}
          label="Duration"
          value={`${Math.floor(interviewDuration / 60)}m`}
          color="orange"
          darkMode={darkMode}
        />
      </div>

      {/* Key Highlights */}
      {sections?.keyHighlights && sections.keyHighlights.length > 0 && (
        <Section
          title="Key Highlights"
          icon={<Star className="w-6 h-6" />}
          color="green"
          darkMode={darkMode}
        >
          <div className="space-y-2">
            {sections.keyHighlights.map((highlight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
              >
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{highlight}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Technical Competence */}
      {sections?.technicalCompetence && sections.technicalCompetence.trim() && (
        <Section
          title="Technical Competence"
          icon={<Target className="w-6 h-6" />}
          color="blue"
          darkMode={darkMode}
        >
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {sections.technicalCompetence.trim()}
          </p>
        </Section>
      )}

      {/* Communication Skills */}
      {sections?.communicationSkills && sections.communicationSkills.trim() && (
        <Section
          title="Communication Skills"
          icon={<MessageSquare className="w-6 h-6" />}
          color="purple"
          darkMode={darkMode}
        >
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {sections.communicationSkills.trim()}
          </p>
        </Section>
      )}

      {/* Problem Solving */}
      {sections?.problemSolving && sections.problemSolving.trim() && (
        <Section
          title="Problem-Solving Ability"
          icon={<Lightbulb className="w-6 h-6" />}
          color="yellow"
          darkMode={darkMode}
        >
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {sections.problemSolving.trim()}
          </p>
        </Section>
      )}

      {/* Areas for Development */}
      {sections?.areasForDevelopment && sections.areasForDevelopment.length > 0 && (
        <Section
          title="Areas for Development"
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
          darkMode={darkMode}
        >
          <div className="space-y-2">
            {sections.areasForDevelopment.map((area, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20"
              >
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{area}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Final Recommendation */}
      {sections?.finalRecommendation && sections.finalRecommendation.trim() && (
        <Section
          title="Final Recommendation"
          icon={<Award className="w-6 h-6" />}
          color="indigo"
          darkMode={darkMode}
        >
          <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
              {sections.finalRecommendation.trim()}
            </p>
          </div>
        </Section>
      )}

      {/* Practice Mode Feedback */}
      {isPracticeMode && sections?.practiceFeedback && sections.practiceFeedback.trim() && (
        <Section
          title="Practice Mode: Detailed Feedback"
          icon={<Target className="w-6 h-6" />}
          color="pink"
          darkMode={darkMode}
        >
          <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 border-2 border-dashed border-pink-300 dark:border-pink-700">
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {sections.practiceFeedback.trim()}
            </p>
          </div>
        </Section>
      )}

      {/* Download Button */}
      {onDownloadPDF && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownloadPDF}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
        >
          <Download className="w-5 h-5" />
          Download Full Report as PDF
        </motion.button>
      )}
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, label, value, color, darkMode }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium opacity-80">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </motion.div>
  );
};

// Section Component
const Section = ({ title, icon, color, darkMode, children }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 sm:p-6 rounded-2xl ${
        darkMode 
          ? 'bg-gray-800/50 border border-gray-700' 
          : 'bg-white border border-gray-200'
      } shadow-lg`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
};

export default BeautifulReportDisplay;