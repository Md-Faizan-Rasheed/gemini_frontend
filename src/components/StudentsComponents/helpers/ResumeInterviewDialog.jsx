import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, X } from "lucide-react";

const ResumeInterviewDialog = ({ show, onResume, onStartFresh, savedState, darkMode }) => {
  if (!show || !savedState) return null;

  const timeSince = Math.floor((Date.now() - savedState.timestamp) / 1000 / 60);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onStartFresh}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Resume Previous Interview?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We found an unfinished interview session
                </p>
              </div>
            </div>
            <button
              onClick={onStartFresh}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Session Details
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time ago:</span>
                <span className="font-semibold">
                  {timeSince < 1 ? 'Just now' : `${timeSince} min${timeSince > 1 ? 's' : ''} ago`}
                </span>
              </div>
              
              {savedState.conversation && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Messages:</span>
                  <span className="font-semibold">{savedState.conversation.length}</span>
                </div>
              )}
              
              {savedState.questionProgress && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                  <span className="font-semibold">
                    Question {savedState.questionProgress.current}/{savedState.questionProgress.total}
                  </span>
                </div>
              )}
              
              {savedState.interviewDuration && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-semibold">
                    {Math.floor(savedState.interviewDuration / 60)}m {savedState.interviewDuration % 60}s
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResume}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Resume Interview
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartFresh}
              className={`w-full py-3 px-4 font-semibold rounded-xl border-2 transition-all ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Start Fresh Interview
            </motion.button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Previous session will be discarded if you start fresh
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeInterviewDialog;