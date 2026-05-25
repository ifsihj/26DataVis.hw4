<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { fridgeWasteItems } from "../../data/fridgeWasteData.js";
import {
  plateWasteScenario,
  reductionScenario,
} from "../../data/wasteReductionData.js";
import {
  wasteCounterCopy,
  wasteImpactData,
} from "../../data/wasteImpactData.js";
import CarbonFootprintBarChart from "../charts/CarbonFootprintBarChart.vue";
import FoodWasteCompositionChart from "../charts/FoodWasteCompositionChart.vue";
import FoodWasteRateChart from "../charts/FoodWasteRateChart.vue";
import FoodWasteTrendChart from "../charts/FoodWasteTrendChart.vue";

const secondsOnPage = ref(0);
const selectedFridgeItemId = ref(fridgeWasteItems[0].id);
const leftoverPercent = ref(10);
const reductionPercent = ref(20);

const selectedFridgeItem = computed(
  () =>
    fridgeWasteItems.find((item) => item.id === selectedFridgeItemId.value) ||
    fridgeWasteItems[0],
);

const wastePerSecondTonnes =
  wasteImpactData.annualWasteTonnes / (365 * 24 * 60 * 60);
const liveWasteTonnes = computed(() =>
  Math.round(secondsOnPage.value * wastePerSecondTonnes),
);

const plateWaste = computed(() => {
  const wastePerMealGram =
    plateWasteScenario.mealWeightGram * (leftoverPercent.value / 100);
  const weekKg = (wastePerMealGram * plateWasteScenario.mealsPerDay * 7) / 1000;
  const yearKg =
    (wastePerMealGram * plateWasteScenario.mealsPerDay * 365) / 1000;
  const cityYearTonnes = (yearKg * plateWasteScenario.cityPopulation) / 1000;
  return {
    wastePerMealGram,
    weekKg,
    yearKg,
    cityYearTonnes,
  };
});

const reductionImpact = computed(() => {
  const savedTonnes =
    reductionScenario.baselineWasteTonnes * (reductionPercent.value / 100);
  const savedKg = savedTonnes * 1000;
  return {
    savedTonnes,
    carbonTonnes: (savedKg * reductionScenario.carbonKgPerWasteKg) / 1000,
    peopleDays: savedKg / reductionScenario.foodPerPersonPerDayKg,
  };
});

const plateLeftoverStyle = computed(() => ({
  clipPath: `inset(${100 - leftoverPercent.value}% 0 0 0)`,
}));

let timerId;

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits }).format(
    value,
  );
}

function formatLargeTonnes(value) {
  if (value >= 100000000) return `${formatNumber(value / 100000000, 2)} 亿吨`;
  if (value >= 10000) return `${formatNumber(value / 10000, 1)} 万吨`;
  return `${formatNumber(value)} 吨`;
}

onMounted(() => {
  timerId = window.setInterval(() => {
    secondsOnPage.value += 1;
  }, 1000);
});

onBeforeUnmount(() => {
  window.clearInterval(timerId);
});
</script>

