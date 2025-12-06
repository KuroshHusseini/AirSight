import mqtt from "mqtt";
import { MQTT_TOPICS, SensorReading } from "../types";
import { EventEmitter } from "events";

const brokerUrl = `mqtts://${process.env.MQTT_BROKER}`;
let client: mqtt.MqttClient | null = null;
let isConnected: boolean = false;
let latestReadings: Map<string, SensorReading> = new Map();
const eventEmitter = new EventEmitter();

const connectToHiveMQ = () => {
  if (client?.connected) {
    console.log("[MQTT Service] ⚠️ Already connected");
    return client;
  }

  console.log(`[MQTT Service] Connecting to ${brokerUrl}...`);

  client = mqtt.connect(brokerUrl, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    port: 8883,
    protocol: "mqtts",
    clientId: `airsight-web-${Date.now()}`,
    reconnectPeriod: 1000,
    connectTimeout: 30000,
    clean: true,
    rejectUnauthorized: true,
  });

  client.on("connect", () => {
    console.log("[MQTT Service] ✅ Connected to HiveMQ");
    isConnected = true;

    // Subscribe to both temperature and pressure topics
    const topics = [MQTT_TOPICS.SENSOR_TEMP, MQTT_TOPICS.SENSOR_PRESSURE];

    client?.subscribe(topics, (err) => {
      if (err) {
        console.error("[MQTT Service] ❌ Subscribe error:", err);
      } else {
        console.log(`[MQTT Service] 📡 Subscribed to: ${topics.join(", ")}`);
      }
    });
  });

  client.on("message", (topic, message) => {
    try {
      const sensorData = message.toString();

      // Parse the numeric value from the message
      const value = parseFloat(sensorData);
      if (!value || isNaN(value)) {
        console.error(`[MQTT Service] ❌ Invalid numeric value: ${sensorData}`);
        return;
      }

      // Get existing reading or create new one
      let reading = latestReadings.get(process.env.DEVICE_ID || "unknown");

      if (!reading) {
        reading = {
          deviceId: process.env.DEVICE_ID || "unknown",
          timestamp: Date.now(),
        };
      }

      // Update the appropriate field based on topic
      if (topic === MQTT_TOPICS.SENSOR_TEMP) {
        reading.temperature = value;
      }

      if (topic === MQTT_TOPICS.SENSOR_PRESSURE) {
        reading.pressure = value;
      }

      if (
        topic !== MQTT_TOPICS.SENSOR_TEMP &&
        topic !== MQTT_TOPICS.SENSOR_PRESSURE
      ) {
        console.warn(`[MQTT Service] ⚠️  Unknown topic: ${topic}`);
        return;
      }

      // Update timestamp and save
      reading.timestamp = Date.now();
      latestReadings.set(process.env.DEVICE_ID || "unknown", reading);

      eventEmitter.emit("sensorUpdate", reading);
    } catch (error) {
      console.error("[MQTT Service] ❌ Message processing error:", error);
      console.error("[MQTT Service] Topic:", topic);
      console.error("[MQTT Service] Raw message:", message.toString());
    }
  });

  client.on("error", (error) => {
    console.error(
      "[MQTT Service] ❌ Connection error:",
      error.message || error
    );
    isConnected = false;
  });

  client.on("close", () => {
    console.log("[MQTT Service] ⚠️  Disconnected from HiveMQ");
    isConnected = false;
  });

  client.on("reconnect", () => {
    console.log("[MQTT Service] 🔄 Reconnecting to HiveMQ...");
  });

  client.on("offline", () => {
    console.log("[MQTT Service] 📴 Client went offline");
    isConnected = false;
  });

  return client;
};

// Service API
export const mqttService = {
  connect: connectToHiveMQ,

  disconnect: () => {
    if (client) {
      client.end();
      client = null;
      isConnected = false;
      console.log("[MQTT Service] 🔌 Disconnected");
    }
  },

  getStatus: () => ({
    connected: isConnected,
    brokerUrl: brokerUrl.replace(/\/\/.*@/, "//*****@"), // Hide credentials in logs
    subscribedTopics: [MQTT_TOPICS.SENSOR_TEMP, MQTT_TOPICS.SENSOR_PRESSURE],
    deviceCount: latestReadings.size,
  }),

  getLatestReading: (): SensorReading | undefined => {
    return latestReadings.get(process.env.DEVICE_ID || "unknown");
  },

  clearReadings: () => {
    latestReadings.clear();
    console.log("[MQTT Service] 🗑️  Cleared all readings");
  },

  onSensorUpdate: (callback: (reading: SensorReading) => void) => {
    eventEmitter.on("sensorUpdate", callback);
  },

  offSensorUpdate: (callback: (reading: SensorReading) => void) => {
    eventEmitter.off("sensorUpdate", callback);
  },
};
