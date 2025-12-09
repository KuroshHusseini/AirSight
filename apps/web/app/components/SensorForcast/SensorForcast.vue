<script setup lang="ts">
import type { SensorReadingRef } from "../../types";

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
.status-btn-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.heading {
  margin-bottom: 1rem;
  font-size: clamp(1.25rem, 5vw, 2rem);
  color: #1f2937;
}

.description {
  margin-bottom: 1.5rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #1f2937;
  line-height: 1.5;
}

.btn-container {
  margin-bottom: 0;
}

.btn {
  padding: clamp(0.5rem, 1vw, 0.8rem) clamp(0.75rem, 2vw, 1rem);
  border-radius: 0.5rem;
  color: white;
  border: none;
  cursor: pointer;
  font-size: clamp(0.75rem, 2vw, 0.95rem);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn.connect {
  background-color: #d4edda;
  color: #155724;
}

.btn.disconnect {
  background-color: #f8d7da;
  color: #721c24;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.status {
  flex: 1;
  min-width: 200px;
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: clamp(0.75rem, 2vw, 0.95rem);
  text-align: center;
  line-height: 1.4;
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
  padding: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sensor-card h2 {
  margin-bottom: 1rem;
  color: #374151;
  font-size: clamp(1rem, 3vw, 1.25rem);
}

.reading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: clamp(0.5rem, 2vw, 0.75rem) 0;
  border-bottom: 1px solid #f3f4f6;
}

.reading:last-of-type {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  flex-shrink: 0;
}

.value {
  font-size: clamp(1rem, 4vw, 1.2rem);
  font-weight: 700;
  color: #2563eb;
  text-align: right;
}

.timestamp {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #9ca3af;
  text-align: center;
}

.no-data {
  padding: clamp(2rem, 5vw, 3rem);
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 2px dashed #d1d5db;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.no-data p {
  margin: 0;
}

/* Tablet breakpoint */
@media (max-width: 768px) {
  .sensor-dashboard {
    padding: 0 0.75rem;
  }

  .status-btn-container {
    gap: 0.75rem;
  }

  .sensor-card {
    padding: 1.25rem;
  }

  .reading {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .value {
    text-align: left;
    width: 100%;
  }
}

/* Mobile breakpoint */
@media (max-width: 480px) {
  .sensor-dashboard {
    padding: 0 0.5rem;
  }

  .status-btn-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-container {
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .status {
    min-width: unset;
    width: 100%;
  }

  .sensor-card {
    padding: 1rem;
  }

  .sensor-card h2 {
    margin-bottom: 0.75rem;
  }

  .reading {
    padding: 0.5rem 0;
  }

  .timestamp {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
  }
}
</style>
