import { motion } from "framer-motion";

const ProgressBar = ({ progressWidth }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-0.5 sm:h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <motion.div
        className="h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-600"
        animate={{ width: progressWidth }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
};

export default ProgressBar;
