import { OpenAI } from "openai";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { SensorReading } from "~~/server/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default defineEventHandler(async (event) => {
  const body: SensorReading = await readBody(event);
  const { deviceId, temperature, pressure } = body;

  if (
    !deviceId ||
    typeof temperature !== "number" ||
    typeof pressure !== "number"
  ) {
    setResponseStatus(event, 400);
    return {
      response:
        'Please provide valid sensor context including "deviceId" (string), "temperature" (number), and "pressure" (number).',
    };
  }

  const prompt = `specific, actionable recommendations.

                  Sensor Data:
                  - Device ID: ${deviceId}
                  - Temperature: ${temperature}°C
                  - Pressure: ${pressure} hPa

                  Respond ONLY as valid JSON with no additional text:
                  {
                    "clothing": "specific clothing recommendation based on temperature",
                    "energy": "HVAC/energy efficiency recommendation",
                    "nutrition": "hydration/nutrition recommendation based on conditions"
                  }`;

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
