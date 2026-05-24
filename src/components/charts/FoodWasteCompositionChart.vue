<script setup>
import { computed, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { foodWasteCompositionData } from '../../data/foodWasteCompositionData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

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
    .text('浪费数量及构成');

  svg.append('text')
    .attr('class', 'chart-note')
    .attr('x', margin.left)
    .attr('y', 48)
    .text('按浪费数量（蓝色柱）降序排列；橙色点表示人均每餐浪费量。');

  g.append('g')
    .call(d3.axisLeft(yLeft).ticks(5).tickSize(-innerW).tickFormat(''))
    .selectAll('line')
    .attr('stroke', 'rgba(45,36,26,0.09)');

  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('text')
    .attr('fill', 'var(--ink-soft)')
    .attr('font-size', '0.82rem')
    .attr('font-weight', 700)
    .attr('text-anchor', 'end')
    .attr('dx', '-0.45em')
    .attr('dy', '0.75em')
    .attr('transform', 'rotate(-38)');

  g.append('g')
    .call(d3.axisLeft(yLeft).ticks(5))
    .selectAll('text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.78rem');

  g.append('g')
    .attr('transform', `translate(${innerW},0)`)
    .call(d3.axisRight(yRight).ticks(5))
    .selectAll('text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.78rem');

  g.selectAll('.domain').attr('stroke', 'var(--line)');

  svg.append('text')
    .attr('x', 22)
    .attr('y', margin.top + innerH / 2)
    .attr('transform', `rotate(-90, 22, ${margin.top + innerH / 2})`)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.85rem')
    .attr('font-weight', 700)
    .attr('text-anchor', 'middle')
    .text('食物浪费数量（百万吨）');

  svg.append('text')
    .attr('x', width - 22)
    .attr('y', margin.top + innerH / 2)
    .attr('transform', `rotate(90, ${width - 22}, ${margin.top + innerH / 2})`)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.85rem')
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
    .attr('fill', '#2f6eb8')
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
    .attr('fill', '#f28c28')
    .attr('stroke', '#fff9ed')
    .attr('stroke-width', 3)
    .on('mousemove', (event, d) => {
      showTooltip(tooltip, event, `
        <strong>${d.category}</strong><br/>
        人均每餐浪费量：${d.perMealGram.toFixed(1)} 克<br/>
        蓝色柱排序值：${d.wasteQuantityMt.toFixed(2)} 百万吨
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
    .attr('fill', '#2f5f95')
    .attr('font-size', '0.72rem')
    .attr('font-weight', 800)
    .attr('opacity', 0)
    .text((d) => d.wasteQuantityMt.toFixed(2))
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
    .attr('fill', '#2f6eb8');
  legend.append('text')
    .attr('x', 22)
    .attr('y', 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.82rem')
    .text('食物浪费数量（百万吨）');

  legend.append('circle')
    .attr('cx', 216)
    .attr('cy', 7)
    .attr('r', 7)
    .attr('fill', '#f28c28');
  legend.append('text')
    .attr('x', 230)
    .attr('y', 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.82rem')
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
