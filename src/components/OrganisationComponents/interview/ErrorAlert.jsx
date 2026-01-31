import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const ErrorAlert = ({ error, darkMode }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm sm:text-base font-semibold text-red-800 dark:text-red-200 mb-1">
            Error
          </p>
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorAlert;