<script setup>
const current = [
  { label: '谷物', size: 22, color: '#d2a857' },
  { label: '蔬菜水果', size: 26, color: '#4f7b4b' },
  { label: '猪牛肉', size: 34, color: '#8f2f24' },
  { label: '奶蛋水产', size: 18, color: '#4c7b82' },
];

const responsible = [
  { label: '谷物', size: 28, color: '#d2a857' },
  { label: '蔬菜水果', size: 38, color: '#4f7b4b' },
  { label: '猪牛肉', size: 14, color: '#8f2f24' },
  { label: '奶蛋水产', size: 20, color: '#4c7b82' },
];

function plateGradient(items) {
  let offset = 0;
  const gradient = items.map((item) => {
    const segment = `${item.color} ${offset}% ${offset + item.size}%`;
    offset += item.size;
    return segment;
  });
  return `conic-gradient(${gradient.join(', ')})`;
}
</script>

<template>
  <div class="responsible-card chart-card">
    <div>
      <p class="chart-title">餐盘的影子：当前选择与低碳选择</p>
      <p class="chart-note">mock scenario：减少高碳肉类、增加植物性食物，估算碳足迹下降 31%</p>
    </div>
    <div class="plate-pair">
      <div class="mini-plate-wrap">
        <div class="mini-plate" :style="{ background: plateGradient(current) }" />
        <h3>当前餐盘</h3>
        <p>5.8 kg CO2e</p>
      </div>
      <div class="mini-plate-wrap">
        <div class="mini-plate" :style="{ background: plateGradient(responsible) }" />
        <h3>更低碳餐盘</h3>
        <p>4.0 kg CO2e</p>
      </div>
    </div>
    <div class="carbon-saving">碳足迹减少 <strong>31%</strong></div>
  </div>
</template>
