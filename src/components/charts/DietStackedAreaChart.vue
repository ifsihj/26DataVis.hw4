<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { dietCategoryLabels, dietStructureData } from '../../data/dietStructureData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);
const keys = ['grain', 'meat', 'egg', 'dairy', 'aquatic', 'vegetables', 'fruit', 'oil'];
const colors = ['#b98b4b', '#8f2f24', '#c46b3c', '#e5c46a', '#4c7b82', '#4f7b4b', '#d08a43', '#7a5b3a'];

function draw() {
  const width = 760;
  const height = 410;
  const margin = { top: 42, right: 32, bottom: 48, left: 54 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const minYear = dietStructureData[0].year;
  const maxYear = dietStructureData[dietStructureData.length - 1].year;
  const currentYear = minYear + (maxYear - minYear) * props.progress;
  const data = dietStructureData.filter((d) => d.year <= currentYear);
  const x = d3.scaleLinear().domain(d3.extent(dietStructureData, (d) => d.year)).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);
  const color = d3.scaleOrdinal(keys, colors);
  const series = d3.stack().keys(keys)(data);
  const area = d3.area().x((d) => x(d.data.year)).y0((d) => y(d[0])).y1((d) => y(d[1])).curve(d3.curveMonotoneX);

  svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('饮食结构占比变化');
  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).tickFormat((d) => `${d}%`).ticks(5));

  svg
    .selectAll('path.layer')
    .data(series)
    .join('path')
    .attr('class', 'layer')
    .attr('fill', (d) => color(d.key))
    .attr('d', area)
    .attr('opacity', (d) => (d.key === 'grain' ? 0.88 : 0.78))
    .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${dietCategoryLabels[d.key]}</strong><br/>滚动后可看到结构逐步铺开`))
    .on('mouseleave', () => hideTooltip(tooltip));

  const legend = svg.append('g').attr('transform', `translate(${margin.left},${height - 20})`);
  keys.forEach((key, index) => {
    const item = legend.append('g').attr('transform', `translate(${index * 86},0)`);
    item.append('rect').attr('width', 10).attr('height', 10).attr('fill', color(key)).attr('rx', 2);
    item.append('text').attr('x', 15).attr('y', 10).attr('class', 'legend-text').text(dietCategoryLabels[key]);
  });

  svg
    .append('text')
    .attr('class', 'annotation')
    .attr('x', x(2000))
    .attr('y', y(72))
    .text(`推进到 ${Math.round(currentYear)} 年：谷物占比下降，多样化食品上升`);
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
