import { Sun, Moon, Volume2, VolumeX, HelpCircle, LogOut } from "lucide-react";

const InterviewHeaderButtons = ({
  darkMode,
  onToggleDarkMode,
  step,
  muteAI,
  onToggleMuteAI,
  onOpenHelp,
  onLogout,
  isMobile,
}) => {
  return (
    <div className="fixed top-3 sm:top-5 right-3 sm:right-5 flex gap-2 sm:gap-3 z-50">
      <button
        onClick={onToggleDarkMode}
        className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <Sun size={isMobile ? 18 : 20} /> : <Moon size={isMobile ? 18 : 20} />}
      </button>

      {step === 2 && (
        <>
          <button
            onClick={onToggleMuteAI}
            className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
            title={muteAI ? "Unmute AI voice" : "Mute AI voice"}
          >
            {muteAI ? <VolumeX size={isMobile ? 18 : 20} /> : <Volume2 size={isMobile ? 18 : 20} />}
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
            title="Help & Shortcuts"
          >
            <HelpCircle size={isMobile ? 18 : 20} />
          </button>
        </>
      )}

      <button
        onClick={onLogout}
        className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        title="Logout"
      >
        <LogOut size={isMobile ? 18 : 20} />
      </button>
    </div>
  );
};

export default InterviewHeaderButtons;
