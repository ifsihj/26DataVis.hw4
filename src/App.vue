<script setup>
import Hero from './components/layout/Hero.vue';
import ScrollSection from './components/layout/ScrollSection.vue';
import SceneTitle from './components/layout/SceneTitle.vue';
import FinalSection from './components/layout/FinalSection.vue';
import TechSection from './components/layout/TechSection.vue';
import GrainLineChart from './components/charts/GrainLineChart.vue';
import StapleShareDonut from './components/charts/StapleShareDonut.vue';
import GrainTimeAxis from './components/charts/GrainTimeAxis.vue';
import DietStackedAreaChart from './components/charts/DietStackedAreaChart.vue';
import DietDiversityChart from './components/charts/DietDiversityChart.vue';
import TakeoutGrowthChart from './components/charts/TakeoutGrowthChart.vue';
import CarbonBarChart from './components/charts/CarbonBarChart.vue';
import CarbonBubbleChart from './components/charts/CarbonBubbleChart.vue';
import FoodWasteFlow from './components/charts/FoodWasteFlow.vue';
import FoodWasteTrendChart from './components/charts/FoodWasteTrendChart.vue';
import GrainBarnVisual from './components/visuals/GrainBarnVisual.vue';
import PlateComparison from './components/visuals/PlateComparison.vue';
import ResponsiblePlate from './components/visuals/ResponsiblePlate.vue';

const sceneOneSteps = [
  {
    kicker: '第一幕',
    title: '粮食安全是起点',
    body: '餐桌变迁的第一步，不是丰盛，而是稳定。只有当“有没有饭吃”不再悬在日常生活之上，更多选择才有了生长的空间。',
  },
  {
    kicker: '粮仓充盈',
    title: '人均粮食占有量上升',
    body: '从 1980 年代到今天，mock 数据呈现出人均粮食占有量和粮食总产量的共同上升。当粮仓逐渐充盈，“吃饭”才从生存问题变成生活问题。',
  },
  {
    kicker: '结构变化',
    title: '主食不再占据全部餐盘',
    body: '主食仍然是底色，但它在餐盘中的比例开始下降。粮食安全构成了中国餐桌现代化的底座，也打开了饮食结构变化的起点。',
  },
];

const sceneTwoSteps = [
  {
    kicker: '第二幕',
    title: '从温饱到丰富',
    body: '当“够不够”逐渐退场，“好不好”成为新的问题。餐桌开始容纳更多肉、蛋、奶、果蔬和水产品。',
  },
  {
    kicker: '丰富性',
    title: '饮食结构越来越多元',
    body: '堆叠面积图显示，谷物占比下降，动物性食品和多样化食品上升。餐桌上的变化，是收入、城市化、物流和冷链共同作用的结果。',
  },
  {
    kicker: '城市速度',
    title: '外卖改变吃饭场景',
    body: '从米面馒头到肉蛋奶果，从家中厨房到手机下单，吃饭的方式也在被重新定义。城市配送网络让餐桌延伸到街道和屏幕。',
  },
];

const sceneThreeSteps = [
  {
    kicker: '第三幕',
    title: '丰盛之后，浪费成为新问题',
    body: '新的问题不再是有没有食物，而是如何更合理地消费食物。剩饭背后不仅是食物本身，也包括土地、水、能源和劳动。',
  },
  {
    kicker: '代价',
    title: '不同食物的碳足迹差异很大',
    body: '同样是一公斤食物，不同类别的碳排放、用水和土地占用并不相同。高碳食物需要被看见，低碳选择也需要被理解。',
  },
  {
    kicker: '未来',
    title: '走向负责任的餐桌',
    body: '丰盛不是故事的终点，责任才是下一阶段的餐桌文明。一张餐桌连接着土地、水、能源、劳动与未来。',
  },
];
</script>

<template>
  <main>
    <Hero />

    <SceneTitle
      eyebrow="Scene 01"
      title="吃得饱"
      subtitle="中国人首先解决的是“有没有饭吃”的问题。粮食安全，是餐桌故事最沉稳的开端。"
      image="/assets/hero-table-grain.png"
    />
    <ScrollSection id="enough" tone="field" :steps="sceneOneSteps">
      <template #visual="{ activeStep, scrollProgress }">
        <div class="scene-grid scene-grid--grain">
          <GrainLineChart :active-step="activeStep" :progress="scrollProgress" />
          <GrainBarnVisual :active-step="activeStep" :progress="scrollProgress" />
          <StapleShareDonut :active-step="activeStep" :progress="scrollProgress" />
          <GrainTimeAxis :progress="scrollProgress" />
        </div>
      </template>
    </ScrollSection>

    <TechSection />

    <SceneTitle
      eyebrow="Scene 02"
      title="吃得好"
      subtitle="当温饱问题逐渐退场，餐桌从单一走向丰富，吃饭的场景也从厨房延伸到城市网络。"
      image="/assets/scene-rich-table.png"
    />
    <ScrollSection id="better" tone="table" :steps="sceneTwoSteps">
      <template #visual="{ activeStep }">
        <div class="scene-grid scene-grid--diet">
          <PlateComparison :active-step="activeStep" />
          <DietStackedAreaChart v-if="activeStep < 2" :active-step="activeStep" />
          <TakeoutGrowthChart v-else :active-step="activeStep" />
          <DietDiversityChart :active-step="activeStep" />
        </div>
      </template>
    </ScrollSection>

    <SceneTitle
      eyebrow="Scene 03"
      title="吃得负责"
      subtitle="食物变得丰富之后，餐桌开始面对浪费、碳足迹与可持续消费的新命题。"
      image="/assets/scene-responsible-table.png"
    />
    <ScrollSection id="responsible" tone="future" :steps="sceneThreeSteps">
      <template #visual="{ activeStep }">
        <div class="scene-grid scene-grid--responsible">
          <FoodWasteFlow v-if="activeStep === 0" :active-step="activeStep" />
          <CarbonBarChart v-else-if="activeStep === 1" :active-step="activeStep" />
          <ResponsiblePlate v-else :active-step="activeStep" />
          <FoodWasteTrendChart v-if="activeStep !== 1" :active-step="activeStep" />
          <CarbonBubbleChart v-else :active-step="activeStep" />
        </div>
      </template>
    </ScrollSection>

    <FinalSection />
  </main>
</template>
