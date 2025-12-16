# AirSight

AirSight is a small end-to-end IoT demo:

- A Raspberry Pi Pico W (MicroPython) reads a BMP280 sensor and publishes telemetry via MQTT.
- A Nuxt 4 (Nitro) web app subscribes to MQTT, streams data to the browser via SSE, and can generate AI recommendations using OpenAI.

---

## Repo structure

Monorepo using Yarn workspaces:

```
airsight/
├── apps/
│   ├── device/          # Raspberry Pi Pico W firmware (MicroPython)
│   └── web/             # Nuxt 4 app + Nitro server
└── packages/            # reserved for shared libs
```

---

## Data flow

1. Pico W publishes numeric values to MQTT topics:
   - `pico/temp`
   - `pico/pressure`
2. The Nuxt server connects to the broker over TLS (`mqtts`), subscribes to those topics, and keeps the latest reading in memory.
3. The browser receives live updates via SSE endpoints.

---

## Web API (SSE + AI)

The Nuxt/Nitro server exposes:

- `GET /api/sensors/latest` (SSE)
  - initial snapshot + subsequent updates
  - heartbeat every 10 seconds
- `GET /api/diagnostics/stream` (SSE)
  - periodic MQTT connection/throughput diagnostics
- `POST /api/recommendations`
  - sends the current reading to OpenAI and returns JSON recommendations

---

## Quickstart (web)

Prereqs: Node.js 24+, Yarn 1.22+

```bash
yarn install
cp apps/web/.env.example apps/web/.env
```

Edit [apps/web/.env.example](apps/web/.env.example) → fill values in [apps/web/.env](apps/web/.env) (this file must stay local).

Run:

```bash
yarn dev
# http://localhost:3000
```

---

## Quickstart (device)

See [apps/device/README.md](apps/device/README.md) for the Pico W steps.

At a high level:

- Flash MicroPython on the Pico W (MicroPico can do this)
- Update Wi‑Fi + MQTT settings in `apps/device/credentials/`
- Upload the project to the Pico

---

## Environment variables (web)

The Nuxt server reads these environment variables:

- `DEVICE_ID` (used to label the latest reading in the UI)
- `MQTT_BROKER`
- `MQTT_PORT` (default `8883`)
- `MQTT_USERNAME`
- `MQTT_PASSWORD`
- `OPENAI_API_KEY` (required only for `/api/recommendations`)

---

## Docker (web)

Build the container:

```bash
docker build -t airsight-web ./apps/web
```

Run it:

```bash
docker run --rm -p 3000:3000 --env-file ./apps/web/.env airsight-web
```

---

## Security note (important)

Do not commit secrets.

- `apps/device/credentials/` contains Wi‑Fi + broker credentials.
- `apps/web/.env` contains broker credentials and (optionally) an OpenAI API key.

If secrets were committed at any point, rotate them and purge them from git history.
