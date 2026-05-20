<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { grainData } from '../../data/grainData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 560;
  const height = 320;
  const margin = { top: 46, right: 26, bottom: 46, left: 62 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const x = d3.scaleBand().domain(grainData.map((d) => d.year)).range([margin.left, width - margin.right]).padding(0.28);
  const y = d3.scaleLinear().domain([0, d3.max(grainData, (d) => d.grainProduction)]).nice().range([height - margin.bottom, margin.top]);

  svg.append('text').attr('x', margin.left).attr('y', 24).attr('class', 'chart-title').text('粮食总产量增长');
  svg.append('text').attr('x', margin.left).attr('y', 42).attr('class', 'chart-note').text('mock data：万吨');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickValues(grainData.filter((_, i) => i % 2 === 0).map((d) => d.year)));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d / 10000}亿`));

  svg
    .selectAll('rect')
    .data(grainData)
    .join('rect')
    .attr('x', (d) => x(d.year))
    .attr('y', (d) => y(d.grainProduction))
    .attr('width', x.bandwidth())
    .attr('height', (d) => y(0) - y(d.grainProduction))
    .attr('rx', 5)
    .attr('fill', chartColors.grain)
    .attr('opacity', 0.86)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year}</strong><br/>粮食总产量：${d.grainProduction} 万吨<br/>人均粮食：${d.grainPerCapita} kg`))
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card insight-chart" />
</template>
