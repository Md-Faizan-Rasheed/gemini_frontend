
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY_FRONTEND;

console.log("API loaded:", apiKey ? "YES" : "NO");

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export default openai;
