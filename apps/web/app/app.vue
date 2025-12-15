<template>
  <div>
    <Head>
      <Title>AirSight - Air Quality Monitoring Dashboard</Title>
      <Meta
        name="description"
        content="Monitor air quality in real-time with AirSight's IoT sensor dashboard. Track pollution levels and environmental data."
      />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta property="og:title" content="AirSight - Air Quality Monitoring" />
      <Meta
        property="og:description"
        content="Real-time air quality monitoring dashboard powered by IoT sensors."
      />
    </Head>
    <main class="app-container">
      <div class="content">
        <SensorForcast />
        <Recommendations />
        <DiagnosticsPanel />
      </div>
    </main>
  </div>
</template>

<style scoped>
:host,
html,
body {
  height: 100%;
}

.app-container {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100ovh;
  padding: 2rem;
}

.app-container .content {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 2rem;
}

.app-container .content > :deep(*) {
  min-width: 0;
}

@media (max-width: 700px) {
  .app-container {
    flex-direction: column;
    padding: 1rem;
  }

  .app-container .content {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
}

@media (max-width: 400px) {
  .app-container .content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
