import { mqttService } from "../services/mqtt-service";

export default defineNitroPlugin(async (nitroApp) => {
  try {
    console.log("[Plugin] Initializing MQTT service...");
    await mqttService.connect();
    console.log("[Plugin] ✅ MQTT service ready");
  } catch (error) {
    console.error("[Plugin] ❌ MQTT initialization failed:", error);
  }
});
