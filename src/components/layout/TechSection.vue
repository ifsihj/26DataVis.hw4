<script setup>
import AgriTechMiniChart from '../charts/AgriTechMiniChart.vue';
</script>

<template>
  <section class="tech-section">
    <div class="tech-section__copy">
      <p class="eyebrow">Mechanism</p>
      <h2>粮仓背后的技术积累</h2>
      <p>
        粮食安全不是单一产量曲线的结果。育种、机械化、水利、化肥和农业科研共同构成了“吃得饱”的支撑系统。
      </p>
      <p>
        这一幕把农业专利和论文数量作为辅助指标，展示餐桌稳定背后的长期知识积累。
      </p>
    </div>
    <div class="tech-section__visual">
      <AgriTechMiniChart :active-step="2" />
    </div>
  </section>
</template>
