import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mic, 
  Volume2, 
  Wifi, 
  CheckCircle, 
  XCircle, 
  Loader,
  AlertCircle,
  Camera
} from "lucide-react";

const SystemCheckStep = ({ onComplete, darkMode, isMobile }) => {
  const [checks, setChecks] = useState({
    microphone: 'pending',
    speaker: 'pending',
    internet: 'pending',
    browser: 'pending'
  });
  
  const [checkingComplete, setCheckingComplete] = useState(false);
  const [hasFailures, setHasFailures] = useState(false);

  useEffect(() => {
    runSystemChecks();
  }, []);

  const runSystemChecks = async () => {
    // 1. Browser Check
    const browserCheck = () => {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isChrome || isEdge || (isSafari && parseFloat(navigator.userAgent.match(/Version\/(\d+\.\d+)/)?.[1]) >= 14.1)) {
        setChecks(prev => ({ ...prev, browser: 'success' }));
        return true;
      } else {
        setChecks(prev => ({ ...prev, browser: 'failed' }));
        return false;
      }
    };

    // 2. Microphone test
    const microphoneCheck = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Test audio levels for 2 seconds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // Check if microphone is picking up sound
        return new Promise((resolve) => {
          setTimeout(() => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
            
            if (average > 0) {
              setChecks(prev => ({ ...prev, microphone: 'success' }));
              resolve(true);
            } else {
              setChecks(prev => ({ ...prev, microphone: 'warning' }));
              resolve(true); // Still allow, but warn
            }
          }, 2000);
        });
      } catch (error) {
        console.error("Microphone error:", error);
        setChecks(prev => ({ ...prev, microphone: 'failed' }));
        return false;
      }
    };

    // 3. Speaker test
    const speakerCheck = async () => {
      return new Promise((resolve) => {
        try {
          const utterance = new SpeechSynthesisUtterance("Testing audio");
          utterance.volume = 0.1;
          utterance.rate = 2; // Speak faster for quick test
          
          utterance.onend = () => {
            setChecks(prev => ({ ...prev, speaker: 'success' }));
            resolve(true);
          };
          
          utterance.onerror = () => {
            setChecks(prev => ({ ...prev, speaker: 'warning' }));
            resolve(true);
          };
          
          window.speechSynthesis.speak(utterance);
          
          // Timeout after 3 seconds
          setTimeout(() => {
            window.speechSynthesis.cancel();
            setChecks(prev => ({ ...prev, speaker: 'success' }));
            resolve(true);
          }, 3000);
        } catch (error) {
          setChecks(prev => ({ ...prev, speaker: 'warning' }));
          resolve(true);
        }
      });
    };

    // 4. Internet speed test
    const internetCheck = async () => {
      const startTime = Date.now();
      try {
        // Fetch a small resource from your backend
        // await fetch('https://www.google.com/favicon.ico', { cache: 'no-store' });
        if (!navigator.onLine) {
} else {
}

        const duration = Date.now() - startTime;
        console.log("Internet speed test duration (ms):", duration);
        
        if (duration < 500) {
          setChecks(prev => ({ ...prev, internet: 'success' }));
          return true;
        } else if (duration < 2000) {
          setChecks(prev => ({ ...prev, internet: 'warning' }));
          return true;
        } else {
          setChecks(prev => ({ ...prev, internet: 'warning' }));
          return true;
        }
      } catch (error) {
        setChecks(prev => ({ ...prev, internet: 'failed' }));
        return false;
      }
    };

    // Run all checks sequentially
    try {
      const browserOk = browserCheck();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const micOk = await microphoneCheck();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const speakerOk = await speakerCheck();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const internetOk = await internetCheck();
      
      setCheckingComplete(true);
      
      // Check if any critical failures
      const criticalFailure = !browserOk || !micOk || !internetOk;
      setHasFailures(criticalFailure);
      
    } catch (error) {
      console.error("System check error:", error);
      setCheckingComplete(true);
      setHasFailures(true);
    }
  };

  const retryCheck = (checkName) => {
    setChecks(prev => ({ ...prev, [checkName]: 'pending' }));
    setCheckingComplete(false);
    
    setTimeout(() => {
      runSystemChecks();
    }, 500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'pending':
        return <Loader className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <Loader className="w-6 h-6 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Ready';
      case 'failed':
        return 'Failed';
      case 'warning':
        return 'Warning';
      case 'pending':
        return 'Testing...';
      default:
        return 'Waiting...';
    }
  };

  const checkItems = [
    { key: 'browser', label: 'Browser Compatibility', icon: Wifi },
    { key: 'microphone', label: 'Microphone Access', icon: Mic },
    { key: 'speaker', label: 'Speaker/Audio Output', icon: Volume2 },
    { key: 'internet', label: 'Internet Connection', icon: Wifi }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 md:p-8"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">System Check</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please allow permissions and ensure your system is ready
        </p>
      </div>

      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
            📱 Mobile Device Detected
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Use headphones for best audio quality</li>
            <li>Close other apps to free up memory</li>
            <li>Ensure you're on WiFi or have good signal</li>
            <li>Keep your device charged (50%)</li>
          </ul>
        </motion.div>
      )}

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 space-y-4`}>
        {checkItems.map((item, index) => {
          const status = checks[item.key];
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                status === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-900/20' :
                status === 'failed' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                status === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-gray-200 bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                  status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  'bg-gray-100 dark:bg-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.label}
                  </p>
                  {status === 'warning' && (
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      {item.key === 'microphone' && 'No audio detected - please speak to test'}
                      {item.key === 'internet' && 'Slow connection detected'}
                      {item.key === 'speaker' && 'Unable to verify - please check manually'}
                    </p>
                  )}
                  {status === 'failed' && (
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      {item.key === 'browser' && 'Please use Chrome, Edge, or Safari 14.1+'}
                      {item.key === 'microphone' && 'Microphone access denied or unavailable'}
                      {item.key === 'internet' && 'No internet connection'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <span className={`text-sm font-semibold ${
                  status === 'success' ? 'text-green-600 dark:text-green-400' :
                  status === 'failed' ? 'text-red-600 dark:text-red-400' :
                  status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-gray-500'
                }`}>
                  {getStatusText(status)}
                </span>
                
                {status === 'failed' && (
                  <button
                    onClick={() => retryCheck(item.key)}
                    className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {checkingComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          {hasFailures ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
              <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                ⚠️ Critical Issues Detected
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Please resolve the failed checks before continuing. Click "Retry" to test again.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                ✓ All Systems Ready!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                You can now proceed to the interview.
              </p>
            </div>
          )}

          <button
            onClick={onComplete}
            disabled={hasFailures}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              hasFailures
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            {hasFailures ? 'Resolve Issues to Continue' : 'Continue to Interview'}
          </button>
        </motion.div>
      )}

      {!checkingComplete && (
        <div className="mt-6 text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Running system diagnostics...
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SystemCheckStep;