<script setup>
import { computed } from 'vue';
import * as d3 from 'd3';
import { grainData } from '../../data/grainData.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const currentYear = computed(() => grainData[0].year + (grainData[grainData.length - 1].year - grainData[0].year) * props.progress);
const grainScale = d3.scaleLinear().domain(d3.extent(grainData, (d) => d.grainPerCapita)).range([38, 90]);

function interpolateByYear(year, key) {
  const index = d3.bisector((d) => d.year).right(grainData, year);
  if (index <= 0) return grainData[0][key];
  if (index >= grainData.length) return grainData[grainData.length - 1][key];
  const prev = grainData[index - 1];
  const next = grainData[index];
  const t = (year - prev.year) / (next.year - prev.year);
  return prev[key] + (next[key] - prev[key]) * t;
}

const grainPerCapita = computed(() => interpolateByYear(currentYear.value, 'grainPerCapita'));
const fillLevel = computed(() => Math.round(grainScale(grainPerCapita.value)));
</script>

<template>
  <div class="barn-card">
    <div class="barn">
      <div class="barn__roof" />
      <div class="barn__body">
        <div class="barn__grain" :style="{ height: `${fillLevel}%` }" />
        <div class="barn__lines" />
      </div>
    </div>
    <div class="barn-card__copy">
      <p>粮仓充盈度</p>
      <strong>{{ fillLevel }}%</strong>
      <span>{{ Math.round(currentYear) }} 年 / 人均粮食 {{ Math.round(grainPerCapita) }} kg</span>
    </div>
  </div>
</template>
