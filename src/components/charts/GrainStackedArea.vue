<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { grainOutput } from '../../data/scene1Data.js';
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
  mode: { type: String, default: 'absolute' },
  crop: { type: String, default: 'all' },
});

const svgRef = ref(null);
const keys = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
const labels = { rice: '稻谷', wheat: '小麦', corn: '玉米', soybean: '大豆', tubers: '薯类' };
const colors = Object.fromEntries(keys.map((key, index) => [key, theme.series[index]]));

const currentYear = computed(() => {
  const minYear = grainOutput[0].year;
  const maxYear = grainOutput[grainOutput.length - 1].year;
  return minYear + (maxYear - minYear) * props.progress;
});

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 56, right: 118, bottom: 52, left: 70 };
  const svg = clearSvg(svgRef, width, height)
    .attr('aria-label', '1949 至 2025 年中国粮食总产量分品种堆叠面积图');
  const tooltip = createTooltip();
  const year = Math.round(currentYear.value);
  const visibleData = grainOutput.filter(item => item.year <= year);
  const visibleKeys = props.crop === 'all' ? keys : keys.filter(key => key === props.crop);
  const chartData = props.mode === 'relative'
    ? visibleData.map(item => {
      const total = d3.sum(keys, key => item[key]);
      return {
        ...item,
        ...Object.fromEntries(keys.map(key => [key, (item[key] / total) * 100])),
      };
    })
    : visibleData;

  const x = d3.scaleLinear()
    .domain(d3.extent(grainOutput, item => item.year))
    .range([margin.left, width - margin.right]);

  const stacked = d3.stack().keys(visibleKeys)(chartData);
  const yMax = props.mode === 'relative'
    ? (props.crop === 'all'
      ? 100
      : d3.max(chartData, item => d3.sum(visibleKeys, key => item[key])) * 1.14)
    : d3.max(grainOutput, item => d3.sum(visibleKeys, key => item[key])) * 1.06;
  const y = d3.scaleLinear()
    .domain([0, yMax])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('粮食增产伴随着作物结构变化');

  svg.append('text')
    .attr('x', margin.left).attr('y', 41)
    .attr('class', 'chart-note')
    .text(`1949–2025 · ${props.mode === 'relative' ? '五类作物构成占比' : '万吨'} · 右侧直接标注各品种`);

  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues([1950, 1970, 1990, 2010, 2025])
      .tickFormat(d3.format('d')));
  styleChartAxis(xAxis);

  const yAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)
      .ticks(5)
      .tickFormat(value => props.mode === 'relative'
        ? `${value}%`
        : (value >= 10000 ? `${(value / 10000).toFixed(1)} 亿` : `${value}`)));
  styleChartAxis(yAxis);

  svg.append('text')
    .attr('x', margin.left - 48).attr('y', margin.top - 18)
    .attr('fill', theme.muted).attr('font-size', '0.78rem')
    .text(props.mode === 'relative' ? '占比' : '万吨');

  const area = d3.area()
    .x(item => x(item.data.year))
    .y0(item => y(item[0]))
    .y1(item => y(item[1]))
    .curve(d3.curveMonotoneX);

  svg.selectAll('.stacked-area')
    .data(stacked)
    .join('path')
    .attr('class', 'stacked-area')
    .attr('d', area)
    .attr('fill', item => colors[item.key])
    .attr('opacity', 0.82)
    .attr('stroke', theme.paper)
    .attr('stroke-width', 0.7);

  const lastVisible = chartData[chartData.length - 1];
  if (lastVisible) {
    stacked.forEach(series => {
      const point = series[series.length - 1];
      svg.append('text')
        .attr('x', x(lastVisible.year) + 9)
        .attr('y', y((point[0] + point[1]) / 2))
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors[series.key])
        .attr('font-size', '0.78rem')
        .attr('font-weight', 800)
        .text(labels[series.key]);
    });

    svg.append('text')
      .attr('x', x(lastVisible.year) - 6)
      .attr('y', y(d3.sum(keys, key => lastVisible[key])) - 10)
      .attr('text-anchor', 'end')
      .attr('fill', theme.inkSoft)
      .attr('font-size', '0.8rem')
      .attr('font-weight', 800)
      .text(props.mode === 'relative'
        ? (props.crop === 'all' ? '五类作物构成 100%' : `${labels[props.crop]}占比 ${lastVisible[props.crop].toFixed(1)}%`)
        : `${props.crop === 'all' ? '五类合计' : labels[props.crop]} ${(d3.sum(visibleKeys, key => lastVisible[key]) / 10000).toFixed(1)} 亿吨`);
  }

  const guide = svg.append('line')
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom)
    .attr('stroke', theme.signal)
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('opacity', 0);

  svg.append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr('fill', 'transparent')
    .on('mousemove', function(event) {
      const [pointerX] = d3.pointer(event, svg.node());
      const targetYear = Math.round(x.invert(pointerX));
      const row = grainOutput.find(item => item.year === targetYear);
      if (!row) return;
      guide.attr('x1', x(row.year)).attr('x2', x(row.year)).attr('opacity', 0.55);
      const total = d3.sum(keys, key => row[key]);
      const lines = visibleKeys
        .map(key => `<div>${labels[key]}：<strong>${props.mode === 'relative' ? `${((row[key] / total) * 100).toFixed(1)}%` : `${Math.round(row[key]).toLocaleString()} 万吨`}</strong></div>`)
        .join('');
      showTooltip(
        tooltip,
        event,
        `<strong>${row.year} 年</strong><br/>
         <div>粮食总产：<strong>${Math.round(row.total).toLocaleString()}</strong> 万吨</div>
         ${lines}`,
      );
    })
    .on('mouseleave', () => {
      guide.attr('opacity', 0);
      hideTooltip(tooltip);
    });
}

onMounted(draw);
watch(() => [props.activeStep, props.progress, props.mode, props.crop], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
