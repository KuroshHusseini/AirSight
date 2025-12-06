# AirSight - IoT Environmental Dashboard

A responsive full-stack application that integrates Raspberry Pi Pico W with a Nuxt web dashboard to provide real-time indoor sensor data, outdoor weather integration, and AI-powered insights for clothing, energy usage, and nutrition.

## 🏗️ Architecture

**Monorepo structure using Yarn workspaces:**

```
airsight/
├── apps/
│   ├── device/          # Raspberry Pi Pico W (MicroPython)
│   └── web/             # Nuxt 3 web application
└── packages/
    └── shared-types/    # Shared TypeScript types & MQTT schemas
```

## ✨ Core Features

- **Real-time indoor environment telemetry**: Temperature, humidity, and pressure from Pico W
- **Weather integration**: Hourly outdoor weather based on user location
- **AI-driven recommendations**: OpenAI-powered guidance for clothing, energy, nutrition
- **Historical trend analysis**: Time-series charts showing environmental patterns
- **Unified responsive dashboard**: Mobile-first UX across all devices
- **Cloud-backed data retention**: MongoDB for analytics and long-term insights
- **MQTT messaging**: Real-time device-to-cloud communication

## 🛠️ Tech Stack

### IoT & Device Layer

- Raspberry Pi Pico W
- BME/BMP environmental sensors
- MicroPython
- MicroPico (VSCode extension)

### Messaging

- MQTT (MQTT.js)
- EMQX (local) / HiveMQ (cloud)

### Backend

- Nuxt 3 (Nitro server)
- Node.js & TypeScript
- MongoDB / MongoDB Atlas
- OpenAI API
- Weather API (OpenWeather / Tomorrow.io)

### Frontend

- Vue 3
- Tailwind CSS
- Chart.js / ECharts

### Deployment

- Vercel (Web app)
- MongoDB Atlas (Database)
- HiveMQ Cloud (MQTT broker)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **Yarn** 1.22+
- **Raspberry Pi Pico W** with MicroPython firmware
- **MQTT Broker** (EMQX locally or HiveMQ Cloud)
- **MongoDB** instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/KuroshHusseini/AirSight.git
cd AirSight

# Install dependencies
yarn install

# Set up environment variables (see below)
cp apps/web/.env.example apps/web/.env
```

### Environment Variables

Create `apps/web/.env`:

```env
# MQTT Configuration
MQTT_BROKER_URL=mqtt://localhost:1883

# Database
MONGODB_URI=mongodb://localhost:27017/airsight

# API Keys
OPENAI_API_KEY=your_openai_key_here
WEATHER_API_KEY=your_weather_api_key_here
```

### Development

```bash
# Run web application
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking across all workspaces
yarn type-check
```

### Device Setup

1. Flash MicroPython firmware to Pico W
2. Update device credentials:
   - `apps/device/credentials/network.py` - WiFi credentials
   - `apps/device/credentials/mqtt.py` - MQTT broker details
3. Upload code using MicroPico VSCode extension
4. Run `main.py` on the device

See [apps/device/README.md](apps/device/README.md) for detailed instructions.

## 📁 Workspace Structure

### `apps/web` - Nuxt Application

```
apps/web/
├── server/
│   ├── api/              # REST API endpoints
│   ├── mqtt/             # MQTT client & message handlers
│   ├── models/           # MongoDB schemas
│   └── services/         # OpenAI, Weather services
├── pages/                # Vue pages (dashboard, analytics)
├── components/           # Vue components
└── composables/          # Shared Vue logic
```

### `apps/device` - MicroPython

```
apps/device/
├── config/               # Device configuration
├── credentials/          # WiFi & MQTT credentials
├── lib/                  # MicroPython libraries (MQTT)
├── utils/                # Helper functions
└── main.py               # Entry point
```

### `packages/shared-types` - Shared Types

TypeScript types and constants shared between web app and device (as comments):

- MQTT topic definitions
- Sensor data interfaces
- API contracts

## 🔧 Yarn Workspace Commands

```bash
# Run command in specific workspace
yarn workspace @airsight/web dev
yarn workspace @airsight/shared-types build

# Run command across all workspaces
yarn workspaces run build
yarn workspaces run type-check

# Add dependency to workspace
yarn workspace @airsight/web add mqtt mongodb

# Add dev dependency
yarn workspace @airsight/web add -D eslint

# Add dependency to root
yarn add -W -D prettier
```

## 📊 MQTT Topics

Defined in `packages/shared-types/src/index.ts`:

- `airsight/sensors/indoor` - Sensor readings from Pico W
- `airsight/device/status` - Device online/offline status
- `airsight/commands` - Commands to device

## 🗄️ Data Models

### SensorReading

```typescript
{
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // hPa
  timestamp: number; // Unix timestamp
  deviceId: string;
}
```

See `packages/shared-types/src/index.ts` for all data models.

## 🚀 Deployment

### Web Application (Vercel)

```bash
# Connect to Vercel
vercel login

# Deploy
vercel --prod
```

### Database (MongoDB Atlas)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in production environment

### MQTT Broker (HiveMQ Cloud)

1. Create free cluster at [hivemq.com/cloud](https://www.hivemq.com/mqtt-cloud-broker/)
2. Update device credentials with cloud broker URL
3. Configure web app with same broker URL

## 📝 Development Workflow

1. **Device Development**: Edit MicroPython code, flash to Pico W via MicroPico
2. **Backend API**: Create endpoints in `apps/web/server/api/`
3. **Frontend**: Build Vue components in `apps/web/components/`
4. **Shared Types**: Update schemas in `packages/shared-types/src/`
5. **Testing**: Test device → MQTT → backend → frontend flow

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and commit: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Course: IoT Systems, University of Oulu
- Technologies: Nuxt, MicroPython, MQTT, MongoDB, OpenAI
