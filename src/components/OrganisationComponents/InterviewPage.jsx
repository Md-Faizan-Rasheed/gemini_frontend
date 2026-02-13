// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Sun, Moon, Mic, MicOff, FileText, Play, Volume2, VolumeX } from "lucide-react";
// import { useParams ,useSearchParams} from "react-router-dom";
// import { createSession, pushTranscript, completeSession ,extractAIReport} from "./helpers.js";
// import { useToast } from "../Context/ToastContext.jsx"

// const InterviewPage = () => {
//   /* ================= STATE ================= */
//   const [darkMode, setDarkMode] = useState(false);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [interviewStarted, setInterviewStarted] = useState(false);
//   const [interviewComplete, setInterviewComplete] = useState(false);
//   const [conversation, setConversation] = useState([]);

//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [processingAI, setProcessingAI] = useState(false);

//   const [transcript, setTranscript] = useState("");
//   const [interimTranscript, setInterimTranscript] = useState("");
//   const [report, setReport] = useState(null);
//   const [muteAI, setMuteAI] = useState(false);
//   const { showToast } = useToast();

//   /* ================= REFS ================= */
//   const recognitionRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);
//   const silenceTimerRef = useRef(null);
//   const conversationEndRef = useRef(null);
//   const systemPromptRef = useRef("");
//   const conversationHistoryRef = useRef([]);
//   const transcriptRef = useRef("");
//   const sessionIdRef = useRef(null);
  
//   // State refs for callbacks
//   const isListeningRef = useRef(false);
//   const processingAIRef = useRef(false);
//   const interviewStartedRef = useRef(false);
//   const interviewCompleteRef = useRef(false);

//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const studentId = searchParams.get("studentId");


//   /* ================= SYNC STATE TO REFS ================= */
//   useEffect(() => {
//     isListeningRef.current = isListening;
//   }, [isListening]);

//   useEffect(() => {
//     processingAIRef.current = processingAI;
//   }, [processingAI]);

//   useEffect(() => {
//     interviewStartedRef.current = interviewStarted;
//   }, [interviewStarted]);

//   useEffect(() => {
//     interviewCompleteRef.current = interviewComplete;
//   }, [interviewComplete]);

//   /* ================= FETCH JOB FROM API ================= */
//   useEffect(() => {
//     if (!id) return;

//     const fetchJob = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching job with id:", id);
//         const token = localStorage.getItem("token"); // or sessionStorage
//         console.log("Using token:", token);

//         // const response = await fetch(`https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/jobs/${id}`);


//   const response = await fetch(
//     `https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/jobs/${id}`,
//     {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Job API result:", result);

//         // ✅ CHANGED: Extract questions from API
//         setData({
//           title: result?.title || "",
//           description: result?.description || "",
//           questions: result?.questions || [], // ✅ Store questions array
//           numberOfQuestions: result?.questions?.length || 3,
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch job error:", err);
//         setError("Failed to load job details");
//         setLoading(false);
//       }
//     };

//     fetchJob();
//   }, [id]);

//   useEffect(() => {
//     conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [conversation]);

//   /* ================= VOICE HELPERS ================= */
//   const speak = useCallback((text) => {
//     if (muteAI) return Promise.resolve();

//     return new Promise((resolve) => {
//       synthRef.current.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 1.0;
//       utterance.pitch = 1.0;
      
//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => {
//         setIsSpeaking(false);
//         resolve();
//       };
//       utterance.onerror = () => {
//         setIsSpeaking(false);
//         resolve();
//       };
      
//       synthRef.current.speak(utterance);
//     });
//   }, [muteAI]);

//   const startListening = useCallback(() => {
//     console.log('👂 Attempting to start listening...', {
//       hasRecognition: !!recognitionRef.current,
//       processingAI: processingAIRef.current,
//       isListening: isListeningRef.current
//     });

//     if (!recognitionRef.current || processingAIRef.current || isListeningRef.current) {
//       console.log('❌ Cannot start listening');
//       return;
//     }

//     clearTimeout(silenceTimerRef.current);
//     setTranscript("");
//     setInterimTranscript("");
//     transcriptRef.current = "";
//     setIsListening(true);

//     try {
//       recognitionRef.current.start();
//       console.log('✅ Recognition started successfully');
//     } catch (e) {
//       console.log("⚠️ Recognition already started:", e);
//     }
//   }, []);

