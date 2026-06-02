<script setup>
import {
  dietConsumptionSourceNote,
  ruralDietConsumption,
  urbanDietConsumption,
} from "../../data/dietConsumptionData.js";
import DietConsumptionTrendChart from "../charts/DietConsumptionTrendChart.vue";
import DietStructureDonutChart from "../charts/DietStructureDonutChart.vue";
import DietUrbanRuralSnapshotChart from "../charts/DietUrbanRuralSnapshotChart.vue";
import EngelCoefficientChart from "../charts/EngelCoefficientChart.vue";

const urban1990 = urbanDietConsumption[0];
const urban2024 = urbanDietConsumption.at(-1);
const rural1990 = ruralDietConsumption[0];
const rural2024 = ruralDietConsumption.at(-1);

const metrics = [
  {
    label: "农村主食消费",
    value: `${rural1990.staple.toFixed(0)} → ${rural2024.staple.toFixed(0)}`,
    unit: "kg / 人 / 年",
    note: "主食仍是底色，却不再占据全部。",
  },
  {
    label: "农村蛋奶消费",
    value: `${rural1990.dairy.toFixed(1)} → ${rural2024.dairy.toFixed(1)}`,
    unit: "kg / 人 / 年",
    note: "近十倍增长，丰富度进入日常。",
  },
  {
    label: "城镇水果坚果",
    value: `${urban1990.fruit.toFixed(0)} → ${urban2024.fruit.toFixed(0)}`,
    unit: "kg / 人 / 年",
    note: "从补充项，成为日常选择。",
  },
  {
    label: "城乡禽肉差距",
    value: `${Math.abs(urban2024.poultry - rural2024.poultry).toFixed(1)}`,
    unit: "kg / 人 / 年",
    note: "差距收窄至几乎重合。",
  },
];
</script>

<template>
  <section id="better" class="better-diet">
    <div class="better-diet__inner">
      <header class="better-opening">
        <div>
          <p class="eyebrow">Scene 02</p>
          <h2>从一碗主食<br />到一张餐桌</h2>
        </div>
        <p>
          吃得更好，并不是简单地吃得更多。主食仍然是底色，蛋奶、水产、
          禽肉与水果逐步进入日常；城乡餐桌也在长期变化中彼此靠近。
          丰盛，最终体现为选择。
        </p>
      </header>

      <section class="better-metrics">
        <p class="eyebrow">结构信号</p>
        <h3>餐桌的变化，先落在四个数字上</h3>
        <div class="better-metrics__grid">
          <article v-for="metric in metrics" :key="metric.label">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
            <em>{{ metric.unit }}</em>
            <p>{{ metric.note }}</p>
          </article>
        </div>
      </section>

      <div class="better-reading-guide">
        <article>
          <strong>压力退场</strong>
          <span
            >恩格尔系数下降，为更多样的饮食选择释放空间。</span
          >
        </article>
        <article>
          <strong>餐盘重组</strong>
          <span
            >九类食物归入四个切面，主食之外，更多类别共同构成日常。</span
          >
        </article>
        <article>
          <strong>城乡靠近</strong>
          <span
            >小倍数趋势与 2024 年哑铃图，呈现差距如何被时间重新书写。</span
          >
        </article>
      </div>

      <section class="better-chart-block better-chart-block--hero">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 01 / 消费升级</p>
          <h3>当食品支出压力下降，选择开始变多</h3>
          <p>
            恩格尔系数记录食品支出在消费中的比重。它并不直接等同于饮食质量，
            却解释了一个重要前提：当基本压力逐步退场，餐桌才有空间容纳更多选择。
          </p>
        </div>
        <EngelCoefficientChart />
      </section>

      <section class="better-chart-block">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 02 / 餐盘快照</p>
          <h3>四个餐盘，呈现结构的重新分配</h3>
          <p>
            环形图将九类食物归入四个大类。它不是精确比较的终点，而是一眼看见变化的入口：
            主食之外，动物性蛋白、蔬果与其他类别逐渐获得更多位置。
          </p>
        </div>
        <DietStructureDonutChart />
      </section>

      <section class="better-chart-block better-chart-block--hero">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 03 / 长期趋势</p>
          <h3>同一种食物，放回同一条纵轴</h3>
          <p>
            当量级差异过大，一张图会掩盖细微变化。六个小倍数图各自保留尺度，
            让城乡之间的接近与分离重新变得可见。
          </p>
        </div>
        <DietConsumptionTrendChart />
      </section>

      <section class="better-chart-block">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 04 / 城乡对照</p>
          <h3>2024：差距仍在，但餐桌正在靠近</h3>
          <p>
            哑铃图把大宗食物与多样化食品分开观察。禽肉消费已经接近，
            蛋奶与水果仍保留清晰差距。
          </p>
        </div>
        <DietUrbanRuralSnapshotChart />
      </section>

      <p class="better-diet__footnote">
        {{ dietConsumptionSourceNote }}
        恩格尔系数来源于新增子项目数据，其中 2010-2017 年无观测值。
        环形图沿用新增快照数据口径，仅用于四个大类的结构概览。
      </p>
    </div>
  </section>
