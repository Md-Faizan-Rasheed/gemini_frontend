import { Clock } from "lucide-react";

const InterviewHUD = ({ step, timeWarning, formatTime, interviewDuration, questionProgress, isMobile }) => {
  if (step !== 2) return null;

  return (
    <>
      <div className="fixed top-14 sm:top-6 left-3 sm:left-6 z-40">
        <div
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 ${
            timeWarning ? "bg-orange-500 animate-pulse" : "bg-blue-500"
          } text-white font-semibold`}
        >
          <Clock size={isMobile ? 14 : 16} />
          <span className="text-xs sm:text-sm">{formatTime(interviewDuration)}</span>
        </div>
      </div>

      <div className="fixed top-24 sm:top-20 left-3 sm:left-6 z-40">
        <div className="bg-white dark:bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg">
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
            Q {questionProgress.current}/{questionProgress.total}
          </span>
        </div>
      </div>
    </>
  );
};

export default InterviewHUD;
