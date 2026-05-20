<script setup>
import { computed } from 'vue';
import * as d3 from 'd3';
import { grainData } from '../../data/grainData.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const currentYear = computed(() => grainData[0].year + (grainData[grainData.length - 1].year - grainData[0].year) * props.progress);

function interpolateStapleShare(year) {
  const index = d3.bisector((d) => d.year).right(grainData, year);
  if (index <= 0) return grainData[0].stapleShare;
  if (index >= grainData.length) return grainData[grainData.length - 1].stapleShare;
  const prev = grainData[index - 1];
  const next = grainData[index];
  const t = (year - prev.year) / (next.year - prev.year);
  return prev.stapleShare + (next.stapleShare - prev.stapleShare) * t;
}

const stapleShare = computed(() => Math.round(interpolateStapleShare(currentYear.value)));
const otherShare = computed(() => 100 - stapleShare.value);
const background = computed(
  () => `conic-gradient(#b88446 0 ${stapleShare.value}%, #315f49 ${stapleShare.value}% 100%)`,
);
</script>

<template>
  <div class="donut-card chart-card">
    <div>
      <p class="chart-title">主食占比变化</p>
      <p class="chart-note">{{ Math.round(currentYear) }} 年 mock structure</p>
    </div>
    <div class="donut" :style="{ background }">
      <div class="donut__inner">
        <strong>{{ stapleShare }}%</strong>
        <span>主食</span>
      </div>
    </div>
    <div class="donut-legend">
      <span><i class="grain" />主食 {{ stapleShare }}%</span>
      <span><i class="other" />非主食 {{ otherShare }}%</span>
    </div>
  </div>
</template>
