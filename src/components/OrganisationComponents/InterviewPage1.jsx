// import { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import { createSession, pushTranscript, completeSession, extractAIReport } from "./helpers.js";
// import { useToast } from "../Context/ToastContext.jsx";

// // Import components
// import InterviewHeader from "../OrganisationComponents/interview/InterviewHeader.jsx";
// import PreInterviewScreen from "../OrganisationComponents/interview/PreInterviewScreen.jsx";
// import ConversationPanel from "../OrganisationComponents/interview/ConversationPanel.jsx";
// import VoiceControlPanel from "../OrganisationComponents/interview/VoiceControlPanel.jsx";
// import ReportPanel from "../OrganisationComponents/interview/ReportPanel.jsx";
// import ErrorAlert from "../OrganisationComponents/interview/ErrorAlert.jsx";
// import LoadingScreen from "../OrganisationComponents/interview/LoadingScreen.jsx";
// import FloatingControls from "../OrganisationComponents/interview/FloatingControls.jsx";

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
//         const token = localStorage.getItem("token");
//         console.log("Using token:", token);

//         const response = await fetch(
//           `https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/jobs/${id}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Job API result:", result);

//         setData({
//           title: result?.title || "",
//           description: result?.description || "",
//           questions: result?.questions || [],
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

//   /* ================= VOICE HELPERS ================= */
//   const speak = useCallback(
//     (text) => {
//       if (muteAI) return Promise.resolve();

//       return new Promise((resolve) => {
//         synthRef.current.cancel();
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.rate = 1.0;
//         utterance.pitch = 1.0;

//         utterance.onstart = () => setIsSpeaking(true);
//         utterance.onend = () => {
//           setIsSpeaking(false);
//           resolve();
//         };
//         utterance.onerror = () => {
//           setIsSpeaking(false);
//           resolve();
//         };

//         synthRef.current.speak(utterance);
//       });
//     },
//     [muteAI]
//   );

//   const startListening = useCallback(() => {
//     console.log("👂 Attempting to start listening...", {
//       hasRecognition: !!recognitionRef.current,
//       processingAI: processingAIRef.current,
//       isListening: isListeningRef.current,
//     });

//     if (!recognitionRef.current || processingAIRef.current || isListeningRef.current) {
//       console.log("❌ Cannot start listening");
//       return;
//     }

//     clearTimeout(silenceTimerRef.current);
//     setTranscript("");
//     setInterimTranscript("");
//     transcriptRef.current = "";
//     setIsListening(true);

//     try {
//       recognitionRef.current.start();
//       console.log("✅ Recognition started successfully");
//     } catch (e) {
//       console.log("⚠️ Recognition already started:", e);
//     }
//   }, []);

