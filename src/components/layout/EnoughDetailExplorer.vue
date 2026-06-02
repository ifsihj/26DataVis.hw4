<script setup>
import { computed, ref } from 'vue';
import AgriTechnologyExplorerChart from '../charts/AgriTechnologyExplorerChart.vue';
import GrainStackedArea from '../charts/GrainStackedArea.vue';
import PerCapitaLineChart from '../charts/PerCapitaLineChart.vue';
import WorldComparisonBar from '../charts/WorldComparisonBar.vue';

const props = defineProps({
  detailId: { type: String, required: true },
});

const rangeStart = ref(1949);
const showReference = ref(true);
const grainMode = ref('absolute');
const crop = ref('all');
const worldFilter = ref('all');
const metrics = ref(['yield_per_mu', 'hybrid_rice_pct']);

const cropOptions = [
  ['all', '全部'],
  ['rice', '稻谷'],
  ['wheat', '小麦'],
  ['corn', '玉米'],
  ['soybean', '大豆'],
  ['tubers', '薯类'],
];

const metricOptions = [
  ['yield_per_mu', '粮食亩产'],
  ['hybrid_rice_pct', '杂交稻覆盖率'],
  ['patents', '农业专利'],
  ['papers', '农业论文'],
];

const hint = computed(() => ({
  'per-capita': '切换时间窗口，观察参考线前后的长期变化。悬停曲线可同时读取人均量与当年粮食总产。',
  production: '在绝对量与构成占比之间切换，也可以单独抽出某一品种观察长期变化。',
  world: '以 FAO 400 kg 参考线筛选国家或地区，比较中国所处的位置。',
  technology: '不同指标的单位差异很大，因此详情页使用标准化指数比较趋势；悬停时仍显示原始量。',
})[props.detailId] || '');

function toggleMetric(metric) {
  const next = metrics.value.includes(metric)
    ? metrics.value.filter(item => item !== metric)
    : [...metrics.value, metric];
  if (next.length) metrics.value = next;
}
</script>

<template>
  <div class="enough-explorer">
    <p class="enough-explorer__hint">{{ hint }}</p>

    <div v-if="detailId === 'per-capita'" class="enough-explorer__controls">
      <div>
        <span>时间窗口</span>
        <button v-for="year in [1949, 1978, 2000]" :key="year" type="button"
          :class="{ 'is-active': rangeStart === year }" @click="rangeStart = year">
          {{ year }}–2025
        </button>
      </div>
      <div>
        <span>辅助线</span>
        <button type="button" :class="{ 'is-active': showReference }"
          @click="showReference = !showReference">
          FAO 400 kg
        </button>
      </div>
    </div>

    <div v-else-if="detailId === 'production'" class="enough-explorer__controls">
      <div>
        <span>读数方式</span>
        <button type="button" :class="{ 'is-active': grainMode === 'absolute' }"
          @click="grainMode = 'absolute'">绝对量</button>
        <button type="button" :class="{ 'is-active': grainMode === 'relative' }"
          @click="grainMode = 'relative'">构成占比</button>
      </div>
      <div>
        <span>作物品种</span>
        <button v-for="[key, label] in cropOptions" :key="key" type="button"
          :class="{ 'is-active': crop === key }" @click="crop = key">
          {{ label }}
        </button>
      </div>
    </div>

    <div v-else-if="detailId === 'world'" class="enough-explorer__controls">
      <div>
        <span>参考线筛选</span>
        <button v-for="[key, label] in [['all', '全部'], ['above', '参考线以上'], ['below', '参考线以下']]"
          :key="key" type="button" :class="{ 'is-active': worldFilter === key }"
          @click="worldFilter = key">
          {{ label }}
        </button>
      </div>
    </div>

    <div v-else-if="detailId === 'technology'" class="enough-explorer__controls">
      <div>
        <span>显示指标</span>
        <button v-for="[key, label] in metricOptions" :key="key" type="button"
          :class="{ 'is-active': metrics.includes(key) }" @click="toggleMetric(key)">
          {{ label }}
        </button>
      </div>
    </div>

    <div class="enough-explorer__chart">
      <PerCapitaLineChart v-if="detailId === 'per-capita'" :progress="1"
        :range-start="rangeStart" :show-reference="showReference" />
      <GrainStackedArea v-else-if="detailId === 'production'" :progress="1"
        :mode="grainMode" :crop="crop" />
      <WorldComparisonBar v-else-if="detailId === 'world'" :filter="worldFilter" />
      <AgriTechnologyExplorerChart v-else-if="detailId === 'technology'" :metrics="metrics" />
    </div>
  </div>
</template>

<style scoped>
.enough-explorer {
  display: grid;
  gap: 14px;
}

.enough-explorer__hint {
  margin: 0;
  color: rgba(45, 36, 26, 0.7);
  font-size: 0.86rem;
  line-height: 1.75;
}

.enough-explorer__controls {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(239, 225, 199, 0.42);
}

.enough-explorer__controls > div {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
}

.enough-explorer__controls span {
  min-width: 74px;
  color: rgba(45, 36, 26, 0.66);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.enough-explorer__controls button {
  padding: 6px 10px;
  border: 1px solid rgba(49, 95, 73, 0.2);
  border-radius: 999px;
  background: rgba(255, 249, 237, 0.7);
  color: rgba(45, 36, 26, 0.72);
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 800;
}

.enough-explorer__controls button.is-active {
  border-color: rgba(143, 51, 40, 0.42);
  background: rgba(143, 51, 40, 0.1);
  color: #8f3328;
}

.enough-explorer__chart {
  min-width: 0;
}
</style>
