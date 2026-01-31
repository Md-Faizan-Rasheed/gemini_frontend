// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { X } from "lucide-react";

// const BreathingExercise = ({ onComplete, darkMode }) => {
//   const [showExercise, setShowExercise] = useState(false);
//   const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
//   const [count, setCount] = useState(4);
//   const [cycle, setCycle] = useState(0);
//   const totalCycles = 3;

//   useEffect(() => {
//     if (!showExercise) return;

//     const timer = setInterval(() => {
//       setCount(prev => {
//         if (prev === 1) {
//           if (phase === 'inhale') {
//             setPhase('hold');
//             return 4;
//           } else if (phase === 'hold') {
//             setPhase('exhale');
//             return 4;
//           } else if (phase === 'exhale') {
//             setCycle(c => c + 1);
//             setPhase('inhale');
//             return 4;
//           }
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, [phase, showExercise]);

//   useEffect(() => {
//     if (cycle >= totalCycles && showExercise) {
//       setTimeout(() => {
//         setShowExercise(false);
//         onComplete();
//       }, 2000);
//     }
//   }, [cycle, showExercise, onComplete]);

//   if (!showExercise) {
//     return (
//       <div className="mb-6">
//         <button
//           onClick={() => setShowExercise(true)}
//           className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
//         >
//           🧘 Take a Calming Breath First
//         </button>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//           Optional: Help reduce interview anxiety
//         </p>
//       </div>
//     );
//   }

//   const phaseInstructions = {
//     inhale: 'Breathe In...',
//     hold: 'Hold...',
//     exhale: 'Breathe Out...'
//   };

//   const phaseColors = {
//     inhale: 'from-blue-400 to-cyan-500',
//     hold: 'from-purple-400 to-pink-500',
//     exhale: 'from-green-400 to-emerald-500'
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm`}
//     >
//       <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 shadow-2xl`}>
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-2xl font-bold">Breathing Exercise</h3>
//           <button
//             onClick={() => {
//               setShowExercise(false);
//               onComplete();
//             }}
//             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="text-center mb-8">
//           <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//             Cycle {cycle + 1} of {totalCycles}
//           </p>
//           <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//             <motion.div
//               className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
//               initial={{ width: 0 }}
//               animate={{ width: `${((cycle / totalCycles) * 100)}%` }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>
//         </div>

//         <div className="flex flex-col items-center">
//           <motion.div
//             animate={{
//               scale: phase === 'inhale' ? 1.8 : phase === 'hold' ? 1.8 : 1,
//               opacity: phase === 'exhale' ? 0.5 : 1
//             }}
//             transition={{ duration: 1, ease: "easeInOut" }}
//             className={`w-40 h-40 rounded-full bg-gradient-to-br ${phaseColors[phase]} mb-8 shadow-2xl`}
//           />
          
//           <motion.p
//             key={phase}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold mb-4 capitalize"
//           >
//             {phaseInstructions[phase]}
//           </motion.p>
          
//           <motion.p
//             key={count}
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//           >
//             {count}
//           </motion.p>

//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
//             Follow the circle and breathing instructions
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default BreathingExercise;



import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Play, Pause, Sparkles } from "lucide-react";

