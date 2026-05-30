<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { keyEvents } from '../../data/scene1Data.js';
import { clearSvg } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 760;
  const height = 300;
  const margin = { top: 12, right: 24, bottom: 12, left: 24 };
  const svg = clearSvg(svgRef, width, height);

  // 选取关键事件
  const keyYears = [1949, 1958, 1973, 1978, 1982, 1996, 2003, 2006, 2013, 2020, 2025];
  const events = keyEvents.filter(e => keyYears.includes(e.year));

  const shortLabels = {
    '新中国成立': '新中国成立',
    '人民公社化': '人民公社化',
    '杂交稻突破': '杂交稻突破',
    '改革开放': '改革开放',
    '家庭联产承包责任制': '联产承包',
    '粮食总产突破5亿吨': '总产破5亿吨',
    '粮食产量低谷': '产量低谷',
    '取消农业税': '取消农业税',
    '人均粮食突破450kg': '人均>450kg',
    '全面小康': '全面小康',
    '粮食产量创新高': '产量创新高',
  };

  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const years = events.map(e => e.year);
  const x = d3.scaleLinear().domain(d3.extent(years)).range([30, w - 30]);
  const midY = h / 2;

  // Center line
  g.append('line')
    .attr('x1', 0).attr('y1', midY)
    .attr('x2', w).attr('y2', midY)
    .attr('stroke', '#D4C9C3').attr('stroke-width', 1.5);

  events.forEach((ev, i) => {
    const px = x(ev.year);
    const side = i % 2 === 0 ? -1 : 1;
    const gap = 8 + Math.floor(i / 2) % 2 * 12; // alternate spacing
    const tickLen = 18 + gap;

    // Tick line
    g.append('line')
      .attr('x1', px).attr('y1', midY + side * 4)
      .attr('x2', px).attr('y2', midY + side * tickLen)
      .attr('stroke', '#C4B8B0').attr('stroke-width', 0.7);

    // Dot
    g.append('circle')
      .attr('cx', px).attr('cy', midY)
      .attr('r', 4.5)
      .attr('fill', '#9E6B6B').attr('stroke', '#fff').attr('stroke-width', 1.5);

    // Year label
    g.append('text')
      .attr('x', px).attr('y', midY + side * tickLen + side * 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '0.6rem')
      .attr('fill', '#9E6B6B').attr('font-weight', 700)
      .attr('font-family', 'Roboto Mono, monospace')
      .text(ev.year);

    // Event label
    const label = shortLabels[ev.label] || ev.label.slice(0, 6);
    g.append('text')
      .attr('x', px).attr('y', midY - side * tickLen + side * 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', '0.6rem').attr('fill', '#4A4A4A')
      .text(label);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
