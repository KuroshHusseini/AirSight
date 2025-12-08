<script setup lang="ts">
const {
  loading,
  error,
  recommendation,
  askAI,
  currentTemp,
  currentPressure,
  deviceId,
} = useRecommendations();
const { isConnected } = useSensorStream();

// Disable ask button when temperature or pressure are missing
const dataIsAvailable = computed(() => {
  const temp = currentTemp.value;
  const pressure = currentPressure.value;

  return (
    temp !== undefined &&
    temp !== null &&
    pressure !== undefined &&
    pressure !== null
  );
});
</script>

<template>
  <div class="recommendations">
    <h1 class="heading">AI Recommendations</h1>
    <p class="description">
      Get personalized recommendations based on current sensor readings
    </p>

    <button class="btn" :disabled="loading || !dataIsAvailable" @click="askAI">
      <span v-if="!loading">Ask AI for recommendations</span>
      <span v-else>Loading...</span>
    </button>

    <p v-if="!dataIsAvailable && !loading" class="hint">
      Waiting for sensor data (temperature and pressure)...
    </p>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="recommendation && !error && isConnected" class="cards">
      <div class="card info">
        <h3>Current Sensor Readings</h3>
        <p><strong>Device:</strong> {{ deviceId }}</p>
        <p><strong>Temperature:</strong> {{ currentTemp ?? "N/A" }} °C</p>
        <p><strong>Pressure:</strong> {{ currentPressure ?? "N/A" }} hPa</p>
      </div>

      <div class="card">
        <h3>Clothing</h3>
        <p>{{ recommendation.clothing }}</p>
      </div>
      <div class="card">
        <h3>Energy</h3>
        <p>{{ recommendation.energy }}</p>
      </div>
      <div class="card">
        <h3>Nutrition</h3>
        <p>{{ recommendation.nutrition }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heading {
  margin-bottom: 0.6rem;
  font-size: 2rem;
  color: #1f2937;
}

.description {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #1f2937;
}

.hint {
  font-weight: 500;
  color: #6b7280;
}

.btn {
  background: #2563eb; /* blue-600 */
  margin: 0.5rem 0 1.5rem 0;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
}

.cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.card.info {
  background: #f8fafc;
}

.card h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
