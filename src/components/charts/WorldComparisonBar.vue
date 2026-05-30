<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { worldComparison } from '../../data/scene1Data.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 760;
  const height = 380;
  const margin = { top: 42, right: 24, bottom: 60, left: 56 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const data = worldComparison;

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('全球人均粮食占有量对比');

  svg.append('text')
    .attr('x', margin.left).attr('y', 40)
    .attr('class', 'chart-note')
    .text('2023年截面数据 · 单位：kg/年');

  const x = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.per_capita_kg) * 1.12])
    .range([height - margin.bottom, margin.top]);

  // Grid
  svg.append('g')
    .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat('').ticks(5))
    .selectAll('.tick line').attr('stroke', '#E2DCD0').attr('stroke-dasharray', '2,3');

  // Axes
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .attr('transform', 'rotate(-25)').attr('text-anchor', 'end')
    .attr('dx', '-0.5em').attr('dy', '0.2em')
    .attr('font-size', '0.7rem');

  svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + 'kg'));

  // FAO safety line
  svg.append('line')
    .attr('x1', margin.left).attr('y1', y(400))
    .attr('x2', width - margin.right).attr('y2', y(400))
    .attr('stroke', '#7B8B8B').attr('stroke-dasharray', '6,4').attr('stroke-width', 0.8);

  // Bars
  svg.selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('x', d => x(d.country))
    .attr('y', d => y(d.per_capita_kg))
    .attr('width', x.bandwidth())
    .attr('height', d => y(0) - y(d.per_capita_kg))
    .attr('fill', d => d.country === '中国' ? '#9E6B6B' : '#D4C9C3')
    .attr('rx', 2)
    .on('mousemove', function(ev, d) {
      d3.select(this).attr('opacity', 0.8);
      showTooltip(tooltip, ev, `<strong>${d.country}</strong> &nbsp; ${d.per_capita_kg} kg`);
    })
    .on('mouseleave', function() {
      d3.select(this).attr('opacity', 1);
      hideTooltip(tooltip);
    });

  // Value labels
  svg.selectAll('.bar-label')
    .data(data)
    .join('text')
    .attr('x', d => x(d.country) + x.bandwidth() / 2)
    .attr('y', d => y(d.per_capita_kg) - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '0.6rem')
    .attr('fill', '#666')
    .attr('font-family', 'Roboto Mono, monospace')
    .text(d => d.per_capita_kg);
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
