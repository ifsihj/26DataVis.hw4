<script setup>
import { computed } from 'vue';
import { grainData } from '../../data/grainData.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
});

const years = [1980, 2000, 2023];
const year = computed(() => years[Math.min(props.activeStep, years.length - 1)]);
const item = computed(() => grainData.find((row) => row.year === year.value) ?? grainData[0]);
const otherShare = computed(() => 100 - item.value.stapleShare);
const background = computed(
  () => `conic-gradient(#b88446 0 ${item.value.stapleShare}%, #315f49 ${item.value.stapleShare}% 100%)`,
);
</script>

<template>
  <div class="donut-card chart-card">
    <div>
      <p class="chart-title">主食占比变化</p>
      <p class="chart-note">{{ year }} 年 mock structure</p>
    </div>
    <div class="donut" :style="{ background }">
      <div class="donut__inner">
        <strong>{{ item.stapleShare }}%</strong>
        <span>主食</span>
      </div>
    </div>
    <div class="donut-legend">
      <span><i class="grain" />主食 {{ item.stapleShare }}%</span>
      <span><i class="other" />非主食 {{ otherShare }}%</span>
    </div>
  </div>
</template>
