<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  wasteCounterCopy,
  wasteImpactData,
} from "../../data/wasteImpactData.js";
import FoodSupplyChainChart from "../charts/FoodSupplyChainChart.vue";
import FoodWasteCompositionChart from "../charts/FoodWasteCompositionChart.vue";
import FoodWasteEnvironmentalImpactChart from "../charts/FoodWasteEnvironmentalImpactChart.vue";
import FoodWasteRateChart from "../charts/FoodWasteRateChart.vue";

const secondsOnPage = ref(0);

const wastePerSecondTonnes =
  wasteImpactData.annualWasteTonnes / (365 * 24 * 60 * 60);
const liveWasteTonnes = computed(() =>
  Math.round(secondsOnPage.value * wastePerSecondTonnes),
);

let timerId;

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits }).format(
    value,
  );
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
        <p class="eyebrow">Scene 03 / 丰盛之后</p>
        <h2>吃得负责</h2>
        <p>
          当餐桌变得丰盛，浪费开始成为必须正视的另一面。食物系统贡献了约 1/3 的全球温室气体排放；
          每一次丢弃，都让已经投入的土地、水、能源与劳动失去价值。减少浪费，不只是生活习惯，
          也是通往<strong>双碳</strong>与联合国<strong>SDG 12.3</strong>的现实路径。
        </p>
        <div class="broadcast-beats">
          <span
            ><b>一口剩饭</b
            >看似微小，却已经包含土地、水、能源与劳动。</span
          >
          <span
            ><b>不同食物，不同代价</b
            >总量与比例共同决定，改变应该从哪里开始。</span
          >
          <span
            ><b>丰盛之后的选择</b
            >负责并非降低生活质量，而是更准确地珍惜。</span
          >
        </div>
      </div>

      <div class="waste-opening__plate" aria-hidden="true">
        <div class="public-plate">
          <span class="public-plate__rice" />
          <span class="public-plate__leaf" />
          <span class="public-plate__sauce" />
        </div>
        <div class="public-caption">
          <strong>一顿饭，剩下 10%</strong>
          <span>看起来很少。乘以时间与人数，便不再微小。</span>
        </div>
      </div>
    </div>

    <section class="responsible-part responsible-part--waste">
      <div class="responsible-part__intro">
        <p class="eyebrow">Part 01 / 浪费的尺度</p>
        <h2>浪费，发生在每一段日常</h2>
        <p>
          浪费并不是抽象概念。它发生在家庭厨房、餐饮服务与零售端，
          也分布在果蔬、肉类、谷物等不同类别中。规模与结构，决定改变从哪里开始。
        </p>
      </div>

      <div class="waste-counter">
        <div class="waste-counter__copy">
          <p class="eyebrow">数字放大</p>
          <h2>{{ wasteCounterCopy.headline }}</h2>
          <p>
            {{ wasteCounterCopy.note }}
            数字持续跳动，是为了把十亿吨级的年度规模，压缩为阅读此刻仍在发生的现实。
          </p>
        </div>
        <div class="waste-counter__number">
          <span>此刻已浪费约</span>
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
          <p class="eyebrow">浪费结构</p>
          <h2>哪些食物，被浪费得更多？</h2>
          <p>
            总量揭示治理优先级，人均每餐浪费量与浪费率则指向日常策略。
            规模与比例，需要被同时看见。
          </p>
        </div>
        <div class="chart-reading-guide">
          <article>
            <strong>规模</strong>
            <span>总量更大的类别，值得优先进入治理视野。</span>
          </article>
          <article>
            <strong>比例</strong>
            <span>浪费率更高的类别，需要更细致的购买、储存与烹饪。</span>
          </article>
          <article>
            <strong>行动</strong>
            <span>按需购买、合理储存、减少过量点餐，改变从日常开始。</span>
          </article>
        </div>
        <div class="waste-charts__grid">
          <FoodWasteCompositionChart />
          <FoodWasteRateChart />
        </div>
      </div>
    </section>

    <section class="responsible-part responsible-part--impact">
      <div class="responsible-part__intro">
        <p class="eyebrow">Part 02 / 代价的形状</p>
        <h2>被丢掉的，从来不只是食物</h2>
        <p>
          一份食物抵达餐桌之前，已经消耗土地、水与能源，也留下氮磷投入和温室气体排放。
          当食物被丢弃，这些资源也随之失去价值。
        </p>
      </div>

      <div class="choice-charts">
        <div class="waste-charts__header">
          <p class="eyebrow">环境账本</p>
          <h2>从资源足迹，到一份食物的生命周期</h2>
          <p>
            上图呈现浪费带走的环境资源；下图继续追问，温室气体排放究竟发生在哪里。
            从土地变化、农场生产与动物饲料，到加工、运输、零售与包装，一份食物的代价被逐段展开。
          </p>
        </div>
        <div class="chart-reading-guide">
          <article>
            <strong>资源账本</strong>
            <span>土地、水、氮磷投入与温室气体，共同构成一份食物的环境代价。</span>
          </article>
          <article>
            <strong>生命周期</strong>
            <span>切换绝对值与相对值，观察排放总量与阶段结构。</span>
          </article>
          <article>
            <strong>回到选择</strong>
            <span>食物类别往往比运输距离更重要。选择本身，也有重量。</span>
          </article>
        </div>
        <div class="choice-charts__grid">
          <FoodWasteEnvironmentalImpactChart />
          <FoodSupplyChainChart />
        </div>
      </div>
    </section>
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
.responsible-panel {
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
.responsible-panel__copy h3 {
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

.responsible-part {
  max-width: 1180px;
  margin: 34px auto 0;
  padding: 28px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 12px;
}

.responsible-part--waste {
  background: rgba(255, 249, 237, 0.2);
}

.responsible-part--impact {
  background: rgba(49, 95, 73, 0.12);
}

.responsible-part__intro {
  max-width: 880px;
  margin: 0 auto 24px;
}

.responsible-part__intro h2 {
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1.05;
}

.responsible-part__intro p:last-child {
  margin: 0;
  color: rgba(45, 36, 26, 0.72);
  line-height: 1.85;
}

.waste-charts {
  max-width: 1120px;
  margin: 28px auto 0;
  padding: 34px;
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 8px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 249, 237, 0.92),
      rgba(234, 216, 183, 0.84)
    ),
    #fff9ed;
  box-shadow: 0 28px 70px rgba(45, 36, 26, 0.16);
}

.choice-charts {
  max-width: 1120px;
  margin: 28px auto 0;
  padding: 34px;
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 8px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 249, 237, 0.92),
      rgba(208, 222, 200, 0.74)
    ),
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

.choice-charts__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-reading-guide {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 22px;
}

.chart-reading-guide article {
  display: grid;
  gap: 7px;
  min-height: 110px;
  padding: 16px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(255, 249, 237, 0.58);
}

.chart-reading-guide strong {
  color: #8f3328;
  font-size: 1rem;
}

.chart-reading-guide span {
  color: rgba(45, 36, 26, 0.68);
  font-size: 0.9rem;
  line-height: 1.65;
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
  .chart-reading-guide,
  .waste-charts__grid,
  .choice-charts__grid,
  .impact-grid {
    grid-template-columns: 1fr;
  }

  .responsible-part {
    padding: 16px;
  }

  .fridge-box {
    min-height: 360px;
  }
}
</style>
