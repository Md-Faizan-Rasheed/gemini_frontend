import { useState, useRef } from "react";

export const useInterviewState = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [processingAI, setProcessingAI] = useState(false);
  const [muteAI, setMuteAI] = useState(false);

  // Refs for persistent data
  const sessionIdRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const systemPromptRef = useRef("");

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewComplete(false);
    setConversation([]);
    setError(null);
    setProcessingAI(false);
    conversationHistoryRef.current = [];
    systemPromptRef.current = "";
    sessionIdRef.current = null;
  };

  return {
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
  };
};