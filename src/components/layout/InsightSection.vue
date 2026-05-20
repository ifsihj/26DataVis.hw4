<script setup>
import GrainProductionBarChart from '../charts/GrainProductionBarChart.vue';
import DietHeatmap from '../charts/DietHeatmap.vue';
import CarbonResourceMatrix from '../charts/CarbonResourceMatrix.vue';
</script>

<template>
  <section class="insight-section">
    <div class="insight-section__header">
      <p class="eyebrow">More Data Views</p>
      <h2>补充视角：把餐桌放进更多坐标里</h2>
      <p>这些图表作为主线叙事之外的补充，帮助队友后续继续替换真实数据、扩展分析角度。</p>
    </div>
    <div class="insight-grid">
      <GrainProductionBarChart />
      <DietHeatmap />
      <CarbonResourceMatrix />
    </div>
  </section>
</template>
