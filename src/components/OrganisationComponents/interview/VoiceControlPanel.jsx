import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, Loader2, Send } from "lucide-react";

const VoiceControlPanel = ({
  isListening,
  isSpeaking,
  processingAI,
  transcript,
  interimTranscript,
  onToggleListen,
  onManualSubmit,
  darkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-6 sm:p-8 lg:p-10 border`}
    >
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        {/* Mic Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleListen}
          disabled={isSpeaking || processingAI}
          className={`relative p-8 sm:p-10 lg:p-12 rounded-full ${
            isListening
              ? "bg-gradient-to-r from-red-500 to-rose-600 animate-pulse"
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          } text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transition-all duration-300`}
        >
          {isListening ? (
            <MicOff size={36} className="sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px]" />
          ) : (
            <Mic size={36} className="sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px]" />
          )}
          
          {/* Pulse Ring Effect */}
          {isListening && (
            <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></span>
          )}
        </motion.button>

        {/* Status Indicator */}
        <div className="text-center min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center">
          {isSpeaking && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-pulse" />
                <p className="text-sm sm:text-base font-semibold text-blue-500">AI is speaking...</p>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              </div>
            </div>
          )}
          
          {processingAI && !isSpeaking && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 animate-spin" />
                <p className="text-sm sm:text-base font-semibold text-purple-500">Processing your answer...</p>
              </div>
            </div>
          )}
          
          {isListening && !isSpeaking && !processingAI && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm sm:text-base font-semibold text-green-500">Listening...</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Speak your answer clearly
              </p>
            </div>
          )}
          
          {!isListening && !isSpeaking && !processingAI && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
                Click the microphone to speak
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Your response will be submitted automatically
              </p>
            </div>
          )}
        </div>

        {/* Transcript Display - Mobile Optimized */}
        {(transcript || interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full"
          >
            <div
              className={`p-4 sm:p-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } rounded-xl sm:rounded-2xl`}
            >
              <p className="text-xs sm:text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                Your Response:
              </p>
              <p className="text-sm sm:text-base leading-relaxed mb-4">
                {transcript}
                <span className="text-gray-400 dark:text-gray-500 italic">{interimTranscript}</span>
              </p>
              
              {transcript && !processingAI && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onManualSubmit}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:shadow-md transition-all"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Submit Now
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceControlPanel;