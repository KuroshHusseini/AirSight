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

// Diagnostics types (client-side)
export interface DiagnosticsThroughput {
  perSecond: number;
  perMinute: number;
}

export interface DiagnosticsConnection {
  connectCount: number;
  reconnectCount: number;
  disconnectCount: number;
  firstConnectAt: number | null;
  lastConnectAt: number | null;
  lastDisconnectAt: number | null;
  uptimeMs: number;
  totalConnectedMs: number;
  stabilityPct: number; // 0..100
}

export interface DiagnosticsPayload {
  connected: boolean;
  brokerUrl: string;
  messagesReceived: number;
  messagesByTopic: Record<string, number>;
  lastMessageAt: number | null;
  throughput: DiagnosticsThroughput;
  connection: DiagnosticsConnection;
  latencyMs: number | null;
  generatedAt: number;
}
