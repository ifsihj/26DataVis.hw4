<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { grainOutput } from '../../data/scene1Data.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);

const keys = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
const labels = { rice: '稻谷', wheat: '小麦', corn: '玉米', soybean: '大豆', tubers: '薯类' };
const colors = { rice: '#A8B8A0', wheat: '#D4C9C3', corn: '#D4B8A0', soybean: '#C0B0A0', tubers: '#C4A494' };

const currentYear = computed(() => {
  const minYear = grainOutput[0].year;
  const maxYear = grainOutput[grainOutput.length - 1].year;
  return minYear + (maxYear - minYear) * props.progress;
});

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 42, right: 24, bottom: 42, left: 62 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const year = Math.round(currentYear.value);
  const visibleData = grainOutput.filter(d => d.year <= year);

  const x = d3.scaleLinear()
    .domain(d3.extent(grainOutput, d => d.year))
    .range([margin.left, width - margin.right]);

  const stacker = d3.stack().keys(keys);
  const stacked = stacker(visibleData.map(d => {
    const row = { year: d.year };
    keys.forEach(k => { row[k] = +d[k] || 0; });
    return row;
  }));

  const yMax = d3.max(stacked[stacked.length - 1], d => d[1]) * 1.03;
  const y = d3.scaleLinear().domain([0, yMax]).range([height - margin.bottom, margin.top]);

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('粮食总产量（分品种）');

  svg.append('text')
    .attr('x', margin.left).attr('y', 40)
    .attr('class', 'chart-note')
    .text('数据来源：国家统计局年度数据 (1949-2025) · 堆叠面积图');

  // Grid
  svg.append('g')
    .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat('').ticks(6))
    .selectAll('.tick line').attr('stroke', '#E2DCD0').attr('stroke-dasharray', '2,3');

  // Axes
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(10));

  svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d >= 10000 ? (d / 10000).toFixed(1) + '亿' : d + '万'));

  // Areas
  const areaGen = d3.area()
    .x(d => x(d.data.year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  svg.selectAll('.stacked-area')
    .data(stacked)
    .join('path')
    .attr('d', areaGen)
    .attr('fill', d => colors[d.key])
    .attr('opacity', 0.82);

  // Legend
  const lg = svg.append('g').attr('transform', `translate(${margin.left}, -6)`);
  let cx = 0;
  keys.forEach(k => {
    const g = lg.append('g').style('cursor', 'pointer');
    g.append('rect').attr('x', cx).attr('y', -5)
      .attr('width', 10).attr('height', 10)
      .attr('fill', colors[k]).attr('rx', 1);
    g.append('text').attr('x', cx + 14).attr('y', 3)
      .attr('font-size', '0.7rem').attr('fill', '#666')
      .text(labels[k]);
    cx += g.node().getBBox().width + 18;
  });

  // Hover
  svg.append('rect')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('fill', 'none').attr('pointer-events', 'all')
    .on('mousemove', function(ev) {
      const yr = Math.round(x.invert(d3.pointer(ev)[0] + margin.left));
      const row = grainOutput.find(d => d.year === yr);
      if (!row) return;
      const lines = keys.map(k =>
        `<div>${labels[k]}: <strong>${Math.round(row[k]).toLocaleString()}</strong> 万吨</div>`
      ).join('');
      showTooltip(tooltip, ev, `<strong>${yr} 年</strong><br>${lines}`);
    })
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