//   const stopListening = useCallback(() => {
//     console.log('🛑 Stopping listening...');
//     clearTimeout(silenceTimerRef.current);
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (e) {
//         console.log('Stop error:', e);
//       }
//     }
//     setIsListening(false);
//   }, []);

//   /* ================= SUBMIT ANSWER ================= */
//   const submitResponseWithText = useCallback(async (messageText) => {
//     console.log('submitResponseWithText called with:', messageText);

//     if (processingAIRef.current) {
//       console.log('⚠️ Already processing, skipping...');
//       return;
//     }

//     const message = messageText.trim();

//     if (!message) {
//       console.log("⚠️ No transcript to submit");
//       setTimeout(() => startListening(), 500);
//       return;
//     }

//     stopListening();
//     setProcessingAI(true);

//     // ✅ Save candidate's message to conversation history
//     conversationHistoryRef.current.push({
//       role: "user",
//       content: message
//     });

//     // ✅ Save candidate transcript to DB
//     await pushTranscript(sessionIdRef.current, "candidate", message);

//     setConversation(prev => [
//       ...prev,
//       { role: "user", content: message }
//     ]);

//     setTranscript("");
//     setInterimTranscript("");
//     transcriptRef.current = "";

//     try {
//       // Call OpenAI API
//       const res = await fetch("https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "gpt-4o",
//           messages: [
//             { role: "system", content: systemPromptRef.current },
//             ...conversationHistoryRef.current
//           ]
//         })
//       });

//       if (!res.ok) {
//         throw new Error(`API Error: ${res.status}`);
//       }

//       const json = await res.json();
//       const aiMessage = json.choices?.[0]?.message?.content;

//       console.log('🤖 AI Response:', aiMessage);

//       if (!aiMessage) {
//         throw new Error("No AI response received");
//       }

//       // ✅ Save AI response to conversation history
//       conversationHistoryRef.current.push({
//         role: "assistant",
//         content: aiMessage
//       });

//       // ✅ Save interviewer transcript to DB
//       await pushTranscript(sessionIdRef.current, "interviewer", aiMessage);

//       setConversation(prev => [
//         ...prev,
//         { role: "assistant", content: aiMessage }
//       ]);

//       await speak(aiMessage);

//       // ✅ Check if interview is complete
//       if (aiMessage.includes("INTERVIEW_COMPLETE")) {
//         console.log('✅ Interview complete!');
//         setInterviewComplete(true);
//         setProcessingAI(false);
        
//         // ✅ Mark session as complete
//         await completeSession(sessionIdRef.current);
        
//         // Generate report
//         await generateReport();
//         return;
//       }

//       setProcessingAI(false);
      
//       console.log('🎤 Resuming listening...');
//       setTimeout(() => startListening(), 500);

//     } catch (err) {
//       console.error("❌ Submit response error:", err);
//       setError(`AI error: ${err.message}`);
//       setProcessingAI(false);
      
//       setTimeout(() => startListening(), 1000);
//     }
//   }, [speak, startListening, stopListening]);

//   /* ================= SPEECH RECOGNITION SETUP ================= */
//   useEffect(() => {
//     if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
//       setError("Speech recognition not supported. Please use Chrome or Edge.");
//       return;
//     }

//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const rec = new SR();

//     rec.lang = "en-US";
//     rec.continuous = true;
//     rec.interimResults = true;

//     rec.onresult = (event) => {
//       console.log('🎤 Speech result received');
//       clearTimeout(silenceTimerRef.current);

//       let interim = "";
//       let final = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const text = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           final += text + " ";
//         } else {
//           interim += text;
//         }
//       }

//       if (final) {
//         const newTranscript = transcriptRef.current + final;
//         transcriptRef.current = newTranscript;
//         setTranscript(newTranscript);
//         setInterimTranscript("");
//         console.log('✅ Final transcript:', newTranscript);
//       } else {
//         setInterimTranscript(interim);
//       }

//       silenceTimerRef.current = setTimeout(() => {
//         console.log('⏱️ Silence detected, submitting...');
//         if (transcriptRef.current.trim()) {
//           stopListening();
//           submitResponseWithText(transcriptRef.current);
//         }
//       }, 2000);
//     };

//     rec.onend = () => {
//       console.log('🔚 Recognition ended');

//       if (isListeningRef.current && 
//           !processingAIRef.current && 
//           interviewStartedRef.current && 
//           !interviewCompleteRef.current) {
//         console.log('🔄 Auto-restarting recognition...');
//         try {
//           rec.start();
//         } catch (e) {
//           console.log("⚠️ Recognition restart failed:", e);
//         }
//       }
//     };

//     rec.onerror = (event) => {
//       console.error("❌ Speech recognition error:", event.error);
      
//       if (event.error === "no-speech" || event.error === "aborted") {
//         return;
//       }
      
//       setIsListening(false);
//       setTimeout(() => {
//         if (interviewStartedRef.current && 
//             !interviewCompleteRef.current && 
//             !processingAIRef.current) {
//           startListening();
//         }
//       }, 1000);
//     };

//     recognitionRef.current = rec;

//     return () => {
//       clearTimeout(silenceTimerRef.current);
//       if (rec) {
//         rec.stop();
//       }
//       if (synthRef.current) {
//         synthRef.current.cancel();
//       }
//     };
//   }, [submitResponseWithText, startListening, stopListening]);

//   /* ================= START INTERVIEW ================= */
//   const startInterview = async () => {
//     if (!data) return;

//   try {
//     const response = await fetch(
//       "https://jubilant-fortnight-node-backend.onrender.com/api/interview-sessions/verify_update",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ jobId:id }),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       showToast(
//         result.message ||
//           "You do not have access for this interview. Contact your organisation team.",
//         "error"
//       );
//       return;
//     }

//     // ✅ interview allowed → continue with interview flow
//     showToast("Interview started successfully","success");

//   } catch (err) {
//     console.error("Interview start failed:", err);
//     showToast("Unable to start interview. Please try again.","error");
//   }
//     // ✅ CHANGED: Format questions list for system prompt
//     const questionsList = data.questions
//       .map((q, i) => `${i + 1}. ${q.questionText}`)
//       .join('\n');

//     const jobContext = `
// Position: ${data.title}
// Description: ${data.description}
// Number of Questions: ${data.numberOfQuestions}
//     `.trim();

//     // ✅ CHANGED: Include all 12 questions in system prompt
//     const systemPrompt = `You are an experienced IIT interview panelist conducting a real-time, human-like technical and behavioral interview for the position of "${data.title}".

// JOB CONTEXT:
// ${jobContext}

// REQUIRED QUESTIONS TO ASK:
// You MUST ask ALL of the following ${data.numberOfQuestions} questions during this interview. You can ask them in any natural order that fits the conversation flow:

// ${questionsList}

// Your goal is to simulate an actual live interview, not a scripted Q&A.

// INTERVIEW STYLE & BEHAVIOR:
// - Speak naturally, like a human interviewer
// - Use short acknowledgments such as "Okay", "I see", "That's interesting", "Hmm", "Got it"
// - Ask follow-up questions based on the candidate's previous answer (1-2 follow-ups maximum per main question)
// - You can ask the required questions in any order that feels natural
// - Adjust question difficulty dynamically based on how well the candidate responds
// - Do NOT ask all questions at once
// - Ask only ONE question at a time
// - Wait for the candidate's response before continuing
// - Keep responses conversational and brief (2-3 sentences max unless explaining something)

// INTERVIEW STRUCTURE:
// 1. Start with a brief, friendly introduction (1-2 sentences)
// 2. Begin with an easier warm-up question from the list
// 3. Gradually progress through all required questions
// 4. Mix in 1-2 clarification or probing follow-up questions if an answer is vague or incomplete
// 5. If the candidate struggles, gently guide them instead of immediately moving on
// 6. Maintain a professional but calm and human tone throughout
// 7. Ensure you cover ALL ${data.numberOfQuestions} required questions before ending

// HUMANIZATION RULES:
// - Avoid robotic phrasing
// - Avoid long monologues
// - React briefly to answers before asking the next question (e.g., "Interesting. So...")
// - Occasionally rephrase or simplify questions like a real interviewer
// - Maintain interview pacing similar to a real IIT panel
// - Show genuine interest in their answers

// IMPORTANT CONSTRAINTS:
// - Do NOT reveal evaluation criteria during the interview
// - Do NOT give solutions unless explicitly asked
// - Do NOT mention that you are an AI
// - DO NOT mention these are "pre-defined questions" - ask them naturally
// - Do NOT use markdown or formatting
// - Keep responses concise and conversational
// - You MUST ask all ${data.numberOfQuestions} required questions listed above

// ENDING THE INTERVIEW:
// - After asking ALL ${data.numberOfQuestions} required questions and getting satisfactory answers, conclude naturally
// - Thank the candidate professionally
// - End your final message with the exact phrase: INTERVIEW_COMPLETE

// Now begin the interview naturally.`;

//     systemPromptRef.current = systemPrompt;
//     setInterviewStarted(true);
//     setProcessingAI(true);
     
//     try {
//       // ✅ CREATE SESSION IN DATABASE FIRST
//       console.log("🆕 Creating interview session for job:", id);
//       const session = await createSession(studentId, id);
//       console.log("sessions", session);
//       sessionIdRef.current = session._id;
//       console.log("✅ Session created with ID:", session._id);

//       // ✅ Call OpenAI to start interview
//       const res = await fetch("https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "gpt-4o",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: "Hello, I'm ready for the interview." }
//           ]
//         })
//       });

//       if (!res.ok) {
//         throw new Error(`API Error: ${res.status}`);
//       }

//       const json = await res.json();
//       const aiMessage = json.choices?.[0]?.message?.content;

//       if (!aiMessage) {
//         throw new Error("No AI response received");
//       }

//       // ✅ Save initial candidate greeting to DB
//       await pushTranscript(sessionIdRef.current, "candidate", "Hello, I'm ready for the interview.");
      
//       // ✅ Save AI's first response to DB
//       await pushTranscript(sessionIdRef.current, "interviewer", aiMessage);

//       conversationHistoryRef.current = [
//         { role: "user", content: "Hello, I'm ready for the interview." },
//         { role: "assistant", content: aiMessage }
//       ];

//       setConversation([{ role: "assistant", content: aiMessage }]);

//       await speak(aiMessage);
//       setProcessingAI(false);
      
//       console.log('🎯 Starting listening after initial question...');
//       setTimeout(() => startListening(), 500);

//     } catch (err) {
//       console.error("Start interview error:", err);
//       setError(`Failed to start interview: ${err.message}`);
//       setInterviewStarted(false);
//       setProcessingAI(false);
//     }
//   };

//   /* ================= GENERATE REPORT ================= */
//   const generateReport = async () => {
//     setProcessingAI(true);

//     const conversationText = conversationHistoryRef.current
//       .map(msg => `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
//       .join('\n\n');

//     console.log("Generating report for conversation:", conversationText);

//     try {
//       const res = await fetch("https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "gpt-4o",
//           messages: [{
//             role: "user",
//             content:`
//             Based on the following interview transcript for the position of "${data?.title}", generate a comprehensive evaluation.

// INTERVIEW TRANSCRIPT:
// ${conversationText}

// Return the response in TWO PARTS:

// ====================
// PART 1: STRUCTURED JSON (for storage)
// ====================

// Return ONLY valid JSON in the following schema:

// {
//   "overallRating": number (0–10),
//   "scores": {
//     "technical": number (0–10),
//     "communication": number (0–10),
//     "problemSolving": number (0–10)
//   },
//   "strengths": [string],
//   "weaknesses": [string],
//   "areasForDevelopment": [string],
//   "highlights": [string],
//   "recommendation": {
//     "decision": "Strongly Recommend" | "Recommend" | "Consider" | "Do Not Recommend",
//     "confidence": number (0–1)
//   }
// }

// Rules:
// - Numbers must be numeric (not strings)
// - Arrays must contain concise bullet points
// - Do not add extra fields
// - Do not include explanations outside JSON

// ====================
// PART 2: HUMAN-READABLE REPORT
// ====================

// Generate a professional evaluation report with the following sections:

// 1. OVERALL ASSESSMENT (Rating out of 10)
// 2. TECHNICAL COMPETENCE
// 3. COMMUNICATION SKILLS
// 4. PROBLEM-SOLVING ABILITY
// 5. KEY HIGHLIGHTS
// 6. AREAS FOR DEVELOPMENT
// 7. FINAL RECOMMENDATION

// Tone:
// - Professional
// - Constructive
// - Specific
// - Suitable for hiring managers
//             `
//           }]
//         })
//       });

     
//       if (!res.ok) {
//         throw new Error(`API Error: ${res.status}`);
//       }

//       const json = await res.json();
//       const aiContent = json.choices?.[0]?.message?.content;
//       console.log("ai Report content", aiContent);

//       const { structured, reportText } = extractAIReport(aiContent);

//       // UI rendering (same as today)
//       setReport(reportText || "Report generation failed");
//       setProcessingAI(false);

//       // send once interview ends
//       try {
//         const reportSave = await fetch("https://jubilant-fortnight-node-backend.onrender.com/api/interview-report", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             aiContent,
//             sessionId: sessionIdRef.current,
//             candidateId: studentId,
//             jobId: id,
//             jobTitle: data?.title || "Intern"
//           }),
//         });

//         // ❌ HTTP-level failure
//         if (!reportSave.ok) {
//           console.error("❌ Report save failed (HTTP):", reportSave.status);
//           return;
//         }

//         const saveResult = await reportSave.json();

//         if (saveResult.success) {
//           console.log("✅ Interview report saved successfully");
//           console.log("📄 Report ID:", saveResult.reportId);
//         } else {
//           console.error("❌ Report save failed:", saveResult.message);
//         }
//       } catch (err) {
//         console.error("Report Saving error:", err);
//       }
//     } catch (err) {
//       // Report generation error
//       console.error("Report generation error:", err);
//       setReport("Error generating report. Please try again.");
//       setProcessingAI(false);
//     }
//   };

//   const resetInterview = () => {
//     setInterviewStarted(false);
//     setInterviewComplete(false);
//     setConversation([]);
//     setReport(null);
//     setTranscript("");
//     setInterimTranscript("");
//     transcriptRef.current = "";
//     setError(null);
//     conversationHistoryRef.current = [];
//     systemPromptRef.current = "";
//     sessionIdRef.current = null;
//     synthRef.current.cancel();
//     stopListening();
//   };

//   const handleManualSubmit = () => {
//     if (transcriptRef.current.trim()) {
//       stopListening();
//       submitResponseWithText(transcriptRef.current);
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//         <div className="text-2xl animate-pulse">Loading interview details...</div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-gray-900"} min-h-screen transition-all duration-300`}>
//       {/* Dark Mode Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className="fixed top-6 right-6 p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-50"
//       >
//         {darkMode ? <Sun size={22} /> : <Moon size={22} />}
//       </button>

//       {/* Mute Toggle */}
//       {interviewStarted && (
//         <button
//           onClick={() => setMuteAI(!muteAI)}
//           className="fixed top-6 right-24 p-3.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-50"
//           title={muteAI ? "Unmute AI voice" : "Mute AI voice"}
//         >
//           {muteAI ? <VolumeX size={22} /> : <Volume2 size={22} />}
//         </button>
//       )}

//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
//             AI Voice Interview
//           </h1>
          
//           {data && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto`}
//             >
//               <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
//               <span className="px-5 py-2.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
//                 {data.numberOfQuestions} Questions
//               </span>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Error */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="mb-8 p-5 bg-red-100 dark:bg-red-900 rounded-2xl text-center text-red-800 dark:text-red-200"
//           >
//             ⚠️ {error}
//           </motion.div>
//         )}

//         {/* Pre-Interview */}
//         {!interviewStarted && !interviewComplete && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-3xl shadow-2xl max-w-xl mx-auto`}>
//               <h3 className="text-2xl font-bold mb-4">Ready to begin?</h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-8">
//                 Enable your microphone and speak clearly.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={startInterview}
//                 disabled={!data}
//                 className="w-full px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 <Play size={26} />
//                 Start Interview
//               </motion.button>
//             </div>
//           </motion.div>
//         )}

//         {/* Active Interview */}
//         {interviewStarted && !interviewComplete && (
//           <div className="space-y-8">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-8 max-h-[500px] overflow-y-auto`}
//             >
//               <AnimatePresence>
//                 {conversation.map((msg, idx) => (
//                   <motion.div
//                     key={idx}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div className={`max-w-[80%] px-6 py-4 rounded-2xl ${
//                       msg.role === 'assistant'
//                         ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
//                         : 'bg-gray-100 dark:bg-gray-700'
//                     }`}>
//                       <p className="text-xs font-semibold mb-1 opacity-80">
//                         {msg.role === 'assistant' ? '🎓 Interviewer' : '👤 You'}
//                       </p>
//                       <p className="text-sm">{msg.content}</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//               <div ref={conversationEndRef} />
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-10`}
//             >
//               <div className="flex flex-col items-center gap-6">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={isListening ? stopListening : startListening}
//                   disabled={isSpeaking || processingAI}
//                   className={`p-10 rounded-full ${
//                     isListening
//                       ? 'bg-red-500 animate-pulse'
//                       : 'bg-blue-500'
//                   } text-white disabled:opacity-50 shadow-2xl`}
//                 >
//                   {isListening ? <MicOff size={48} /> : <Mic size={48} />}
//                 </motion.button>

//                 <div className="text-center">
//                   {isSpeaking && <p className="text-blue-500 font-semibold">🎤 AI is speaking...</p>}
//                   {processingAI && !isSpeaking && <p className="text-purple-500 font-semibold">⚡ Processing...</p>}
//                   {isListening && !isSpeaking && !processingAI && <p className="text-green-500 font-semibold">🎙️ Listening...</p>}
//                   {!isListening && !isSpeaking && !processingAI && <p className="text-gray-500">Click to speak</p>}
//                 </div>

//                 {(transcript || interimTranscript) && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="w-full p-6 bg-gray-100 dark:bg-gray-700 rounded-2xl"
//                   >
//                     <p className="text-sm mb-3">
//                       <span className="font-semibold">You're saying: </span>
//                       {transcript}
//                       <span className="text-gray-400 italic">{interimTranscript}</span>
//                     </p>
//                     {transcript && !processingAI && (
//                       <button
//                         onClick={handleManualSubmit}
//                         className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-semibold"
//                       >
//                         ✓ Submit Now
//                       </button>
//                     )}
//                   </motion.div>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Interview Complete - Report */}
//         {interviewComplete && report && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-2xl p-10 border`}
//           >
//             <div className="flex flex-col items-center mb-8">
//               <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
//                 <FileText size={56} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
//                 Interview Evaluation Report
//               </h2>
//               <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-4"></div>
//             </div>

//             <div className="prose dark:prose-invert max-w-none">
//               <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'} p-8 rounded-2xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                 <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-green-600 dark:text-green-400 m-0">
//                   {report}
//                 </pre>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-center">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={resetInterview}
//                 className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-3 group"
//               >
//                 <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Start New Interview
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InterviewPage;




import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Mic, MicOff, FileText, Play, Volume2, VolumeX, Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { createSession, pushTranscript, completeSession, extractAIReport } from "./helpers.js";
import { useToast } from "../Context/ToastContext.jsx";

const InterviewPage = () => {
  /* ================= STATE ================= */
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [conversation, setConversation] = useState([]);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [report, setReport] = useState(null);
  const [muteAI, setMuteAI] = useState(false);
  const { showToast } = useToast();

  /* ================= REFS ================= */
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef(null);
  const conversationEndRef = useRef(null);
  const systemPromptRef = useRef("");
  const conversationHistoryRef = useRef([]);
  const transcriptRef = useRef("");
  const sessionIdRef = useRef(null);

  // State refs for callbacks
  const isListeningRef = useRef(false);
  const processingAIRef = useRef(false);
  const interviewStartedRef = useRef(false);
  const interviewCompleteRef = useRef(false);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");

  /* ================= SYNC STATE TO REFS ================= */
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    processingAIRef.current = processingAI;
  }, [processingAI]);

  useEffect(() => {
    interviewStartedRef.current = interviewStarted;
  }, [interviewStarted]);

  useEffect(() => {
    interviewCompleteRef.current = interviewComplete;
  }, [interviewComplete]);

  /* ================= FETCH JOB FROM API ================= */
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/jobs/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        setData({
          title: result?.title || "",
          description: result?.description || "",
          questions: result?.questions || [],
          numberOfQuestions: result?.questions?.length || 3,
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch job error:", err);
        setError("Failed to load job details");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  /* ================= VOICE HELPERS ================= */
  const speak = useCallback(
    (text) => {
      if (muteAI) return Promise.resolve();

      return new Promise((resolve) => {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };

        synthRef.current.speak(utterance);
      });
    },
    [muteAI]
  );

  const startListening = useCallback(() => {
    console.log("👂 Attempting to start listening...", {
      hasRecognition: !!recognitionRef.current,
      processingAI: processingAIRef.current,
      isListening: isListeningRef.current,
    });

    if (!recognitionRef.current || processingAIRef.current || isListeningRef.current) {
      return;
    }

    clearTimeout(silenceTimerRef.current);
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (e) {
    }
  }, []);

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

  /* ================= SUBMIT ANSWER ================= */
  const submitResponseWithText = useCallback(
    async (messageText) => {

      if (processingAIRef.current) {
        return;
      }

      const message = messageText.trim();

      if (!message) {
        setTimeout(() => startListening(), 500);
        return;
      }

      stopListening();
      setProcessingAI(true);

      conversationHistoryRef.current.push({
        role: "user",
        content: message,
      });

      await pushTranscript(sessionIdRef.current, "candidate", message);

      setConversation((prev) => [...prev, { role: "user", content: message }]);

      setTranscript("");
      setInterimTranscript("");
      transcriptRef.current = "";

      try {
        const res = await fetch(
          "https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                { role: "system", content: systemPromptRef.current },
                ...conversationHistoryRef.current,
              ],
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const json = await res.json();
        const aiMessage = json.choices?.[0]?.message?.content;


        if (!aiMessage) {
          throw new Error("No AI response received");
        }

        conversationHistoryRef.current.push({
          role: "assistant",
          content: aiMessage,
        });

        await pushTranscript(sessionIdRef.current, "interviewer", aiMessage);

        setConversation((prev) => [...prev, { role: "assistant", content: aiMessage }]);

        await speak(aiMessage);

        if (aiMessage.includes("INTERVIEW_COMPLETE")) {
          setInterviewComplete(true);
          setProcessingAI(false);

          await completeSession(sessionIdRef.current);

          await generateReport();
          return;
        }

        setProcessingAI(false);

        setTimeout(() => startListening(), 500);
      } catch (err) {
        console.error("❌ Submit response error:", err);
        setError(`AI error: ${err.message}`);
        setProcessingAI(false);

        setTimeout(() => startListening(), 1000);
      }
    },
    [speak, startListening, stopListening]
  );

  /* ================= SPEECH RECOGNITION SETUP ================= */
  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported. Please use Chrome or Edge.");
      return;
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

      if (
        isListeningRef.current &&
        !processingAIRef.current &&
        interviewStartedRef.current &&
        !interviewCompleteRef.current
      ) {
        try {
          rec.start();
        } catch (e) {
        }
      }
    };

    rec.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);

      if (event.error === "no-speech" || event.error === "aborted") {
        return;
      }

      setIsListening(false);
      setTimeout(() => {
        if (interviewStartedRef.current && !interviewCompleteRef.current && !processingAIRef.current) {
          startListening();
        }
      }, 1000);
    };

    recognitionRef.current = rec;

    return () => {
      clearTimeout(silenceTimerRef.current);
      if (rec) {
        rec.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [submitResponseWithText, startListening, stopListening]);

  /* ================= START INTERVIEW ================= */
  const startInterview = async () => {
    if (!data) return;

    try {
      const response = await fetch("https://jubilant-fortnight-node-backend.onrender.com/api/interview-sessions/verify_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ jobId: id }),
      });

      const result = await response.json();

      if (!response.ok) {
        showToast(
          result.message || "You do not have access for this interview. Contact your organisation team.",
          "error"
        );
        return;
      }

      showToast("Interview started successfully", "success");
    } catch (err) {
      console.error("Interview start failed:", err);
      showToast("Unable to start interview. Please try again.", "error");
    }

    const questionsList = data.questions.map((q, i) => `${i + 1}. ${q.questionText}`).join("\n");

    const jobContext = `
Position: ${data.title}
Description: ${data.description}
Number of Questions: ${data.numberOfQuestions}
    `.trim();

    const systemPrompt = `You are an experienced IIT interview panelist conducting a real-time, human-like technical and behavioral interview for the position of "${data.title}".

JOB CONTEXT:
${jobContext}

REQUIRED QUESTIONS TO ASK:
You MUST ask ALL of the following ${data.numberOfQuestions} questions during this interview. You can ask them in any natural order that fits the conversation flow:

${questionsList}

Your goal is to simulate an actual live interview, not a scripted Q&A.

INTERVIEW STYLE & BEHAVIOR:
- Speak naturally, like a human interviewer
- Use short acknowledgments such as "Okay", "I see", "That's interesting", "Hmm", "Got it"
- Ask follow-up questions based on the candidate's previous answer (1-2 follow-ups maximum per main question)
- You can ask the required questions in any order that feels natural
- Adjust question difficulty dynamically based on how well the candidate responds
- Do NOT ask all questions at once
- Ask only ONE question at a time
- Wait for the candidate's response before continuing
- Keep responses conversational and brief (2-3 sentences max unless explaining something)

INTERVIEW STRUCTURE:
1. Start with a brief, friendly introduction (1-2 sentences)
2. Begin with an easier warm-up question from the list
3. Gradually progress through all required questions
4. Mix in 1-2 clarification or probing follow-up questions if an answer is vague or incomplete
5. If the candidate struggles, gently guide them instead of immediately moving on
6. Maintain a professional but calm and human tone throughout
7. Ensure you cover ALL ${data.numberOfQuestions} required questions before ending

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
- DO NOT mention these are "pre-defined questions" - ask them naturally
- Do NOT use markdown or formatting
- Keep responses concise and conversational
- You MUST ask all ${data.numberOfQuestions} required questions listed above

ENDING THE INTERVIEW:
- After asking ALL ${data.numberOfQuestions} required questions and getting satisfactory answers, conclude naturally
- Thank the candidate professionally
- End your final message with the exact phrase: INTERVIEW_COMPLETE

Now begin the interview naturally.`;

    systemPromptRef.current = systemPrompt;
    setInterviewStarted(true);
    setProcessingAI(true);

    try {
      const session = await createSession(studentId, id);
      sessionIdRef.current = session._id;

      const res = await fetch(
        "https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "Hello, I'm ready for the interview." },
            ],
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const json = await res.json();
      const aiMessage = json.choices?.[0]?.message?.content;

      if (!aiMessage) {
        throw new Error("No AI response received");
      }

      await pushTranscript(sessionIdRef.current, "candidate", "Hello, I'm ready for the interview.");

      await pushTranscript(sessionIdRef.current, "interviewer", aiMessage);

      conversationHistoryRef.current = [
        { role: "user", content: "Hello, I'm ready for the interview." },
        { role: "assistant", content: aiMessage },
      ];

      setConversation([{ role: "assistant", content: aiMessage }]);

      await speak(aiMessage);
      setProcessingAI(false);

      setTimeout(() => startListening(), 500);
    } catch (err) {
      console.error("Start interview error:", err);
      setError(`Failed to start interview: ${err.message}`);
      setInterviewStarted(false);
      setProcessingAI(false);
    }
  };

  /* ================= GENERATE REPORT ================= */
  const generateReport = async () => {
    setProcessingAI(true);

    const conversationText = conversationHistoryRef.current
      .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      .join("\n\n");


    try {
      const res = await fetch(
        "https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: `
            Based on the following interview transcript for the position of "${data?.title}", generate a comprehensive evaluation.

INTERVIEW TRANSCRIPT:
${conversationText}

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
    "problemSolving": number (0–10)
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

Rules:
- Numbers must be numeric (not strings)
- Arrays must contain concise bullet points
- Do not add extra fields
- Do not include explanations outside JSON

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
7. FINAL RECOMMENDATION

Tone:
- Professional
- Constructive
- Specific
- Suitable for hiring managers
            `,
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const json = await res.json();
      const aiContent = json.choices?.[0]?.message?.content;

      const { structured, reportText } = extractAIReport(aiContent);

      setReport(reportText || "Report generation failed");
      setProcessingAI(false);

      try {
        const reportSave = await fetch("https://jubilant-fortnight-node-backend.onrender.com/api/interview-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aiContent,
            sessionId: sessionIdRef.current,
            candidateId: studentId,
            jobId: id,
            jobTitle: data?.title || "Intern",
          }),
        });

        if (!reportSave.ok) {
          console.error("❌ Report save failed (HTTP):", reportSave.status);
          return;
        }

        const saveResult = await reportSave.json();

        if (saveResult.success) {
        } else {
          console.error("❌ Report save failed:", saveResult.message);
        }
      } catch (err) {
        console.error("Report Saving error:", err);
      }
    } catch (err) {
      console.error("Report generation error:", err);
      setReport("Error generating report. Please try again.");
      setProcessingAI(false);
    }
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewComplete(false);
    setConversation([]);
    setReport(null);
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
    setError(null);
    conversationHistoryRef.current = [];
    systemPromptRef.current = "";
    sessionIdRef.current = null;
    synthRef.current.cancel();
    stopListening();
  };

  const handleManualSubmit = () => {
    if (transcriptRef.current.trim()) {
      stopListening();
      submitResponseWithText(transcriptRef.current);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
        }`}
      >
        <div className="text-center px-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading interview details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-gray-900"
      } min-h-screen transition-all duration-300`}
    >
      {/* Floating Action Buttons - Mobile Optimized */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex gap-2 sm:gap-3">
        {/* Mute Toggle */}
        {interviewStarted && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setMuteAI(!muteAI)}
            className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            title={muteAI ? "Unmute AI voice" : "Mute AI voice"}
          >
            {muteAI ? <VolumeX size={18} className="sm:w-[22px] sm:h-[22px]" /> : <Volume2 size={18} className="sm:w-[22px] sm:h-[22px]" />}
          </motion.button>
        )}

        {/* Dark Mode Toggle */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 sm:p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
        >
          {darkMode ? <Sun size={18} className="sm:w-[22px] sm:h-[22px]" /> : <Moon size={18} className="sm:w-[22px] sm:h-[22px]" />}
        </motion.button>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight px-4">
            AI Voice Interview
          </h1>

          {data && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
              } p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl max-w-3xl mx-auto border`}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2">
                {data.title}
              </h2>
              <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-semibold">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {data.numberOfQuestions} Questions
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Error Alert - Mobile Optimized */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm sm:text-base font-semibold text-red-800 dark:text-red-200 mb-1">
                  Error
                </p>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pre-Interview Screen - Mobile Optimized */}
        {!interviewStarted && !interviewComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className={`${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
              } p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl max-w-xl mx-auto border`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to begin?</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2">
                Make sure your microphone is enabled and speak clearly. The AI interviewer will guide you
                through the process.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startInterview}
                disabled={!data}
                className="w-full px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
              >
                <Play size={20} className="sm:w-[26px] sm:h-[26px]" />
                <span>Start Interview</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Active Interview - Mobile Optimized */}
        {interviewStarted && !interviewComplete && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Conversation Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
              } rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-4 sm:p-6 lg:p-8 max-h-[400px] sm:max-h-[500px] overflow-y-auto border`}
            >
              <AnimatePresence>
                {conversation.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`mb-4 sm:mb-6 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="text-[10px] sm:text-xs font-semibold mb-1 sm:mb-1.5 opacity-80">
                        {msg.role === "assistant" ? "🎓 Interviewer" : "👤 You"}
                      </p>
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={conversationEndRef} />
            </motion.div>

            {/* Voice Control Panel - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
              } rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-6 sm:p-8 lg:p-10 border`}
            >
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                {/* Mic Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking || processingAI}
                  className={`relative p-8 sm:p-10 lg:p-12 rounded-full ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-rose-600 animate-pulse"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transition-all duration-300`}
                >
                  {isListening ? (
                    <MicOff size={36} className="sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px]" />
                  ) : (
                    <Mic size={36} className="sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px]" />
                  )}
                  
                  {/* Pulse Ring Effect */}
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></span>
                  )}
                </motion.button>

                {/* Status Indicator */}
                <div className="text-center min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center">
                  {isSpeaking && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-pulse" />
                        <p className="text-sm sm:text-base font-semibold text-blue-500">AI is speaking...</p>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      </div>
                    </div>
                  )}
                  
                  {processingAI && !isSpeaking && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 animate-spin" />
                        <p className="text-sm sm:text-base font-semibold text-purple-500">Processing your answer...</p>
                      </div>
                    </div>
                  )}
                  
                  {isListening && !isSpeaking && !processingAI && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm sm:text-base font-semibold text-green-500">Listening...</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Speak your answer clearly
                      </p>
                    </div>
                  )}
                  
                  {!isListening && !isSpeaking && !processingAI && (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
                        Click the microphone to speak
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Your response will be submitted automatically
                      </p>
                    </div>
                  )}
                </div>

                {/* Transcript Display - Mobile Optimized */}
                {(transcript || interimTranscript) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full"
                  >
                    <div
                      className={`p-4 sm:p-6 ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      } rounded-xl sm:rounded-2xl`}
                    >
                      <p className="text-xs sm:text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                        Your Response:
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed mb-4">
                        {transcript}
                        <span className="text-gray-400 dark:text-gray-500 italic">{interimTranscript}</span>
                      </p>
                      
                      {transcript && !processingAI && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleManualSubmit}
                          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:shadow-md transition-all"
                        >
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          Submit Now
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Interview Complete - Report - Mobile Optimized */}
        {interviewComplete && report && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            } rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-6 sm:p-8 lg:p-10 border`}
          >
            {/* Report Header */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-3 sm:mb-4"
              >
                <CheckCircle size={40} className="sm:w-[48px] sm:h-[48px] lg:w-[56px] lg:h-[56px] text-blue-600 dark:text-blue-400" />
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-2 sm:mb-3">
                Interview Evaluation Report
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Your comprehensive performance assessment
              </p>
              
              <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>

            {/* Report Content */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <div
                className={`${
                  darkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"
                } p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 overflow-x-auto`}
              >
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 m-0">
                  {report}
                </pre>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetInterview}
                className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 active:shadow-md transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Start New Interview</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? "#1f2937" : "#f3f4f6"};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#4b5563" : "#d1d5db"};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "#6b7280" : "#9ca3af"};
        }
      `}</style>
    </div>
  );
};

export default InterviewPage;