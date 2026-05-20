<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { carbonFootprintData } from '../../data/carbonFootprintData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

defineProps({
  activeStep: { type: Number, default: 0 },
});

const svgRef = ref(null);

function draw() {
  const width = 420;
  const height = 250;
  const margin = { top: 42, right: 28, bottom: 44, left: 52 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const x = d3.scaleLinear().domain([0, 38]).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([0, 30]).range([height - margin.bottom, margin.top]);
  const r = d3.scaleSqrt().domain([0, d3.max(carbonFootprintData, (d) => d.consumption)]).range([5, 20]);

  svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('碳足迹、蛋白质与消费量');
  svg.append('text').attr('x', margin.left).attr('y', 38).attr('class', 'chart-note').text('横轴碳排放，纵轴蛋白质，气泡表示消费量');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).ticks(5));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(4));

  svg
    .selectAll('circle')
    .data(carbonFootprintData)
    .join('circle')
    .attr('cx', (d) => x(d.carbonKgPerKg))
    .attr('cy', (d) => y(d.protein))
    .attr('r', (d) => r(d.consumption))
    .attr('fill', (d) => (d.category === '动物性' ? chartColors.red : chartColors.green))
    .attr('opacity', 0.68)
    .attr('stroke', '#fff9ed')
    .attr('stroke-width', 1.5)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.food}</strong><br/>碳排放：${d.carbonKgPerKg} kg CO2e/kg<br/>蛋白质：${d.protein} g/100g<br/>消费量：${d.consumption}`))
    .on('mouseleave', () => hideTooltip(tooltip));

  svg
    .selectAll('.bubble-label')
    .data(carbonFootprintData.filter((d) => ['牛肉', '猪肉', '谷物', '蔬菜'].includes(d.food)))
    .join('text')
    .attr('class', 'legend-text')
    .attr('x', (d) => x(d.carbonKgPerKg) + 8)
    .attr('y', (d) => y(d.protein) - 7)
    .text((d) => d.food);
}

onMounted(draw);
watch(() => carbonFootprintData, draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card mini-chart" />
</template>