const BreathingExercise = ({ onComplete, darkMode }) => {
  const [showExercise, setShowExercise] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const totalCycles = 3;
  const audioContextRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [soundEnabled]);

  // Play gentle sound for phase transitions
  const playSound = (frequency = 440, duration = 0.2) => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // Main breathing cycle logic
  useEffect(() => {
    if (!isActive || phase === 'ready') return;

    const timer = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          if (phase === 'inhale') {
            playSound(523.25, 0.15); // C5 note
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            playSound(392.00, 0.15); // G4 note
            setPhase('exhale');
            return 8;
          } else if (phase === 'exhale') {
            const newCycle = cycle + 1;
            setCycle(newCycle);
            if (newCycle >= totalCycles) {
              setIsActive(false);
              playSound(659.25, 0.3); // E5 note - completion
              return 0;
            } else {
              playSound(329.63, 0.15); // E4 note
              setPhase('inhale');
              return 4;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phase, isActive, cycle, soundEnabled]);

  // Auto-complete when cycles finish
  useEffect(() => {
    if (cycle >= totalCycles && isActive === false && showExercise) {
      setTimeout(() => {
        setShowExercise(false);
        onComplete();
      }, 2500);
    }
  }, [cycle, isActive, showExercise, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
    playSound(440, 0.2);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resumeExercise = () => {
    setIsActive(true);
  };

  const skipExercise = () => {
    setShowExercise(false);
    onComplete();
  };

  if (!showExercise) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6 lg:mb-8 px-3 sm:px-0"
      >
        <div className={`${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-200'
        } p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            {/* Icon - adjusted for mobile */}
            <div className="text-3xl sm:text-4xl">🧘‍♀️</div>
            
            <div className="flex-1 w-full">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Feeling Nervous?</h3>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 sm:mb-4 leading-relaxed`}>
                Take a moment to calm your nerves with a guided breathing exercise. 
                <span className="hidden sm:inline"> Research shows deep breathing can reduce anxiety by up to 40%.</span>
              </p>
              
              {/* Buttons - stack on mobile, row on desktop */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowExercise(true)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Breathing Exercise
                </button>
                <button
                  onClick={skipExercise}
                  className={`w-full sm:w-auto px-4 py-3 ${
                    darkMode ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-200 active:bg-gray-300'
                  } rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base`}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const phaseConfig = {
    ready: {
      instruction: 'Get Ready',
      description: 'Prepare to begin',
      descriptionFull: 'Prepare to begin your breathing exercise',
      color: 'from-gray-400 to-gray-500',
      gradient: 'from-gray-500/20 to-gray-600/20',
    },
    inhale: {
      instruction: 'Breathe In',
      description: 'Through your nose',
      descriptionFull: 'Slowly inhale through your nose',
      color: 'from-blue-400 to-cyan-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      particles: '💙',
    },
    hold: {
      instruction: 'Hold',
      description: 'Hold gently',
      descriptionFull: 'Hold your breath gently',
      color: 'from-purple-400 to-pink-500',
      gradient: 'from-purple-500/20 to-pink-500/20',
      particles: '💜',
    },
    exhale: {
      instruction: 'Breathe Out',
      description: 'Through your mouth',
      descriptionFull: 'Slowly exhale through your mouth',
      color: 'from-green-400 to-emerald-500',
      gradient: 'from-green-500/20 to-emerald-500/20',
      particles: '💚',
    }
  };

  const currentPhase = phaseConfig[phase] || phaseConfig.ready;
  const progress = ((cycle / totalCycles) * 100);
  const isComplete = cycle >= totalCycles;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isComplete) {
            pauseExercise();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[calc(100vw-24px)] sm:max-w-md md:max-w-lg shadow-2xl border-2 relative overflow-hidden`}
        >
          {/* Background gradient effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentPhase.gradient} opacity-50 pointer-events-none`} />
          
          {/* Header - Mobile optimized */}
          <div className="relative flex justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8">
            <div className="flex-1 pr-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 leading-tight">
                {isComplete ? (
                  <>
                    <span className="inline sm:hidden">🎉 Done!</span>
                    <span className="hidden sm:inline">🎉 Complete!</span>
                  </>
                ) : (
                  <>
                    <span className="inline sm:hidden">🧘 Breathe</span>
                    <span className="hidden sm:inline">🧘 Breathing Exercise</span>
                  </>
                )}
              </h3>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isComplete ? (
                  <>
                    <span className="inline sm:hidden">You're ready!</span>
                    <span className="hidden sm:inline">Great job! You're ready.</span>
                  </>
                ) : (
                  <>
                    <span className="inline sm:hidden">Follow the circle</span>
                    <span className="hidden sm:inline">Follow the circle and breathe</span>
                  </>
                )}
              </p>
            </div>
            
            {/* Action buttons - compact for mobile */}
            <div className="flex gap-1 sm:gap-2">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 sm:p-3 ${
                  darkMode ? 'hover:bg-gray-800 active:bg-gray-700' : 'hover:bg-gray-100 active:bg-gray-200'
                } rounded-lg sm:rounded-xl transition-colors`}
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
                )}
              </button>
              
              {/* Close button */}
              <button
                onClick={skipExercise}
                className={`p-2 sm:p-3 ${
                  darkMode ? 'hover:bg-gray-800 active:bg-gray-700' : 'hover:bg-gray-100 active:bg-gray-200'
                } rounded-lg sm:rounded-xl transition-colors`}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Progress bar - Mobile optimized */}
          {!isComplete && (
            <div className="relative mb-4 sm:mb-6 md:mb-8">
              <div className="flex justify-between text-xs sm:text-sm font-medium mb-2">
                <span>Cycle {cycle + 1}/{totalCycles}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className={`h-2 sm:h-3 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              } rounded-full overflow-hidden relative`}>
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Main breathing circle - Responsive sizing */}
          <div className="relative flex flex-col items-center mb-4 sm:mb-6 md:mb-8">
            {/* Breathing circle with animations */}
            <div className="relative flex items-center justify-center">
              {/* Outer glow rings - scaled for mobile */}
              <AnimatePresence>
                {isActive && phase !== 'ready' && (
                  <>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: phase === 'inhale' ? [1, 1.4] : phase === 'hold' ? 1.4 : [1.4, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`absolute w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${currentPhase.color} blur-xl sm:blur-2xl -z-10`}
                    />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: phase === 'inhale' ? [1.1, 1.6] : phase === 'hold' ? 1.6 : [1.6, 1.1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ 
                        duration: phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                      className={`absolute w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${currentPhase.color} blur-2xl sm:blur-3xl -z-20`}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Main circle - Responsive sizing */}
              <motion.div
                animate={isActive && phase !== 'ready' ? {
                  scale: phase === 'inhale' ? [1, 1.5] : phase === 'hold' ? 1.5 : [1.5, 1],
                  rotate: phase === 'hold' ? [0, 360] : 0,
                } : { scale: 1 }}
                transition={{ 
                  duration: phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8,
                  ease: "easeInOut"
                }}
                className={`w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${currentPhase.color} shadow-2xl flex items-center justify-center relative overflow-hidden`}
              >
                {/* Particle effects - Scaled for mobile */}
                {isActive && currentPhase.particles && (
                  <motion.div
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl absolute"
                  >
                    {currentPhase.particles}
                  </motion.div>
                )}

                {/* Counter - Responsive text size */}
                <motion.div
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl xs:text-7xl sm:text-7xl md:text-8xl font-bold text-white drop-shadow-lg"
                >
                  {isComplete ? '✓' : count}
                </motion.div>

                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow" />
              </motion.div>
            </div>

            {/* Phase instruction - Mobile optimized spacing */}
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4 sm:mt-6 md:mt-8 px-2"
            >
              <motion.p
                animate={isActive && phase !== 'ready' ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 capitalize"
              >
                {isComplete ? 'Well Done!' : currentPhase.instruction}
              </motion.p>
              <p className={`text-xs xs:text-sm sm:text-base ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isComplete ? (
                  <>
                    <span className="inline sm:hidden">You're calm & ready</span>
                    <span className="hidden sm:inline">You're calm and ready to start</span>
                  </>
                ) : (
                  <>
                    <span className="inline sm:hidden">{currentPhase.description}</span>
                    <span className="hidden sm:inline">{currentPhase.descriptionFull}</span>
                  </>
                )}
              </p>
            </motion.div>
          </div>

          {/* Control buttons - Mobile optimized */}
          <div className="relative flex justify-center gap-2 sm:gap-4">
            {!isComplete && phase === 'ready' && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startExercise}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg active:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="inline sm:hidden">Begin</span>
                <span className="hidden sm:inline">Begin Exercise</span>
              </motion.button>
            )}
            
            {!isComplete && phase !== 'ready' && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isActive ? pauseExercise : resumeExercise}
                className={`px-6 sm:px-6 py-3 ${
                  darkMode ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-200 active:bg-gray-300'
                } rounded-xl font-semibold transition-all flex items-center gap-2 text-sm sm:text-base`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    Resume
                  </>
                )}
              </motion.button>
            )}

            {isComplete && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={skipExercise}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg active:shadow-md transition-all"
              >
                <span className="inline sm:hidden">Continue →</span>
                <span className="hidden sm:inline">Continue to Interview →</span>
              </motion.button>
            )}
          </div>

          {/* Tips - Mobile optimized */}
          {!isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
              } rounded-lg sm:rounded-xl`}
            >
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center leading-relaxed`}>
                💡 <strong>Tip:</strong> 
                <span className="inline sm:hidden"> Breathe naturally with the circle.</span>
                <span className="hidden sm:inline"> Breathe naturally and don't force it. Let the circle guide your pace.</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Custom CSS for shimmer animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes shimmer-slow {
            0% {
              transform: translateX(-100%) rotate(-45deg);
            }
            100% {
              transform: translateX(100%) rotate(-45deg);
            }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          
          .animate-shimmer-slow {
            animation: shimmer-slow 3s infinite;
          }

          /* Extra small devices breakpoint */
          @media (min-width: 375px) {
            .xs\:w-40 {
              width: 10rem;
            }
            .xs\:h-40 {
              height: 10rem;
            }
            .xs\:text-3xl {
              font-size: 1.875rem;
              line-height: 2.25rem;
            }
            .xs\:text-7xl {
              font-size: 4.5rem;
              line-height: 1;
            }
            .xs\:text-sm {
              font-size: 0.875rem;
              line-height: 1.25rem;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default BreathingExercise;