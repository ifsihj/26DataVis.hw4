<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { foodWasteData } from '../../data/foodWasteData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
});

const svgRef = ref(null);

function draw() {
  const width = 420;
  const height = 250;
  const margin = { top: 42, right: 36, bottom: 42, left: 52 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const data = props.activeStep === 0 ? foodWasteData.slice(0, 4) : foodWasteData;
  const x = d3.scaleLinear().domain(d3.extent(foodWasteData, (d) => d.year)).range([margin.left, width - margin.right]);
  const yWaste = d3.scaleLinear().domain([45, 92]).range([height - margin.bottom, margin.top]);
  const yAwareness = d3.scaleLinear().domain([0, 90]).range([height - margin.bottom, margin.top]);
  const wasteLine = d3.line().x((d) => x(d.year)).y((d) => yWaste(d.wasteAmount)).curve(d3.curveMonotoneX);
  const awarenessLine = d3.line().x((d) => x(d.year)).y((d) => yAwareness(d.campaignAwareness)).curve(d3.curveMonotoneX);

  svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('浪费与光盘意识');
  svg.append('text').attr('x', margin.left).attr('y', 38).attr('class', 'chart-note').text('浪费量与行动认知同时被看见');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(5));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yWaste).ticks(4));
  svg.append('path').datum(data).attr('fill', 'none').attr('stroke', chartColors.red).attr('stroke-width', 3).attr('d', wasteLine);
  svg.append('path').datum(data).attr('fill', 'none').attr('stroke', chartColors.green).attr('stroke-width', 3).attr('stroke-dasharray', '6 6').attr('d', awarenessLine);
  svg
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => x(d.year))
    .attr('cy', (d) => yWaste(d.wasteAmount))
    .attr('r', 4)
    .attr('fill', chartColors.red)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year}</strong><br/>浪费量：${d.wasteAmount} 百万吨<br/>人均浪费：${d.perCapitaWaste} kg<br/>行动认知：${d.campaignAwareness}%`))
    .on('mouseleave', () => hideTooltip(tooltip));

  svg.append('text').attr('x', width - 150).attr('y', 58).attr('class', 'legend-text').text('红：浪费量  绿：行动认知');
}

onMounted(draw);
watch(() => props.activeStep, draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card mini-chart" />
</template>
