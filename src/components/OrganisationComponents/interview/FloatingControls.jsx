import { motion } from "framer-motion";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";

const FloatingControls = ({ darkMode, onToggleDarkMode, muteAI, onToggleMute, showMuteButton }) => {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex gap-2 sm:gap-3">
      {/* Mute Toggle */}
      {showMuteButton && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={onToggleMute}
          className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          title={muteAI ? "Unmute AI voice" : "Mute AI voice"}
        >
          {muteAI ? (
            <VolumeX size={18} className="sm:w-[22px] sm:h-[22px]" />
          ) : (
            <Volume2 size={18} className="sm:w-[22px] sm:h-[22px]" />
          )}
        </motion.button>
      )}

      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onToggleDarkMode}
        className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
      >
        {darkMode ? (
          <Sun size={18} className="sm:w-[22px] sm:h-[22px]" />
        ) : (
          <Moon size={18} className="sm:w-[22px] sm:h-[22px]" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingControls;