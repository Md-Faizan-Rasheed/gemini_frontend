// import OpenAI from "openai";


// console.log(import.meta.env);

// const VITE_OPENAI_API_KEY_FRONTEND = import.meta.env.VITE_OPENAI_API_KEY_FRONTEND ;
// console.log("🚀 VITE_OPENAI_API_KEY_FRONTEND:", VITE_OPENAI_API_KEY_FRONTEND) ;
// console.log("🔑 OpenAI API Key loaded:", import.meta.env.VITE_OPENAI_API_KEY_FRONTEND
//  ? "✅ Loaded" : "❌ Missing");

// const openai = new OpenAI({
// apiKey: VITE_OPENAI_API_KEY_FRONTEND,
//   dangerouslyAllowBrowser: true, // REQUIRED for frontend
// });

// export default openai;



import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

console.log("API loaded:", apiKey ? "YES" : "NO");

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export default openai;
