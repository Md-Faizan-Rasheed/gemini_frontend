import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Mic, MicOff, FileText, Play, Volume2, VolumeX, LogOut,
  AlertCircle, CheckCircle, XCircle, Clock, Wifi, WifiOff, 
  Loader, HelpCircle, Star, MessageSquare, ChevronDown, ChevronUp
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { createSession, pushTranscript, completeSession, extractAIReport } from "../OrganisationComponents/helpers.js";
import { useToast } from "../Context/ToastContext.jsx";

// Import helper components
import SystemCheckStep from "./helpers/SystemCheckStep.jsx";
import BrowserCompatibilityWarning from "./helpers/BrowserCompatibilityWarning.jsx";
import BreathingExercise from "./helpers/BreathingExercise.jsx";
import FeedbackForm from "./helpers/FeedbackForm.jsx";
import ResumeInterviewDialog from "./helpers/ResumeInterviewDialog.jsx";
import HelpMenu from "./helpers/HelpMenu.jsx";
import BeautifulReportDisplay from "./helpers/Beautifulreportdisplay.jsx";

const api = axios.create({
  baseURL: "https://jubilant-fortnight-node-backend.onrender.com/students",
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
      console.log(`Attempt ${i + 1} failed, retrying...`);
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
        console.log('Stop error:', e);
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
          `https://jubilant-fortnight-node-backend.onrender.com/students/student-skill/${studentId}`,
          { method: 'GET' }
        );

        const studentResult = await studentResponse.json();
        console.log("Student API result:", studentResult.student.skills);

        const skills = studentResult?.student?.skills || [];
        setStudentSkills(skills);
        setData({
          title: "Skill-Based Technical Interview",
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
      console.log("Recognition already started:", e);
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

      if (aiMessage.includes("INTERVIEW_COMPLETE")) {
        setInterviewComplete(true);
        await completeSession(sessionIdRef.current);
        localStorage.removeItem('interviewBackup');
        setStep(3);
        return;
      }

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
          console.log("Recognition restart failed:", e);
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
    console.log("🚀 Starting interview...");

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

    console.log("Formatted Skills for AI:", skillsText);

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

    console.log("🧾 System Prompt:", systemPrompt);
    systemPromptRef.current = systemPrompt;
    setProcessingAI(true);

    try {
      const session = await createSession(studentId, jobId);
      sessionIdRef.current = session._id;
      console.log("✅ Session created:", sessionIdRef.current);

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
      console.log("✅ OpenAI response JSON:", json);
      const aiMessage = json.choices?.[0]?.message?.content;
      console.log("🤖 AI Message:", aiMessage);

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

    console.log("🧾 Generating AI evaluation for conversation:\n", conversationText);

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
      console.log("✅ AI Report Raw Content:", aiContent);

      const { structured, reportText } = extractAIReport(aiContent);
      console.log("📊 Parsed Report:", structured);

      setReport(reportText || "Error: report formatting issue.");
      
      localStorage.removeItem('interviewBackup');

      try {
        const saveRes = await fetch("https://jubilant-fortnight-node-backend.onrender.com/api/interview-report", {
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
          console.log("✅ Interview report saved successfully");
          console.log("🆔 Report ID:", saveResult.reportId);
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
    
    try {
      await fetch("https://jubilant-fortnight-node-backend.onrender.com/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          studentId,
          jobId,
          feedback
        }),
      });
      console.log("✅ Feedback saved");
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

      {/* Header buttons - Responsive */}
      <div className="fixed top-3 sm:top-5 right-3 sm:right-5 flex gap-2 sm:gap-3 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={isMobile ? 18 : 20} /> : <Moon size={isMobile ? 18 : 20} />}
        </button>

        {step === 2 && (
          <>
            <button
              onClick={() => setMuteAI(!muteAI)}
              className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              title={muteAI ? "Unmute AI voice" : "Mute AI voice"}
            >
              {muteAI ? <VolumeX size={isMobile ? 18 : 20} /> : <Volume2 size={isMobile ? 18 : 20} />}
            </button>
            
            <button
              onClick={() => setShowHelpMenu(true)}
              className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              title="Help & Shortcuts"
            >
              <HelpCircle size={isMobile ? 18 : 20} />
            </button>
          </>
        )}

        <button
          onClick={handleLogout}
          className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          title="Logout"
        >
          <LogOut size={isMobile ? 18 : 20} />
        </button>
      </div>

      {/* Offline Warning - Responsive */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-[90%] sm:max-w-md w-full px-3 sm:px-4"
        >
          <div className="p-3 sm:p-4 bg-red-500 text-white rounded-xl sm:rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 sm:gap-3">
            <WifiOff size={isMobile ? 20 : 24} />
            <span className="text-xs sm:text-sm font-semibold">No Internet - Interview Paused</span>
          </div>
        </motion.div>
      )}

      {/* Tab Switch Warning - Responsive */}
      {showTabWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-[90%] sm:max-w-md w-full px-3 sm:px-4"
        >
          <div className="p-3 sm:p-4 bg-orange-500 text-white rounded-xl sm:rounded-2xl text-center shadow-lg">
            <p className="text-xs sm:text-sm font-semibold">⚠️ Tab Switching ({tabSwitches}/3)</p>
            <p className="text-xs mt-1">Stay on this tab</p>
          </div>
        </motion.div>
      )}

      {/* Error Display - Responsive */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-[90%] sm:max-w-md w-full px-3 sm:px-4"
        >
          <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900 rounded-xl sm:rounded-2xl text-center text-red-800 dark:text-red-200 shadow-lg text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        </motion.div>
      )}

      {/* Fullscreen Warning Modal - Responsive */}
      {showFullscreenWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`max-w-[95%] sm:max-w-lg w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl ${
              fullscreenExitCount >= 3
                ? 'bg-gradient-to-br from-red-600 to-red-700 text-white'
                : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900'
            }`}
          >
            <div className="text-center">
              <motion.div 
                className="text-5xl sm:text-7xl mb-4 sm:mb-6"
                animate={{ 
                  scale: fullscreenExitCount >= 3 ? [1, 1.2, 1] : [1, 1.1, 1],
                  rotate: fullscreenExitCount >= 3 ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.5, repeat: fullscreenExitCount >= 3 ? Infinity : 0, repeatDelay: 1 }}
              >
                {fullscreenExitCount >= 3 ? '❌' : '⚠️'}
              </motion.div>
              
              <h3 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4">
                {fullscreenExitCount >= 3 ? 'Interview Terminated' : 'Fullscreen Required'}
              </h3>
              
              <p className="text-sm sm:text-lg font-semibold mb-4 sm:mb-6 leading-relaxed px-2">
                {warningMessage}
              </p>

              {requiresUserAction && fullscreenExitCount < 3 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResumeInterview}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gray-900 text-white font-bold text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Return to Fullscreen
                </motion.button>
              )}

              {fullscreenExitCount >= 3 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm opacity-90">Generating evaluation...</p>
                  <div className="mt-3 sm:mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
                  </div>
                </div>
              )}

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                <p className="text-xs sm:text-sm font-medium opacity-90">
                  Exit Count: {fullscreenExitCount}/3
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Fullscreen Status Indicator - Responsive */}
      {step === 2 && !showFullscreenWarning && !isPracticeMode && (
        <div className="fixed bottom-16 sm:bottom-6 left-3 sm:left-6 z-40">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 ${
              checkIfFullscreen()
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white animate-pulse'
            }`}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold">
              {checkIfFullscreen() 
                ? '✓ Fullscreen' 
                : `⚠️ ${fullscreenExitCount}/2`}
            </span>
          </motion.div>
        </div>
      )}

      {/* Interview Timer & Question Progress - Responsive */}
      {step === 2 && (
        <>
          <div className="fixed top-14 sm:top-6 left-3 sm:left-6 z-40">
            <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 ${
              timeWarning ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'
            } text-white font-semibold`}>
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
      )}

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
            <motion.div
              key="welcome"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="flex flex-col items-center justify-center text-center flex-grow px-3 sm:px-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight">
                AI Voice Interview
              </h1>
              
              {data && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl mb-6 sm:mb-8`}
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{data.title}</h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                    Get ready to begin your interactive technical interview.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <span className="inline-block px-3 py-1.5 sm:px-5 sm:py-2.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-semibold">
                      {data.numberOfQuestions} Questions
                    </span>
                    <span className="inline-block px-3 py-1.5 sm:px-5 sm:py-2.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs sm:text-sm font-semibold">
                      ~{data.numberOfQuestions * 5} Min
                    </span>
                  </div>
                </motion.div>
              )}

              {isMobile && (
                <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg max-w-2xl w-full">
                  <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
                    📱 Mobile Tips:
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Use headphones for better audio</li>
                    <li>Stable internet required</li>
                    <li>Keep device charged</li>
                    <li>Find quiet environment</li>
                  </ul>
                </div>
              )}

              <BreathingExercise 
                onComplete={() => {}}
                darkMode={darkMode}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-2xl">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsPracticeMode(true);
                    startInterview();
                  }}
                  className="flex-1 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <Play size={isMobile ? 18 : 22} />
                  Practice Mode
                  <span className="text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded-full">Hints</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsPracticeMode(false);
                    startInterview();
                  }}
                  className="flex-1 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <Play size={isMobile ? 18 : 22} />
                  Real Interview
                  <span className="text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded-full">Eval</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Interview - Highly Responsive */}
          {step === 2 && (
            <motion.div
              key="interview"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="flex flex-col flex-grow space-y-3 sm:space-y-4 md:space-y-6 pb-20 sm:pb-0"
            >
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  {isPracticeMode ? '🎯 Practice ' : ''}Interview
                </h2>
              </div>
              
              {/* Conversation Area - Responsive height */}
              <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl max-h-[50vh] sm:max-h-[400px] md:max-h-[500px]">
                <AnimatePresence>
                  {conversation.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-3 sm:mb-4 flex ${
                        msg.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl max-w-[90%] sm:max-w-[85%] md:max-w-[80%] text-xs sm:text-sm ${
                          msg.role === "assistant"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1 opacity-80">
                          {msg.role === 'assistant' ? '🎓 Interviewer' : '👤 You'}
                        </p>
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={conversationEndRef} />
              </div>

              {/* Microphone Controls - Responsive */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8`}>
                <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    disabled={isSpeaking || processingAI || !isOnline}
                    className={`p-6 sm:p-8 md:p-10 rounded-full ${
                      isListening
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-blue-500'
                    } text-white disabled:opacity-50 shadow-2xl transition-all duration-200`}
                  >
                    {isListening ? 
                      <MicOff size={isMobile ? 32 : 40} className="sm:w-10 sm:h-10 md:w-12 md:h-12" /> : 
                      <Mic size={isMobile ? 32 : 40} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
                    }
                  </motion.button>

                  <div className="text-center">
                    {isSpeaking && <p className="text-blue-500 font-semibold text-xs sm:text-sm md:text-base">🎤 AI speaking...</p>}
                    {processingAI && !isSpeaking && <p className="text-purple-500 font-semibold text-xs sm:text-sm md:text-base">⚡ Processing...</p>}
                    {isListening && !isSpeaking && !processingAI && <p className="text-green-500 font-semibold text-xs sm:text-sm md:text-base">🎙️ Listening...</p>}
                    {!isListening && !isSpeaking && !processingAI && !isOnline && <p className="text-red-500 font-semibold text-xs sm:text-sm md:text-base">❌ No Internet</p>}
                    {!isListening && !isSpeaking && !processingAI && isOnline && (
                      <div>
                        <p className="text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">Tap to speak</p>
                        <p className="text-xs text-gray-400 hidden sm:block">or press Space</p>
                      </div>
                    )}
                  </div>

                  {(transcript || interimTranscript) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full p-3 sm:p-4 md:p-6 bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl"
                    >
                      <p className="text-xs sm:text-sm mb-2 sm:mb-3">
                        <span className="font-semibold">You're saying: </span>
                        {transcript}
                        <span className="text-gray-400 italic">{interimTranscript}</span>
                      </p>
                      {transcript && !processingAI && (
                        <button
                          onClick={handleManualSubmit}
                          className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-green-600 transition-colors"
                        >
                          ✓ Submit Now
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-2 sm:pt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (window.confirm("End interview?")) {
                      stopListening();
                      synthRef.current.cancel();
                      setStep(3);
                    }
                  }}
                  disabled={processingAI}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  Complete Interview
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Feedback */}
          {step === 3 && (
            <motion.div
              key="feedback"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="flex flex-col flex-grow justify-center px-3 sm:px-4"
            >
              <FeedbackForm 
                onSubmit={handleFeedbackSubmit}
                darkMode={darkMode}
                isProcessing={processingAI}
              />
            </motion.div>
          )}

          {/* STEP 4: Report - Beautiful Display */}
          {step === 4 && (
            <motion.div
              key="report"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="flex flex-col flex-grow px-3 sm:px-4 pb-20 sm:pb-4 overflow-y-auto max-h-screen"
            >
              <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                {/* Header */}
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-3 sm:mb-4">
                    <FileText size={isMobile ? 36 : 48} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center leading-tight px-2">
                    {isPracticeMode ? 'Practice ' : ''}Interview Evaluation
                  </h2>
                  <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-3 sm:mt-4"></div>
                  
                  {isPracticeMode && (
                    <div className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <span className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-200">
                        🎯 Practice Mode - Detailed Feedback
                      </span>
                    </div>
                  )}
                </div>

                {/* Beautiful Report Display */}
                <BeautifulReportDisplay
                  reportData={report}
                  darkMode={darkMode}
                  isPracticeMode={isPracticeMode}
                  engagementMetrics={engagementMetrics}
                  interviewDuration={interviewDuration}
                  onDownloadPDF={null} // Add PDF download functionality if needed
                />

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/StudentHomePage/${studentId}`)}
                  className="mt-6 sm:mt-8 w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start Another Interview
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom progress bar */}
      <div className="fixed bottom-0 left-0 w-full h-0.5 sm:h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.div
          className="h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-600"
          animate={{ width: progressWidth }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
};

export default StudentInterviewPage;