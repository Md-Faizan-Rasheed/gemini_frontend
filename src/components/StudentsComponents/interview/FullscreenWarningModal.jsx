import { motion } from "framer-motion";

const FullscreenWarningModal = ({
  show,
  fullscreenExitCount,
  warningMessage,
  requiresUserAction,
  onResume,
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`max-w-[95%] sm:max-w-lg w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl ${
          fullscreenExitCount >= 3
            ? "bg-gradient-to-br from-red-600 to-red-700 text-white"
            : "bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900"
        }`}
      >
        <div className="text-center">
          <motion.div
            className="text-5xl sm:text-7xl mb-4 sm:mb-6"
            animate={{
              scale: fullscreenExitCount >= 3 ? [1, 1.2, 1] : [1, 1.1, 1],
              rotate: fullscreenExitCount >= 3 ? [0, -10, 10, 0] : 0,
            }}
            transition={{ duration: 0.5, repeat: fullscreenExitCount >= 3 ? Infinity : 0, repeatDelay: 1 }}
          >
            {fullscreenExitCount >= 3 ? "❌" : "⚠️"}
          </motion.div>

          <h3 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4">
            {fullscreenExitCount >= 3 ? "Interview Terminated" : "Fullscreen Required"}
          </h3>

          <p className="text-sm sm:text-lg font-semibold mb-4 sm:mb-6 leading-relaxed px-2">
            {warningMessage}
          </p>

          {requiresUserAction && fullscreenExitCount < 3 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gray-900 text-white font-bold text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Return to Fullscreen
            </motion.button>
          )}

          {fullscreenExitCount >= 3 && (
            <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm opacity-90">Generating evaluation...</p>
              <div className="mt-3 sm:mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
            <p className="text-xs sm:text-sm font-medium opacity-90">
              Exit Count: {fullscreenExitCount}/3
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FullscreenWarningModal;
