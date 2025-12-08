<script setup lang="ts">
import type { SensorReading, SensorReadingRef } from "./types";

const {
  sensorData,
  connectionStatus,
  connect,
  isConnected,
  disconnectFromSensorHandler,
} = useSensorStream();
// Connected to the stream but haven't received any reading yet
const waitingForData = computed(
  () => connectionStatus.value === "connected" && !sensorData
);

const isDetailLoading = computed(() => {
  const data = sensorData as SensorReadingRef;

  return (
    !data ||
    data.value?.deviceId == null ||
    data.value?.temperature == null ||
    data.value?.pressure == null ||
    data.value?.timestamp == null
  );
});
</script>

<template>
  <div class="sensor-dashboard">
    <h1 class="heading">Real-Time Sensor Dashboard</h1>
    <p class="description">
      Monitor live temperature and pressure readings from IoT sensors
    </p>

    <div class="status-btn-container">
      <div class="btn-container">
        <button
          class="btn disconnect"
          v-if="connectionStatus === 'connected'"
          @click="disconnectFromSensorHandler"
        >
          Disconnect
        </button>
        <button v-else class="btn connect" @click="connect">Connect</button>
      </div>
      <div
        class="status"
        :class="connectionStatus"
        role="status"
        aria-live="polite"
      >
        <span v-if="connectionStatus === 'connecting'">
          Connecting to sensor stream...
        </span>
        <span v-if="connectionStatus === 'connected'">
          Connected to live sensor data
        </span>
        <span v-if="connectionStatus === 'disconnected'">
          Disconnected from sensor stream
        </span>
      </div>
    </div>
    <div v-if="waitingForData" class="no-data">
      <p>Connected. Waiting for first sensor reading…</p>
    </div>
    <div
      v-else-if="connectionStatus !== 'connected' || !isConnected.valueOf()"
      class="no-data"
    >
      <p>
        No sensor data available yet. Connect to start receiving real-time
        readings.
      </p>
    </div>

    <div v-else>
      <div class="sensor-card">
        <template v-if="isDetailLoading">
          <div class="reading">
            <span class="label">Temperature</span>
            <span class="value skeleton">Pulling data…</span>
          </div>
          <div class="reading">
            <span class="label">Pressure</span>
            <span class="value skeleton">Pulling data…</span>
          </div>
          <div class="timestamp">
            Last update:
            <span class="skeleton">Pulling data…</span>
          </div>
        </template>
        <template v-else>
          <h2>{{ sensorData?.deviceId }}</h2>
          <div class="reading">
            <span class="label">Temperature</span>
            <span class="value">{{ sensorData?.temperature }} °C</span>
          </div>
          <div class="reading">
            <span class="label">Pressure</span>
            <span class="value">{{ sensorData?.pressure }} hPa</span>
          </div>
          <div class="timestamp">
            Last update:
            <time
              :datetime="
                sensorData?.timestamp
                  ? new Date(sensorData?.timestamp).toISOString()
                  : ''
              "
            >
              {{ formatTimestamp(Number(sensorData?.timestamp)) }}
            </time>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sensor-dashboard {
  max-width: 800px;
}

.status-btn-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.heading {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #1f2937;
}

.description {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #1f2937;
}

.status {
  flex-grow: 1;
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

.btn-container {
  margin-bottom: 1.5rem;
  text-align: center;
}

.btn {
  padding: 0.8rem 1rem;
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
  font-size: 1.2rem;
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
