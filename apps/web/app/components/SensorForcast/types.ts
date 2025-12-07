export interface SensorReading {
  deviceId: string;
  temperature?: number;
  pressure?: number;
  timestamp: number;
}

export type connectionStatusType = "connecting" | "connected" | "disconnected";

export interface connectionStatusRef {
  value: connectionStatusType;
}
