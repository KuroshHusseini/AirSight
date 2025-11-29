# AirSight

AirSight is an end-to-end IoT monitoring platform built on the Raspberry Pi Pico W. It captures temperature and pressure data using a BMP280 sensor, performs edge analytics (moving averages, threshold logic, anomaly detection via z-score), hosts a local web dashboard, and streams telemetry to Azure IoT Hub for historical insights.

The platform demonstrates a full sensor-to-cloud workflow with embedded intelligence and modular MicroPython architecture.

---

## Features

- Real-time temperature, pressure, and altitude monitoring
- Local anomaly detection using rolling-window statistics
- RGB LED indicators for status (normal → critical)
- Mobile-friendly auto-refreshing web UI served from the Pico W
- Azure IoT Hub cloud upload for historical data and analysis
- Modular MicroPython codebase with clear separation of concerns

---

# Tools Needed

### **Hardware**

- Raspberry Pi Pico W
- BMP280 (I2C) temperature/pressure sensor
- RGB LED (common anode or cathode)
- Breadboard + male-female jumper wires
- USB cable (for flashing + data)

### **Software**

- **Visual Studio Code**
  [https://code.visualstudio.com/](https://code.visualstudio.com/)

- **MicroPico (VSCode extension)**
  Handles flashing MicroPython, uploading files, REPL access.

- **MicroPython firmware for Pico W**
  Installed automatically using MicroPico.

- **Git**
  [https://git-scm.com/](https://git-scm.com/)

- **Azure IoT Hub (optional)**
  For telemetry ingestion, dashboards, and analytics.

---

# Setup Guide

This section walks you from zero → working AirSight deployment on the Pico W.

---

## 1. Install VSCode + MicroPico

1. Install **VSCode**
2. Go to **Extensions → search “MicroPico” → Install**
3. Restart VSCode once installed

MicroPico gives you:

- Flash MicroPython
- Upload project files
- Serial REPL
- Auto-run main.py

---

## 2. Flash MicroPython to Raspberry Pi Pico W

1. Hold **BOOTSEL**
2. Plug the Pico into your laptop
3. Release BOOTSEL
4. In VSCode press:
   **CMD/CTRL + SHIFT + P → “MicroPico: Install MicroPython”**
5. Select the Pico
6. Wait for the firmware flash to finish

Your Pico now runs MicroPython.

---

## 3. Clone the Repository

```bash
git clone <your repo url>
cd AirSight
```

## 4. Configure WiFi + Azure

Edit `credentials/cred.py`:

```python
WIFI_SSID = "your_wifi"
WIFI_PASS = "your_password"
```

If we use it in the future

```python
AZURE_CONNECTION_STRING = None
```

---

## 5. Wire the Hardware

### BMP280 → Pico W

| BMP280 | Pico W |
| ------ | ------ |
| VCC    | 3V3    |
| GND    | GND    |
| SDA    | GP0    |
| SCL    | GP1    |

### RGB LED → Pico W

(example pin mapping)

- Red → GP15
- Green → GP14
- Blue → GP13
- Each pin → 220Ω resistor → LED pin
- Common pin → 3V3 or GND depending on LED type

---

## 6. Upload Project to the Pico W

Inside VSCode:

1. Press **CMD/CTRL + SHIFT + P**
2. Select **MicroPico: Upload Project to Pico**
3. MicroPico copies all files to the device
4. Reset the Pico or unplug/plug it again

`main.py` runs automatically.

---

## 7. Open REPL for Logs

Inside VSCode:
**CMD/CTRL + SHIFT + P → MicroPico: Open REPL**

You will see:

- WiFi status
- Pico IP address
- Sensor data
- Errors or debug output

---

## 8. Access the Web Dashboard

Once Pico prints the IP (example):

```
[INFO] IP: 192.168.1.42
```

Open your browser:

```
http://192.168.1.42/
```

You’ll see:

- Live temperature/pressure data
- Status color
- Alerts
- Auto-refresh states

---

## 9. Azure IoT Hub (Optional)

If the connection string is configured, AirSight will:

- Push telemetry every 60 seconds
- Send structured fields (Temp, Pressure, Altitude, Status Code)
- Retry on failed uploads

You can explore data via:
**IoT Hub → Devices → Your Device → Telemetry**

---

# Development Workflow

1. Create a feature branch: `git checkout -b feature/<name>`
2. Edit code in VS Code.
3. Use **MicroPico → Upload Project**.
4. Watch Pico logs in REPL.
5. Test on device and refresh the web UI.
6. Commit changes: `git add -A && git commit -m "Describe changes"`.
7. Push your branch: `git push -u origin HEAD`.
8. Inform others on what changes are coming.
9. Merge directly after verification:
   `git checkout main && git pull && git merge --no-ff feature/<name> && git push`.
   (Optional) Delete branch after merge:
   `git branch -d feature/<name> && git push origin --delete feature/<name>`
10. Iterate.

Fast, deterministic development.

# Known issues with MicroPico and VS Code:

- Upload appears successful but files don’t update on the Pico:

  - Press `Cmd/Ctrl+Shift+P` → “Developer: Restart Extension Host”.
  - Unplug and re‑plug the Pico, then retry the upload.
  - As a last resort, restart your computer.

- Pico doesn’t connect even though wiring looks correct:

  - Unplug and re‑plug the USB cable.
  - Ensure the USB cable supports data (not charge‑only).
  - Make sure BOOTSEL isn’t held and the correct serial port is selected.

- A single file change isn’t recognized:
  - Use “MicroPico: Upload File to Pico” for that specific file.
  - Verify the file isn’t excluded by project filters (e.g., settings) and exists on the device.
  - Confirm filenames for entry points (e.g., `main.py`, `boot.py`) are correct if relevant.

---

# License

MIT
