import mqtt from "mqtt";
import { MQTT_TOPICS, SensorReading } from "../types";
import { EventEmitter } from "events";

let client: mqtt.MqttClient | null = null;
let isConnected: boolean = false;
let latestReadings: Map<string, SensorReading> = new Map();
const host = process.env.MQTT_BROKER;
const port = Number(process.env.MQTT_PORT || 8883);

const eventEmitter = new EventEmitter();

// Diagnostics state
const messagesByTopic: Record<string, number> = {};

let lastMessageAt: number | null = null;
let firstConnectAt: number | null = null;
let lastConnectAt: number | null = null;
let lastDisconnectAt: number | null = null;

let totalMessages = 0;
let connectCount = 0;
let reconnectCount = 0;
let disconnectCount = 0;
let totalConnectedMs = 0;

let currentSessionStartedAt: number | null = null;
let recentMessageTimestamps: number[] = [];

const connectToHiveMQ = () => {
  if (client?.connected) {
    console.log("[MQTT Service] ⚠️ Already connected");
    return client;
  }

  console.log("[MQTT Service] Using MQTT host:", host, "port:", port);

  client = mqtt.connect({
    host,
    port,
    protocol: "mqtts",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: `airsight-web-${Date.now()}`,
    reconnectPeriod: 1000,
    connectTimeout: 30000,
    clean: true,
    rejectUnauthorized: true,
  });

  client.on("connect", () => {
    console.log("[MQTT Service] ✅ Connected to HiveMQ");
    isConnected = true;
    connectCount += 1;

    if (!firstConnectAt) {
      firstConnectAt = Date.now();
    }

    lastConnectAt = Date.now();
    currentSessionStartedAt = Date.now();

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

      // Update diagnostics
      totalMessages += 1;
      messagesByTopic[topic] = (messagesByTopic[topic] || 0) + 1;

      lastMessageAt = reading.timestamp;
      const now = reading.timestamp;

      recentMessageTimestamps.push(now);

      const cutoff = now - 60000;

      if (recentMessageTimestamps.length > 0) {
        let index = 0;

        while (
          index < recentMessageTimestamps.length &&
          recentMessageTimestamps[index] < cutoff
        )
          index++;

        if (index > 0) {
          recentMessageTimestamps = recentMessageTimestamps.slice(index);
        }
      }

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
    disconnectCount += 1;
    lastDisconnectAt = Date.now();

    if (currentSessionStartedAt) {
      totalConnectedMs += Date.now() - currentSessionStartedAt;
      currentSessionStartedAt = null;
    }
  });

  client.on("reconnect", () => {
    console.log("[MQTT Service] 🔄 Reconnecting to HiveMQ...");
    reconnectCount += 1;
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
    brokerUrl: `mqtts://${host}:${port}`,
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

  onSensorLatest: (callback: (reading: SensorReading) => void) => {
    eventEmitter.on("sensorUpdate", callback);
  },

  offSensorLatest: (callback: (reading: SensorReading) => void) => {
    eventEmitter.off("sensorUpdate", callback);
  },

  getDiagnostics: () => {
    const now = Date.now();
    const windowCutoff = now - 60000;
    const tenSecCutoff = now - 10000;
    const lifetimeMs = firstConnectAt ? now - firstConnectAt : 0;

    const msgsLastMinute = recentMessageTimestamps.filter(
      (t) => t >= windowCutoff
    ).length;

    const msgsLast10s =
      recentMessageTimestamps.filter((t) => t >= tenSecCutoff).length / 10;

    const connectedDurationMs = currentSessionStartedAt
      ? totalConnectedMs + (now - currentSessionStartedAt)
      : totalConnectedMs;

    const stabilityPct =
      lifetimeMs > 0
        ? Math.min(100, Math.max(0, (connectedDurationMs / lifetimeMs) * 100))
        : 0;

    return {
      connected: isConnected,
      brokerUrl: `mqtts://${host}:${port}`,
      messagesReceived: totalMessages,
      messagesByTopic: { ...messagesByTopic },
      lastMessageAt,
      throughput: {
        perSecond: Number(msgsLast10s.toFixed(2)),
        perMinute: msgsLastMinute,
      },

      connection: {
        connectCount,
        reconnectCount,
        disconnectCount,
        firstConnectAt,
        lastConnectAt,
        lastDisconnectAt,
        uptimeMs: currentSessionStartedAt ? now - currentSessionStartedAt : 0,
        totalConnectedMs: connectedDurationMs,
        stabilityPct: Number(stabilityPct.toFixed(2)),
      },

      latencyMs: null as number | null,
      generatedAt: now,
    };
  },
};
