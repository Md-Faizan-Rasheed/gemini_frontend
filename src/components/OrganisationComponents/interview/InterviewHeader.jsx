import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const InterviewHeader = ({ data, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-6 sm:mb-8 lg:mb-12"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight px-4">
        AI Voice Interview
      </h1>

      {data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          } p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl max-w-3xl mx-auto border`}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2">
            {data.title}
          </h2>
          <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-semibold">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {data.numberOfQuestions} Questions
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InterviewHeader;