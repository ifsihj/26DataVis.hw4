<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { takeoutData } from '../../data/takeoutData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 2 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 52, right: 60, bottom: 48, left: 72 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const x = d3.scaleBand()
    .domain(takeoutData.map((d) => String(d.year)))
    .range([margin.left, width - margin.right])
    .padding(0.25);

  const y = d3.scaleLinear()
    .domain([0, d3.max(takeoutData, (d) => d.orderCount) * 1.12])
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleSequential(d3.interpolateOrRd)
    .domain([0, takeoutData.length - 1]);

  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 26)
    .attr('class', 'chart-title')
    .text('外卖订单量增长（2011—2023）');

  svg.append('text')
    .attr('x', margin.left)
    .attr('y', 46)
    .attr('class', 'chart-note')
    .text('从 2.1 亿单到 214.5 亿单，十余年间增长超过 100 倍');

  // Bars
  svg.selectAll('rect')
    .data(takeoutData)
    .join('rect')
    .attr('x', (d) => x(String(d.year)))
    .attr('y', (d) => y(d.orderCount))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - margin.bottom - y(d.orderCount))
    .attr('rx', 4)
    .attr('fill', (d, i) => color(i))
    .attr('opacity', 0.88)
    .on('mousemove', (event, d) => showTooltip(tooltip, event,
      `<strong>${d.year} 年</strong><br/>订单量：${d.orderCount} 亿单<br/>用户规模：${d.users} 亿人`))
    .on('mouseleave', () => hideTooltip(tooltip));

  // Value labels on top of each bar
  svg.selectAll('.bar-label')
    .data(takeoutData)
    .join('text')
    .attr('class', 'bar-label')
    .attr('x', (d) => x(String(d.year)) + x.bandwidth() / 2)
    .attr('y', (d) => y(d.orderCount) - 8)
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('fill', '#5a4a3a')
    .text((d) => `${d.orderCount}亿`);

  // Axes
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6));

  // The last bar highlight annotation
  const last = takeoutData[takeoutData.length - 1];
  svg.append('text')
    .attr('x', x(String(last.year)) + x.bandwidth() / 2)
    .attr('y', y(last.orderCount) - 28)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', '700')
    .attr('fill', '#8f2f24')
    .text('2023 年');
  svg.append('text')
    .attr('x', x(String(last.year)) + x.bandwidth() / 2)
    .attr('y', y(last.orderCount) - 14)
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('fill', '#8f7a66')
    .text('214.5 亿单 / 6.22 亿用户');

  // Mini summary card at bottom
  const summaryY = height - margin.bottom + 32;
  const summaryBg = svg.append('rect')
    .attr('x', margin.left)
    .attr('y', summaryY)
    .attr('width', width - margin.left - margin.right)
    .attr('height', 44)
    .attr('rx', 6)
    .attr('fill', 'rgba(49,95,73,0.08)')
    .attr('stroke', 'rgba(49,95,73,0.15)')
    .attr('stroke-width', 1);

  const summaryText = svg.append('text')
    .attr('x', margin.left + 16)
    .attr('y', summaryY + 26)
    .attr('font-size', '13px')
    .attr('fill', '#5a4a3a')
    .text('2023 年市场规模：约 8,430 亿元  ·  平台用户规模：6.22 亿人');
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
