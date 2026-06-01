<script setup>
import { computed, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { foodWasteCompositionData } from '../../data/foodWasteCompositionData.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);

const sortedData = computed(() =>
  [...foodWasteCompositionData].sort((a, b) => b.wasteQuantityMt - a.wasteQuantityMt),
);

function draw() {
  const width = 900;
  const height = 460;
  const margin = { top: 58, right: 86, bottom: 96, left: 72 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const data = sortedData.value;

  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const x = d3.scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, innerW])
    .padding(0.32);

  const yLeft = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.wasteQuantityMt) * 1.18])
    .nice()
    .range([innerH, 0]);

  const yRight = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.perMealGram) * 1.14])
    .nice()
    .range([innerH, 0]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', width / 2)
    .attr('y', 28)
    .attr('text-anchor', 'middle')
    .text('不同食物类别的浪费数量及构成');

  svg.append('text')
    .attr('class', 'chart-note')
    .attr('x', margin.left)
    .attr('y', 48)
    .text('红棕柱为浪费总量，按降序排列；绿色点为人均每餐浪费量。');

  const xAxis = g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickSize(0));
  styleChartAxis(xAxis);
  xAxis.selectAll('text')
    .style('fill', theme.inkSoft)
    .style('font-size', '0.92rem')
    .style('font-weight', 700)
    .attr('text-anchor', 'end')
    .attr('dx', '-0.45em')
    .attr('dy', '0.75em')
    .attr('transform', 'rotate(-38)');

  const yLeftAxis = g.append('g')
    .call(d3.axisLeft(yLeft).ticks(5));
  styleChartAxis(yLeftAxis);

  const yRightAxis = g.append('g')
    .attr('transform', `translate(${innerW},0)`)
    .call(d3.axisRight(yRight).ticks(5));
  styleChartAxis(yRightAxis);

  svg.append('text')
    .attr('x', 22)
    .attr('y', margin.top + innerH / 2)
    .attr('transform', `rotate(-90, 22, ${margin.top + innerH / 2})`)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.94rem')
    .attr('font-weight', 700)
    .attr('text-anchor', 'middle')
    .text('食物浪费数量（百万吨）');

  svg.append('text')
    .attr('x', width - 22)
    .attr('y', margin.top + innerH / 2)
    .attr('transform', `rotate(90, ${width - 22}, ${margin.top + innerH / 2})`)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.94rem')
    .attr('font-weight', 700)
    .attr('text-anchor', 'middle')
    .text('人均每餐浪费量（克）');

  g.selectAll('.composition-bar')
    .data(data)
    .join('rect')
    .attr('class', 'composition-bar')
    .attr('data-category', (d) => d.category)
    .attr('data-waste', (d) => d.wasteQuantityMt)
    .attr('x', (d) => x(d.category))
    .attr('y', innerH)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('rx', 4)
    .attr('fill', theme.signal)
    .attr('opacity', 0.84)
    .on('mousemove', (event, d) => {
      showTooltip(tooltip, event, `
        <strong>${d.category}</strong><br/>
        浪费数量：${d.wasteQuantityMt.toFixed(2)} 百万吨<br/>
        人均每餐：${d.perMealGram.toFixed(1)} 克
      `);
    })
    .on('mouseleave', () => hideTooltip(tooltip))
    .transition()
    .duration(650)
    .delay((_, i) => i * 45)
    .ease(d3.easeCubicOut)
    .attr('y', (d) => yLeft(d.wasteQuantityMt))
    .attr('height', (d) => innerH - yLeft(d.wasteQuantityMt));

  g.selectAll('.composition-dot')
    .data(data)
    .join('circle')
    .attr('class', 'composition-dot')
    .attr('cx', (d) => x(d.category) + x.bandwidth() / 2)
    .attr('cy', (d) => yRight(d.perMealGram))
    .attr('r', 0)
    .attr('fill', theme.positive)
    .attr('stroke', theme.paper)
    .attr('stroke-width', 3)
    .on('mousemove', (event, d) => {
      showTooltip(tooltip, event, `
        <strong>${d.category}</strong><br/>
        人均每餐浪费量：${d.perMealGram.toFixed(1)} 克<br/>
        红棕柱排序值：${d.wasteQuantityMt.toFixed(2)} 百万吨
      `);
    })
    .on('mouseleave', () => hideTooltip(tooltip))
    .transition()
    .duration(420)
    .delay((_, i) => 220 + i * 45)
    .attr('r', 7);

  g.selectAll('.composition-value')
    .data(data)
    .join('text')
    .attr('class', 'composition-value')
    .attr('x', (d) => x(d.category) + x.bandwidth() / 2)
    .attr('y', (d) => yLeft(d.wasteQuantityMt) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', theme.signal)
    .attr('font-size', '0.8rem')
    .attr('font-weight', 800)
    .attr('opacity', 0)
    .text((d) => `${d.wasteQuantityMt.toFixed(2)}百万吨`)
    .transition()
    .duration(360)
    .delay((_, i) => 300 + i * 45)
    .attr('opacity', 1);

  const legend = svg.append('g')
    .attr('transform', `translate(${width / 2 - 170}, ${height - 18})`);

  legend.append('rect')
    .attr('width', 14)
    .attr('height', 14)
    .attr('rx', 2)
    .attr('fill', theme.signal);
  legend.append('text')
    .attr('x', 22)
    .attr('y', 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.88rem')
    .text('食物浪费数量（百万吨）');

  legend.append('circle')
    .attr('cx', 216)
    .attr('cy', 7)
    .attr('r', 7)
    .attr('fill', theme.positive);
  legend.append('text')
    .attr('x', 230)
    .attr('y', 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.88rem')
    .text('人均每餐浪费量（克）');
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card food-waste-composition-chart" />
</template>

<style scoped>
.food-waste-composition-chart {
  grid-column: 1 / -1;
  display: block;
  width: 100%;
  max-width: 100%;
  min-height: 460px;
  height: 460px;
}
</style>
