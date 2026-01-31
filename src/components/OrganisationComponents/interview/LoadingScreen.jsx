// const LoadingScreen = ({ darkMode }) => {
//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center ${
//         darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
//       }`}
//     >
//       <div className="text-center px-4">
//         <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
//           <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
//           <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//         </div>
//         <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
//           Loading interview details...
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoadingScreen;


const LoadingScreen = ({ darkMode }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
      } overflow-hidden relative`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-blob ${
            darkMode ? "bg-blue-500" : "bg-blue-300"
          }`}
        ></div>
        <div
          className={`absolute top-40 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 ${
            darkMode ? "bg-purple-500" : "bg-purple-300"
          }`}
        ></div>
        <div
          className={`absolute -bottom-20 left-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000 ${
            darkMode ? "bg-pink-500" : "bg-pink-300"
          }`}
        ></div>
      </div>

      <div className="text-center px-4 relative z-10">
        {/* Main loader container */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-purple-400 rounded-full animate-spin-reverse"></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${
                darkMode ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-gradient-to-br from-blue-500 to-purple-500"
              } animate-pulse-slow shadow-lg`}>
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  {/* Microphone icon */}
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce-subtle"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full -ml-1.5 shadow-lg"></div>
          </div>
          <div className="absolute inset-0 animate-spin-reverse animation-delay-1000">
            <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full -ml-1.5 shadow-lg"></div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h2 className={`text-xl sm:text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          } animate-fade-in`}>
            Preparing Your Interview
          </h2>
          
          <p className={`text-sm sm:text-base font-medium ${
            darkMode ? "text-gray-300" : "text-gray-600"
          } animate-fade-in animation-delay-500`}>
            Loading interview details...
          </p>

          {/* Loading dots */}
          <div className="flex justify-center space-x-2 pt-2 animate-fade-in animation-delay-1000">
            <div className={`w-2 h-2 rounded-full ${
              darkMode ? "bg-blue-400" : "bg-blue-500"
            } animate-bounce animation-delay-0`}></div>
            <div className={`w-2 h-2 rounded-full ${
              darkMode ? "bg-purple-400" : "bg-purple-500"
            } animate-bounce animation-delay-200`}></div>
            <div className={`w-2 h-2 rounded-full ${
              darkMode ? "bg-pink-400" : "bg-pink-500"
            } animate-bounce animation-delay-400`}></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className={`h-1 rounded-full overflow-hidden ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}>
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress"></div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.95);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;