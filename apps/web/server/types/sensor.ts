import mqtt from "mqtt";

export const MQTT_TOPICS = {
  SENSOR_TEMP: "pico/temp",
  SENSOR_PRESSURE: "pico/pressure",
} as const;

export interface SensorReading {
  deviceId: string;
  temperature?: number; // From pico/temp
  pressure?: number; // From pico/pressure
  timestamp: number;
}

export interface DeviceStatus {
  deviceId: string;
  online: boolean;
  lastSeen: number;
  firmware: string;
  batteryLevel?: number;
}

export interface MQTTServiceState {
  client: mqtt.MqttClient | null;
  isConnected: boolean;
  latestReadings: Map<string, SensorReading>;
  brokerUrl: string;
}
