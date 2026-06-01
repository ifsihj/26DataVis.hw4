<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { grainOutput, perCapitaGrain } from '../../data/scene1Data.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);

const currentYear = computed(() => {
  const minYear = perCapitaGrain[0].year;
  const maxYear = perCapitaGrain[perCapitaGrain.length - 1].year;
  return minYear + (maxYear - minYear) * props.progress;
});

function interpolatePerCapita(year) {
  const index = d3.bisector(item => item.year).right(perCapitaGrain, year);
  if (index <= 0) return perCapitaGrain[0].per_capita_kg;
  if (index >= perCapitaGrain.length) return perCapitaGrain[perCapitaGrain.length - 1].per_capita_kg;
  const prev = perCapitaGrain[index - 1];
  const next = perCapitaGrain[index];
  const t = (year - prev.year) / (next.year - prev.year);
  return prev.per_capita_kg + (next.per_capita_kg - prev.per_capita_kg) * t;
}

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 56, right: 104, bottom: 52, left: 70 };
  const svg = clearSvg(svgRef, width, height)
    .attr('aria-label', '1949 至 2025 年中国人均粮食占有量折线图');
  const tooltip = createTooltip();
  const year = Math.round(currentYear.value);
  const visibleData = perCapitaGrain.filter(item => item.year <= year);

  const x = d3.scaleLinear()
    .domain(d3.extent(perCapitaGrain, item => item.year))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([180, 540])
    .range([height - margin.bottom, margin.top]);

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('人均粮食占有量跨过安全线');

  svg.append('text')
    .attr('x', margin.left).attr('y', 41)
    .attr('class', 'chart-note')
    .text('1949–2025 · kg / 人 / 年 · 虚线为 FAO 400 kg 参考线');

  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues([1950, 1970, 1990, 2010, 2025])
      .tickFormat(d3.format('d')));
  styleChartAxis(xAxis);

  const yAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)
      .tickValues([200, 300, 400, 500])
      .tickFormat(value => `${value}`));
  styleChartAxis(yAxis);

  svg.append('text')
    .attr('x', margin.left - 48).attr('y', margin.top - 18)
    .attr('fill', theme.muted).attr('font-size', '0.68rem')
    .text('kg / 人 / 年');

  svg.append('line')
    .attr('x1', margin.left).attr('y1', y(400))
    .attr('x2', width - margin.right).attr('y2', y(400))
    .attr('stroke', theme.positive)
    .attr('stroke-dasharray', '6,4')
    .attr('stroke-width', 1.2)
    .attr('opacity', 0.74);

  svg.append('text')
    .attr('x', width - margin.right).attr('y', y(400) - 8)
    .attr('text-anchor', 'end')
    .attr('fill', theme.positive)
    .attr('font-size', '0.68rem')
    .attr('font-weight', 700)
    .text('FAO 参考线 400 kg');

  const line = d3.line()
    .x(item => x(item.year))
    .y(item => y(item.per_capita_kg))
    .curve(d3.curveMonotoneX);

  svg.append('path')
    .datum(visibleData)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', theme.signal)
    .attr('stroke-width', 2.8);

  const first = visibleData[0];
  if (first) {
    svg.append('text')
      .attr('x', x(first.year) + 8)
      .attr('y', y(first.per_capita_kg) + 18)
      .attr('fill', theme.inkSoft)
      .attr('font-size', '0.7rem')
      .text(`${first.year} · ${Math.round(first.per_capita_kg)} kg`);
  }

  const firstSafe = perCapitaGrain.find(item => item.per_capita_kg >= 400);
  if (firstSafe && firstSafe.year <= year) {
    svg.append('circle')
      .attr('cx', x(firstSafe.year)).attr('cy', y(firstSafe.per_capita_kg))
      .attr('r', 4.5)
      .attr('fill', theme.paper)
      .attr('stroke', theme.positive)
      .attr('stroke-width', 2);

    svg.append('text')
      .attr('x', x(firstSafe.year) + 8)
      .attr('y', y(firstSafe.per_capita_kg) - 11)
      .attr('fill', theme.positive)
      .attr('font-size', '0.68rem')
      .attr('font-weight', 700)
      .text(`${firstSafe.year} · 首次越过参考线`);
  }

  const currentValue = interpolatePerCapita(year);
  svg.append('circle')
    .attr('cx', x(year)).attr('cy', y(currentValue))
    .attr('r', 5.5)
    .attr('fill', theme.paper)
    .attr('stroke', theme.signal)
    .attr('stroke-width', 2.4);

  svg.append('text')
    .attr('x', Math.min(x(year) + 10, width - 96))
    .attr('y', y(currentValue) - 13)
    .attr('fill', theme.signal)
    .attr('font-size', '0.76rem')
    .attr('font-weight', 800)
    .text(`${year} · ${Math.round(currentValue)} kg`);

  svg.selectAll('.per-capita-hit')
    .data(visibleData)
    .join('circle')
    .attr('class', 'per-capita-hit')
    .attr('cx', item => x(item.year))
    .attr('cy', item => y(item.per_capita_kg))
    .attr('r', 7)
    .attr('fill', 'transparent')
    .on('mousemove', (event, item) => {
      const total = grainOutput.find(row => row.year === item.year);
      showTooltip(
        tooltip,
        event,
        `<strong>${item.year} 年</strong><br/>
         人均粮食：${item.per_capita_kg} kg / 人 / 年<br/>
         粮食总产：${total ? Math.round(total.total).toLocaleString() : '—'} 万吨`,
      );
    })
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
