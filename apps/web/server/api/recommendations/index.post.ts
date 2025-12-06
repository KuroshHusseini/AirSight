import { OpenAI } from "openai";
import { defineEventHandler, readBody } from "h3";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You're an assistant." },
      { role: "user", content: body.query },
    ],
  });

  console.log("OpenAI response:", response.choices[0].message.content);

  return {
    response: response.choices[0].message.content,
  };
});