<template>
  <section id="responsible" class="responsible-waste">
    <div class="waste-opening">
      <div class="waste-opening__copy">
        <p class="eyebrow">Scene 03 / 一盘剩饭</p>
        <h2>浪费</h2>
        <p>
          食品浪费加剧了粮食不安全，并导致了1/3全球温室气体排放，其中餐饮业浪费尤为突出。中国作为最大的发展中国家，减少事物浪费对实现国家<strong>双碳</strong>目标和联合国<strong
            >SDG 12.3</strong
          >目标具有重要意义。明晰食物浪费现状、组成及特征是实施有效干预的基础。
        </p>
      </div>

      <div class="waste-opening__plate" aria-hidden="true">
        <div class="public-plate">
          <span class="public-plate__rice" />
          <span class="public-plate__leaf" />
          <span class="public-plate__sauce" />
        </div>
        <div class="public-caption">
          <strong>一顿饭剩 10%</strong>
          <span>看起来很少，乘以时间和人数就不再小。</span>
        </div>
      </div>
    </div>

    <div class="waste-counter">
      <div class="waste-counter__copy">
        <p class="eyebrow">数字放大</p>
        <h2>{{ wasteCounterCopy.headline }}</h2>
        <p>{{ wasteCounterCopy.note }}</p>
      </div>
      <div class="waste-counter__number">
        <span>已浪费约</span>
        <strong>{{ formatNumber(liveWasteTonnes) }}</strong>
        <em>吨食物</em>
      </div>
      <div class="waste-counter__sources">
        <article v-for="sector in wasteImpactData.sectors" :key="sector.key">
          <i
            :style="{
              backgroundColor: sector.color,
              width: `${sector.share}%`,
            }"
          />
          <span>{{ sector.label }}</span>
          <strong>{{ sector.share }}%</strong>
        </article>
      </div>
    </div>

    <div class="waste-charts">
      <div class="waste-charts__header">
        <p class="eyebrow">数据放大镜</p>
        <h2>哪些食物浪费得最多？</h2>
        <p>
          蓝色柱表示各类食物的浪费总量，已经按从高到低排序；橙色点表示平均每人每餐浪费了多少克。
          这张图不是为了责备某一种食物，而是提醒我们：浪费既有总量差异，也有日常餐桌上的习惯差异。
        </p>
      </div>
      <div class="waste-charts__grid">
        <FoodWasteCompositionChart />
        <FoodWasteRateChart />
        <CarbonFootprintBarChart />
        <FoodWasteTrendChart />
      </div>
    </div>

    <div class="responsible-timeline">
      <p class="eyebrow">Table Timeline</p>
      <h3>从吃得饱，到吃得好，再到吃得负责</h3>
      <div class="responsible-timeline__nodes">
        <article>
          <span>01</span>
          <strong>粮食安全</strong>
          <p>先解决有没有饭吃。</p>
        </article>
        <article>
          <span>02</span>
          <strong>饮食丰富</strong>
          <p>再拥有更多选择。</p>
        </article>
        <article>
          <span>03</span>
          <strong>可持续消费</strong>
          <p>最后理解食物的代价。</p>
        </article>
      </div>
      <p class="responsible-timeline__closing">
        吃得负责，不是回到匮乏，而是在丰盛之后学会珍惜。
      </p>
    </div>
  </section>
</template>

<style scoped>
.responsible-waste {
  padding: 56px 5vw 88px;
  background:
    radial-gradient(
      circle at 18% 8%,
      rgba(143, 51, 40, 0.15),
      transparent 26rem
    ),
    linear-gradient(180deg, #efe1c7 0%, #d5c09e 42%, #60745f 100%);
  color: #2d241a;
}

.waste-opening,
.waste-counter,
.responsible-panel,
.responsible-timeline {
  max-width: 1120px;
  margin: 0 auto;
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 8px;
  background: rgba(255, 249, 237, 0.78);
  box-shadow: 0 28px 70px rgba(45, 36, 26, 0.16);
}

.waste-opening {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 30px;
  align-items: center;
  padding: 36px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 249, 237, 0.9),
      rgba(234, 216, 183, 0.86)
    ),
    #fff9ed;
}

