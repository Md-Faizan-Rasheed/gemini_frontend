import { motion } from "framer-motion";

const FullscreenIndicator = ({ show, isPracticeMode, checkIfFullscreen, fullscreenExitCount }) => {
  if (!show || isPracticeMode) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 sm:left-6 z-40">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 ${
          checkIfFullscreen()
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white animate-pulse"
        }`}
      >
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
        <span className="text-xs sm:text-sm font-semibold">
          {checkIfFullscreen() ? "✓ Fullscreen" : `⚠️ ${fullscreenExitCount}/2`}
        </span>
      </motion.div>
    </div>
  );
};

export default FullscreenIndicator;
