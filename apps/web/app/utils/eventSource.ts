import type { connectionStatusRef } from "~/types";

export const disconnectSubscriptionHandler = (
  reconnectTimer: number | null,
  eventSource: EventSource | null,
  connectionStatus: connectionStatusRef
) => {
  // Prevent auto-reconnect
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  // Close SSE
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  connectionStatus.value = "disconnected";
};
