<script setup>
import { computed, ref, watch } from 'vue';
import { dietStructureData, dietCategoryLabels } from '../../data/dietStructureData.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
});

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

const years = dietStructureData.map((item) => item.year);
const stepYears = [1980, 2000, 2023];
const selectedYear = ref(stepYears[0]);

watch(
  () => props.activeStep,
  (nextStep) => {
    selectedYear.value = stepYears[Math.min(nextStep, stepYears.length - 1)];
  },
  { immediate: true },
);

const item = computed(() => dietStructureData.find((row) => row.year === Number(selectedYear.value)) ?? dietStructureData[0]);
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

const topItems = computed(() =>
  Object.keys(colors)
    .map((key) => ({ key, label: dietCategoryLabels[key], value: item.value[key], color: colors[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4),
);
</script>

<template>
  <div class="plate-card plate-card--interactive">
    <div class="plate-card__meta">
      <p class="chart-title">{{ selectedYear }} 年餐盘结构</p>
      <p class="chart-note">可拖动年份，观察餐盘从主食中心走向多元组合。</p>
      <div class="year-control">
        <input
          v-model.number="selectedYear"
          type="range"
          :min="years[0]"
          :max="years[years.length - 1]"
          step="5"
          list="diet-years"
        />
        <datalist id="diet-years">
          <option v-for="year in years" :key="year" :value="year" />
        </datalist>
        <div class="year-buttons">
          <button
            v-for="year in years"
            :key="year"
            type="button"
            :class="{ 'is-active': selectedYear === year }"
            @click="selectedYear = year"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>
    <div class="plate" :style="{ background: plateBackground }">
      <div class="plate__inner">
        <strong>{{ selectedYear }}</strong>
        <span>多样性 {{ item.diversityIndex }}</span>
      </div>
    </div>
    <div class="plate-legend">
      <span v-for="(color, key) in colors" :key="key">
        <i :style="{ backgroundColor: color }" />{{ dietCategoryLabels[key] }} {{ item[key] }}%
      </span>
    </div>
    <div class="plate-ranking">
      <p class="chart-note">当前占比最高</p>
      <div v-for="food in topItems" :key="food.key" class="rank-row">
        <span><i :style="{ backgroundColor: food.color }" />{{ food.label }}</span>
        <strong>{{ food.value }}%</strong>
      </div>
    </div>
  </div>
</template>
