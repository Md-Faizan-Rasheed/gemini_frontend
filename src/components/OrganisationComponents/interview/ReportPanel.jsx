import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ReportPanel = ({ report, onReset, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-6 sm:p-8 lg:p-10 border`}
    >
      {/* Report Header */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-3 sm:mb-4"
        >
          <CheckCircle size={40} className="sm:w-[48px] sm:h-[48px] lg:w-[56px] lg:h-[56px] text-blue-600 dark:text-blue-400" />
        </motion.div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-2 sm:mb-3">
          Interview Evaluation Report
        </h2>
        
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          Your comprehensive performance assessment
        </p>
        
        <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
      </div>

      {/* Report Content */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div
          className={`${
            darkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"
          } p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 overflow-x-auto`}
        >
          <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 m-0">
            {report}
          </pre>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 active:shadow-md transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Start New Interview</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReportPanel;