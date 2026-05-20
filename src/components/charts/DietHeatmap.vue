<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { dietCategoryLabels, dietStructureData } from '../../data/dietStructureData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);
const keys = ['grain', 'meat', 'egg', 'dairy', 'aquatic', 'vegetables', 'fruit', 'oil'];

function draw() {
  const width = 560;
  const height = 320;
  const margin = { top: 48, right: 24, bottom: 46, left: 78 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const cells = dietStructureData.flatMap((row) => keys.map((key) => ({ year: row.year, key, value: row[key] })));
  const x = d3.scaleBand().domain(dietStructureData.map((d) => d.year)).range([margin.left, width - margin.right]).padding(0.08);
  const y = d3.scaleBand().domain(keys).range([margin.top, height - margin.bottom]).padding(0.1);
  const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(cells, (d) => d.value)]);

  svg.append('text').attr('x', margin.left).attr('y', 24).attr('class', 'chart-title').text('饮食结构热力图');
  svg.append('text').attr('x', margin.left).attr('y', 42).attr('class', 'chart-note').text('颜色越深，占比越高');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickValues(dietStructureData.filter((_, i) => i % 2 === 0).map((d) => d.year)));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).tickFormat((d) => dietCategoryLabels[d]));

  svg
    .selectAll('rect')
    .data(cells)
    .join('rect')
    .attr('x', (d) => x(d.year))
    .attr('y', (d) => y(d.key))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('rx', 4)
    .attr('fill', (d) => color(d.value))
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year} / ${dietCategoryLabels[d.key]}</strong><br/>占比：${d.value}%`))
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card insight-chart" />
</template>