</template>

<style scoped>
.better-diet {
  padding: 56px 5vw 92px;
  color: #2d241a;
  background:
    radial-gradient(
      circle at 84% 10%,
      rgba(212, 166, 74, 0.18),
      transparent 28rem
    ),
    linear-gradient(180deg, #efe1c7 0%, #dfc99f 50%, #70836d 100%);
}

.better-diet__inner {
  max-width: 1180px;
  margin: 0 auto;
}

.better-opening,
.better-metrics,
.better-chart-block {
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 12px;
  background: rgba(255, 249, 237, 0.84);
  box-shadow: 0 28px 70px rgba(45, 36, 26, 0.14);
}

.better-opening {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.76fr);
  gap: 44px;
  align-items: end;
  padding: 38px;
}

.better-opening h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(3.4rem, 6vw, 6.2rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.better-opening > p,
.better-chart-block__copy p:last-child {
  margin: 0;
  color: rgba(45, 36, 26, 0.7);
  line-height: 1.9;
}

.better-metrics {
  margin-top: 28px;
  padding: 28px;
}

.better-metrics h3,
.better-chart-block h3 {
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.12;
}

.better-metrics__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.better-metrics article,
.better-reading-guide article {
  padding: 16px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(255, 249, 237, 0.64);
}

.better-metrics span,
.better-metrics em {
  display: block;
  color: rgba(45, 36, 26, 0.6);
  font-size: 0.78rem;
  font-style: normal;
}

.better-metrics strong {
  display: block;
  margin-top: 8px;
  color: #8f3328;
  font-family: var(--font-serif);
  font-size: 1.7rem;
}

.better-metrics p {
  margin: 8px 0 0;
  color: rgba(45, 36, 26, 0.68);
  font-size: 0.86rem;
  line-height: 1.6;
}

.better-reading-guide {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 28px 0;
}

.better-reading-guide strong {
  display: block;
  color: #8f3328;
}

.better-reading-guide span {
  display: block;
  margin-top: 7px;
  color: rgba(45, 36, 26, 0.68);
  font-size: 0.9rem;
  line-height: 1.65;
}

.better-chart-block {
  margin-top: 22px;
  padding: 28px;
}

.better-chart-block--hero {
  background: rgba(255, 249, 237, 0.92);
}

.better-chart-block__copy {
  max-width: 840px;
  margin-bottom: 20px;
}

.better-diet__footnote {
  margin: 22px 0 0;
  color: rgba(45, 36, 26, 0.64);
  font-size: 0.8rem;
  line-height: 1.7;
}

@media (max-width: 820px) {
  .better-diet {
    padding: 46px 24px 72px;
  }
  .better-opening,
  .better-metrics__grid,
  .better-reading-guide {
    grid-template-columns: 1fr;
  }
  .better-opening,
  .better-metrics,
  .better-chart-block {
    padding: 20px;
  }
}
</style>
