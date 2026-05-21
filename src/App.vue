<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Hero from "./components/layout/Hero.vue";
import ScrollSection from "./components/layout/ScrollSection.vue";
import SceneTitle from "./components/layout/SceneTitle.vue";
import FinalSection from "./components/layout/FinalSection.vue";
import TechSection from "./components/layout/TechSection.vue";
import InsightSection from "./components/layout/InsightSection.vue";
import GrainLineChart from "./components/charts/GrainLineChart.vue";
import StapleShareDonut from "./components/charts/StapleShareDonut.vue";
import GrainTimeAxis from "./components/charts/GrainTimeAxis.vue";
import CarbonBarChart from "./components/charts/CarbonBarChart.vue";
import CarbonBubbleChart from "./components/charts/CarbonBubbleChart.vue";
import FoodWasteFlow from "./components/charts/FoodWasteFlow.vue";
import FoodWasteTrendChart from "./components/charts/FoodWasteTrendChart.vue";
import GrainBarnVisual from "./components/visuals/GrainBarnVisual.vue";
import ResponsiblePlate from "./components/visuals/ResponsiblePlate.vue";
import SceneTwoChart from "./components/charts/SceneTwoChart.vue";

const sceneOneSteps = [
  {
    kicker: "第一幕",
    title: "粮食安全是起点",
    body: '餐桌变迁的第一步，不是丰盛，而是稳定。只有当"有没有饭吃"不再悬在日常生活之上，更多选择才有了生长的空间。',
  },
  {
    kicker: "粮仓充盈",
    title: "人均粮食占有量上升",
    body: '从 1980 年代到今天，mock 数据呈现出人均粮食占有量和粮食总产量的共同上升。当粮仓逐渐充盈，"吃饭"才从生存问题变成生活问题。',
  },
  {
    kicker: "结构变化",
    title: "主食不再占据全部餐盘",
    body: "主食仍然是底色，但它在餐盘中的比例开始下降。粮食安全构成了中国餐桌现代化的底座，也打开了饮食结构变化的起点。",
  },
];

const sceneTwoSteps = [
  {
    kicker: "Scene 02 / 餐盘",
    title: "从一碗主食，到一张更丰富的餐桌",
    body: '谷物比例从 64% 下降到 31%，而肉、蛋奶、水产、果蔬等品类共同上升。餐桌从"够吃"走向"可选择"。',
  },
  {
    kicker: "结构变化",
    title: "长期趋势：谷物占比下降，多样性上升",
    body: "谷物占比下降并不意味着主食消失，而是更多类别开始共同构成一顿饭。饮食结构变丰富，是收入、城市化、物流和冷链共同作用的结果。",
  },
  {
    kicker: "城市网络",
    title: "外卖让吃饭进入即时配送时代",
    body: '2011 年到 2023 年，外卖订单从 2.1 亿单增长到 214.5 亿单。手机、平台、骑手和城市配送让"吃饭"不再只发生在厨房。',
  },
];

const sceneThreeSteps = [
  {
    kicker: "第三幕",
    title: "丰盛之后，浪费成为新问题",
    body: "新的问题不再是有没有食物，而是如何更合理地消费食物。剩饭背后不仅是食物本身，也包括土地、水、能源和劳动。",
  },
  {
    kicker: "代价",
    title: "不同食物的碳足迹差异很大",
    body: "同样是一公斤食物，不同类别的碳排放、用水和土地占用并不相同。高碳食物需要被看见，低碳选择也需要被理解。",
  },
  {
    kicker: "未来",
    title: "走向负责任的餐桌",
    body: "丰盛不是故事的终点，责任才是下一阶段的餐桌文明。一张餐桌连接着土地、水、能源、劳动与未来。",
  },
];

const scrollProgress = ref(0);
const assetUrl = (fileName) => `${import.meta.env.BASE_URL}assets/${fileName}`;

function updateGlobalProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = docHeight > 0 ? scrollTop / docHeight : 0;
}

onMounted(() => {
  window.addEventListener("scroll", updateGlobalProgress, { passive: true });
  updateGlobalProgress();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateGlobalProgress);
});
</script>

<template>
  <div class="scroll-progress">
    <div
      class="scroll-progress__fill"
      :style="{ width: `${scrollProgress * 100}%` }"
    />
  </div>
  <main>
    <Hero />

    <SceneTitle
      eyebrow="Scene 01"
      title="吃得饱"
      subtitle="中国人首先解决的是有没有饭吃的问题。粮食安全，是餐桌故事最沉稳的开端。"
      :image="assetUrl('hero-table-grain.png')"
    />
    <ScrollSection id="enough" tone="field" :steps="sceneOneSteps">
      <template #visual="{ activeStep, scrollProgress }">
        <div class="scene-grid scene-grid--grain">
          <GrainLineChart
            :active-step="activeStep"
            :progress="scrollProgress"
          />
          <GrainBarnVisual
            :active-step="activeStep"
            :progress="scrollProgress"
          />
          <StapleShareDonut
            :active-step="activeStep"
            :progress="scrollProgress"
          />
          <GrainTimeAxis :progress="scrollProgress" />
        </div>
      </template>
    </ScrollSection>

    <TechSection />

    <SceneTitle
      eyebrow="Scene 02"
      title="吃得好"
      subtitle="当粮食不再短缺，餐桌开始追求丰盛与多样。中国人的饮食结构在四十年间发生了深刻变化。"
      :image="assetUrl('scene-rich-table.png')"
    />
    <ScrollSection id="better" tone="table" :steps="sceneTwoSteps">
      <template #visual="{ activeStep, scrollProgress }">
        <SceneTwoChart :active-step="activeStep" :progress="scrollProgress" />
      </template>
    </ScrollSection>

    <SceneTitle
      eyebrow="Scene 03"
      title="吃得负责"
      subtitle="食物变得丰富之后，餐桌开始面对浪费、碳足迹与可持续消费的新命题。"
      :image="assetUrl('scene-responsible-table.png')"
    />
    <ScrollSection id="responsible" tone="future" :steps="sceneThreeSteps">
      <template #visual="{ activeStep }">
        <div class="scene-grid scene-grid--responsible">
          <FoodWasteFlow v-if="activeStep === 0" :active-step="activeStep" />
          <CarbonBarChart
            v-else-if="activeStep === 1"
            :active-step="activeStep"
          />
          <ResponsiblePlate v-else :active-step="activeStep" />
          <FoodWasteTrendChart
            v-if="activeStep !== 1"
            :active-step="activeStep"
          />
          <CarbonBubbleChart v-else :active-step="activeStep" />
        </div>
      </template>
    </ScrollSection>

    <InsightSection />
    <FinalSection />
  </main>
</template>
