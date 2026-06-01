<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { agriTechnology } from '../../data/scene1Data.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);

function paddedExtent(values, padding) {
  const [min, max] = d3.extent(values);
  return [Math.max(0, min - padding), max + padding];
}

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 62, right: 116, bottom: 46, left: 70 };
  const upper = { top: 72, bottom: 226 };
  const lower = { top: 286, bottom: 362 };
  const svg = clearSvg(svgRef, width, height)
    .attr('aria-label', '1949 至 2025 年粮食亩产与杂交稻覆盖率趋势图');
  const tooltip = createTooltip();

  const x = d3.scaleLinear()
    .domain(d3.extent(agriTechnology, item => item.year))
    .range([margin.left, width - margin.right]);

  const yYield = d3.scaleLinear()
    .domain(paddedExtent(agriTechnology.map(item => item.yield_per_mu), 22))
    .nice()
    .range([upper.bottom, upper.top]);

  const yHybrid = d3.scaleLinear()
    .domain(paddedExtent(agriTechnology.map(item => item.hybrid_rice_pct), 5))
    .nice()
    .range([lower.bottom, lower.top]);

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('有限土地上的增量，更依赖单产提升');

  svg.append('text')
    .attr('x', margin.left).attr('y', 41)
    .attr('class', 'chart-note')
    .text('1949–2025 · 趋势估算序列 · 上下图共享时间轴');

  svg.append('text')
    .attr('x', margin.left).attr('y', upper.top - 13)
    .attr('fill', theme.inkSoft)
    .attr('font-size', '0.68rem')
    .attr('font-weight', 800)
    .text('a  粮食亩产（kg / 亩）');

  svg.append('text')
    .attr('x', margin.left).attr('y', lower.top - 13)
    .attr('fill', theme.inkSoft)
    .attr('font-size', '0.68rem')
    .attr('font-weight', 800)
    .text('b  杂交稻覆盖率（%）');

  const yieldAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yYield).ticks(4));
  styleChartAxis(yieldAxis);

  const hybridAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yHybrid).ticks(3));
  styleChartAxis(hybridAxis);

  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${lower.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues([1950, 1970, 1990, 2010, 2025])
      .tickFormat(d3.format('d')));
  styleChartAxis(xAxis);

  const yieldLine = d3.line()
    .x(item => x(item.year))
    .y(item => yYield(item.yield_per_mu))
    .curve(d3.curveMonotoneX);

  const hybridLine = d3.line()
    .x(item => x(item.year))
    .y(item => yHybrid(item.hybrid_rice_pct))
    .curve(d3.curveMonotoneX);

  svg.append('path')
    .datum(agriTechnology)
    .attr('d', yieldLine)
    .attr('fill', 'none')
    .attr('stroke', theme.positive)
    .attr('stroke-width', 2.7);

  svg.append('path')
    .datum(agriTechnology)
    .attr('d', hybridLine)
    .attr('fill', 'none')
    .attr('stroke', theme.accent)
    .attr('stroke-width', 2.5);

  const sampled = agriTechnology.filter((_, index) => index % 5 === 0 || index === agriTechnology.length - 1);

  svg.selectAll('.yield-dot')
    .data(sampled)
    .join('circle')
    .attr('class', 'yield-dot')
    .attr('cx', item => x(item.year))
    .attr('cy', item => yYield(item.yield_per_mu))
    .attr('r', 3.3)
    .attr('fill', theme.paper)
    .attr('stroke', theme.positive)
    .attr('stroke-width', 1.6);

  svg.selectAll('.hybrid-dot')
    .data(sampled)
    .join('circle')
    .attr('class', 'hybrid-dot')
    .attr('cx', item => x(item.year))
    .attr('cy', item => yHybrid(item.hybrid_rice_pct))
    .attr('r', 3.3)
    .attr('fill', theme.paper)
    .attr('stroke', theme.accent)
    .attr('stroke-width', 1.6);

  const last = agriTechnology[agriTechnology.length - 1];

  svg.append('text')
    .attr('x', x(last.year) + 8)
    .attr('y', yYield(last.yield_per_mu))
    .attr('dominant-baseline', 'middle')
    .attr('fill', theme.positive)
    .attr('font-size', '0.7rem')
    .attr('font-weight', 800)
    .text(`${last.yield_per_mu} kg / 亩`);

  svg.append('text')
    .attr('x', x(last.year) + 8)
    .attr('y', yHybrid(last.hybrid_rice_pct))
    .attr('dominant-baseline', 'middle')
    .attr('fill', theme.inkSoft)
    .attr('font-size', '0.7rem')
    .attr('font-weight', 800)
    .text(`${last.hybrid_rice_pct}%`);

  const guide = svg.append('line')
    .attr('y1', upper.top)
    .attr('y2', lower.bottom)
    .attr('stroke', theme.signal)
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('opacity', 0);

  svg.append('rect')
    .attr('x', margin.left)
    .attr('y', upper.top)
    .attr('width', width - margin.left - margin.right)
    .attr('height', lower.bottom - upper.top)
    .attr('fill', 'transparent')
    .on('mousemove', function(event) {
      const [pointerX] = d3.pointer(event, svg.node());
      const targetYear = Math.round(x.invert(pointerX));
      const item = agriTechnology.reduce((best, candidate) =>
        Math.abs(candidate.year - targetYear) < Math.abs(best.year - targetYear) ? candidate : best
      );
      guide.attr('x1', x(item.year)).attr('x2', x(item.year)).attr('opacity', 0.5);
      showTooltip(
        tooltip,
        event,
        `<strong>${item.year} 年</strong><br/>
         亩产：${item.yield_per_mu} kg / 亩<br/>
         杂交稻覆盖率：${item.hybrid_rice_pct}%<br/>
         <span>注：趋势估算序列</span>`,
      );
    })
    .on('mouseleave', () => {
      guide.attr('opacity', 0);
      hideTooltip(tooltip);
    });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
