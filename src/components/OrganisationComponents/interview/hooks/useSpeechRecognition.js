import { useState, useEffect, useRef, useCallback } from "react";

export const useSpeechRecognition = ({
  submitResponse,
  interviewStarted,
  interviewComplete,
  processingAI,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");

  // State refs for callbacks
  const isListeningRef = useRef(false);
  const processingAIRef = useRef(false);
  const interviewStartedRef = useRef(false);
  const interviewCompleteRef = useRef(false);

  // Sync state to refs
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

  const startListening = useCallback(() => {

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

  const handleSubmitTranscript = useCallback(() => {
    if (transcriptRef.current.trim()) {
      stopListening();
      submitResponse(transcriptRef.current);
    }
  }, [submitResponse, stopListening]);

  // Setup speech recognition
  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported");
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
          handleSubmitTranscript();
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
        if (
          interviewStartedRef.current &&
          !interviewCompleteRef.current &&
          !processingAIRef.current
        ) {
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
    };
  }, [handleSubmitTranscript, startListening]);

  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualSubmit = () => {
    handleSubmitTranscript();
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    handleToggleListen,
    handleManualSubmit,
  };
};