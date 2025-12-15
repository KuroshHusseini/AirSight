<script setup lang="ts">
import { computed } from "vue";

const { diagnostics } = useDiagnosticsStream();
const { lastHeartbeatAt } = useSensorStream();

const now = ref(Date.now());
let timer: number | null = null;

const heartbeatLabel = computed(() => {
  if (!lastHeartbeatAt.value) return "No heartbeat yet";
  return formatAgo(now, lastHeartbeatAt.value);
});

const heartbeatHealthy = computed(() => {
  if (!lastHeartbeatAt.value) return false;

  return Date.now() - lastHeartbeatAt.value < 20000;
});

const latencyLabel = computed(() => {
  const v = diagnostics.value?.latencyMs;

  return v == null ? "N/A" : `${Math.round(v)} ms`;
});

onMounted(() => {
  timer = window.setInterval(() => (now.value = Date.now()), 1000);
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div class="panel">
    <h2 class="panel-title">Diagnostics</h2>

    <div class="diag-grid">
      <div class="box">
        <div class="label">Last Sensor Heartbeat</div>
        <div class="value" :class="heartbeatHealthy ? 'ok' : 'bad'">
          {{ heartbeatLabel }}
        </div>
      </div>

      <div class="box">
        <div class="label">MQTT Latency</div>
        <div class="value">{{ latencyLabel }}</div>
      </div>

      <div class="box">
        <div class="label">Message Throughput</div>
        <div class="value">
          {{ diagnostics?.throughput.perSecond.toFixed(2) ?? "0.00" }} msg/s ·
          {{ diagnostics?.throughput.perMinute ?? 0 }} msg/min
        </div>
      </div>

      <div class="box">
        <div class="label">Broker Stability</div>
        <div class="value">
          {{ diagnostics?.connection.stabilityPct ?? 0 }}% uptime
        </div>
        <div class="subtext">
          c:{{ diagnostics?.connection.connectCount ?? 0 }} · r:{{
            diagnostics?.connection.reconnectCount ?? 0
          }}
          · d:{{ diagnostics?.connection.disconnectCount ?? 0 }}
        </div>
      </div>

      <div class="box box-full">
        <div class="row">
          <div class="label">Broker Connection</div>
          <span class="status" :class="diagnostics?.connected ? 'ok' : 'bad'">
            <span
              class="dot"
              :class="diagnostics?.connected ? 'ok' : 'bad'"
            ></span>
            {{ diagnostics?.connected ? "Connected" : "Disconnected" }}
          </span>
        </div>
        <div class="subtext ellipsis">{{ diagnostics?.brokerUrl }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  max-width: 48rem;
  height: fit-content;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #111827;
}

.diag-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.box {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  width: 100%;
  min-width: 0;
}

.box-full {
  grid-column: 1 / -1;
}

.label {
  font-size: 0.75rem;
  color: #6b7280;
}

.value {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}

.subtext {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  display: inline-block;
}

.ok {
  color: #047857;
}

.ok.dot {
  background: #16a34a;
}

.bad {
  color: #b91c1c;
}

.bad.dot {
  background: #dc2626;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .diag-grid {
    grid-template-columns: 1fr;
  }
}
</style>