//   const stopListening = useCallback(() => {
//     console.log("🛑 Stopping listening...");
//     clearTimeout(silenceTimerRef.current);
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (e) {
//         console.log("Stop error:", e);
//       }
//     }
//     setIsListening(false);
//   }, []);

//   /* ================= SUBMIT ANSWER ================= */
//   const submitResponseWithText = useCallback(
//     async (messageText) => {
//       console.log("submitResponseWithText called with:", messageText);

//       if (processingAIRef.current) {
//         console.log("⚠️ Already processing, skipping...");
//         return;
//       }

//       const message = messageText.trim();

//       if (!message) {
//         console.log("⚠️ No transcript to submit");
//         setTimeout(() => startListening(), 500);
//         return;
//       }

//       stopListening();
//       setProcessingAI(true);

//       conversationHistoryRef.current.push({
//         role: "user",
//         content: message,
//       });

//       await pushTranscript(sessionIdRef.current, "candidate", message);

//       setConversation((prev) => [...prev, { role: "user", content: message }]);

//       setTranscript("");
//       setInterimTranscript("");
//       transcriptRef.current = "";

//       try {
//         const res = await fetch(
//           "https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               model: "gpt-4o",
//               messages: [
//                 { role: "system", content: systemPromptRef.current },
//                 ...conversationHistoryRef.current,
//               ],
//             }),
//           }
//         );

//         if (!res.ok) {
//           throw new Error(`API Error: ${res.status}`);
//         }

//         const json = await res.json();
//         const aiMessage = json.choices?.[0]?.message?.content;

//         console.log("🤖 AI Response:", aiMessage);

//         if (!aiMessage) {
//           throw new Error("No AI response received");
//         }

//         conversationHistoryRef.current.push({
//           role: "assistant",
//           content: aiMessage,
//         });

//         await pushTranscript(sessionIdRef.current, "interviewer", aiMessage);

//         setConversation((prev) => [...prev, { role: "assistant", content: aiMessage }]);

//         await speak(aiMessage);

//         if (aiMessage.includes("INTERVIEW_COMPLETE")) {
//           console.log("✅ Interview complete!");
//           setInterviewComplete(true);
//           setProcessingAI(false);

//           await completeSession(sessionIdRef.current);

//           await generateReport();
//           return;
//         }

//         setProcessingAI(false);

//         console.log("🎤 Resuming listening...");
//         setTimeout(() => startListening(), 500);
//       } catch (err) {
//         console.error("❌ Submit response error:", err);
//         setError(`AI error: ${err.message}`);
//         setProcessingAI(false);

//         setTimeout(() => startListening(), 1000);
//       }
//     },
//     [speak, startListening, stopListening]
//   );

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
//       console.log("🎤 Speech result received");
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
//         console.log("✅ Final transcript:", newTranscript);
//       } else {
//         setInterimTranscript(interim);
//       }

//       silenceTimerRef.current = setTimeout(() => {
//         console.log("⏱️ Silence detected, submitting...");
//         if (transcriptRef.current.trim()) {
//           stopListening();
//           submitResponseWithText(transcriptRef.current);
//         }
//       }, 2000);
//     };

//     rec.onend = () => {
//       console.log("🔚 Recognition ended");

//       if (
//         isListeningRef.current &&
//         !processingAIRef.current &&
//         interviewStartedRef.current &&
//         !interviewCompleteRef.current
//       ) {
//         console.log("🔄 Auto-restarting recognition...");
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
//         if (interviewStartedRef.current && !interviewCompleteRef.current && !processingAIRef.current) {
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

//     try {
//       const response = await fetch("http://localhost:8080/api/interview-sessions/verify_update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ jobId: id }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         showToast(
//           result.message || "You do not have access for this interview. Contact your organisation team.",
//           "error"
//         );
//         return;
//       }

//       showToast("Interview started successfully", "success");
//     } catch (err) {
//       console.error("Interview start failed:", err);
//       showToast("Unable to start interview. Please try again.", "error");
//     }

//     const questionsList = data.questions.map((q, i) => `${i + 1}. ${q.questionText}`).join("\n");

//     const jobContext = `
// Position: ${data.title}
// Description: ${data.description}
// Number of Questions: ${data.numberOfQuestions}
//     `.trim();

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
//       console.log("🆕 Creating interview session for job:", id);
//       const session = await createSession(studentId, id);
//       console.log("sessions", session);
//       sessionIdRef.current = session._id;
//       console.log("✅ Session created with ID:", session._id);

//       const res = await fetch(
//         "https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             model: "gpt-4o",
//             messages: [
//               { role: "system", content: systemPrompt },
//               { role: "user", content: "Hello, I'm ready for the interview." },
//             ],
//           }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`API Error: ${res.status}`);
//       }

//       const json = await res.json();
//       const aiMessage = json.choices?.[0]?.message?.content;

//       if (!aiMessage) {
//         throw new Error("No AI response received");
//       }

//       await pushTranscript(sessionIdRef.current, "candidate", "Hello, I'm ready for the interview.");

//       await pushTranscript(sessionIdRef.current, "interviewer", aiMessage);

//       conversationHistoryRef.current = [
//         { role: "user", content: "Hello, I'm ready for the interview." },
//         { role: "assistant", content: aiMessage },
//       ];

//       setConversation([{ role: "assistant", content: aiMessage }]);

//       await speak(aiMessage);
//       setProcessingAI(false);

//       console.log("🎯 Starting listening after initial question...");
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
//       .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
//       .join("\n\n");

//     console.log("Generating report for conversation:", conversationText);

//     try {
//       const res = await fetch(
//         "https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/api/openai",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             model: "gpt-4o",
//             messages: [
//               {
//                 role: "user",
//                 content: `
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
//             `,
//               },
//             ],
//           }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`API Error: ${res.status}`);
//       }

//       const json = await res.json();
//       const aiContent = json.choices?.[0]?.message?.content;
//       console.log("ai Report content", aiContent);

//       const { structured, reportText } = extractAIReport(aiContent);

//       setReport(reportText || "Report generation failed");
//       setProcessingAI(false);

//       try {
//         const reportSave = await fetch("http://localhost:8080/api/interview-report", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             aiContent,
//             sessionId: sessionIdRef.current,
//             candidateId: studentId,
//             jobId: id,
//             jobTitle: data?.title || "Intern",
//           }),
//         });

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

//   const handleToggleListen = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return <LoadingScreen darkMode={darkMode} />;
//   }

//   return (
//     <div
//       className={`${
//         darkMode
//           ? "bg-gray-900 text-white"
//           : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-gray-900"
//       } min-h-screen transition-all duration-300`}
//     >
//       {/* Floating Action Buttons */}
//       <FloatingControls
//         darkMode={darkMode}
//         onToggleDarkMode={() => setDarkMode(!darkMode)}
//         muteAI={muteAI}
//         onToggleMute={() => setMuteAI(!muteAI)}
//         showMuteButton={interviewStarted}
//       />

//       <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-6xl">
//         {/* Header */}
//         <InterviewHeader data={data} darkMode={darkMode} />

//         {/* Error Alert */}
//         <ErrorAlert error={error} darkMode={darkMode} />

//         {/* Pre-Interview Screen */}
//         {!interviewStarted && !interviewComplete && (
//           <PreInterviewScreen
//             onStartInterview={startInterview}
//             disabled={!data}
//             darkMode={darkMode}
//           />
//         )}

//         {/* Active Interview */}
//         {interviewStarted && !interviewComplete && (
//           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
//             <ConversationPanel conversation={conversation} darkMode={darkMode} />
            
//             <VoiceControlPanel
//               isListening={isListening}
//               isSpeaking={isSpeaking}
//               processingAI={processingAI}
//               transcript={transcript}
//               interimTranscript={interimTranscript}
//               onToggleListen={handleToggleListen}
//               onManualSubmit={handleManualSubmit}
//               darkMode={darkMode}
//             />
//           </div>
//         )}

//         {/* Interview Complete - Report */}
//         {interviewComplete && report && (
//           <ReportPanel report={report} onReset={resetInterview} darkMode={darkMode} />
//         )}
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx>{`
//         ::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }
//         ::-webkit-scrollbar-track {
//           background: ${darkMode ? "#1f2937" : "#f3f4f6"};
//           border-radius: 10px;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: ${darkMode ? "#4b5563" : "#d1d5db"};
//           border-radius: 10px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: ${darkMode ? "#6b7280" : "#9ca3af"};
//         }
//       `}</style>
//     </div>
//   );
// };

// export default InterviewPage;


// InterviewPage.jsx (Main Component - significantly reduced)
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useToast } from "../Context/ToastContext.jsx";

