import {
  defineEventHandler,
  createEventStream,
  setHeader,
  setResponseStatus,
} from "h3";
import { mqttService } from "~~/server/services/mqtt-service";

export default defineEventHandler((event) => {
  setResponseStatus(event, 200);
  setHeader(event, "Content-Type", "text/event-stream; charset=utf-8");
  setHeader(event, "Cache-Control", "no-cache, no-transform");
  setHeader(event, "Connection", "keep-alive");
  setHeader(event, "X-Accel-Buffering", "no");

  const eventStream = createEventStream(event);
  let closed = false;

  const safePush = (payload: string) => {
    if (closed) return;
    try {
      eventStream.push(payload);
    } catch (e) {
      console.error("[Diagnostics SSE] ❌ Error pushing:", e);
    }
  };

  // initial snapshot
  safePush(
    JSON.stringify({
      type: "diagnostics",
      data: mqttService.getDiagnostics(),
    })
  );

  // periodic updates
  const tick = setInterval(() => {
    safePush(
      JSON.stringify({
        type: "diagnostics",
        data: mqttService.getDiagnostics(),
      })
    );
  }, 5000);

  eventStream.onClosed(() => {
    closed = true;
    clearInterval(tick);
  });

  return eventStream.send();
});
