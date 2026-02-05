export const API_BASE = "https://jubilant-fortnight-node-backend.onrender.com/api";

// 🔹 create interview session
export const createSession = async (studentId,jobId) => {
  const res = await fetch(`${API_BASE}/interview-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId, // replace later
      jobId
    })
  });
  return res.json();
};

// 🔹 push transcript line
export const pushTranscript = async (sessionId, speaker, message) => {
  if (!sessionId) return;
  await fetch(`${API_BASE}/interview-sessions/${sessionId}/transcript`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ speaker, message })
  });
};

// 🔹 mark completed
export const completeSession = async (sessionId) => {
  if (!sessionId) return;
  await fetch(`${API_BASE}/interview-sessions/${sessionId}/complete`, {
    method: "POST"
  });
};



export const extractAIReport = (content) => {
  if (!content || typeof content !== "string") {
    return { structured: null, reportText: "" };
  }

  let structured = null;
  let reportText = "";

  try {
    /**
     * 1️⃣ Extract JSON safely
     * Looks for FIRST valid JSON object only
     */
    const jsonMatch = content.match(
      /```json([\s\S]*?)```|(\{[\s\S]*?"recommendation"[\s\S]*?\})/
    );

    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      structured = JSON.parse(jsonString);
    }

    /**
     * 2️⃣ Extract human-readable report
     */
    const reportSplit = content.split("PART 2: HUMAN-READABLE REPORT");

    if (reportSplit.length > 1) {
      reportText = reportSplit[1].trim();
    } else {
      // fallback: remove JSON and show everything else
      reportText = content.replace(jsonMatch?.[0] || "", "").trim();
    }

    return { structured, reportText };
  } catch (error) {
    console.error("AI parsing failed:", error);

    // Fallback: show raw content
    return {
      structured: null,
      reportText: content,
    };
  }
};