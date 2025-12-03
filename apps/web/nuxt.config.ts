// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss"],

  typescript: {
    strict: true,
    typeCheck: false  // Disabled due to vite-plugin-checker issue
  },

  runtimeConfig: {
    // Server-only secrets
    mqttBrokerUrl: process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
    mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/airsight",
    openaiApiKey: process.env.OPENAI_API_KEY,
    weatherApiKey: process.env.WEATHER_API_KEY,

    // Public variables
    public: {
      appName: "AirSight",
    },
  },
});
