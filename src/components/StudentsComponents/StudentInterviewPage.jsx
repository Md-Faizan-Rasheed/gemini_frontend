import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { createSession, pushTranscript, completeSession, extractAIReport } from "../OrganisationComponents/helpers.js";
import { useToast } from "../Context/ToastContext.jsx";

// Import helper components
import SystemCheckStep from "./helpers/SystemCheckStep.jsx";
import BrowserCompatibilityWarning from "./helpers/BrowserCompatibilityWarning.jsx";
import ResumeInterviewDialog from "./helpers/ResumeInterviewDialog.jsx";
import HelpMenu from "./helpers/HelpMenu.jsx";
import InterviewHeaderButtons from "./interview/InterviewHeaderButtons.jsx";
import NetworkAndErrorBanners from "./interview/NetworkAndErrorBanners.jsx";
import FullscreenWarningModal from "./interview/FullscreenWarningModal.jsx";
import FullscreenIndicator from "./interview/FullscreenIndicator.jsx";
import InterviewHUD from "./interview/InterviewHUD.jsx";
import StepWelcome from "./interview/StepWelcome.jsx";
import StepInterview from "./interview/StepInterview.jsx";
import StepFeedback from "./interview/StepFeedback.jsx";
import StepReport from "./interview/StepReport.jsx";
import ProgressBar from "./interview/ProgressBar.jsx";

const api = axios.create({
  baseURL: "http://localhost:8080/students",
  withCredentials: true,
});

