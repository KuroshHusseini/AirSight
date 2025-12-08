export interface SensorReading {
  deviceId: string;
  temperature?: number;
  pressure?: number;
  timestamp: number;
}

export interface SensorReadingRef {
  value: SensorReading;
}

export type connectionStatusType = "connecting" | "connected" | "disconnected";

export interface connectionStatusRef {
  value: connectionStatusType;
}
