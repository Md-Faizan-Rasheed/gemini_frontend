import { motion } from "framer-motion";
import { Mic, Play } from "lucide-react";

const PreInterviewScreen = ({ onStartInterview, disabled, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        } p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl max-w-xl mx-auto border`}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to begin?</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2">
          Make sure your microphone is enabled and speak clearly. The AI interviewer will guide you
          through the process.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartInterview}
          disabled={disabled}
          className="w-full px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
        >
          <Play size={20} className="sm:w-[26px] sm:h-[26px]" />
          <span>Start Interview</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PreInterviewScreen;