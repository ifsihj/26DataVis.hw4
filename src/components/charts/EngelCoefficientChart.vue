<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { engelCoefficientData } from '../../data/dietConsumptionData.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 1080;
  const height = 430;
  const margin = { top: 72, right: 92, bottom: 62, left: 72 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const x = d3.scaleLinear().domain([1978, 2024]).range([0, innerW]);
  const y = d3.scaleLinear().domain([25, 70]).range([innerH, 0]);
  const colors = { urban: theme.signal, rural: theme.positive };
  const labels = { urban: '城镇', rural: '农村' };
  const segments = [
    engelCoefficientData.filter((item) => item.year <= 2009),
    engelCoefficientData.filter((item) => item.year >= 2018),
  ];
  const plot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('text').attr('class', 'chart-title').attr('x', margin.left).attr('y', 30)
    .text('恩格尔系数下降，为更丰富的餐桌释放空间');
  svg.append('text').attr('class', 'chart-note').attr('x', margin.left).attr('y', 54)
    .text('食品支出占消费支出的比重长期下降；2010-2017 年无观测值，虚线仅连接缺口两端。');

  const xAxis = plot.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickValues([1978, 1990, 2000, 2009, 2018, 2024]).tickFormat(d3.format('d')));
  const yAxis = plot.append('g').call(d3.axisLeft(y).tickValues([30, 40, 50, 60, 70]).tickFormat((value) => `${value}%`));
  styleChartAxis(xAxis);
  styleChartAxis(yAxis);

  const line = (key) => d3.line().x((item) => x(item.year)).y((item) => y(item[key])).curve(d3.curveMonotoneX);
  ['urban', 'rural'].forEach((key) => {
    segments.forEach((segment) => {
      plot.append('path').datum(segment).attr('fill', 'none').attr('stroke', colors[key])
        .attr('stroke-width', 3).attr('stroke-linecap', 'round').attr('d', line(key));
    });
    plot.append('line')
      .attr('x1', x(2009)).attr('x2', x(2018))
      .attr('y1', y(engelCoefficientData.find((item) => item.year === 2009)[key]))
      .attr('y2', y(engelCoefficientData.find((item) => item.year === 2018)[key]))
      .attr('stroke', colors[key]).attr('stroke-width', 2).attr('stroke-dasharray', '6 6').attr('opacity', 0.72);
    plot.selectAll(`circle.engel-${key}`).data(engelCoefficientData).join('circle')
      .attr('class', `engel-${key}`)
      .attr('cx', (item) => x(item.year)).attr('cy', (item) => y(item[key]))
      .attr('r', (item) => item.year === 1978 || item.year === 2024 ? 4.4 : 2.6)
      .attr('fill', theme.paper).attr('stroke', colors[key]).attr('stroke-width', 1.8)
      .on('mousemove', (event, item) => showTooltip(tooltip, event, `
        <strong>${item.year} 年 · 恩格尔系数</strong><br/>
        城镇：${item.urban.toFixed(1)}%<br/>
        农村：${item.rural.toFixed(1)}%
      `))
      .on('mouseleave', () => hideTooltip(tooltip));
    const last = engelCoefficientData.at(-1);
    plot.append('text').attr('x', x(last.year) + 10).attr('y', y(last[key]) + (key === 'urban' ? 4 : -8))
      .attr('fill', colors[key]).attr('font-size', '0.86rem').attr('font-weight', 800)
      .text(`${labels[key]} ${last[key].toFixed(1)}%`);
  });

  svg.append('text').attr('x', margin.left + innerW / 2).attr('y', height - 16)
    .attr('text-anchor', 'middle').attr('fill', theme.muted).attr('font-size', '0.88rem').attr('font-weight', 700)
    .text('年份');
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card engel-chart" />
</template>

<style scoped>
.engel-chart {
  display: block;
  width: 100%;
  height: auto;
  min-height: 420px;
}
</style>
