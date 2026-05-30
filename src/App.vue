<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Hero from './components/layout/Hero.vue';
import StoryMarquee from './components/layout/StoryMarquee.vue';
import ScrollSection from './components/layout/ScrollSection.vue';
import SceneTitle from './components/layout/SceneTitle.vue';
import FinalSection from './components/layout/FinalSection.vue';
import TechSection from './components/layout/TechSection.vue';
import InsightSection from './components/layout/InsightSection.vue';
import ResponsibleWasteSection from './components/layout/ResponsibleWasteSection.vue';
import SceneTwoChart from './components/charts/SceneTwoChart.vue';
// Scene 1 — 真实数据图表
import MetricCards from './components/charts/MetricCards.vue';
import PerCapitaLineChart from './components/charts/PerCapitaLineChart.vue';
import GrainStackedArea from './components/charts/GrainStackedArea.vue';
import WorldComparisonBar from './components/charts/WorldComparisonBar.vue';
import FoodSecurityRadar from './components/charts/FoodSecurityRadar.vue';
import KeyEventsTimeline from './components/charts/KeyEventsTimeline.vue';

const sceneOneSteps = [
  {
    kicker: '第一幕 · 全景',
    title: '从 209kg 到 508kg',
    body: '1949 年人均粮食占有量仅 209kg，2025 年达到 508kg，跨越 FAO 400kg 安全线。餐桌变迁的第一步不是丰盛，而是稳定——当”有没有饭吃”不再悬在生活之上，更多选择才开始生长。',
  },
  {
    kicker: '粮仓充盈',
    title: '粮食总产量突破 7 亿吨',
    body: '稻谷稳、玉米增、大豆减——品种结构之变折射出从”吃饱”到”吃好”的深层逻辑。玉米从 1242 万吨增至 3 亿吨，成为饲料与工业驱动的缩影。',
  },
  {
    kicker: '安全与对比',
    title: '口粮绝对安全，大豆之忧',
    body: '稻麦自给率保持在 96% 以上，但大豆从几乎完全自给走向 14%——中国粮食安全最突出的结构性矛盾。全球对比中，人均占有量超世界平均但不及美国的一半。',
  },
];

const sceneTwoSteps = [
  {
    kicker: '第二幕 / 餐盘',
    title: '从一碗主食，到一张更丰富的餐桌',
    body: '谷物比例从 64% 下降到 31%，而肉、蛋奶、水产、果蔬等品类共同上升。餐桌从“够吃”走向“可选择”。',
  },
  {
    kicker: '结构变化',
    title: '长期趋势：谷物占比下降，多样性上升',
    body: '谷物占比下降并不意味着主食消失，而是更多类别开始共同构成一顿饭。饮食结构变丰富，是收入、城市化、物流和冷链共同作用的结果。',
  },
  {
    kicker: '城市网络',
    title: '外卖让吃饭进入即时配送时代',
    body: '2011 年到 2023 年，外卖订单从 2.1 亿单增长到 214.5 亿单。手机、平台、骑手和城市配送让“吃饭”不再只发生在厨房。',
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
  window.addEventListener('scroll', updateGlobalProgress, { passive: true });
  updateGlobalProgress();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateGlobalProgress);
});
</script>

<template>
  <div class="scroll-progress">
    <div class="scroll-progress__fill" :style="{ width: `${scrollProgress * 100}%` }" />
  </div>

  <main>
    <Hero />
    <StoryMarquee />

    <SceneTitle
      eyebrow="Scene 01"
      title="吃得饱"
      subtitle="中国人首先解决的是“有没有饭吃”的问题。粮食安全，是餐桌故事最沉稳的开端。"
      :image="assetUrl('hero-table-grain.png')"
    />
    <ScrollSection id="enough" tone="field" :steps="sceneOneSteps">
      <template #visual="{ activeStep, scrollProgress }">
        <!-- Step 0: Overview with metric cards + per capita line chart -->
        <template v-if="activeStep === 0">
          <div class="scene1-visual">
            <MetricCards :active-step="activeStep" :progress="scrollProgress" />
            <PerCapitaLineChart :active-step="activeStep" :progress="scrollProgress" />
          </div>
        </template>
        <!-- Step 1: Stacked area + world comparison -->
        <template v-else-if="activeStep === 1">
          <div class="scene1-visual">
            <div class="scene1-chart-row scene1-chart-row--split">
              <GrainStackedArea :active-step="activeStep" :progress="scrollProgress" />
              <WorldComparisonBar :active-step="activeStep" :progress="scrollProgress" />
            </div>
          </div>
        </template>
        <!-- Step 2: Security radar + key events timeline -->
        <template v-else>
          <div class="scene1-visual">
            <div class="scene1-chart-row scene1-chart-row--split">
              <div class="scene1-side-stack">
                <div class="chart-card-title">粮食安全综合雷达</div>
                <FoodSecurityRadar :active-step="activeStep" :progress="scrollProgress" />
              </div>
              <div class="scene1-side-stack">
                <div class="chart-card-title">关键历史节点 (1949-2025)</div>
                <KeyEventsTimeline :active-step="activeStep" :progress="scrollProgress" />
              </div>
            </div>
          </div>
        </template>
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
    <ResponsibleWasteSection />

    <InsightSection />
    <FinalSection />
  </main>
</template>
