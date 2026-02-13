import { useState, useCallback } from "react";
import { createSession, pushTranscript, completeSession, extractAIReport } from "../../helpers.js";
import { generateSystemPrompt } from "../utills/promptGenerator.js";

export const useInterviewLogic = ({
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
}) => {
  const [report, setReport] = useState(null);

  const submitResponse = useCallback(
    async (messageText) => {

      const message = messageText.trim();
      if (!message) {
        return;
      }

      setProcessingAI(true);

      conversationHistoryRef.current.push({
        role: "user",
        content: message,
      });

      await pushTranscript(sessionIdRef.current, "candidate", message);
      setConversation((prev) => [...prev, { role: "user", content: message }]);

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
      } catch (err) {
        console.error("❌ Submit response error:", err);
        setError(`AI error: ${err.message}`);
        setProcessingAI(false);
      }
    },
    [
      speak,
      sessionIdRef,
      conversationHistoryRef,
      systemPromptRef,
      setConversation,
      setProcessingAI,
      setError,
      setInterviewComplete,
    ]
  );

  const startInterview = async () => {
    if (!data) return;

    try {
      const response = await fetch(
        "https://jubilant-fortnight-node-backend.onrender.com/api/interview-sessions/verify_update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ jobId: id }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(
          result.message || "You do not have access for this interview.",
          "error"
        );
        return;
      }

      showToast("Interview started successfully", "success");
    } catch (err) {
      console.error("Interview start failed:", err);
      showToast("Unable to start interview. Please try again.", "error");
      return;
    }

    const systemPrompt = generateSystemPrompt(data);
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
    } catch (err) {
      console.error("Start interview error:", err);
      setError(`Failed to start interview: ${err.message}`);
      setInterviewStarted(false);
      setProcessingAI(false);
    }
  };

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
                content: `Based on the following interview transcript for the position of "${data?.title}", generate a comprehensive evaluation.

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

====================
PART 2: HUMAN-READABLE REPORT
====================

Generate a professional evaluation report with sections for:
1. OVERALL ASSESSMENT
2. TECHNICAL COMPETENCE
3. COMMUNICATION SKILLS
4. PROBLEM-SOLVING ABILITY
5. KEY HIGHLIGHTS
6. AREAS FOR DEVELOPMENT
7. FINAL RECOMMENDATION`,
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

      // Save report
      await fetch("https://jubilant-fortnight-node-backend.onrender.com/api/interview-report", {
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
    } catch (err) {
      console.error("Report generation error:", err);
      setReport("Error generating report. Please try again.");
      setProcessingAI(false);
    }
  };

  return {
    startInterview,
    submitResponse,
    generateReport,
    report,
  };
};