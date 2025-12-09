# AirSight - IoT Environmental Dashboard

A full-stack project integrating a Raspberry Pi Pico W and a Nuxt (Nitro) web dashboard to provide real-time indoor sensor data, operational diagnostics, and AI-powered recommendations.

## Architecture

Monorepo using Yarn workspaces:

```
airsight/
├── apps/
│   ├── device/          # Raspberry Pi Pico W (MicroPython)
│   └── web/             # Nuxt 4 app with Nitro server
└── packages/            # (reserved for shared libs)
```

Key Nuxt server modules (apps/web/server):

- API
  - /api/sensors/latest (SSE stream of latest readings + heartbeat)
  - /api/diagnostics/stream (SSE stream of MQTT diagnostics)
  - /api/recommendations (POST to OpenAI with current readings)
- Services
  - mqtt-service.ts (MQTT client + metrics)
- Plugins
  - mqtt.ts (bootstraps MQTT service)

Client app (apps/web/app):

- Components
  - SensorForcast.vue (live readings & connection controls)
  - Recommendations.vue (AI guidance from current readings)
  - DiagnosticsPanel.vue (heartbeat, latency, throughput, stability)
- Composables
  - useSensorStream.ts (subscribe to sensors SSE)
  - useDiagnostics.ts (subscribe to diagnostics SSE)
  - useRecommendations.ts (talks to /api/recommendations)
- Utils
  - eventSource.ts, timeAgo.ts, formatTimestamp.ts

## Features

- Real-time telemetry via SSE:
  - Latest sensor reading stream
  - Heartbeat every 10s
- MQTT operational diagnostics:
  - Message throughput (msg/s, msg/min)
  - Connection stability and event counts
  - Last heartbeat health
  - Latency label (optional if device sends timestamps)
- AI Recommendations (OpenAI):
  - Clothing, Energy, Nutrition suggestions
- Responsive dashboard with normal scoped CSS (no Tailwind in components)

## Tech Stack

- Device: Raspberry Pi Pico W, MicroPython
- Messaging: MQTT (HiveMQ Cloud or local broker)
- Web: Nuxt 4, Vue 3, Nitro server
- AI: OpenAI API

## Getting Started

Prerequisites:

- Node.js 24+, Yarn 1.22+
- A running MQTT broker (HiveMQ Cloud or local)
- OpenAI API key

Install:

```bash
yarn install
cp apps/web/.env.example apps/web/.env
# Fill apps/web/.env with your MQTT and OpenAI credentials
```

Run (development):

```bash
cd apps/web
yarn dev
# http://localhost:3000
```

Build and preview:

```bash
cd apps/web
yarn build
yarn preview
```

## Environment Variables

Place in apps/web/.env (not committed):

```
DEVICE_ID=pico-001
MQTT_USERNAME=your_user
MQTT_PASSWORD=your_pass
MQTT_BROKER=your-host.s1.eu.hivemq.cloud
MQTT_PORT=8883
OPENAI_API_KEY=sk-...
```

Recommended for containers:

- MQTT_URL (prefer websockets on HiveMQ Cloud): wss://<host>:8884
- Or mqtts://<host>:8883 if 8883 is reachable outbound

Nuxt runtimeConfig reads:

- mqttBroker, mqttUsername, mqttPassword, openaiApiKey

## Docker (Nuxt Nitro)

Dockerfile (apps/web/Dockerfile) builds and runs the Nitro server:

- Port: 3000 (set PORT and WEBSITES_PORT in hosting)
- CMD: node .output/server/index.mjs

Build and run locally:

```bash
docker run --rm -p 3000:3000 --env-file .env airsight-web:latest
```

## Device Setup (Pico W)

Update credentials in apps/device:

- credentials/network.py (Wi-Fi)
- credentials/mqtt.py (broker host/user/pass)

Publish sensor readings with a timestamp to enable latency:

```python
# suggested payload from device
{"deviceId": "pico-001", "temperature": 23.5, "pressure": 1004.2, "timestamp": 1733720000000}
```

## API Overview

- GET /api/sensors/latest
  - SSE stream: initial latest reading, heartbeat, updates
- GET /api/diagnostics/stream
  - SSE stream: periodic diagnostics snapshot (5s)
- POST /api/recommendations
  - Accepts current SensorReading and returns AI guidance
