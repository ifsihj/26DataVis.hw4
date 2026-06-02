<script setup>
import { foodWasteData } from '../../data/foodWasteData.js';

const latest = foodWasteData[foodWasteData.length - 1];
</script>

<template>
  <div class="flow-card chart-card">
    <div class="flow-card__header">
      <p class="chart-title">食物浪费并不是孤立的一端</p>
      <p class="chart-note">mock data：2023 年浪费量约 {{ latest.wasteAmount }} 百万吨，人均 {{ latest.perCapitaWaste }} kg</p>
    </div>
    <div class="flow-row">
      <div class="flow-node">生产<br /><span>土地 / 水 / 能源</span></div>
      <div class="flow-arrow" />
      <div class="flow-node">运输<br /><span>冷链 / 油耗</span></div>
      <div class="flow-arrow" />
      <div class="flow-node">消费<br /><span>家庭 / 餐饮 / 外卖</span></div>
      <div class="flow-arrow flow-arrow--loss" />
      <div class="flow-node flow-node--loss">浪费<br /><span>资源投入被一并损失</span></div>
    </div>
    <div class="waste-icons" aria-label="剩饭图标阵列">
      <span v-for="index in 28" :key="index" :class="{ 'is-dim': index % 4 === 0 }">●</span>
    </div>
  </div>
</template>
