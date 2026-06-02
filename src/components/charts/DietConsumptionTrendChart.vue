<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import {
  dietConsumptionCategories,
  ruralDietConsumption,
  urbanDietConsumption,
} from '../../data/dietConsumptionData.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);
const selectedKeys = ['staple', 'pork', 'poultry', 'aquatic', 'dairy', 'fruit'];

function draw() {
  const width = 1080;
  const height = 676;
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const panelW = 316;
  const panelH = 246;
  const gapX = 26;
  const gapY = 34;
  const startX = 54;
  const startY = 108;
  const inner = { top: 30, right: 26, bottom: 32, left: 42 };
  const urbanColor = theme.signal;
  const ruralColor = theme.positive;

  svg.append('text').attr('class', 'chart-title').attr('x', 54).attr('y', 30)
    .text('长期趋势：不同类别使用独立纵轴，变化不再被主食遮住');
  svg.append('text').attr('class', 'chart-note').attr('x', 54).attr('y', 54)
    .text('每个小图只比较同一种食物的城乡变化；2006-2012 年无观测值，虚线仅连接缺口两端。');

  const legend = svg.append('g').attr('transform', 'translate(760,24)');
  [
    { label: '城镇', color: urbanColor },
    { label: '农村', color: ruralColor },
  ].forEach((item, index) => {
    const group = legend.append('g').attr('transform', `translate(${index * 118},0)`);
    group.append('line').attr('x2', 28).attr('y1', 7).attr('y2', 7)
      .attr('stroke', item.color).attr('stroke-width', 3);
    group.append('text').attr('x', 36).attr('y', 11).attr('class', 'legend-text').text(item.label);
  });

  selectedKeys.forEach((key, index) => {
    const category = dietConsumptionCategories.find((item) => item.key === key);
    const col = index % 3;
    const row = Math.floor(index / 3);
    const originX = startX + col * (panelW + gapX);
    const originY = startY + row * (panelH + gapY);
    const panel = svg.append('g').attr('transform', `translate(${originX},${originY})`);
    const plotW = panelW - inner.left - inner.right;
    const plotH = panelH - inner.top - inner.bottom;
    const values = [...urbanDietConsumption, ...ruralDietConsumption].map((item) => item[key]);
    const extent = d3.extent(values);
    const padding = Math.max((extent[1] - extent[0]) * 0.18, extent[1] * 0.06);
    const x = d3.scaleLinear().domain([1990, 2024]).range([0, plotW]);
    const y = d3.scaleLinear().domain([Math.max(0, extent[0] - padding), extent[1] + padding]).nice().range([plotH, 0]);
    const plot = panel.append('g').attr('transform', `translate(${inner.left},${inner.top})`);
    const xAxis = plot.append('g').attr('transform', `translate(0,${plotH})`)
      .call(d3.axisBottom(x).tickValues([1990, 2005, 2013, 2024]).tickFormat(d3.format('d')).tickSize(4));
    const yAxis = plot.append('g').call(d3.axisLeft(y).ticks(3));
    styleChartAxis(xAxis);
    styleChartAxis(yAxis);
    xAxis.selectAll('text').style('font-size', '0.74rem');
    yAxis.selectAll('text').style('font-size', '0.74rem');

    panel.append('text').attr('x', inner.left).attr('y', 12)
      .attr('fill', theme.ink).attr('font-size', '0.98rem').attr('font-weight', 800)
      .text(category.label);
    panel.append('text').attr('x', panelW - 4).attr('y', 12).attr('text-anchor', 'end')
      .attr('fill', theme.muted).attr('font-size', '0.74rem').text('kg / 人 / 年');

    const drawSeries = (rows, label, color) => {
      const beforeGap = rows.filter((item) => item.year <= 2005);
      const afterGap = rows.filter((item) => item.year >= 2013);
      const line = d3.line().x((item) => x(item.year)).y((item) => y(item[key])).curve(d3.curveMonotoneX);
      [beforeGap, afterGap].forEach((part) => {
        plot.append('path').datum(part).attr('fill', 'none').attr('stroke', color)
          .attr('stroke-width', 2.5).attr('d', line);
      });
      plot.append('line')
        .attr('x1', x(2005)).attr('x2', x(2013))
        .attr('y1', y(beforeGap.at(-1)[key])).attr('y2', y(afterGap[0][key]))
        .attr('stroke', color).attr('stroke-width', 1.8).attr('stroke-dasharray', '5 5').attr('opacity', 0.7);
      plot.selectAll(`circle.${key}-${label}`)
        .data(rows)
        .join('circle')
        .attr('class', `${key}-${label}`)
        .attr('cx', (item) => x(item.year)).attr('cy', (item) => y(item[key]))
        .attr('r', (item) => item.year === 1990 || item.year === 2024 ? 4 : 2.4)
        .attr('fill', theme.paper).attr('stroke', color).attr('stroke-width', 1.7)
        .on('mousemove', (event, item) => showTooltip(tooltip, event, `
          <strong>${category.label} · ${label}</strong><br/>
          ${item.year} 年：${item[key].toFixed(1)} kg / 人 / 年
        `))
        .on('mouseleave', () => hideTooltip(tooltip));
      const last = rows.at(-1);
      plot.append('text').attr('x', x(last.year) + 6).attr('y', y(last[key]) + (label === '城镇' ? -6 : 11))
        .attr('fill', color).attr('font-size', '0.74rem').attr('font-weight', 800)
        .text(`${label[0]} ${last[key].toFixed(1)}`);
    };

    drawSeries(urbanDietConsumption, '城镇', urbanColor);
    drawSeries(ruralDietConsumption, '农村', ruralColor);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card diet-consumption-trend-chart" />
</template>

<style scoped>
.diet-consumption-trend-chart {
  display: block;
  width: 100%;
  height: auto;
  min-height: 620px;
}
</style>
