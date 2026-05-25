<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import {
  environmentalImpactCategories,
  foodWasteEnvironmentalImpactData,
} from '../../data/foodWasteEnvironmentalImpactData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 980;
  const height = 520;
  const margin = { top: 58, right: 34, bottom: 118, left: 92 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const barHeight = 42;

  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
  const y = d3.scaleBand()
    .domain(foodWasteEnvironmentalImpactData.map((d) => d.label))
    .range([0, innerH])
    .padding(0.28);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', width / 2)
    .attr('y', 28)
    .attr('text-anchor', 'middle')
    .text('食物浪费的环境影响');

  svg.append('text')
    .attr('class', 'chart-note')
    .attr('x', margin.left)
    .attr('y', 48)
    .text('每一行表示一种环境足迹，色块表示不同食物类别对该足迹的贡献比例。');

  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(10).tickFormat((d) => `${d}%`).tickSize(-innerH))
    .selectAll('line')
    .attr('stroke', 'rgba(45,36,26,0.08)');

  g.selectAll('.domain').attr('stroke', 'var(--line)');
  g.selectAll('.tick text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.78rem');

  g.append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll('text')
    .attr('fill', 'var(--ink)')
    .attr('font-size', '0.92rem')
    .attr('font-weight', 800);

  g.selectAll('.domain').attr('stroke', 'var(--line)');

  foodWasteEnvironmentalImpactData.forEach((row) => {
    let offset = 0;
    const segments = environmentalImpactCategories.map((category) => {
      const value = row.values[category.key] || 0;
      const segment = {
        row: row.label,
        category: category.label,
        key: category.key,
        color: category.color,
        value,
        x0: offset,
        x1: offset + value,
      };
      offset += value;
      return segment;
    });

    const rowG = g.append('g')
      .attr('transform', `translate(0,${y(row.label) + (y.bandwidth() - barHeight) / 2})`);

    rowG.selectAll('rect')
      .data(segments)
      .join('rect')
      .attr('x', (d) => x(d.x0))
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0.9)
      .on('mousemove', (event, d) => {
        showTooltip(tooltip, event, `
          <strong>${d.row}</strong><br/>
          ${d.category}：${d.value}%<br/>
          表示该类别食物浪费对这一环境足迹的占比
        `);
      })
      .on('mouseleave', () => hideTooltip(tooltip))
      .transition()
      .duration(650)
      .delay((_, i) => i * 28)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0)));

    rowG.selectAll('text')
      .data(segments.filter((d) => d.value >= 2))
      .join('text')
      .attr('x', (d) => x((d.x0 + d.x1) / 2))
      .attr('y', barHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#2d241a')
      .attr('font-size', '0.72rem')
      .attr('font-weight', 800)
      .attr('opacity', 0)
      .text((d) => `${d.value}%`)
      .transition()
      .duration(360)
      .delay(360)
      .attr('opacity', 0.76);
  });

  svg.append('text')
    .attr('x', margin.left + innerW / 2)
    .attr('y', height - 76)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.86rem')
    .attr('font-weight', 800)
    .text('各食物类别在环境足迹中的占比（%）');

  const legend = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${height - 48})`);

  environmentalImpactCategories.forEach((category, index) => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    const item = legend.append('g')
      .attr('transform', `translate(${col * 168}, ${row * 22})`);

    item.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('rx', 2)
      .attr('fill', category.color);

    item.append('text')
      .attr('x', 18)
      .attr('y', 11)
      .attr('fill', 'var(--muted)')
      .attr('font-size', '0.8rem')
      .text(category.label);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card food-waste-impact-chart" />
</template>

<style scoped>
.food-waste-impact-chart {
  grid-column: 1 / -1;
  display: block;
  width: 100%;
  max-width: 100%;
  min-height: 520px;
  height: 520px;
}
</style>
