import { onMounted, onUnmounted, shallowRef } from "vue";
import type {
  SensorReading,
  connectionStatusType,
} from "../components/SensorForcast/types";

export const useConnectionStatus = () =>
  useState<connectionStatusType>("status", () => "connecting");

export const useSensors = () =>
  useState<SensorReading | null>("sensors", () => null);

export const useSensorStream = () => {
  const connectionStatus = useConnectionStatus();
  const sensorData = useSensors();
  const eventSource = shallowRef<EventSource | null>(null);
  const reconnectTimer = shallowRef<number | null>(null);

  const disconnectFromSensorHandler = () => {
    connectionStatus.value = "disconnected";

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
    disconnectFromSensorHandler();
    connectionStatus.value = "connecting";

    try {
      const es = new EventSource("/api/sensors/latest");
      eventSource.value = es;

      es.onopen = () => {
        connectionStatus.value = "connected";
      };

      es.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "initial") {
            sensorData.value = message.data ? message.data : null;
          }

          if (message.type === "latest") {
            sensorData.value = message.data;
          }
        } catch (err) {
          console.error("[SSE] Parse error:", err, event.data);
        }
      };

      es.onerror = () => {
        // if user manually disconnected, don't auto reconnect
        if (connectionStatus.value === "disconnected") return;

        disconnectFromSensorHandler();
        reconnectTimer.value = window.setTimeout(connect, 5000);
      };
    } catch (e) {
      console.error("[SSE] Connection error:", e);
      connectionStatus.value = "disconnected";
    }
  };

  onMounted(() => {
    if (import.meta.client) connect();
  });

  onUnmounted(() => {
    disconnectFromSensorHandler();
  });

  return {
    sensorData,
    connectionStatus,
    connect,
    disconnectFromSensorHandler,
  };
};
