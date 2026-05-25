<script setup>
import { computed, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { foodWasteRateData } from '../../data/foodWasteRateData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);

const sortedData = computed(() =>
  [...foodWasteRateData].sort((a, b) => b.consumptionMt - a.consumptionMt),
);

function draw() {
  const width = 900;
  const height = 480;
  const margin = { top: 64, right: 92, bottom: 102, left: 76 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const data = sortedData.value;
  let focusedCategory = data[0].category;

  const svg = clearSvg(svgRef, width, height)
    .attr('preserveAspectRatio', 'xMidYMid meet');
  const tooltip = createTooltip();

  const x = d3.scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, innerW])
    .padding(0.32);

  const yLeft = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.consumptionMt) * 1.18])
    .nice()
    .range([innerH, 0]);

  const yRight = d3.scaleLinear()
    .domain([0, 100])
    .range([innerH, 0]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', width / 2)
    .attr('y', 28)
    .attr('text-anchor', 'middle')
    .text('不同类别食物浪费率');

  svg.append('text')
    .attr('class', 'chart-note')
    .attr('x', margin.left)
    .attr('y', 50)
    .text('点击柱子或圆点锁定类别；橙色柱为食物消费量，蓝绿色点为浪费率。');

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
    .call(d3.axisRight(yRight).ticks(5).tickFormat((d) => `${d}%`))
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
    .text('食物消费量（百万吨）');

  svg.append('text')
    .attr('x', width - 24)
    .attr('y', margin.top + innerH / 2)
    .attr('transform', `rotate(90, ${width - 24}, ${margin.top + innerH / 2})`)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.85rem')
    .attr('font-weight', 700)
    .attr('text-anchor', 'middle')
    .text('食物浪费率（%）');

  const focusText = svg.append('g')
    .attr('transform', `translate(${width - 270}, 58)`);

  focusText.append('rect')
    .attr('width', 230)
    .attr('height', 60)
    .attr('rx', 8)
    .attr('fill', 'rgba(255,249,237,0.86)')
    .attr('stroke', 'rgba(45,36,26,0.12)');

  const focusTitle = focusText.append('text')
    .attr('x', 14)
    .attr('y', 24)
    .attr('fill', '#8f3328')
    .attr('font-size', '0.86rem')
    .attr('font-weight', 900);

  const focusNote = focusText.append('text')
    .attr('x', 14)
    .attr('y', 44)
    .attr('fill', 'rgba(45,36,26,0.68)')
    .attr('font-size', '0.76rem')
    .attr('font-weight', 700);

  function setFocus(category) {
    focusedCategory = category;
    const datum = data.find((d) => d.category === category);
    focusTitle.text(`当前关注：${datum.category}`);
    focusNote.text(`消费 ${datum.consumptionMt.toFixed(1)} 百万吨 / 浪费率 ${datum.wasteRate.toFixed(1)}%`);
    g.selectAll('.rate-bar')
      .attr('opacity', (d) => (d.category === focusedCategory ? 1 : 0.34))
      .attr('stroke', (d) => (d.category === focusedCategory ? '#8f3328' : 'none'))
      .attr('stroke-width', (d) => (d.category === focusedCategory ? 2 : 0));
    g.selectAll('.rate-dot')
      .attr('opacity', (d) => (d.category === focusedCategory ? 1 : 0.38))
      .attr('r', (d) => (d.category === focusedCategory ? 9 : 6.5));
    g.selectAll('.rate-value')
      .attr('opacity', (d) => (d.category === focusedCategory ? 1 : 0.48));
  }

  g.selectAll('.rate-bar')
    .data(data)
    .join('rect')
    .attr('class', 'rate-bar')
    .attr('data-category', (d) => d.category)
    .attr('x', (d) => x(d.category))
    .attr('y', innerH)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('rx', 4)
    .attr('fill', '#f28c28')
    .attr('cursor', 'pointer')
    .on('click', (_, d) => setFocus(d.category))
    .on('mousemove', (event, d) => {
      showTooltip(tooltip, event, `
        <strong>${d.category}</strong><br/>
        食物消费量：${d.consumptionMt.toFixed(1)} 百万吨<br/>
        浪费率：${d.wasteRate.toFixed(1)}%<br/>
        点击可锁定高亮
      `);
    })
    .on('mouseleave', () => hideTooltip(tooltip))
    .transition()
    .duration(650)
    .delay((_, i) => i * 45)
    .ease(d3.easeCubicOut)
    .attr('y', (d) => yLeft(d.consumptionMt))
    .attr('height', (d) => innerH - yLeft(d.consumptionMt))
    .on('end', (_, i) => {
      if (i === data.length - 1) setFocus(focusedCategory);
    });

  g.selectAll('.rate-dot')
    .data(data)
    .join('circle')
    .attr('class', 'rate-dot')
    .attr('cx', (d) => x(d.category) + x.bandwidth() / 2)
    .attr('cy', (d) => yRight(d.wasteRate))
    .attr('r', 0)
    .attr('fill', '#2f6f73')
    .attr('stroke', '#f0b13e')
    .attr('stroke-width', 2.5)
    .attr('cursor', 'pointer')
    .on('click', (_, d) => setFocus(d.category))
    .on('mousemove', (event, d) => {
      showTooltip(tooltip, event, `
        <strong>${d.category}</strong><br/>
        浪费率：${d.wasteRate.toFixed(1)}%<br/>
        食物消费量：${d.consumptionMt.toFixed(1)} 百万吨
      `);
    })
    .on('mouseleave', () => hideTooltip(tooltip))
    .transition()
    .duration(420)
    .delay((_, i) => 220 + i * 45)
    .attr('r', 7);

  g.selectAll('.rate-value')
    .data(data)
    .join('text')
    .attr('class', 'rate-value')
    .attr('x', (d) => x(d.category) + x.bandwidth() / 2)
    .attr('y', (d) => yLeft(d.consumptionMt) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', '#b85f14')
    .attr('font-size', '0.72rem')
    .attr('font-weight', 800)
    .attr('opacity', 0)
    .text((d) => `${d.consumptionMt.toFixed(d.consumptionMt >= 10 ? 0 : 1)}百万吨`)
    .transition()
    .duration(360)
    .delay((_, i) => 300 + i * 45)
    .attr('opacity', 1);

  const legend = svg.append('g')
    .attr('transform', `translate(${width / 2 - 170}, ${height - 20})`);

  legend.append('rect')
    .attr('width', 14)
    .attr('height', 14)
    .attr('rx', 2)
    .attr('fill', '#f28c28');
  legend.append('text')
    .attr('x', 22)
    .attr('y', 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.82rem')
    .text('食物消费量（百万吨）');

  legend.append('circle')
    .attr('cx', 216)
    .attr('cy', 7)
    .attr('r', 7)
    .attr('fill', '#2f6f73')
    .attr('stroke', '#f0b13e')
    .attr('stroke-width', 2.5);
  legend.append('text')
    .attr('x', 230)
    .attr('y', 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.82rem')
    .text('食物浪费率');
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card food-waste-rate-chart" />
</template>

<style scoped>
.food-waste-rate-chart {
  display: block;
  width: 100%;
  max-width: 100%;
  min-height: 480px;
  height: 480px;
}
</style>
