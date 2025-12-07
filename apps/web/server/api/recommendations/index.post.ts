import { OpenAI } from "openai";
import { defineEventHandler, readBody } from "h3";
import { SensorReading } from "~~/server/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default defineEventHandler(async (event) => {
  const body: SensorReading = await readBody(event);

  // Improved validation: check for missing or invalid values
  if (!body || !body.deviceId || !body.temperature || !body.pressure) {
    setResponseStatus(event, 400);
    return {
      response:
        'Please provide valid sensor context including "deviceId" (string), "temperature" (number), and "pressure" (number).',
    };
  }

  const prompt = `Given indoor sensor readings (deviceId: ${body.deviceId}, temperature: ${body.temperature} °C, pressure: ${body.pressure} hPa), provide concise, practical guidance for clothing, energy usage, and nutrition. Respond strictly as JSON: {"clothing": string, "energy": string, "nutrition": string}.`;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 256,
  });

  return {
    response: response.choices[0]?.message?.content ?? "",
  };
});
