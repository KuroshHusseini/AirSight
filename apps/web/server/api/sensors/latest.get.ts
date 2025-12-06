import {
  defineEventHandler,
  createEventStream,
  setHeader,
  setResponseStatus,
} from "h3";
import { mqttService } from "~~/server/services/mqtt-service";

export default defineEventHandler((event) => {
  const latest = mqttService.getLatestReading();
  const initialData = latest ? [latest] : [];

  // Proper SSE headers
  setResponseStatus(event, 200);
  setHeader(event, "Content-Type", "text/event-stream; charset=utf-8");
  setHeader(event, "Cache-Control", "no-cache, no-transform");
  setHeader(event, "Connection", "keep-alive");
  setHeader(event, "X-Accel-Buffering", "no");

  const eventStream = createEventStream(event);
  let closed = false;
  console.log("[SSE] Client connected", mqttService.getStatus());

  const safePush = (payload: string) => {
    if (closed) return;
    try {
      eventStream.push(payload);
    } catch (e) {
      console.error("[SSE] ❌ Error pushing to stream:", e);
    }
  };

  safePush(
    JSON.stringify({
      type: "initial",
      data: initialData,
      timestamp: Date.now(),
    })
  );

  // Updates from MQTT
  const handleUpdate = (reading: any) => {
    safePush(
      JSON.stringify({
        type: "update",
        data: reading,
        timestamp: Date.now(),
      })
    );
  };

  mqttService.onSensorUpdate(handleUpdate);

  // Heartbeat
  const heartbeat = setInterval(() => {
    safePush(
      JSON.stringify({
        type: "heartbeat",
        timestamp: Date.now(),
      })
    );
  }, 10000);

  // Cleanup
  eventStream.onClosed(() => {
    closed = true;
    clearInterval(heartbeat);
    mqttService.offSensorUpdate(handleUpdate);
    console.log("[SSE] Client disconnected");
  });

  // Return the SSE stream (not HTML)
  return eventStream.send();
});
