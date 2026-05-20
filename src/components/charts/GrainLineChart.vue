<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { grainData } from '../../data/grainData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);

const currentYear = computed(() => {
  const minYear = grainData[0].year;
  const maxYear = grainData[grainData.length - 1].year;
  return minYear + (maxYear - minYear) * props.progress;
});

function interpolateByYear(year) {
  const index = d3.bisector((d) => d.year).right(grainData, year);
  if (index <= 0) return grainData[0];
  if (index >= grainData.length) return grainData[grainData.length - 1];
  const prev = grainData[index - 1];
  const next = grainData[index];
  const t = (year - prev.year) / (next.year - prev.year);

  return {
    year,
    grainPerCapita: prev.grainPerCapita + (next.grainPerCapita - prev.grainPerCapita) * t,
    grainProduction: prev.grainProduction + (next.grainProduction - prev.grainProduction) * t,
    stapleShare: prev.stapleShare + (next.stapleShare - prev.stapleShare) * t,
  };
}

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 42, right: 48, bottom: 48, left: 64 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const x = d3.scaleLinear().domain(d3.extent(grainData, (d) => d.year)).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([280, 520]).range([height - margin.bottom, margin.top]);
  const areaY = d3.scaleLinear().domain([30000, 72000]).range([height - margin.bottom, margin.top]);
  const point = interpolateByYear(currentYear.value);
  const visibleData = [
    ...grainData.filter((d) => d.year <= currentYear.value),
    point,
  ].filter((d, index, list) => index === 0 || d.year !== list[index - 1].year);

  svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('人均粮食占有量与粮食总产量');
  svg.append('text').attr('x', margin.left).attr('y', 40).attr('class', 'chart-note').text('随滚动推进年份：折线从左向右展开');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5));

  const area = d3.area().x((d) => x(d.year)).y0(height - margin.bottom).y1((d) => areaY(d.grainProduction)).curve(d3.curveMonotoneX);
  const line = d3.line().x((d) => x(d.year)).y((d) => y(d.grainPerCapita)).curve(d3.curveMonotoneX);

  svg.append('path').datum(visibleData).attr('class', 'area-fill').attr('d', area);
  svg.append('path').datum(visibleData).attr('class', 'grain-line').attr('d', line);

  svg
    .append('line')
    .attr('class', 'time-cursor')
    .attr('x1', x(point.year))
    .attr('x2', x(point.year))
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom);

  svg
    .append('circle')
    .attr('class', 'grain-dot grain-dot--active')
    .attr('cx', x(point.year))
    .attr('cy', y(point.grainPerCapita))
    .attr('r', 6);

  svg
    .append('text')
    .attr('class', 'annotation')
    .attr('x', Math.min(x(point.year) + 12, width - 170))
    .attr('y', y(point.grainPerCapita) - 16)
    .text(`${Math.round(point.year)} 年 / ${Math.round(point.grainPerCapita)} kg`);

  svg
    .selectAll('.grain-dot')
    .data(grainData.filter((d) => d.year <= currentYear.value))
    .join('circle')
    .attr('class', 'grain-dot')
    .attr('cx', (d) => x(d.year))
    .attr('cy', (d) => y(d.grainPerCapita))
    .attr('r', 4)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year}</strong><br/>人均粮食：${d.grainPerCapita} kg<br/>总产量：${d.grainProduction} 万吨<br/>主食占比：${d.stapleShare}%`))
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
