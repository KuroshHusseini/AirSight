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
    <main>
      <div class="app-container">
        <SensorForcast />
        <Recommendations />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: row;
  justify-content: center;

  gap: 4rem;
  padding: 2rem;
}

@media (max-width: 700px) {
  .app-container {
    flex-direction: column;
  }
}
</style>
