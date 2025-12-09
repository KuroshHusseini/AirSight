import { onMounted, onUnmounted, shallowRef } from "vue";
import type { DiagnosticsPayload } from "../types";

export const useDiagnosticsState = () =>
  useState<DiagnosticsPayload | null>("diagnostics", () => null);

export const useDiagnosticsStream = () => {
  const diagnostics = useDiagnosticsState();
  const eventSource = shallowRef<EventSource | null>(null);
  const reconnectTimer = shallowRef<number | null>(null);
  const connected = ref(false);

  const disconnect = () => {
    connected.value = false;
    if (reconnectTimer.value != null) {
      clearTimeout(reconnectTimer.value);
      reconnectTimer.value = null;
    }
    if (eventSource.value) {
      eventSource.value.close();
      eventSource.value = null;
    }
  };

  const connect = () => {
    disconnect();

    try {
      const es = new EventSource("/api/diagnostics/stream");
      eventSource.value = es;

      es.onopen = () => {
        connected.value = true;
      };

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "diagnostics") {
            diagnostics.value = payload.data as DiagnosticsPayload;
          }
        } catch (e) {
          console.error("[Diagnostics SSE] Parse error:", e, event.data);
        }
      };

      es.onerror = () => {
        disconnect();
        reconnectTimer.value = window.setTimeout(connect, 5000);
      };
    } catch (e) {
      console.error("[Diagnostics SSE] Connection error:", e);
      connected.value = false;
    }
  };

  onMounted(() => {
    if (import.meta.client) {
      connect();
    }
  });

  onUnmounted(() => disconnect());

  return { diagnostics, connected, connect, disconnect };
};
