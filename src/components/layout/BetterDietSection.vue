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
    note: "主食仍是底盘，但不再独占餐桌。",
  },
  {
    label: "农村蛋奶消费",
    value: `${rural1990.dairy.toFixed(1)} → ${rural2024.dairy.toFixed(1)}`,
    unit: "kg / 人 / 年",
    note: "增长近十倍，丰富度显著提升。",
  },
  {
    label: "城镇水果坚果",
    value: `${urban1990.fruit.toFixed(0)} → ${urban2024.fruit.toFixed(0)}`,
    unit: "kg / 人 / 年",
    note: "从补充项逐渐进入日常。",
  },
  {
    label: "城乡禽肉差距",
    value: `${Math.abs(urban2024.poultry - rural2024.poultry).toFixed(1)}`,
    unit: "kg / 人 / 年",
    note: "2024 年已经非常接近。",
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
          “吃得好”不是简单地吃得更多，而是餐盘里的选择变多。
          主食仍然重要，但蛋奶、水产、禽肉和水果逐步进入日常；
          农村与城镇的饮食结构，也在长期变化中彼此靠近。
        </p>
      </header>

      <section class="better-metrics">
        <p class="eyebrow">结构信号</p>
        <h3>先看四个变化，再进入完整图表</h3>
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
          <strong>先看消费升级</strong>
          <span
            >恩格尔系数下降，意味着食品支出压力减轻，也为更丰富的饮食选择释放空间。</span
          >
        </article>
        <article>
          <strong>再看四个餐盘</strong>
          <span
            >把九类食物归并为四个大类，观察城乡餐桌如何从主食集中走向更多类别共同构成。</span
          >
        </article>
        <article>
          <strong>最后展开细节</strong>
          <span
            >小倍数趋势图拆开量级，2024 年哑铃图再比较城乡差距，避免大数值遮住小类别。</span
          >
        </article>
      </div>

      <section class="better-chart-block better-chart-block--hero">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 01 / 消费升级</p>
          <h3>食品支出压力下降，餐桌才有更多选择</h3>
          <p>
            恩格尔系数是食品支出占消费支出的比重。长期下降不等同于饮食质量本身，
            但它解释了为什么家庭能够逐步把预算分配给更丰富的食品类别。
          </p>
        </div>
        <EngelCoefficientChart />
      </section>

      <section class="better-chart-block">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 02 / 餐盘快照</p>
          <h3>四个环形餐盘，看见结构如何重组</h3>
          <p>
            环形图先把九类食物归并为主食、动物性蛋白、蔬菜水果和油脂糖盐四个大类。
            它不是精确比较工具，而是视觉入口：悬停一个扇区，可以同步对照城乡和年份变化。
          </p>
        </div>
        <DietStructureDonutChart />
      </section>

      <section class="better-chart-block better-chart-block--hero">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 03 / 长期趋势</p>
          <h3>同一种食物，才放在同一条纵轴里比较</h3>
          <p>
            原始折线图把量级差异巨大的食物放进一张图，主食的大数值遮住了小类别的变化。
            这里改成六个小图：每个类别独立缩放纵轴，城乡曲线仍保持一致的颜色语义。
          </p>
        </div>
        <DietConsumptionTrendChart />
      </section>

      <section class="better-chart-block">
        <div class="better-chart-block__copy">
          <p class="eyebrow">Part 04 / 城乡对照</p>
          <h3>用两组量程，看见 2024 年的差距与靠近</h3>
          <p>
            雷达图不适合精确比较真实数值，因此改为哑铃图。左侧保留大宗食物，右侧放大多样化食品；
            禽肉已经接近，蛋奶和水果仍然存在明显差距。
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