.waste-opening__copy h2,
.waste-counter__copy h2,
.responsible-panel__copy h3,
.responsible-timeline h3 {
  margin: 0;
  font-family: var(--font-serif);
  color: #2d241a;
  font-size: clamp(2.2rem, 4vw, 4.6rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.waste-opening__copy p:last-child,
.waste-counter__copy p:last-child,
.responsible-panel__copy p:last-child {
  max-width: 690px;
  color: rgba(45, 36, 26, 0.68);
  font-size: 1rem;
  line-height: 1.85;
}

.waste-opening__plate {
  display: grid;
  gap: 18px;
  justify-items: center;
}

.public-plate {
  position: relative;
  width: 270px;
  aspect-ratio: 1;
  border: 18px solid #fff9ed;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 36%, #fff3c6 0 18px, transparent 19px),
    radial-gradient(circle at 62% 58%, #9a4034 0 22px, transparent 23px),
    radial-gradient(circle at 45% 66%, #537c4a 0 18px, transparent 19px),
    #f1dfbf;
  box-shadow: 0 30px 60px rgba(45, 36, 26, 0.2);
}

.public-plate::after {
  position: absolute;
  right: 34px;
  bottom: 24px;
  width: 86px;
  height: 40px;
  border-radius: 50%;
  content: "";
  background: rgba(143, 51, 40, 0.22);
  transform: rotate(-18deg);
}

.public-plate__rice,
.public-plate__leaf,
.public-plate__sauce {
  position: absolute;
  display: block;
  border-radius: 999px;
}

.public-plate__rice {
  left: 78px;
  top: 62px;
  width: 74px;
  height: 46px;
  background: #fff5d6;
}

.public-plate__leaf {
  right: 66px;
  top: 84px;
  width: 48px;
  height: 26px;
  background: #537c4a;
  transform: rotate(-24deg);
}

.public-plate__sauce {
  left: 96px;
  bottom: 68px;
  width: 54px;
  height: 34px;
  background: #a94a3a;
}

.public-caption {
  display: grid;
  gap: 4px;
  max-width: 280px;
  color: rgba(45, 36, 26, 0.68);
  text-align: center;
}

.public-caption strong {
  color: #8f3328;
  font-size: 1.18rem;
}

.broadcast-beats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.broadcast-beats span {
  padding: 14px 16px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(45, 36, 26, 0.72);
  font-weight: 800;
}

.broadcast-beats b {
  margin-right: 8px;
  color: #8f3328;
}

.waste-counter {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 26px;
  align-items: end;
  margin-top: 28px;
  padding: 34px;
}

.waste-counter__number {
  display: grid;
  justify-items: end;
  color: #6d3129;
}

.waste-counter__number span,
.waste-counter__number em {
  color: rgba(45, 36, 26, 0.62);
  font-style: normal;
}

.waste-counter__number strong {
  font-size: clamp(3rem, 7vw, 6.6rem);
  line-height: 0.95;
}

.waste-counter__sources {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.waste-counter__sources article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px 12px;
  align-items: center;
  padding: 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.46);
}

.waste-counter__sources i {
  grid-column: 1 / -1;
  display: block;
  height: 8px;
  max-width: 100%;
  border-radius: 999px;
}

.responsible-panel {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 30px;
  align-items: center;
  margin-top: 28px;
  padding: 30px;
}

.waste-charts {
  max-width: 1120px;
  margin: 28px auto 0;
  padding: 34px;
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 249, 237, 0.92), rgba(234, 216, 183, 0.84)),
    #fff9ed;
  box-shadow: 0 28px 70px rgba(45, 36, 26, 0.16);
}

.waste-charts__header {
  margin-bottom: 24px;
}

.waste-charts__header h2 {
  margin: 0 0 8px;
  font-family: var(--font-serif);
  color: #2d241a;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: 0;
}

.waste-charts__header p:last-child {
  max-width: 720px;
  margin: 0;
  color: rgba(45, 36, 26, 0.66);
  font-size: 0.95rem;
  line-height: 1.75;
}

.waste-charts__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.fridge-interactive {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 22px;
  align-items: stretch;
}

.fridge-box {
  position: relative;
  min-height: 440px;
  border: 10px solid #f8efe0;
  border-radius: 28px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.72),
      rgba(214, 231, 218, 0.78)
    ),
    #d6e8dc;
  box-shadow: inset 0 0 0 2px rgba(49, 95, 73, 0.15);
}

.fridge-box::before,
.fridge-box::after {
  position: absolute;
  right: 28px;
  left: 28px;
  height: 2px;
  content: "";
  background: rgba(49, 95, 73, 0.16);
}

.fridge-box::before {
  top: 38%;
}
.fridge-box::after {
  top: 68%;
}

.fridge-food {
  position: absolute;
  display: grid;
  gap: 3px;
  min-width: 78px;
  padding: 9px;
  border: 1px solid rgba(49, 95, 73, 0.18);
  border-radius: 16px;
  background: rgba(255, 249, 237, 0.86);
  color: #2d241a;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.fridge-food span {
  font-size: 1.9rem;
}

.fridge-food small {
  font-size: 0.76rem;
  font-weight: 800;
}

.fridge-food.is-active,
.fridge-food:hover {
  transform: translate(-50%, -50%) scale(1.08);
  box-shadow: 0 14px 28px rgba(49, 95, 73, 0.18);
}

.fridge-card {
  display: grid;
  align-content: center;
  padding: 24px;
  border-radius: 8px;
  background: #fff9ed;
}

.fridge-card p {
  margin: 0 0 8px;
  color: #8f3328;
  font-weight: 800;
}

.fridge-card h4 {
  margin: 0 0 12px;
  font-size: 1.7rem;
}

