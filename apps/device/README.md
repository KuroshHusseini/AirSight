# AirSight (Device)

MicroPython firmware for a Raspberry Pi Pico W that reads a BMP280 sensor and publishes telemetry to an MQTT broker (HiveMQ Cloud-style TLS setup).

This folder contains the code that runs on the Pico W. The web dashboard lives separately in the repo under `apps/web`.

---

## What it does

- Connects to Wi‑Fi
- Reads BMP280 temperature and pressure
- Publishes values periodically via MQTT

Telemetry is published to these topics (see `constants/mqtt.py`):

- `pico/temp`
- `pico/pressure`

The MQTT client also sets a last-will message (`pico/status = offline`).

---

## Folder layout

- `main.py` - entrypoint
- `config/` - Wi‑Fi, sensor, and MQTT connection helpers
- `constants/` - publish interval, LED pin, MQTT topic constants
- `credentials/` - Wi‑Fi + MQTT secrets (do not commit)
- `lib/umqtt/` - MicroPython MQTT client implementation
- `utils/` - small utilities (publishing, byte conversion)

---

## Requirements

### Hardware

- Raspberry Pi Pico W
- BMP280 (I2C)
- USB cable that supports data

### Software

- VS Code + MicroPico extension
- MicroPython firmware for Pico W (MicroPico can install it)

---

## Setup (Pico W)

### 1) Flash MicroPython

1. Hold **BOOTSEL** while plugging in the Pico W
2. In VS Code: `MicroPico: Install MicroPython`

### 2) Configure credentials

Edit these two files:

- `credentials/network.py`
- `credentials/mqtt.py`

They should define:

**Wi‑Fi** (`credentials/network.py`)

```python
SSID = "your_wifi_ssid"
PWD = "your_wifi_password"
```

**MQTT** (`credentials/mqtt.py`)

```python
MQTT_CLIENT_ID = "pico01"
MQTT_BROKER = "your-broker-hostname"
MQTT_PORT = 8883
MQTT_USER = "your_username"
MQTT_PASSWORD = "your_password"
```

### 3) Wire the BMP280

Default I2C pins depend on your BMP280 wiring + driver settings, but a common Pico W mapping is:

| BMP280 | Pico W |
| ------ | ------ |
| VCC    | 3V3    |
| GND    | GND    |
| SDA    | GP0    |
| SCL    | GP1    |

### 4) Upload to the Pico

In VS Code:

1. `MicroPico: Upload Project to Pico`
2. Reset the Pico

### 5) View logs

In VS Code:

- `MicroPico: Open REPL`

You should see Wi‑Fi connection status, IP address, and MQTT connection logs.

---

## Security note (important)

Files in `credentials/` contain real secrets (Wi‑Fi and MQTT). They should not be committed.

If you accidentally committed them:

1. Rotate the leaked Wi‑Fi / broker credentials.
2. Remove/purge secrets from git history.

---

## Troubleshooting

- Wi‑Fi connects but no MQTT: verify broker host, port `8883`, and credentials.
- TLS issues on MicroPython: this project uses `ssl=True` and sets `server_hostname`. Certificate verification is not enforced by default.
- Upload looks successful but code doesn’t change: unplug/replug the Pico and re-run `MicroPico: Upload Project to Pico`.

---
