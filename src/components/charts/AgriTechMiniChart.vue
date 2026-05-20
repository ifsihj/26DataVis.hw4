<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { grainData } from '../../data/grainData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
});

const svgRef = ref(null);

function draw() {
  const width = 420;
  const height = 250;
  const margin = { top: 42, right: 28, bottom: 42, left: 52 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const data = props.activeStep === 0 ? grainData.slice(0, 4) : grainData;
  const x = d3.scaleLinear().domain(d3.extent(grainData, (d) => d.year)).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([0, d3.max(grainData, (d) => d.agriPatentCount)]).nice().range([height - margin.bottom, margin.top]);
  const line = d3.line().x((d) => x(d.year)).y((d) => y(d.agriPatentCount)).curve(d3.curveMonotoneX);

  svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('农业科技积累');
  svg.append('text').attr('x', margin.left).attr('y', 38).attr('class', 'chart-note').text('专利数量 mock trend');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(5));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d / 1000}k`));
  svg.append('path').datum(data).attr('class', 'grain-line').attr('stroke', chartColors.green).attr('d', line);

  svg
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => x(d.year))
    .attr('cy', (d) => y(d.agriPatentCount))
    .attr('r', 4)
    .attr('fill', chartColors.green)
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year}</strong><br/>农业专利：${d.agriPatentCount}<br/>农业论文：${d.agriPaperCount}`))
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
watch(() => props.activeStep, draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card mini-chart" />
</template>
