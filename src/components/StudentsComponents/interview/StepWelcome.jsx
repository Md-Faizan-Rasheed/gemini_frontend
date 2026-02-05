import { motion } from "framer-motion";
import { Play } from "lucide-react";
import BreathingExercise from "../helpers/BreathingExercise.jsx";

const StepWelcome = ({
  pageVariants,
  data,
  darkMode,
  isMobile,
  onStartPractice,
  onStartReal,
}) => {
  return (
    <motion.div
      key="welcome"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex flex-col items-center justify-center text-center flex-grow px-3 sm:px-4"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight">
        AI Voice Interview
      </h1>

      {data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl mb-6 sm:mb-8`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{data.title}</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Get ready to begin your interactive technical interview.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <span className="inline-block px-3 py-1.5 sm:px-5 sm:py-2.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-semibold">
              {data.numberOfQuestions} Questions
            </span>
            <span className="inline-block px-3 py-1.5 sm:px-5 sm:py-2.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs sm:text-sm font-semibold">
              ~{data.numberOfQuestions * 5} Min
            </span>
          </div>
        </motion.div>
      )}

      {isMobile && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg max-w-2xl w-full">
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
            📱 Mobile Tips:
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Use headphones for better audio</li>
            <li>Stable internet required</li>
            <li>Keep device charged</li>
            <li>Find quiet environment</li>
          </ul>
        </div>
      )}

      <BreathingExercise onComplete={() => {}} darkMode={darkMode} />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartPractice}
          className="flex-1 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
        >
          <Play size={isMobile ? 18 : 22} />
          Practice Mode
          <span className="text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded-full">Hints</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartReal}
          className="flex-1 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
        >
          <Play size={isMobile ? 18 : 22} />
          Real Interview
          <span className="text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded-full">Eval</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepWelcome;
