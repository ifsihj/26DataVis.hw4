<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { dietStructureData } from '../../data/dietStructureData.js';
import { takeoutData } from '../../data/takeoutData.js';

const sectionRef = ref(null);
const activeStep = ref(0);
const progress = ref(0);

const steps = [
  {
    kicker: 'Scene 02 / Plate',
    title: '从一碗主食，到一张更丰富的餐桌',
    body: '这一幕先看餐盘。谷物仍然是底色，但肉蛋奶、果蔬和水产品逐渐进入日常，餐桌从“够吃”走向“可选择”。',
  },
  {
    kicker: 'Structure',
    title: '长期趋势：谷物占比下降，多样性上升',
    body: '谷物占比下降并不意味着主食消失，而是更多类别开始共同构成一顿饭。饮食结构变丰富，是收入、城市化、物流和冷链共同作用的结果。',
  },
  {
    kicker: 'Urban Life',
    title: '外卖让吃饭进入城市网络',
    body: '当手机、平台、骑手和城市配送加入餐桌，吃饭不再只发生在厨房。它开始连接街道、屏幕和即时服务。',
  },
];

const colors = {
  grain: '#d6ad5a',
  meat: '#8f3328',
  egg: '#e7c864',
  dairy: '#f2e6c7',
  aquatic: '#4c7d86',
  vegetables: '#537c4a',
  fruit: '#d58d45',
  oil: '#7d5d3d',
};

const labels = {
  grain: '谷物主食',
  meat: '肉类',
  egg: '蛋类',
  dairy: '奶类',
  aquatic: '水产品',
  vegetables: '蔬菜',
  fruit: '水果',
  oil: '油脂',
};

const categoryKeys = Object.keys(colors);
const years = dietStructureData.map((item) => item.year);
const chartWidth = 760;
const chartHeight = 360;
const margin = { top: 34, right: 26, bottom: 42, left: 48 };

const currentYear = computed(() => {
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  return Math.round(minYear + (maxYear - minYear) * progress.value);
});

const nearestDiet = computed(() =>
  dietStructureData.reduce((nearest, item) => (
    Math.abs(item.year - currentYear.value) < Math.abs(nearest.year - currentYear.value) ? item : nearest
  ), dietStructureData[0]),
);

const visibleDietData = computed(() => {
  const data = dietStructureData.filter((item) => item.year <= currentYear.value);
  return data.length > 1 ? data : dietStructureData.slice(0, 2);
});

const xScale = computed(() =>
  d3.scaleLinear()
    .domain(d3.extent(dietStructureData, (d) => d.year))
    .range([margin.left, chartWidth - margin.right]),
);

const yScale = d3.scaleLinear().domain([0, 100]).range([chartHeight - margin.bottom, margin.top]);
const diversityY = d3.scaleLinear().domain([0.32, 0.84]).range([chartHeight - margin.bottom, margin.top]);

const stackedPaths = computed(() => {
  const stack = d3.stack().keys(categoryKeys)(visibleDietData.value);
  const area = d3.area()
    .x((d) => xScale.value(d.data.year))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  return stack.map((series) => ({
    key: series.key,
    label: labels[series.key],
    color: colors[series.key],
    d: area(series),
  }));
});

const diversityPath = computed(() =>
  d3.line()
    .x((d) => xScale.value(d.year))
    .y((d) => diversityY(d.diversityIndex))
    .curve(d3.curveMonotoneX)(visibleDietData.value),
);

const xTicks = computed(() => [1980, 1990, 2000, 2010, 2023].map((year) => ({
  year,
  x: xScale.value(year),
})));

