<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { dietCategoryLabels, dietStructureData } from '../../data/dietStructureData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);

const categories = [
  { key: 'grain', label: '谷物主食', color: '#b88446' },
  { key: 'meat', label: '肉类', color: '#8f2f24' },
  { key: 'vegetables', label: '蔬菜', color: '#4f7b4b' },
  { key: 'fruit', label: '水果', color: '#d08a43' },
  { key: 'aquatic', label: '水产品', color: '#4c7b82' },
  { key: 'egg', label: '蛋类', color: '#c46b3c' },
  { key: 'dairy', label: '奶类', color: '#e5c46a' },
  { key: 'oil', label: '油脂', color: '#7a5b3a' },
];

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 52, right: 90, bottom: 36, left: 80 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const year1980 = dietStructureData[0];
  const year2023 = dietStructureData[dietStructureData.length - 1];

  // Sort by 2023 value descending
  const sorted = [...categories].sort((a, b) => year2023[b.key] - year2023[a.key]);

  const barHeight = 30;
  const gap = 4;
  const groupGap = 12;
  const groupHeight = barHeight * 2 + gap + groupGap;
  const innerHeight = sorted.length * groupHeight;

  // Manually set the SVG height so everything fits
  d3.select(svgRef.value).attr('height', Math.max(height, innerHeight + margin.top + margin.bottom));

  const xMax = 70;
  const x = d3.scaleLinear().domain([0, xMax]).range([0, width - margin.left - margin.right]);

  const title = svg.append('text')
    .attr('x', margin.left)
    .attr('y', 26)
    .attr('class', 'chart-title')
    .text('1980 → 2023：中国人的餐盘发生了什么变化');

  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 46)
    .attr('class', 'chart-note')
    .text('谷物比例大幅下降，肉、水产、奶类、水果占比显著上升');

  // Top axis
  const xAxis = d3.axisTop(x).ticks(7).tickFormat((d) => `${d}%`);
  svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .call(xAxis);

  sorted.forEach((cat, i) => {
    const yPos = margin.top + 14 + i * groupHeight;
    const v1980 = year1980[cat.key];
    const v2023 = year2023[cat.key];

    // Category label
    svg.append('text')
      .attr('x', margin.left - 12)
      .attr('y', yPos + barHeight)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '13px')
      .attr('fill', '#5a4a3a')
      .attr('font-weight', '600')
      .text(cat.label);

    // 1980 bar
    const show = props.activeStep >= 0;
    if (show) {
      svg.append('rect')
        .attr('x', margin.left)
        .attr('y', yPos)
        .attr('width', x(v1980))
        .attr('height', barHeight)
        .attr('rx', 4)
        .attr('fill', cat.color)
        .attr('opacity', 0.5)
        .on('mousemove', (event) => showTooltip(tooltip, event, `<strong>${cat.label} 1980</strong><br/>占比：${v1980}%`))
        .on('mouseleave', () => hideTooltip(tooltip));

      svg.append('text')
        .attr('x', margin.left + x(v1980) + 6)
        .attr('y', yPos + barHeight / 2)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#8f7a66')
        .attr('font-weight', '500')
        .text(`${v1980}%`);
    }

    // 2023 bar
    const show2023 = props.activeStep >= 0;
    if (show2023) {
      svg.append('rect')
        .attr('x', margin.left)
        .attr('y', yPos + barHeight + gap)
        .attr('width', x(v2023))
        .attr('height', barHeight)
        .attr('rx', 4)
        .attr('fill', cat.color)
        .attr('opacity', 1)
        .on('mousemove', (event) => showTooltip(tooltip, event, `<strong>${cat.label} 2023</strong><br/>占比：${v2023}%`))
        .on('mouseleave', () => hideTooltip(tooltip));

      svg.append('text')
        .attr('x', margin.left + x(v2023) + 6)
        .attr('y', yPos + barHeight + gap + barHeight / 2)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#2d241a')
        .attr('font-weight', '700')
        .text(`${v2023}%`);
    }
  });

  // Legend
  const legend = svg.append('g')
    .attr('transform', `translate(${margin.left},${innerHeight + margin.top + 20})`);

  const legendItems = [
    { label: '1980 年', opacity: 0.5 },
    { label: '2023 年', opacity: 1 },
  ];

  legendItems.forEach((item, i) => {
    const lx = i * 140;
    legend.append('rect')
      .attr('x', lx)
      .attr('y', 0)
      .attr('width', 14)
      .attr('height', 14)
      .attr('rx', 3)
      .attr('fill', '#8f2f24')
      .attr('opacity', item.opacity);
    legend.append('text')
      .attr('x', lx + 20)
      .attr('y', 12)
      .attr('font-size', '13px')
      .attr('fill', '#5a4a3a')
      .text(item.label);
  });
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" style="height: auto; min-height: 360px" />
</template>
