// MQTT Topics Configuration
export const MQTT_TOPICS = {
  SENSOR_DATA: "airsight/sensors/indoor",
  DEVICE_STATUS: "airsight/device/status",
  COMMANDS: "airsight/commands",
} as const;

// Sensor Data Types
export interface SensorReading {
  temperature: number; // Celsius
  humidity: number; // Percentage (0-100)
  pressure: number; // hPa
  timestamp: number; // Unix timestamp
  deviceId: string;
}

export interface DeviceStatus {
  deviceId: string;
  online: boolean;
  lastSeen: number;
  firmware: string;
  batteryLevel?: number;
}

// Weather Data Types
export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
  windSpeed: number;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  timestamp: number;
}

// AI Recommendation Types
export interface AIRecommendation {
  clothing: string;
  energy: string;
  nutrition: string;
  alerts: string[];
  generatedAt: number;
}
