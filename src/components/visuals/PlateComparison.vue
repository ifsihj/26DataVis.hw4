<script setup>
import { computed } from 'vue';
import { dietStructureData, dietCategoryLabels } from '../../data/dietStructureData.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
});

const years = [1980, 2000, 2020];
const colors = {
  grain: '#d2a857',
  meat: '#8f2f24',
  egg: '#e5c46a',
  dairy: '#f4e8c5',
  aquatic: '#4c7b82',
  vegetables: '#4f7b4b',
  fruit: '#d08a43',
  oil: '#7a5b3a',
};

const year = computed(() => years[Math.min(props.activeStep, years.length - 1)]);
const item = computed(() => dietStructureData.find((row) => row.year === year.value));
const plateBackground = computed(() => {
  let offset = 0;
  const segments = Object.entries(colors).map(([key, color]) => {
    const value = item.value[key];
    const segment = `${color} ${offset}% ${offset + value}%`;
    offset += value;
    return segment;
  });
  return `conic-gradient(${segments.join(', ')})`;
});
</script>

<template>
  <div class="plate-card">
    <div class="plate-card__meta">
      <p class="chart-title">{{ year }} 年餐盘结构</p>
      <p class="chart-note">多样性指数：{{ item.diversityIndex }}</p>
    </div>
    <div class="plate" :style="{ background: plateBackground }">
      <div class="plate__inner">{{ year }}</div>
    </div>
    <div class="plate-legend">
      <span v-for="(color, key) in colors" :key="key">
        <i :style="{ backgroundColor: color }" />{{ dietCategoryLabels[key] }}
      </span>
    </div>
  </div>
</template>
