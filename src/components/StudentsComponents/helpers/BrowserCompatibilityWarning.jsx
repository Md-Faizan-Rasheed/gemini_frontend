import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

const BrowserCompatibilityWarning = ({ browserSupport }) => {
  const [dismissed, setDismissed] = useState(false);
  
  const hasIssues = !browserSupport.speechRecognition || !browserSupport.speechSynthesis;
  
  if (!hasIssues || dismissed) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full mx-4"
      >
        <div className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 p-4 rounded-lg shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-orange-800 mb-1">
                  Browser Compatibility Issue
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  For the best interview experience, please use one of these browsers:
                </p>
                <ul className="text-xs text-orange-600 space-y-1 mb-3">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <strong>Google Chrome</strong> (Recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <strong>Microsoft Edge</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <strong>Safari 14.1+</strong> (macOS/iOS)
                  </li>
                </ul>
                
                {!browserSupport.speechRecognition && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                    <p className="text-xs text-red-700 font-semibold">
                      ⚠️ Voice recognition not available
                    </p>
                  </div>
                )}
                
                {!browserSupport.speechSynthesis && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-700 font-semibold">
                      ⚠️ Text-to-speech not available
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setDismissed(true)}
              className="text-orange-500 hover:text-orange-700 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BrowserCompatibilityWarning;