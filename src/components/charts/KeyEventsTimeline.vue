<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { keyEvents } from '../../data/scene1Data.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 1120;
  const height = 420;
  const margin = { top: 62, right: 58, bottom: 34, left: 58 };
  const svg = clearSvg(svgRef, width, height)
    .attr('aria-label', '1949 至 2023 年中国粮食安全关键历史节点时间线');
  const tooltip = createTooltip();
  const keyYears = [1949, 1958, 1973, 1978, 1982, 1996, 2003, 2006, 2013, 2020, 2023];
  const events = keyEvents.filter(item => keyYears.includes(item.year));
  const shortLabels = {
    '新中国成立': '新中国成立',
    '人民公社化': '人民公社化',
    '杂交稻突破': '杂交稻突破',
    '改革开放': '改革开放',
    '家庭联产承包责任制': '联产承包',
    '粮食总产突破5亿吨': '总产破 5 亿吨',
    '粮食产量低谷': '产量低谷',
    '取消农业税': '取消农业税',
    '人均粮食突破450kg': '人均破 450 kg',
    '全面小康': '全面小康',
    '粮食产量创新高': '产量创新高',
  };
  const phases = [
    { start: 1949, end: 1978, label: '恢复与探索', color: '#efe2cd' },
    { start: 1978, end: 2006, label: '改革与增产', color: '#e5eddc' },
    { start: 2006, end: 2023, label: '稳定与提质', color: '#f1dfd6' },
  ];

  const x = d3.scaleLinear()
    .domain([1949, 2023])
    .range([margin.left, width - margin.right]);
  const midY = 242;

  svg.append('text')
    .attr('x', margin.left).attr('y', 23)
    .attr('class', 'chart-title')
    .text('粮食安全是一条由制度、技术与生产共同推动的长线进程');

  svg.append('text')
    .attr('x', margin.left).attr('y', 43)
    .attr('class', 'chart-note')
    .text('1949–2023 · 悬停节点查看事件说明');

  phases.forEach(phase => {
    svg.append('rect')
      .attr('x', x(phase.start))
      .attr('y', 74)
      .attr('width', x(phase.end) - x(phase.start))
      .attr('height', 274)
      .attr('fill', phase.color)
      .attr('opacity', 0.58);

    svg.append('text')
      .attr('x', (x(phase.start) + x(phase.end)) / 2)
      .attr('y', 98)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.muted)
      .attr('font-size', '0.82rem')
      .attr('font-weight', 800)
      .text(phase.label);
  });

  svg.append('line')
    .attr('x1', margin.left).attr('x2', width - margin.right)
    .attr('y1', midY).attr('y2', midY)
    .attr('stroke', theme.axis)
    .attr('stroke-width', 1.2);

  events.forEach((event, index) => {
    const px = x(event.year);
    const side = index % 2 === 0 ? -1 : 1;
    const tickLength = index % 4 < 2 ? 58 : 88;
    const endY = midY + side * tickLength;
    const group = svg.append('g')
      .attr('class', 'timeline-event')
      .style('cursor', 'pointer')
      .on('mousemove', pointerEvent => {
        group.select('circle').attr('r', 8);
        showTooltip(
          tooltip,
          pointerEvent,
          `<strong>${event.year} 年 · ${event.label}</strong><br/>
           ${event.detail}`,
        );
      })
      .on('mouseleave', () => {
        group.select('circle').attr('r', 6);
        hideTooltip(tooltip);
      });

    group.append('line')
      .attr('x1', px).attr('x2', px)
      .attr('y1', midY + side * 7).attr('y2', endY)
      .attr('stroke', theme.axis)
      .attr('stroke-width', 1);

    group.append('circle')
      .attr('cx', px).attr('cy', midY)
      .attr('r', 6)
      .attr('fill', theme.signal)
      .attr('stroke', theme.paper)
      .attr('stroke-width', 2)
      .attr('class', 'timeline-node');

    group.append('text')
      .attr('x', px)
      .attr('y', endY + side * 4)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', side < 0 ? 'auto' : 'hanging')
      .attr('fill', theme.signal)
      .attr('font-size', '0.8rem')
      .attr('font-weight', 800)
      .text(event.year);

    group.append('text')
      .attr('x', px)
      .attr('y', endY + side * (side < 0 ? -18 : 22))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', side < 0 ? 'auto' : 'hanging')
      .attr('fill', theme.inkSoft)
      .attr('font-size', '0.78rem')
      .attr('font-weight', 700)
      .text(shortLabels[event.label] || event.label);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
