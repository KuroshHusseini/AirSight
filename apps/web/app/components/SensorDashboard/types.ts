export interface SensorReading {
  deviceId: string;
  temperature?: number;
  pressure?: number;
  timestamp: number;
}