.fridge-card span {
  color: rgba(45, 36, 26, 0.72);
  line-height: 1.7;
}

.fridge-card strong {
  margin-top: 18px;
  color: #315f49;
}

.plate-simulator,
.reduction-control {
  display: grid;
  gap: 22px;
}

.plate-simulator {
  grid-template-columns: 300px minmax(0, 1fr);
  align-items: center;
}

.leftover-plate {
  position: relative;
  display: grid;
  width: 260px;
  aspect-ratio: 1;
  place-items: center;
  overflow: hidden;
  border: 18px solid #fff9ed;
  border-radius: 50%;
  background: #f4ead7;
  box-shadow: 0 26px 48px rgba(45, 36, 26, 0.18);
}

.leftover-plate__food {
  position: absolute;
  inset: 18px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 36% 28%, #fff3c6 0 10px, transparent 11px),
    radial-gradient(circle at 62% 48%, #a64939 0 14px, transparent 15px),
    radial-gradient(circle at 52% 70%, #537c4a 0 12px, transparent 13px),
    #d6ad5a;
  transition: clip-path 240ms ease;
}

.leftover-plate span {
  position: relative;
  z-index: 1;
  display: grid;
  width: 86px;
  height: 86px;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 249, 237, 0.88);
  color: #8f3328;
  font-size: 1.6rem;
  font-weight: 900;
}

.leftover-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.leftover-buttons button {
  padding: 10px 12px;
  border: 1px solid rgba(45, 36, 26, 0.16);
  border-radius: 999px;
  background: rgba(255, 249, 237, 0.7);
  color: #2d241a;
  cursor: pointer;
}

.leftover-buttons button.is-active {
  background: #8f3328;
  color: #fff9ed;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.impact-grid article {
  display: grid;
  align-content: center;
  min-height: 132px;
  padding: 18px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(255, 249, 237, 0.72);
}

.impact-grid span {
  color: rgba(45, 36, 26, 0.58);
  font-weight: 800;
}

.impact-grid strong {
  margin-top: 8px;
  color: #8f3328;
  font-size: clamp(1.25rem, 2.2vw, 2rem);
  line-height: 1.1;
}

.reduction-control label {
  display: grid;
  gap: 14px;
  padding: 20px;
  border-radius: 8px;
  background: rgba(49, 95, 73, 0.12);
}

.reduction-control label span {
  color: #315f49;
  font-size: 2rem;
  font-weight: 900;
}

.reduction-control input {
  width: 100%;
  accent-color: #315f49;
}

.impact-grid--green strong {
  color: #315f49;
}

.responsible-timeline {
  margin-top: 28px;
  padding: 34px;
}

.responsible-timeline__nodes {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.responsible-timeline__nodes::before {
  position: absolute;
  top: 38px;
  right: 12%;
  left: 12%;
  height: 2px;
  content: "";
  background: linear-gradient(90deg, #d6ad5a, #8f3328, #315f49);
}

.responsible-timeline__nodes article {
  position: relative;
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 18px;
  text-align: center;
}

.responsible-timeline__nodes span {
  display: grid;
  width: 78px;
  height: 78px;
  place-items: center;
  border: 8px solid #fff9ed;
  border-radius: 50%;
  background: #2d241a;
  color: #f0c86b;
  font-weight: 900;
}

.responsible-timeline__nodes strong {
  font-size: 1.24rem;
}

.responsible-timeline__nodes p,
.responsible-timeline__closing {
  margin: 0;
  color: rgba(45, 36, 26, 0.66);
}

.responsible-timeline__closing {
  margin-top: 22px;
  text-align: center;
  font-size: 1.08rem;
  font-weight: 800;
}

@media (max-width: 1180px) {
  .waste-opening,
  .waste-counter,
  .responsible-panel,
  .fridge-interactive,
  .plate-simulator {
    grid-template-columns: 1fr;
  }

  .waste-counter__number {
    justify-items: start;
  }

  .broadcast-beats,
  .waste-counter__sources,
  .waste-charts__grid,
  .impact-grid,
  .responsible-timeline__nodes {
    grid-template-columns: 1fr;
  }

  .fridge-box {
    min-height: 360px;
  }

  .responsible-timeline__nodes::before {
    display: none;
  }
}
</style>
