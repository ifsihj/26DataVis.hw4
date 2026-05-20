<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { carbonFootprintData } from '../../data/carbonFootprintData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 560;
  const height = 320;
  const margin = { top: 48, right: 26, bottom: 44, left: 82 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const foods = carbonFootprintData.map((d) => d.food);
  const metrics = [
    { key: 'carbonKgPerKg', label: '碳' },
    { key: 'waterUse', label: '水' },
    { key: 'landUse', label: '地' },
  ];
  const maxByMetric = Object.fromEntries(metrics.map((metric) => [metric.key, d3.max(carbonFootprintData, (d) => d[metric.key])]));
  const cells = carbonFootprintData.flatMap((food) => metrics.map((metric) => ({ ...metric, food: food.food, value: food[metric.key], normalized: food[metric.key] / maxByMetric[metric.key] })));
  const x = d3.scaleBand().domain(metrics.map((d) => d.label)).range([margin.left, width - margin.right]).padding(0.28);
  const y = d3.scaleBand().domain(foods).range([margin.top, height - margin.bottom]).padding(0.12);
  const color = d3.scaleSequential(d3.interpolateGreens).domain([0, 1]);

  svg.append('text').attr('x', margin.left).attr('y', 24).attr('class', 'chart-title').text('食物背后的资源代价');
  svg.append('text').attr('x', margin.left).attr('y', 42).attr('class', 'chart-note').text('碳排放、用水、土地占用标准化对比');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg
    .selectAll('circle')
    .data(cells)
    .join('circle')
    .attr('cx', (d) => x(d.label) + x.bandwidth() / 2)
    .attr('cy', (d) => y(d.food) + y.bandwidth() / 2)
    .attr('r', (d) => 5 + d.normalized * 13)
    .attr('fill', (d) => color(d.normalized))
    .attr('stroke', 'rgba(47,40,33,0.22)')
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.food} / ${d.label}</strong><br/>原始值：${d.value}`))
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card insight-chart" />
</template>
