import { useState, useRef, useCallback } from "react";

export const useSpeechSynthesis = (muteAI) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

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

  return { speak, isSpeaking };
};