import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConversationPanel = ({ conversation, darkMode }) => {
  const conversationEndRef = useRef(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-4 sm:p-6 lg:p-8 max-h-[400px] sm:max-h-[500px] overflow-y-auto border`}
    >
      <AnimatePresence>
        {conversation.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`mb-4 sm:mb-6 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl ${
                msg.role === "assistant"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-[10px] sm:text-xs font-semibold mb-1 sm:mb-1.5 opacity-80">
                {msg.role === "assistant" ? "🎓 Interviewer" : "👤 You"}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={conversationEndRef} />
    </motion.div>
  );
};

export default ConversationPanel;