// Import components
import InterviewHeader from "../OrganisationComponents/interview/InterviewHeader.jsx";
import PreInterviewScreen from "../OrganisationComponents/interview/PreInterviewScreen.jsx";
import ConversationPanel from "../OrganisationComponents/interview/ConversationPanel.jsx";
import VoiceControlPanel from "../OrganisationComponents/interview/VoiceControlPanel.jsx";
import ReportPanel from "../OrganisationComponents/interview/ReportPanel.jsx";
import ErrorAlert from "../OrganisationComponents/interview/ErrorAlert.jsx";
import LoadingScreen from "../OrganisationComponents/interview/LoadingScreen.jsx";
import FloatingControls from "../OrganisationComponents/interview/FloatingControls.jsx";

// Import custom hooks
import { useInterviewState } from "../OrganisationComponents/interview/hooks/useInterviewState.js";
import { useJobData } from "../OrganisationComponents/interview/hooks/useJobData.js";
import { useSpeechRecognition } from "../OrganisationComponents/interview/hooks/useSpeechRecognition.js";
import { useSpeechSynthesis } from "../OrganisationComponents/interview/hooks/useSpeechSynthesis.js";
import { useInterviewLogic } from "../OrganisationComponents/interview/hooks/useInterviewLogic.js";

const InterviewPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { showToast } = useToast();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");

  // Job data fetching
  const { data, loading, error: jobError } = useJobData(id);

  // Interview state management
  const {
    interviewStarted,
    interviewComplete,
    conversation,
    error,
    processingAI,
    muteAI,
    sessionIdRef,
    conversationHistoryRef,
    systemPromptRef,
    setInterviewStarted,
    setInterviewComplete,
    setConversation,
    setError,
    setProcessingAI,
    setMuteAI,
    resetInterview,
  } = useInterviewState();

  // Speech synthesis
  const { speak, isSpeaking } = useSpeechSynthesis(muteAI);

  // Interview logic
  const {
    startInterview,
    submitResponse,
    generateReport,
    report,
  } = useInterviewLogic({
    data,
    id,
    studentId,
    speak,
    sessionIdRef,
    conversationHistoryRef,
    systemPromptRef,
    setInterviewStarted,
    setInterviewComplete,
    setConversation,
    setProcessingAI,
    setError,
    showToast,
  });

  // Speech recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    handleToggleListen,
    handleManualSubmit,
  } = useSpeechRecognition({
    submitResponse,
    interviewStarted,
    interviewComplete,
    processingAI,
  });

  if (loading) {
    return <LoadingScreen darkMode={darkMode} />;
  }

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-gray-900"
      } min-h-screen transition-all duration-300`}
    >
      <FloatingControls
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        muteAI={muteAI}
        onToggleMute={() => setMuteAI(!muteAI)}
        showMuteButton={interviewStarted}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-6xl">
        <InterviewHeader data={data} darkMode={darkMode} />
        <ErrorAlert error={error || jobError} darkMode={darkMode} />

        {!interviewStarted && !interviewComplete && (
          <PreInterviewScreen
            onStartInterview={startInterview}
            disabled={!data}
            darkMode={darkMode}
          />
        )}

        {interviewStarted && !interviewComplete && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <ConversationPanel conversation={conversation} darkMode={darkMode} />
            <VoiceControlPanel
              isListening={isListening}
              isSpeaking={isSpeaking}
              processingAI={processingAI}
              transcript={transcript}
              interimTranscript={interimTranscript}
              onToggleListen={handleToggleListen}
              onManualSubmit={handleManualSubmit}
              darkMode={darkMode}
            />
          </div>
        )}

        {interviewComplete && report && (
          <ReportPanel report={report} onReset={resetInterview} darkMode={darkMode} />
        )}
      </div>

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