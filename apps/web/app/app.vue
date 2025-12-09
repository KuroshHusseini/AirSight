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
  padding: 2rem;
  box-sizing: border-box;
}

.app-container .content {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 1rem;
}

@media (max-width: 700px) {
  .app-container {
    flex-direction: column;
  }
  .app-container .content {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
}
</style>
