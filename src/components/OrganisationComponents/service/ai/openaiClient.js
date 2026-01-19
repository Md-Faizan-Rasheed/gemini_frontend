import OpenAI from "openai";


const VITE_OPENAI_API_KEY_FRONTEND = import.meta.env.VITE_OPENAI_API_KEY_FRONTEND ;

console.log("🔑 OpenAI API Key loaded:", VITE_OPENAI_API_KEY_FRONTEND
 ? "✅ Loaded" : "❌ Missing");

const openai = new OpenAI({
apiKey: VITE_OPENAI_API_KEY_FRONTEND,
  dangerouslyAllowBrowser: true, // REQUIRED for frontend
});

export default openai;
