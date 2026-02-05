import openai from "./openaiClient";
import { generationConfig } from "../../constants/options.jsx";

export async function chatSessionSecond(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Act as an HR of a company hiring a Frontend Engineering Intern. Use professional HR tone.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    ...generationConfig,
  });

  return response.choices[0].message.content;
}

