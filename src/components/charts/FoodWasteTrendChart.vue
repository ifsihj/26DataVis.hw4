<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { foodWasteData } from '../../data/foodWasteData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 760;
  const height = 400;
  const margin = { top: 42, right: 56, bottom: 46, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const x = d3.scaleLinear()
    .domain(d3.extent(foodWasteData, d => d.year))
    .range([0, innerW]);

  const yLeft = d3.scaleLinear()
    .domain([0, d3.max(foodWasteData, d => Math.max(d.wasteAmount, d.perCapitaWaste)) * 1.15])
    .range([innerH, 0]);

  const yRight = d3.scaleLinear()
    .domain([0, 100])
    .range([innerH, 0]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', margin.left)
    .attr('y', 22)
    .text('食品浪费与光盘行动认知度变化');

  svg.append('text')
    .attr('class', 'chart-note')
    .attr('x', margin.left)
    .attr('y', 40)
    .text('数据来源：模拟数据，仅用于叙事演示');

  // Grid
  g.append('g')
    .call(d3.axisLeft(yLeft).ticks(6).tickSize(-innerW).tickFormat(''))
    .selectAll('line')
    .attr('stroke', 'rgba(45,36,26,0.08)');

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6))
    .selectAll('text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.82rem');

  // Y axis (left)
  g.append('g')
    .call(d3.axisLeft(yLeft).ticks(5))
    .selectAll('text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.76rem');

  // Y axis (right)
  g.append('g')
    .attr('transform', `translate(${innerW},0)`)
    .call(d3.axisRight(yRight).ticks(5).tickFormat(d => d + '%'))
    .selectAll('text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.76rem');

  // Axis styling
  g.selectAll('.domain').attr('stroke', 'var(--line)');

  // Waste amount area fill
  const area = d3.area()
    .x(d => x(d.year))
    .y0(innerH)
    .y1(d => yLeft(d.wasteAmount))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(foodWasteData)
    .attr('d', area)
    .attr('fill', 'rgba(143, 47, 36, 0.12)');

  // Waste amount line
  const wasteLine = d3.line()
    .x(d => x(d.year))
    .y(d => yLeft(d.wasteAmount))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(foodWasteData)
    .attr('d', wasteLine)
    .attr('fill', 'none')
    .attr('stroke', '#8f2f24')
    .attr('stroke-width', 3);

  // Waste dots
  g.selectAll('.dot-waste')
    .data(foodWasteData)
    .join('circle')
    .attr('cx', d => x(d.year))
    .attr('cy', d => yLeft(d.wasteAmount))
    .attr('r', 5)
    .attr('fill', '#8f2f24')
    .attr('stroke', '#fff9ed')
    .attr('stroke-width', 2)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year} 年</strong><br/>浪费总量：${d.wasteAmount} 百万吨<br/>人均浪费：${d.perCapitaWaste} kg`))
    .on('mouseleave', () => hideTooltip(tooltip));

  // Campaign awareness line
  const awareLine = d3.line()
    .x(d => x(d.year))
    .y(d => yRight(d.campaignAwareness))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(foodWasteData)
    .attr('d', awareLine)
    .attr('fill', 'none')
    .attr('stroke', '#4a8a66')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '6 4');

  // Awareness dots
  g.selectAll('.dot-aware')
    .data(foodWasteData)
    .join('circle')
    .attr('cx', d => x(d.year))
    .attr('cy', d => yRight(d.campaignAwareness))
    .attr('r', 5)
    .attr('fill', '#4a8a66')
    .attr('stroke', '#fff9ed')
    .attr('stroke-width', 2)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year} 年</strong><br/>光盘行动认知度：${d.campaignAwareness}%`))
    .on('mouseleave', () => hideTooltip(tooltip));

  // End labels
  const last = foodWasteData[foodWasteData.length - 1];
  g.append('text')
    .attr('x', x(last.year) + 10)
    .attr('y', yLeft(last.wasteAmount) + 4)
    .attr('fill', '#8f2f24')
    .attr('font-size', '0.78rem')
    .attr('font-weight', 700)
    .text(`${last.wasteAmount} 百万吨`);

  g.append('text')
    .attr('x', x(last.year) + 10)
    .attr('y', yRight(last.campaignAwareness) + 4)
    .attr('fill', '#4a8a66')
    .attr('font-size', '0.78rem')
    .attr('font-weight', 700)
    .text(`${last.campaignAwareness}%`);

  // Legend
  const legendG = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${height - 8})`);

  legendG.append('line')
    .attr('x1', 0).attr('x2', 22).attr('y1', -4).attr('y2', -4)
    .attr('stroke', '#8f2f24').attr('stroke-width', 3);

  legendG.append('text')
    .attr('x', 28).attr('y', 0).attr('font-size', '0.78rem').attr('fill', 'var(--muted)')
    .text('食品浪费量（百万吨）');

  legendG.append('line')
    .attr('x1', 170).attr('x2', 192).attr('y1', -4).attr('y2', -4)
    .attr('stroke', '#4a8a66').attr('stroke-width', 3).attr('stroke-dasharray', '6 4');

  legendG.append('text')
    .attr('x', 198).attr('y', 0).attr('font-size', '0.78rem').attr('fill', 'var(--muted)')
    .text('光盘行动认知度');
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
