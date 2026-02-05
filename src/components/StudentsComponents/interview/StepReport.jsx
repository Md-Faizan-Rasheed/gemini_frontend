import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import BeautifulReportDisplay from "../helpers/Beautifulreportdisplay.jsx";

const StepReport = ({
  pageVariants,
  report,
  darkMode,
  isPracticeMode,
  engagementMetrics,
  interviewDuration,
  isMobile,
  onStartAnother,
}) => {
  return (
    <motion.div
      key="report"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex flex-col flex-grow px-3 sm:px-4 pb-20 sm:pb-4 overflow-y-auto max-h-screen"
    >
      <div
        className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl ${
          darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-3 sm:mb-4">
            <FileText size={isMobile ? 36 : 48} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center leading-tight px-2">
            {isPracticeMode ? "Practice " : ""}Interview Evaluation
          </h2>
          <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-3 sm:mt-4"></div>

          {isPracticeMode && (
            <div className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <span className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-200">
                🎯 Practice Mode - Detailed Feedback
              </span>
            </div>
          )}
        </div>

        <BeautifulReportDisplay
          reportData={report}
          darkMode={darkMode}
          isPracticeMode={isPracticeMode}
          engagementMetrics={engagementMetrics}
          interviewDuration={interviewDuration}
          onDownloadPDF={null}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartAnother}
          className="mt-6 sm:mt-8 w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 group"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start Another Interview
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepReport;
