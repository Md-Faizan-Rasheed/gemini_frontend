import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Mic, Volume2, HelpCircle,AlertCircle } from "lucide-react";

const HelpMenu = ({ show, onClose, darkMode }) => {
  if (!show) return null;

  const shortcuts = [
    { key: 'Space', action: 'Toggle Microphone', icon: Mic },
    { key: 'ESC', action: 'Show/Hide Help Menu', icon: HelpCircle },
  ];

  const tips = [
    {
      title: "Speak Clearly",
      description: "Speak at a normal pace and enunciate your words clearly for better recognition."
    },
    {
      title: "Minimize Background Noise",
      description: "Find a quiet space to ensure accurate voice recognition."
    },
    {
      title: "Pause Before Speaking",
      description: "Wait for the AI to finish speaking before you respond."
    },
    {
      title: "Take Your Time",
      description: "Think before you answer. There's no rush - quality over speed."
    },
    {
      title: "Ask for Clarification",
      description: "If you don't understand a question, ask the interviewer to rephrase it."
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Interview Help</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Keyboard Shortcuts */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold">Keyboard Shortcuts</h3>
              </div>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => {
                  const Icon = shortcut.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{shortcut.action}</span>
                      </div>
                      <kbd className="px-3 py-1.5 bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg text-sm font-semibold shadow-sm">
                        {shortcut.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interview Tips */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-bold">Interview Tips</h3>
              </div>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-blue-500"
                  >
                    <h4 className="font-semibold mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Info */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-xl">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                Troubleshooting
              </h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                <li>If audio cuts out, check your microphone permissions</li>
                <li>Slow responses? Check your internet connection</li>
                <li>Can't hear AI? Unmute the AI voice (speaker icon)</li>
                <li>Voice not detected? Speak louder or closer to the mic</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Got it, thanks!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelpMenu;
