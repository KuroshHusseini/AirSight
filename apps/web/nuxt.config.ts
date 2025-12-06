// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss"],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    mqttBroker: process.env.MQTT_BROKER,
    mqttUsername: process.env.MQTT_USERNAME,
    mqttPassword: process.env.MQTT_PASSWORD,
    mongodbUri: process.env.MONGODB_URI,
    openaiApiKey: process.env.OPENAI_API_KEY,
    weatherApiKey: process.env.WEATHER_API_KEY,

    // Public variables
    public: {
      appName: "AirSight",
    },
  },

  compatibilityDate: "2024-11-01",
});
