<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { carbonFootprintData } from '../../data/carbonFootprintData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 760;
  const height = 400;
  const margin = { top: 42, right: 32, bottom: 28, left: 72 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  // Sort by carbon footprint ascending
  const sorted = [...carbonFootprintData].sort((a, b) => a.carbonKgPerKg - b.carbonKgPerKg);

  const x = d3.scaleLinear()
    .domain([0, d3.max(sorted, d => d.carbonKgPerKg) * 1.12])
    .range([0, innerW]);

  const y = d3.scaleBand()
    .domain(sorted.map(d => d.food))
    .range([0, innerH])
    .padding(0.35);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', margin.left)
    .attr('y', 22)
    .text('每千克食物碳足迹（kg CO₂ / kg）');

  // Grid lines
  g.append('g')
    .call(d3.axisTop(x).ticks(6).tickSize(-innerH).tickFormat(''))
    .selectAll('line')
    .attr('stroke', 'rgba(45,36,26,0.08)');

  // Bars
  g.selectAll('rect')
    .data(sorted)
    .join('rect')
    .attr('y', d => y(d.food))
    .attr('height', y.bandwidth())
    .attr('x', 0)
    .attr('width', 0)
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('fill', d => d.category === '植物性' ? '#4a8a66' : '#b84a3a')
    .attr('opacity', 0.85)
    .transition()
    .duration(600)
    .delay((_, i) => i * 60)
    .ease(d3.easeQuadOut)
    .attr('width', d => x(d.carbonKgPerKg));

  // Value labels on bars
  g.selectAll('.bar-val')
    .data(sorted)
    .join('text')
    .attr('class', 'bar-val')
    .attr('x', d => x(d.carbonKgPerKg) + 6)
    .attr('y', d => y(d.food) + y.bandwidth() / 2 + 5)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.78rem')
    .attr('font-weight', 700)
    .attr('opacity', 0)
    .text(d => `${d.carbonKgPerKg} kg`)
    .transition()
    .duration(400)
    .delay((_, i) => 120 + i * 60)
    .attr('opacity', 1);

  // Y axis labels
  g.append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll('text')
    .attr('fill', 'var(--ink)')
    .attr('font-size', '0.86rem')
    .attr('font-weight', 600);

  g.selectAll('.domain').attr('stroke', 'var(--line)');
  g.selectAll('.tick line').remove();

  // Interactive hover bars (full width transparent rects)
  g.selectAll('.hover-bar')
    .data(sorted)
    .join('rect')
    .attr('class', 'hover-bar')
    .attr('y', d => y(d.food))
    .attr('height', y.bandwidth())
    .attr('x', 0)
    .attr('width', innerW)
    .attr('fill', 'transparent')
    .on('mousemove', (event, d) => {
      showTooltip(tooltip, event, `
        <strong>${d.food}</strong><br/>
        碳足迹：${d.carbonKgPerKg} kg CO₂/kg<br/>
        用水量：${d.waterUse} L/kg<br/>
        土地占用：${d.landUse} m²/kg<br/>
        蛋白质：${d.protein} g/100g
      `);
    })
    .on('mouseleave', () => hideTooltip(tooltip));

  // Legend
  const legendG = svg.append('g')
    .attr('transform', `translate(${width - 200}, ${height - 28})`);

  legendG.append('circle').attr('cx', 0).attr('cy', -4).attr('r', 5).attr('fill', '#4a8a66');
  legendG.append('text').attr('x', 10).attr('y', 0).attr('font-size', '0.76rem').attr('fill', 'var(--muted)').text('植物性');

  legendG.append('circle').attr('cx', 76).attr('cy', -4).attr('r', 5).attr('fill', '#b84a3a');
  legendG.append('text').attr('x', 86).attr('y', 0).attr('font-size', '0.76rem').attr('fill', 'var(--muted)').text('动物性');
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
