<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { fridgeWasteItems } from '../../data/fridgeWasteData.js';
import { plateWasteScenario, reductionScenario } from '../../data/wasteReductionData.js';
import { wasteCounterCopy, wasteImpactData } from '../../data/wasteImpactData.js';

const secondsOnPage = ref(0);
const selectedFridgeItemId = ref(fridgeWasteItems[0].id);
const leftoverPercent = ref(10);
const reductionPercent = ref(20);

const selectedFridgeItem = computed(() =>
  fridgeWasteItems.find((item) => item.id === selectedFridgeItemId.value) || fridgeWasteItems[0],
);

const wastePerSecondTonnes = wasteImpactData.annualWasteTonnes / (365 * 24 * 60 * 60);
const liveWasteTonnes = computed(() => Math.round(secondsOnPage.value * wastePerSecondTonnes));

const plateWaste = computed(() => {
  const wastePerMealGram = plateWasteScenario.mealWeightGram * (leftoverPercent.value / 100);
  const weekKg = (wastePerMealGram * plateWasteScenario.mealsPerDay * 7) / 1000;
  const yearKg = (wastePerMealGram * plateWasteScenario.mealsPerDay * 365) / 1000;
  const cityYearTonnes = (yearKg * plateWasteScenario.cityPopulation) / 1000;
  return {
    wastePerMealGram,
    weekKg,
    yearKg,
    cityYearTonnes,
  };
});

const reductionImpact = computed(() => {
  const savedTonnes = reductionScenario.baselineWasteTonnes * (reductionPercent.value / 100);
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
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits }).format(value);
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
        <h2>浪费很少以宏大的样子出现。</h2>
        <p>
          它常常只是餐盘里剩下的一点饭菜、冰箱深处忘记的一盒食物、聚餐后没有打包的一桌菜。
          第三幕先从一个具体场景开始，再把它放大成数字，最后回到每个人能做的选择。
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

      <div class="broadcast-beats" aria-label="第三幕叙事节奏">
        <span><b>01</b> 先看见一盘剩饭</span>
        <span><b>02</b> 再放大成社会数字</span>
        <span><b>03</b> 最后回到行动选择</span>
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
          <i :style="{ backgroundColor: sector.color, width: `${sector.share}%` }" />
          <span>{{ sector.label }}</span>
          <strong>{{ sector.share }}%</strong>
        </article>
      </div>
    </div>

    <div class="responsible-panel responsible-panel--fridge">
      <div class="responsible-panel__copy">
        <p class="eyebrow">回到家庭</p>
        <h3>浪费常常不是“故意的”，而是被忘记的。</h3>
        <p>
          点击冰箱里的食物，看看常见的浪费原因。宏大的 10 亿吨，最终会落到每个家庭的购买、储存和处理习惯上。
        </p>
      </div>

      <div class="fridge-interactive">
        <div class="fridge-box" aria-label="可点击的家庭冰箱">
          <button
            v-for="item in fridgeWasteItems"
            :key="item.id"
            class="fridge-food"
            :class="{ 'is-active': selectedFridgeItemId === item.id }"
            :style="{ left: `${item.position.left}%`, top: `${item.position.top}%` }"
            type="button"
            @click="selectedFridgeItemId = item.id"
          >
            <span>{{ item.icon }}</span>
            <small>{{ item.name }}</small>
          </button>
        </div>

        <article class="fridge-card">
          <p>{{ selectedFridgeItem.name }}</p>
          <h4>{{ selectedFridgeItem.reason }}</h4>
          <span>{{ selectedFridgeItem.detail }}</span>
          <strong>{{ selectedFridgeItem.suggestion }}</strong>
        </article>
      </div>
    </div>

    <div class="responsible-panel responsible-panel--plate">
      <div class="responsible-panel__copy">
        <p class="eyebrow">个人模拟</p>
        <h3>每顿饭剩下一点点，放大到一年就不再小。</h3>
        <p>选择一顿饭的剩余比例，看看它如何被换算成一周、一年，以及一个千万人口城市的浪费量。</p>
      </div>

      <div class="plate-simulator">
        <div class="plate-simulator__visual">
          <div class="leftover-plate">
            <div class="leftover-plate__food" :style="plateLeftoverStyle" />
            <span>{{ leftoverPercent }}%</span>
          </div>
          <div class="leftover-buttons">
            <button
              v-for="option in plateWasteScenario.leftoverOptions"
              :key="option"
              :class="{ 'is-active': leftoverPercent === option }"
              type="button"
              @click="leftoverPercent = option"
            >
              剩 {{ option }}%
            </button>
          </div>
        </div>

        <div class="impact-grid">
          <article>
            <span>一周</span>
            <strong>{{ formatNumber(plateWaste.weekKg, 1) }} kg</strong>
          </article>
          <article>
            <span>一年</span>
            <strong>{{ formatNumber(plateWaste.yearKg, 1) }} kg</strong>
          </article>
          <article>
            <span>一座城市一年</span>
            <strong>{{ formatLargeTonnes(plateWaste.cityYearTonnes) }}</strong>
          </article>
        </div>
      </div>
    </div>

    <div class="responsible-panel responsible-panel--slider">
      <div class="responsible-panel__copy">
        <p class="eyebrow">行动反馈</p>
        <h3>责任不是突然改变一切，而是从减少一点开始。</h3>
        <p>拖动滑块，看看如果全球食品浪费减少一部分，能够节约多少食物，并减少多少隐含碳排。</p>
      </div>

      <div class="reduction-control">
        <label>
          <span>减少 {{ reductionPercent }}% 浪费</span>
          <input v-model.number="reductionPercent" min="0" max="50" step="5" type="range" />
        </label>

        <div class="impact-grid impact-grid--green">
          <article>
            <span>节约食物</span>
            <strong>{{ formatLargeTonnes(reductionImpact.savedTonnes) }}</strong>
          </article>
          <article>
            <span>减少碳排</span>
            <strong>{{ formatLargeTonnes(reductionImpact.carbonTonnes) }} CO2e</strong>
          </article>
          <article>
            <span>相当于供餐</span>
            <strong>{{ formatNumber(reductionImpact.peopleDays / 100000000, 2) }} 亿人天</strong>
          </article>
        </div>
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
    radial-gradient(circle at 18% 8%, rgba(143, 51, 40, 0.15), transparent 26rem),
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
    linear-gradient(135deg, rgba(255, 249, 237, 0.9), rgba(234, 216, 183, 0.86)),
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
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(214, 231, 218, 0.78)),
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

.fridge-box::before { top: 38%; }
.fridge-box::after { top: 68%; }

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
  transition: transform 180ms ease, box-shadow 180ms ease;
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
