import { ref, computed } from "vue";
import { useSensorStream } from "./useSensorStream";

export type AIRecommendation = {
  clothing: string;
  energy: string;
  nutrition: string;
  alerts?: string[];
  generatedAt?: number;
};

export const useRecommendations = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const recommendation = ref<AIRecommendation | null>(null);

  // live sensor context
  const { sensorData } = useSensorStream();
  const currentTemp = computed(() => sensorData.value?.temperature);
  const currentPressure = computed(() => sensorData.value?.pressure);
  const deviceId = computed(() => sensorData.value?.deviceId ?? "unknown");

  const askAI = async () => {
    loading.value = true;
    error.value = null;

    try {
      const context = {
        deviceId: deviceId.value,
        temperature: currentTemp.value,
        pressure: currentPressure.value,
        timestamp: Date.now(),
      };
      console.log("🚀 ~ askAI ~ context:", context);

      const res = await $fetch<{ response: string }>("/api/recommendations", {
        method: "POST",
        body: {
          context,
        },
      });

      console.log(res);

      const parse = JSON.parse(res.response);
      recommendation.value = parse;
    } catch (e: any) {
      error.value = e?.message || "Failed to get AI recommendations";
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    recommendation,
    askAI,
    sensorData,
    currentTemp,
    currentPressure,
    deviceId,
  };
};