const topFoods = computed(() =>
  categoryKeys
    .map((key) => ({ key, label: labels[key], value: nearestDiet.value[key], color: colors[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6),
);

const takeoutBars = computed(() => {
  const maxOrder = d3.max(takeoutData, (d) => d.orderCount);
  return takeoutData.map((item) => ({ ...item, height: `${(item.orderCount / maxOrder) * 100}%` }));
});

const takeoutStats = computed(() => takeoutData[takeoutData.length - 1]);

function plateBackground(item) {
  let offset = 0;
  const segments = categoryKeys.map((key) => {
    const value = item[key];
    const segment = `${colors[key]} ${offset}% ${offset + value}%`;
    offset += value;
    return segment;
  });
  return `conic-gradient(${segments.join(', ')})`;
}

function updateProgress() {
  if (!sectionRef.value) return;
  const sectionTop = sectionRef.value.getBoundingClientRect().top + window.scrollY;
  const scrollable = Math.max(sectionRef.value.offsetHeight - window.innerHeight, 1);
  const raw = (window.scrollY - sectionTop) / scrollable;
  progress.value = Math.max(0, Math.min(1, raw));
  activeStep.value = Math.min(2, Math.max(0, Math.floor(progress.value * 3)));
}

onMounted(() => {
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress);
  window.removeEventListener('resize', updateProgress);
});
</script>

<template>
  <section id="better" ref="sectionRef" class="diet-journey">
    <div class="diet-journey__intro">
      <div>
        <p class="eyebrow">Scene 02</p>
        <h2>吃得好</h2>
        <p>
          忘掉旧版本的堆叠和拥挤。这一章重新拆成三段：餐盘如何变丰富，结构如何长期改变，
          以及外卖如何把“吃饭”扩展到城市网络。
        </p>
      </div>
      <img src="/assets/scene-rich-table.png" alt="卡通风格的中国家庭餐桌" />
    </div>

    <div class="diet-journey__sticky">
      <div class="diet-journey__stage">
        <div v-if="activeStep === 0" class="diet-visual-card diet-visual-card--plate">
          <div class="diet-visual-card__header">
            <span>餐盘年份旅程</span>
            <strong>{{ nearestDiet.year }}</strong>
          </div>
          <div class="diet-plate-layout">
            <div class="diet-main-plate" :style="{ background: plateBackground(nearestDiet) }">
              <div>
                <strong>{{ nearestDiet.year }}</strong>
                <span>多样性 {{ nearestDiet.diversityIndex.toFixed(2) }}</span>
              </div>
            </div>
            <div class="diet-ranking">
              <div v-for="food in topFoods" :key="food.key" class="diet-ranking__row">
                <span><i :style="{ backgroundColor: food.color }" />{{ food.label }}</span>
                <strong>{{ food.value }}%</strong>
              </div>
            </div>
          </div>
          <div class="diet-mini-plates">
            <div v-for="year in [1980, 1990, 2000, 2010, 2020, 2023]" :key="year">
              <i :style="{ background: plateBackground(dietStructureData.find((item) => item.year === year)) }" />
              <span>{{ year }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="activeStep === 1" class="diet-visual-card diet-visual-card--structure">
          <div class="diet-visual-card__header">
            <span>饮食结构与多样性</span>
            <strong>{{ currentYear }}</strong>
          </div>
          <svg class="diet-structure-svg" viewBox="0 0 760 360" role="img" aria-label="饮食结构堆叠面积图">
            <line x1="48" y1="318" x2="734" y2="318" class="diet-axis" />
            <g v-for="tick in xTicks" :key="tick.year">
              <line :x1="tick.x" y1="318" :x2="tick.x" y2="326" class="diet-axis" />
              <text :x="tick.x" y="346" text-anchor="middle" class="diet-axis-label">{{ tick.year }}</text>
            </g>
            <path v-for="layer in stackedPaths" :key="layer.key" :d="layer.d" :fill="layer.color" opacity="0.84" />
            <path :d="diversityPath" fill="none" stroke="#233c2f" stroke-width="5" stroke-linecap="round" />
            <text x="54" y="42" class="diet-svg-title">谷物占比下降，多样性指数上升</text>
            <text x="54" y="68" class="diet-svg-note">深色曲线表示饮食多样性，色带表示各类食物占比</text>
          </svg>
          <div class="diet-legend">
            <span v-for="layer in stackedPaths" :key="layer.key">
              <i :style="{ backgroundColor: layer.color }" />{{ layer.label }}
            </span>
          </div>
        </div>

        <div v-else class="diet-visual-card diet-visual-card--takeout">
          <div class="diet-visual-card__header">
            <span>城市外卖网络</span>
            <strong>2011-2023</strong>
          </div>
          <div class="takeout-panel">
            <div class="takeout-bars" aria-label="外卖订单增长柱状图">
              <div v-for="bar in takeoutBars" :key="bar.year" class="takeout-bar">
                <i :style="{ height: bar.height }" />
                <span>{{ bar.year }}</span>
              </div>
            </div>
            <div class="takeout-network">
              <svg viewBox="0 0 420 250" aria-hidden="true">
                <path d="M52 170 C128 64 180 92 228 106 S330 92 374 46" />
                <path d="M68 188 C146 206 246 182 356 142" />
                <path d="M94 84 C164 132 244 116 330 190" />
              </svg>
              <span class="node node--home">家</span>
              <span class="node node--phone">手机</span>
              <span class="node node--rider">骑手</span>
              <span class="node node--city">城市</span>
            </div>
            <div class="takeout-summary">
              <strong>{{ takeoutStats.orderCount }} 亿单</strong>
              <span>mock 2023 年订单量</span>
              <strong>{{ takeoutStats.users }} 亿人</strong>
              <span>mock 平台用户规模</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="diet-journey__rail" aria-label="场景二滚动时间轴">
        <strong>{{ currentYear }}</strong>
        <div><i :style="{ height: `${progress * 100}%` }" /></div>
        <span>1980</span>
        <span>2000</span>
        <span>2023</span>
      </aside>
    </div>

    <div class="diet-journey__steps">
      <article v-for="(step, index) in steps" :key="step.title" :class="{ 'is-active': activeStep === index }">
        <p>{{ step.kicker }}</p>
        <h3>{{ step.title }}</h3>
        <span>{{ step.body }}</span>
      </article>
    </div>
  </section>
</template>
