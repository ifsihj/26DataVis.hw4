<script setup>
import { computed } from 'vue';
import { grainOutput, perCapitaGrain, selfSufficiency, agriTechnology, arableLand } from '../../data/scene1Data.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const latestIdx = grainOutput.length - 1;
const firstIdx = 0;

const metrics = computed(() => {
  const g = grainOutput;
  const pc = perCapitaGrain;
  const ss = selfSufficiency;
  const tech = agriTechnology;
  const land = arableLand;

  return [
    {
      label: '人均粮食',
      value: Math.round(pc[latestIdx].per_capita_kg),
      unit: 'kg',
      detail: `${pc[firstIdx].per_capita_kg} → ${Math.round(pc[latestIdx].per_capita_kg)} kg`,
    },
    {
      label: '粮食总产',
      value: (g[latestIdx].total / 10000).toFixed(1),
      unit: '亿吨',
      detail: `增 ${((g[latestIdx].total / g[firstIdx].total - 1) * 100).toFixed(0)}%`,
    },
    {
      label: '口粮自给率',
      value: Math.round((ss[latestIdx].rice + ss[latestIdx].wheat) / 2),
      unit: '%',
      detail: '稻麦 >94%',
    },
    {
      label: '亩产',
      value: Math.round(tech[latestIdx].yield_per_mu),
      unit: 'kg',
      detail: `${tech[firstIdx].yield_per_mu} → ${Math.round(tech[latestIdx].yield_per_mu)} kg`,
    },
    {
      label: '耕地',
      value: land[latestIdx].total_land_yi_mu.toFixed(1),
      unit: '亿亩',
      detail: '守住 18 亿红线',
    },
  ];
});
</script>

<template>
  <div class="metric-row">
    <div v-for="m in metrics" :key="m.label" class="metric-card">
      <div class="metric-card__label">{{ m.label }}</div>
      <span class="metric-card__value">{{ m.value }}</span>
      <span class="metric-card__unit">{{ m.unit }}</span>
      <div class="metric-card__delta">{{ m.detail }}</div>
    </div>
  </div>
</template>

<style scoped>
.metric-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.metric-card {
  min-height: 118px;
  padding: 18px 14px;
  border-right: 1px solid var(--line);
  background: transparent;
  text-align: left;
  transition: background 0.2s;
}
.metric-card:last-child { border-right: 0; }
.metric-card:hover { background: rgba(158, 61, 50, 0.04); }
.metric-card__label { margin-bottom: 10px; color: #81776c; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; }
.metric-card__value { color: #29251f; font-family: 'Georgia', serif; font-size: 2rem; font-weight: 400; }
.metric-card__unit { font-size: 0.72rem; color: #8f806e; margin-left: 2px; }
.metric-card__delta { margin-top: 8px; color: #66755c; font-size: 0.7rem; font-weight: 700; }

@media (max-width: 820px) {
  .metric-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .metric-card { border-bottom: 1px solid var(--line); }
}
</style>