const pageVariants = {
  initial: { opacity: 0, x: 60 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

// Retry fetch utility
const fetchWithRetry = async (url, options, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

const StudentInterviewPage = () => {
  // Steps: 0=SystemCheck, 1=Breathing/Welcome, 2=Interview, 3=Feedback, 4=Report
  const [step, setStep] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [muteAI, setMuteAI] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [report, setReport] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [studentSkills, setStudentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);

  // New state variables
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [requiresUserAction, setRequiresUserAction] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedInterviewState, setSavedInterviewState] = useState(null);
  const [interviewFeedback, setInterviewFeedback] = useState(null);
  const [browserSupport, setBrowserSupport] = useState({
    speechRecognition: false,
    speechSynthesis: false,
    fullscreen: false
  });

  // Mobile-specific states
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  // Time tracking
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [timeWarning, setTimeWarning] = useState(false);

  // Progress tracking
  const [questionProgress, setQuestionProgress] = useState({
    current: 0,
    total: 5
  });

  // Engagement metrics
  const [engagementMetrics, setEngagementMetrics] = useState({
    responseCount: 0,
    averageResponseTime: 0,
    totalSilenceTime: 0,
    wordsSpoken: 0
  });

  const { studentId } = useParams();
  const jobId = "695b9465d4f905b31427de23";
  const navigate = useNavigate();
  const isInterviewActiveRef = useRef(false);
  const { showToast } = useToast();

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);
  const systemPromptRef = useRef("");
  const conversationHistoryRef = useRef([]);
  const transcriptRef = useRef("");
  const sessionIdRef = useRef(null);
  const conversationEndRef = useRef(null);
  const responseStartTimeRef = useRef(null);

  // State refs for callbacks
  const isListeningRef = useRef(false);
  const processingAIRef = useRef(false);
  const interviewStartedRef = useRef(false);

  // Sync state to refs
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    processingAIRef.current = processingAI;
  }, [processingAI]);

  useEffect(() => {
    interviewStartedRef.current = step === 2;
    isInterviewActiveRef.current = step === 2;
  }, [step]);

  // ============== BROWSER SUPPORT CHECK ==============
  useEffect(() => {
    const checkBrowserSupport = () => {
      setBrowserSupport({
        speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
        speechSynthesis: 'speechSynthesis' in window,
        fullscreen: document.fullscreenEnabled || document.webkitFullscreenEnabled || document.msRequestFullscreen
      });
    };
    checkBrowserSupport();
  }, []);

  // ============== MOBILE & ORIENTATION DETECTION ==============
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // ============== ONLINE/OFFLINE DETECTION ==============
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Connection restored", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("No internet connection. Interview paused.", "error");
      stopListening();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ============== AUTH CHECK ==============
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check-auth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!res.data.success) {
          navigate("/StudentSignin");
        }
      } catch {
        navigate("/StudentSignin");
      }
    };
    checkAuth();
  }, [navigate]);

  // ============== CHECK FOR RESUME ==============
  useEffect(() => {
    const backup = localStorage.getItem('interviewBackup');
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        if (Date.now() - parsed.timestamp < 3600000) {
          setShowResumeDialog(true);
          setSavedInterviewState(parsed);
        } else {
          localStorage.removeItem('interviewBackup');
        }
      } catch (e) {
        localStorage.removeItem('interviewBackup');
      }
    }
  }, []);

  // ============== FULLSCREEN FUNCTIONS ==============
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setRequiresUserAction(false);
      setShowFullscreenWarning(false);
    } catch (err) {
      console.error("Error entering fullscreen:", err);
      setError("Unable to enter fullscreen mode. Please try clicking the button again.");
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const checkIfFullscreen = () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  };

  const stopListening = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
      }
    }
    setIsListening(false);
  }, []);

  // ============== FULLSCREEN MONITORING ==============
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = checkIfFullscreen();

      if (!isFullscreen && isInterviewActiveRef.current && step === 2) {
        setFullscreenExitCount((prev) => {
          const newCount = prev + 1;
          
          if (newCount === 1) {
            setWarningMessage("⚠️ Warning 1/2: You have exited fullscreen mode. Please click the button below to return to fullscreen.");
            setShowFullscreenWarning(true);
            setRequiresUserAction(true);
            stopListening();
          } else if (newCount === 2) {
            setWarningMessage("⚠️ Final Warning 2/2: This is your last chance. Exiting fullscreen again will terminate the interview!");
            setShowFullscreenWarning(true);
            setRequiresUserAction(true);
            stopListening();
          } else if (newCount >= 3) {
            setWarningMessage("❌ Interview Terminated: You have exited fullscreen mode 3 times.");
            setShowFullscreenWarning(true);
            setRequiresUserAction(false);
            stopListening();
            synthRef.current.cancel();
            
            setTimeout(async () => {
              if (sessionIdRef.current) {
                await completeSession(sessionIdRef.current);
              }
              
              const terminationNote = "Interview terminated: Candidate exited fullscreen mode 3 times.";
              conversationHistoryRef.current.push({
                role: "system",
                content: terminationNote
              });
              
              await generateReport();
            }, 3000);
          }
          
          return newCount;
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, [step, stopListening]);

  // ============== TAB SWITCHING DETECTION ==============
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && step === 2 && !isPracticeMode) {
        setTabSwitches(prev => {
          const newCount = prev + 1;
          
          if (newCount === 1) {
            setShowTabWarning(true);
            showToast("⚠️ Warning: Tab switching detected (1/3)", "warning");
            setTimeout(() => setShowTabWarning(false), 5000);
          } else if (newCount === 2) {
            setShowTabWarning(true);
            showToast("⚠️ Final Warning: One more tab switch will end interview (2/3)", "error");
            setTimeout(() => setShowTabWarning(false), 5000);
          } else if (newCount >= 3) {
            stopListening();
            synthRef.current.cancel();
            showToast("❌ Interview terminated: Too many tab switches", "error");
            
            setTimeout(async () => {
              if (sessionIdRef.current) {
                await completeSession(sessionIdRef.current);
              }
              
              conversationHistoryRef.current.push({
                role: "system",
                content: "Interview terminated: Candidate switched tabs 3 times."
              });
              
              await generateReport();
            }, 2000);
          }
          
          return newCount;
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [step, isPracticeMode]);

  // ============== COPY-PASTE PREVENTION ==============
  useEffect(() => {
    const handlePaste = (e) => {
      if (step === 2) {
        e.preventDefault();
        showToast("⚠️ Pasting is disabled during interview", "warning");
        console.warn("Paste attempt detected at", new Date().toISOString());
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [step]);

  // ============== KEYBOARD SHORTCUTS ==============
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && step === 2 && !processingAI) {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      
      if (e.code === 'Escape' && step === 2) {
        e.preventDefault();
        setShowHelpMenu(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, isListening, processingAI]);

  // ============== INTERVIEW TIME TRACKING ==============
  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setInterviewDuration(prev => {
          const newTime = prev + 1;
          if (newTime === 1500 && !timeWarning) {
            setTimeWarning(true);
            showToast("⏰ 5 minutes remaining", "info");
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [step, timeWarning]);

  // ============== SAVE INTERVIEW STATE PERIODICALLY ==============
  useEffect(() => {
    if (step === 2) {
      const saveInterval = setInterval(() => {
        const interviewState = {
          conversation: conversationHistoryRef.current,
          sessionId: sessionIdRef.current,
          timestamp: Date.now(),
          studentId,
          jobId,
          questionProgress,
          engagementMetrics,
          interviewDuration
        };
        
        localStorage.setItem('interviewBackup', JSON.stringify(interviewState));
      }, 30000);
      
      return () => clearInterval(saveInterval);
    }
  }, [step, studentId, jobId, questionProgress, engagementMetrics, interviewDuration]);

  // ============== HIDE WARNING WHEN MOVING TO REPORT ==============
  useEffect(() => {
    if (step === 3 || step === 4) {
      setShowFullscreenWarning(false);
      setRequiresUserAction(false);
    }
  }, [step]);

  const handleResumeInterview = async () => {
    await enterFullscreen();
    
    setTimeout(() => {
      if (checkIfFullscreen()) {
        setShowFullscreenWarning(false);
        setRequiresUserAction(false);
        
        if (!processingAIRef.current && step === 2) {
          setTimeout(() => startListening(), 500);
        }
      }
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("studentId");
      localStorage.removeItem("token");
      localStorage.removeItem('interviewBackup');
      navigate("/StudentSignin");
    } catch (err) {
      console.error("Logout failed:", err);
      showToast("Logout failed, please try again.", "error");
    }
  };

  // ============== FETCH STUDENT DATA ==============
  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const studentResponse = await fetchWithRetry(
          `http://localhost:8080/students/student-skill/${studentId}`,
          { method: 'GET' }
        );

        const studentResult = await studentResponse.json();

        const skills = studentResult?.student?.skills || [];
        setStudentSkills(skills);
        const skillTitle =
          skills.length > 0
            ? `Interview: ${skills.map((s) => s.skill).join(", ")}`
            : "Skill-Based Technical Interview";

        setData({
          title: skillTitle,
          description: "Interview based strictly on candidate skills",
          numberOfQuestions: skills.length >= 5 ? 5 : 3,
        });
        
        setQuestionProgress({
          current: 0,
          total: skills.length >= 5 ? 5 : 3
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load student data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [studentId]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Ensure processingAI is false when entering feedback step
useEffect(() => {
  if (step === 3) {
    setProcessingAI(false);
  }
}, [step]);
  // ============== AI VOICE ==============
  const speak = useCallback(
    (text) =>
      new Promise((resolve) => {
        if (muteAI) return resolve();
        synthRef.current.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        synthRef.current.speak(utter);
      }),
    [muteAI]
  );

  const startListening = useCallback(() => {
    if (!recognitionRef.current || processingAIRef.current || isListeningRef.current) {
      return;
    }

    clearTimeout(silenceTimerRef.current);
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
    setIsListening(true);
    responseStartTimeRef.current = Date.now();

    try {
      recognitionRef.current.start();
    } catch (e) {
    }
  }, []);

  // ============== TRACK RESPONSE TIME ==============
  const trackResponseTime = useCallback((startTime) => {
    const responseTime = Date.now() - startTime;
    setEngagementMetrics(prev => ({
      ...prev,
      responseCount: prev.responseCount + 1,
      averageResponseTime: (prev.averageResponseTime * prev.responseCount + responseTime) / (prev.responseCount + 1)
    }));
  }, []);

  // ============== DETECT NEW QUESTION ==============
  const detectNewQuestion = useCallback((aiMessage) => {
    if (aiMessage.trim().endsWith('?')) {
      setQuestionProgress(prev => ({
        ...prev,
        current: Math.min(prev.current + 1, prev.total)
      }));
    }
  }, []);

  // ============== SUBMIT RESPONSE ==============
  const submitResponseWithText = useCallback(async (messageText) => {
    if (processingAIRef.current) return;

    const message = messageText.trim();
    if (!message) {
      setTimeout(() => startListening(), 500);
      return;
    }

    if (responseStartTimeRef.current) {
      trackResponseTime(responseStartTimeRef.current);
      responseStartTimeRef.current = null;
    }

    const wordCount = message.split(/\s+/).length;
    setEngagementMetrics(prev => ({
      ...prev,
      wordsSpoken: prev.wordsSpoken + wordCount
    }));

    stopListening();
    setProcessingAI(true);

    conversationHistoryRef.current.push({
      role: "user",
      content: message
    });

    setConversation(prev => [...prev, { role: "user", content: message }]);

    try {
      const res = await fetchWithRetry("https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPromptRef.current },
            ...conversationHistoryRef.current
          ]
        })
      });

      const json = await res.json();
      const aiMessage = json.choices?.[0]?.message?.content || "I'm sorry, I didn't quite get that. Could you clarify?";

      conversationHistoryRef.current.push({
        role: "assistant",
        content: aiMessage
      });

      setConversation(prev => [...prev, { role: "assistant", content: aiMessage }]);

      detectNewQuestion(aiMessage);

      await speak(aiMessage);

      // if (aiMessage.includes("INTERVIEW_COMPLETE")) {
      //   setInterviewComplete(true);
      //   await completeSession(sessionIdRef.current);
      //   localStorage.removeItem('interviewBackup');
      //   setStep(3);
      //   return;
      // }

      // setProcessingAI(false);
      // setTimeout(() => startListening(), 500);

      // Check for INTERVIEW_COMPLETE
if (aiMessage.includes("INTERVIEW_COMPLETE")) {
  
  setInterviewComplete(true);
  
  // Complete session in background
  completeSession(sessionIdRef.current).catch(err => 
    console.error("Session completion error:", err)
  );
  
  // Clear backup
  localStorage.removeItem('interviewBackup');
  
  // ⚠️ CRITICAL: Reset processingAI BEFORE changing step
  setProcessingAI(false);  // <--- THIS IS THE KEY FIX
  
  // Small delay to ensure state updates
  setTimeout(() => {
    setStep(3);
  }, 100);
  
  // Exit early
  return;
}
// If not complete, continue as normal
    setProcessingAI(false);
    setTimeout(() => startListening(), 500);

    } catch (err) {
      console.error("❌ AI response error:", err);
      showToast("Connection error. Retrying...", "error");
      setProcessingAI(false);
      setTimeout(() => startListening(), 2000);
    }
  }, [startListening, stopListening, speak, trackResponseTime, detectNewQuestion]);

  // ============== SPEECH RECOGNITION SETUP ==============
  useEffect(() => {
    if (!browserSupport.speechRecognition) {
      // Handle unsupported browsers
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();

    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      clearTimeout(silenceTimerRef.current);

      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text + " ";
        } else {
          interim += text;
        }
      }

      if (final) {
        const newTranscript = transcriptRef.current + final;
        transcriptRef.current = newTranscript;
        setTranscript(newTranscript);
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }

      silenceTimerRef.current = setTimeout(() => {
        if (transcriptRef.current.trim()) {
          stopListening();
          submitResponseWithText(transcriptRef.current);
        }
      }, 2000);
    };

    rec.onend = () => {
      if (isListeningRef.current && 
          !processingAIRef.current && 
          interviewStartedRef.current &&
          isOnline) {
        try {
          rec.start();
        } catch (e) {
        }
      }
    };

    rec.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        return;
      }
      
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setTimeout(() => {
        if (interviewStartedRef.current && !processingAIRef.current && isOnline) {
          startListening();
        }
      }, 1000);
    };

    recognitionRef.current = rec;

    return () => {
      clearTimeout(silenceTimerRef.current);
      if (rec) rec.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [submitResponseWithText, startListening, stopListening, browserSupport, isOnline]);

  // ============== START INTERVIEW ==============
  const startInterview = async () => {

    setFullscreenExitCount(0);
    setShowFullscreenWarning(false);
    setRequiresUserAction(false);
    setTabSwitches(0);
    setInterviewDuration(0);
    setTimeWarning(false);
    
    if (!isPracticeMode) {
      await enterFullscreen();
    }
    
    setStep(2);
    setError(null);

    if (!data || !Array.isArray(studentSkills) || studentSkills.length === 0) {
      setError("Missing candidate skills or data");
      return;
    }

    const skillsText = studentSkills
      .map((s) => `${s.skill} (${s.level})`)
      .join(", ");


    const systemPrompt = `You are an experienced IIT interview panelist conducting a real-time, human-like technical and behavioral interview for the position of "${data.title}".

CANDIDATE SKILLS (with proficiency level):
${skillsText}

Your goal is to simulate an actual live interview, not a scripted Q&A.

${isPracticeMode ? `
🎯 PRACTICE MODE ACTIVE:
- Be slightly more encouraging and supportive
- Provide gentle hints if the candidate struggles for more than 20 seconds
- Give brief feedback after each answer (e.g., "Good explanation" or "That's on the right track")
- At the end, provide detailed feedback on each answer
` : ''}

INTERVIEW STYLE & BEHAVIOR:
- Speak naturally, like a human interviewer
- Use short acknowledgments such as "Okay", "I see", "That's interesting", "Hmm", "Got it"
- Ask follow-up questions based on the candidate's previous answer
- Adjust question difficulty dynamically based on how well the candidate responds
- Do NOT ask all questions at once
- Ask only ONE question at a time
- Wait for the candidate's response before continuing
- Keep responses conversational and brief (2-3 sentences max unless explaining something)

INTERVIEW STRUCTURE:
1. Start with a brief, friendly introduction (1-2 sentences)
2. Begin with an easy warm-up question
3. Gradually increase difficulty
4. Mix technical, conceptual, and behavioral questions
5. Ask clarification or probing questions if an answer is vague or incomplete
6. If the candidate struggles, gently guide them instead of immediately moving on
7. Maintain a professional but calm and human tone throughout
8. Conduct ${data.numberOfQuestions} questions total

HUMANIZATION RULES:
- Avoid robotic phrasing
- Avoid long monologues
- React briefly to answers before asking the next question (e.g., "Interesting. So...")
- Occasionally rephrase or simplify questions like a real interviewer
- Maintain interview pacing similar to a real IIT panel
- Show genuine interest in their answers

IMPORTANT CONSTRAINTS:
- Do NOT reveal evaluation criteria during the interview
- Do NOT give solutions unless explicitly asked
- Do NOT mention that you are an AI
- Do NOT use markdown or formatting
- Keep responses concise and conversational

ENDING THE INTERVIEW:
- After ${data.numberOfQuestions} questions, thank the candidate professionally
- End your final message with the exact phrase: INTERVIEW_COMPLETE

Now begin the interview naturally.`;

    systemPromptRef.current = systemPrompt;
    setProcessingAI(true);

    try {
      const session = await createSession(studentId, jobId);
      sessionIdRef.current = session._id;

      const res = await fetchWithRetry("https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Hello, I'm ready for the interview." },
          ],
        }),
      });

      const json = await res.json();
      const aiMessage = json.choices?.[0]?.message?.content;

      conversationHistoryRef.current = [{ role: "assistant", content: aiMessage }];
      setConversation([{ role: "assistant", content: aiMessage }]);

      detectNewQuestion(aiMessage);

      await speak(aiMessage);

      setProcessingAI(false);
      setTimeout(() => startListening(), 500);
    } catch (err) {
      console.error("❌ Interview start error:", err);
      setError(err.message || "Failed to start interview. Please try again.");
      setProcessingAI(false);
    }
  };

  // ============== RESUME SAVED INTERVIEW ==============
  const handleResumeFromBackup = () => {
    if (savedInterviewState) {
      conversationHistoryRef.current = savedInterviewState.conversation;
      sessionIdRef.current = savedInterviewState.sessionId;
      setConversation(savedInterviewState.conversation);
      setQuestionProgress(savedInterviewState.questionProgress || questionProgress);
      setEngagementMetrics(savedInterviewState.engagementMetrics || engagementMetrics);
      setInterviewDuration(savedInterviewState.interviewDuration || 0);
      setStep(2);
      setShowResumeDialog(false);
      
      setTimeout(() => {
        if (!isPracticeMode) {
          enterFullscreen();
        }
        setTimeout(() => startListening(), 1000);
      }, 500);
    }
  };

  const handleStartFresh = () => {
    localStorage.removeItem('interviewBackup');
    setShowResumeDialog(false);
    setSavedInterviewState(null);
  };

  // ============== GENERATE REPORT ==============
  const generateReport = async () => {
    setShowFullscreenWarning(false);
    setRequiresUserAction(false);
    setProcessingAI(true);

    const conversationText = conversationHistoryRef.current
      .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      .join("\n\n");


    try {
      const res = await fetchWithRetry("https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `
Based on the following interview transcript for the position of "${data?.title || "Intern"}",
generate a professional and comprehensive evaluation.

INTERVIEW TRANSCRIPT:
${conversationText}

${isPracticeMode ? `
NOTE: This was a PRACTICE interview. Include specific tips and detailed feedback for improvement.
` : ''}

ENGAGEMENT METRICS:
- Total responses: ${engagementMetrics.responseCount}
- Average response time: ${(engagementMetrics.averageResponseTime / 1000).toFixed(1)}s
- Total words spoken: ${engagementMetrics.wordsSpoken}
- Interview duration: ${Math.floor(interviewDuration / 60)} minutes

Return the response in TWO PARTS:

====================
PART 1: STRUCTURED JSON (for storage)
====================

Return ONLY valid JSON in the following schema:

{
  "overallRating": number (0–10),
  "scores": {
    "technical": number (0–10),
    "communication": number (0–10),
    "problemSolving": number (0–10),
    "confidence": number (0–10)
  },
  "strengths": [string],
  "weaknesses": [string],
  "areasForDevelopment": [string],
  "highlights": [string],
  "recommendation": {
    "decision": "Strongly Recommend" | "Recommend" | "Consider" | "Do Not Recommend",
    "confidence": number (0–1)
  }
}

====================
PART 2: HUMAN-READABLE REPORT
====================

Generate a professional evaluation report with the following sections:

1. OVERALL ASSESSMENT (Rating out of 10)
2. TECHNICAL COMPETENCE
3. COMMUNICATION SKILLS
4. PROBLEM-SOLVING ABILITY
5. KEY HIGHLIGHTS
6. AREAS FOR DEVELOPMENT
7. ENGAGEMENT ANALYSIS
8. FINAL RECOMMENDATION

${isPracticeMode ? `
9. PRACTICE MODE FEEDBACK
   - Detailed tips for improvement
   - Specific examples of what went well
   - Actionable next steps
` : ''}

Tone:
- Professional
- Constructive
- Specific
- Suitable for hiring managers
              `,
            },
          ],
        }),
      });

      const json = await res.json();
      const aiContent = json.choices?.[0]?.message?.content;

      const { structured, reportText } = extractAIReport(aiContent);

      setReport(reportText || "Error: report formatting issue.");
      
      localStorage.removeItem('interviewBackup');

      try {
        const saveRes = await fetch("http://localhost:8080/api/interview-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aiContent,
            structuredReport: structured,
            sessionId: sessionIdRef.current,
            candidateId: studentId,
            jobId,
            jobTitle: data?.title || "Intern",
            isPracticeMode,
            engagementMetrics,
            interviewDuration,
            feedback: interviewFeedback
          }),
        });

        if (saveRes.ok) {
          const saveResult = await saveRes.json();
        }
      } catch (err) {
        console.error("💾 Report saving error:", err);
      }

      setStep(4);
    } catch (err) {
      console.error("❌ Report generation error:", err);
      setReport("Error generating report. Please try again.");
    } finally {
      setProcessingAI(false);
    }
  };

  // ============== HANDLE FEEDBACK SUBMISSION ==============
  const handleFeedbackSubmit = async (feedback) => {
    setInterviewFeedback(feedback);

    setProcessingAI(true);  // <--- Now it's correct to be true

    
    try {
      const res = await fetch(
        `http://localhost:8080/api/interview-feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId,
            ...feedback
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

    } catch (err) {
      console.error("❌ Feedback save error:", err);
    }
    
    await generateReport();
  };

  const resetInterview = () => {
    exitFullscreen();
    setFullscreenExitCount(0);
    setShowFullscreenWarning(false);
    setWarningMessage("");
    setRequiresUserAction(false);
    setTabSwitches(0);
    setInterviewDuration(0);
    setTimeWarning(false);
    setQuestionProgress({ current: 0, total: data?.numberOfQuestions || 5 });
    setEngagementMetrics({
      responseCount: 0,
      averageResponseTime: 0,
      totalSilenceTime: 0,
      wordsSpoken: 0
    });
    setStep(1);
    setConversation([]);
    setInterviewComplete(false);
    setReport(null);
    setTranscript("");
    setInterimTranscript("");
    setInterviewFeedback(null);
    setIsPracticeMode(false);
    transcriptRef.current = "";
    conversationHistoryRef.current = [];
    systemPromptRef.current = "";
    synthRef.current.cancel();
    stopListening();
    localStorage.removeItem('interviewBackup');
  };

  const handleManualSubmit = () => {
    if (transcriptRef.current.trim()) {
      stopListening();
      submitResponseWithText(transcriptRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-700 animate-pulse">Loading interview...</p>
        </div>
      </div>
    );
  }

  const progressWidth =
    step === 0 ? "20%" : 
    step === 1 ? "40%" : 
    step === 2 ? "60%" : 
    step === 3 ? "80%" : 
    step === 4 ? "100%" : "0%";

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-gray-900"
      } transition-all duration-300`}
    >
      {/* Browser Compatibility Warning */}
      <BrowserCompatibilityWarning browserSupport={browserSupport} />

      <InterviewHeaderButtons
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        step={step}
        muteAI={muteAI}
        onToggleMuteAI={() => setMuteAI(!muteAI)}
        onOpenHelp={() => setShowHelpMenu(true)}
        onLogout={handleLogout}
        isMobile={isMobile}
      />

      <NetworkAndErrorBanners
        isOnline={isOnline}
        isMobile={isMobile}
        showTabWarning={showTabWarning}
        tabSwitches={tabSwitches}
        error={error}
      />

      <FullscreenWarningModal
        show={showFullscreenWarning}
        fullscreenExitCount={fullscreenExitCount}
        warningMessage={warningMessage}
        requiresUserAction={requiresUserAction}
        onResume={handleResumeInterview}
      />

      <FullscreenIndicator
        show={step === 2 && !showFullscreenWarning}
        isPracticeMode={isPracticeMode}
        checkIfFullscreen={checkIfFullscreen}
        fullscreenExitCount={fullscreenExitCount}
      />

      <InterviewHUD
        step={step}
        timeWarning={timeWarning}
        formatTime={formatTime}
        interviewDuration={interviewDuration}
        questionProgress={questionProgress}
        isMobile={isMobile}
      />

      {/* Help Menu */}
      <HelpMenu 
        show={showHelpMenu} 
        onClose={() => setShowHelpMenu(false)}
        darkMode={darkMode}
      />

      {/* Resume Interview Dialog */}
      <ResumeInterviewDialog
        show={showResumeDialog}
        onResume={handleResumeFromBackup}
        onStartFresh={handleStartFresh}
        savedState={savedInterviewState}
        darkMode={darkMode}
      />

      {/* Page container - Responsive padding */}
      <div className="max-w-4xl mx-auto p-3 sm:p-5 flex flex-col flex-grow w-full">
        <AnimatePresence mode="wait">
          {/* STEP 0: System Check */}
          {step === 0 && (
            <SystemCheckStep
              key="system-check"
              onComplete={() => setStep(1)}
              darkMode={darkMode}
              isMobile={isMobile}
            />
          )}

          {/* STEP 1: Welcome & Breathing Exercise */}
          {step === 1 && (
            <StepWelcome
              pageVariants={pageVariants}
              data={data}
              darkMode={darkMode}
              isMobile={isMobile}
              onStartPractice={() => {
                setIsPracticeMode(true);
                startInterview();
              }}
              onStartReal={() => {
                setIsPracticeMode(false);
                startInterview();
              }}
            />
          )}

          {/* STEP 2: Interview - Highly Responsive */}
          {step === 2 && (
            <StepInterview
              pageVariants={pageVariants}
              conversation={conversation}
              conversationEndRef={conversationEndRef}
              isPracticeMode={isPracticeMode}
              darkMode={darkMode}
              isListening={isListening}
              isSpeaking={isSpeaking}
              processingAI={processingAI}
              isOnline={isOnline}
              transcript={transcript}
              interimTranscript={interimTranscript}
              isMobile={isMobile}
              onToggleListening={isListening ? stopListening : startListening}
              onManualSubmit={handleManualSubmit}
              onComplete={() => {
                if (window.confirm("End interview?")) {
                  stopListening();
                  synthRef.current.cancel();
                  setStep(3);
                }
              }}
            />
          )}

          {/* STEP 3: Feedback */}
          {step === 3 && (
            <StepFeedback
              pageVariants={pageVariants}
              onSubmit={handleFeedbackSubmit}
              darkMode={darkMode}
              processingAI={processingAI}
            />
          )}

          {/* STEP 4: Report - Beautiful Display */}
          {step === 4 && (
            <StepReport
              pageVariants={pageVariants}
              report={report}
              darkMode={darkMode}
              isPracticeMode={isPracticeMode}
              engagementMetrics={engagementMetrics}
              interviewDuration={interviewDuration}
              isMobile={isMobile}
              onStartAnother={() => navigate(`/StudentHomePage/${studentId}`)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom progress bar */}
      <ProgressBar progressWidth={progressWidth} />
    </div>
  );
};

export default StudentInterviewPage;

