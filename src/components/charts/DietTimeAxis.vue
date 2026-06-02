<script setup>
import { computed } from 'vue';
import { dietStructureData } from '../../data/dietStructureData.js';

const props = defineProps({
  progress: { type: Number, default: 0 },
});

const years = dietStructureData.map((item) => item.year);
const currentYear = computed(() => {
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  return Math.round(minYear + (maxYear - minYear) * props.progress);
});
</script>

<template>
  <aside class="grain-time-axis diet-time-axis" aria-label="吃得好时间轴">
    <div class="grain-time-axis__year">{{ currentYear }}</div>
    <div class="grain-time-axis__track">
      <div class="grain-time-axis__fill" :style="{ height: `${progress * 100}%` }" />
      <span
        v-for="year in years"
        :key="year"
        class="grain-time-axis__tick"
        :class="{ 'is-passed': year <= currentYear }"
        :style="{ top: `${((year - years[0]) / (years[years.length - 1] - years[0])) * 100}%` }"
      >
        {{ year }}
      </span>
    </div>
  </aside>
</template>
