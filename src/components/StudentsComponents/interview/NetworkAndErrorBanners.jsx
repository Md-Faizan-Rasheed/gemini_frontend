import { motion } from "framer-motion";
import { WifiOff } from "lucide-react";

const NetworkAndErrorBanners = ({
  isOnline,
  isMobile,
  showTabWarning,
  tabSwitches,
  error,
}) => {
  return (
    <>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-[90%] sm:max-w-md w-full px-3 sm:px-4"
        >
          <div className="p-3 sm:p-4 bg-red-500 text-white rounded-xl sm:rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 sm:gap-3">
            <WifiOff size={isMobile ? 20 : 24} />
            <span className="text-xs sm:text-sm font-semibold">No Internet - Interview Paused</span>
          </div>
        </motion.div>
      )}

      {showTabWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-[90%] sm:max-w-md w-full px-3 sm:px-4"
        >
          <div className="p-3 sm:p-4 bg-orange-500 text-white rounded-xl sm:rounded-2xl text-center shadow-lg">
            <p className="text-xs sm:text-sm font-semibold">⚠️ Tab Switching ({tabSwitches}/3)</p>
            <p className="text-xs mt-1">Stay on this tab</p>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-[90%] sm:max-w-md w-full px-3 sm:px-4"
        >
          <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900 rounded-xl sm:rounded-2xl text-center text-red-800 dark:text-red-200 shadow-lg text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default NetworkAndErrorBanners;
