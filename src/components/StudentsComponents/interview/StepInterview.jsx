import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

const StepInterview = ({
  pageVariants,
  conversation,
  conversationEndRef,
  isPracticeMode,
  darkMode,
  isListening,
  isSpeaking,
  processingAI,
  isOnline,
  transcript,
  interimTranscript,
  isMobile,
  onToggleListening,
  onManualSubmit,
  onComplete,
}) => {
  return (
    <motion.div
      key="interview"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex flex-col flex-grow space-y-3 sm:space-y-4 md:space-y-6 pb-20 sm:pb-0"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
          {isPracticeMode ? "🎯 Practice " : ""}Interview
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl max-h-[50vh] sm:max-h-[400px] md:max-h-[500px]">
        <AnimatePresence>
          {conversation.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-3 sm:mb-4 flex ${
                msg.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl max-w-[90%] sm:max-w-[85%] md:max-w-[80%] text-xs sm:text-sm ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-80">
                  {msg.role === "assistant" ? "🎓 Interviewer" : "👤 You"}
                </p>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={conversationEndRef} />
      </div>

      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8`}>
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleListening}
            disabled={isSpeaking || processingAI || !isOnline}
            className={`p-6 sm:p-8 md:p-10 rounded-full ${
              isListening ? "bg-red-500 animate-pulse" : "bg-blue-500"
            } text-white disabled:opacity-50 shadow-2xl transition-all duration-200`}
          >
            {isListening ? (
              <MicOff size={isMobile ? 32 : 40} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
            ) : (
              <Mic size={isMobile ? 32 : 40} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
            )}
          </motion.button>

          <div className="text-center">
            {isSpeaking && <p className="text-blue-500 font-semibold text-xs sm:text-sm md:text-base">🎤 AI speaking...</p>}
            {processingAI && !isSpeaking && <p className="text-purple-500 font-semibold text-xs sm:text-sm md:text-base">⚡ Processing...</p>}
            {isListening && !isSpeaking && !processingAI && <p className="text-green-500 font-semibold text-xs sm:text-sm md:text-base">🎙️ Listening...</p>}
            {!isListening && !isSpeaking && !processingAI && !isOnline && <p className="text-red-500 font-semibold text-xs sm:text-sm md:text-base">❌ No Internet</p>}
            {!isListening && !isSpeaking && !processingAI && isOnline && (
              <div>
                <p className="text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">Tap to speak</p>
                <p className="text-xs text-gray-400 hidden sm:block">or press Space</p>
              </div>
            )}
          </div>

          {(transcript || interimTranscript) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-3 sm:p-4 md:p-6 bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl"
            >
              <p className="text-xs sm:text-sm mb-2 sm:mb-3">
                <span className="font-semibold">You're saying: </span>
                {transcript}
                <span className="text-gray-400 italic">{interimTranscript}</span>
              </p>
              {transcript && !processingAI && (
                <button
                  onClick={onManualSubmit}
                  className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  ✓ Submit Now
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-2 sm:pt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          disabled={processingAI}
          className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          Complete Interview
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepInterview;
