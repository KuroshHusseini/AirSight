<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { SensorReading } from "./types";

let eventSource: EventSource | null = null;
let reconnectTimer: number | null = null;

const sensors = ref<SensorReading[]>([]);
const connectionStatus = ref<"connecting" | "connected" | "disconnected">(
  "connecting"
);

const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString();

const disconnect = () => {
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

const connectToStream = () => {
  connectionStatus.value = "connecting";
  try {
    eventSource = new EventSource("/api/sensors/latest");

    eventSource.onopen = () => {
      connectionStatus.value = "connected";
    };

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "status" && message.message) {
          // Show broker status (e.g., "HiveMQ is not connected")
          connectionStatus.value = "disconnected";
          console.warn("[SSE] Status:", message.message);
          return;
        }
        if (message.type === "initial") {
          sensors.value = Array.isArray(message.data) ? message.data : [];
        } else if (message.type === "update") {
          const reading: SensorReading = message.data;
          const idx = sensors.value.findIndex(
            (s) => s.deviceId === reading.deviceId
          );
          if (idx !== -1) sensors.value[idx] = reading;
          else sensors.value.push(reading);
        }
      } catch (err) {
        console.error("[SSE] Parse error:", err, event.data);
      }
    };

    eventSource.onerror = () => {
      // If user explicitly disconnected, don't auto-reconnect
      if (connectionStatus.value === "disconnected") return;
      connectionStatus.value = "disconnected";
      eventSource?.close();
      eventSource = null;
      reconnectTimer = window.setTimeout(connectToStream, 5000);
    };
  } catch {
    connectionStatus.value = "disconnected";
  }
};

onMounted(connectToStream);

onUnmounted(() => {
  disconnect();
});
</script>

<template>
  <div class="sensor-dashboard">
    <h1 class="heading">Real-Time Sensor Dashboard</h1>
    <p class="description">
      Monitor live temperature and pressure readings from IoT sensors
    </p>

    <div
      class="status"
      :class="connectionStatus"
      role="status"
      aria-live="polite"
    >
      <span v-if="connectionStatus === 'connecting'"
        >Connecting to sensor stream...</span
      >
      <span v-else-if="connectionStatus === 'connected'"
        >Connected to live sensor data</span
      >
      <span v-else>Disconnected from sensor stream</span>
    </div>

    <div style="margin-bottom: 1rem">
      <button
        class="btn disconnect"
        v-if="connectionStatus === 'connected'"
        @click="disconnect"
        aria-label="Disconnect from sensor stream"
      >
        Disconnect
      </button>
      <button
        v-else
        class="btn connect"
        @click="connectToStream"
        aria-label="Connect to sensor stream"
      >
        Connect
      </button>
    </div>

    <div v-if="sensors.length === 0" class="no-data">
      <p>
        No sensor data available yet. Connect to start receiving real-time
        readings.
      </p>
    </div>

    <div v-else>
      <div v-for="sensor in sensors" :key="sensor.deviceId" class="sensor-card">
        <h2>{{ sensor.deviceId }}</h2>
        <div class="reading">
          <span class="label">Temperature</span>
          <span class="value">{{ sensor.temperature }} °C</span>
        </div>
        <div class="reading">
          <span class="label">Pressure</span>
          <span class="value">{{ sensor.pressure }} hPa</span>
        </div>
        <div class="timestamp">
          Last update:
          <time :datetime="new Date(sensor.timestamp).toISOString()">{{
            formatTimestamp(sensor.timestamp)
          }}</time>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sensor-dashboard {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.heading {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #1f2937;
}

.description {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #1f2937;
}

.status {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.status.connected {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status.connecting {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status.disconnected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.sensor-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sensor-card h3 {
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.125rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  border: none;
  cursor: pointer;
}

.btn.connect {
  background-color: #d4edda;
  color: #155724;
}

.btn.disconnect {
  background-color: #f8d7da;
  color: #721c24;
}

.reading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.reading:last-of-type {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
}

.timestamp {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
}

.no-data {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 2px dashed #d1d5db;
}
</style>
style
