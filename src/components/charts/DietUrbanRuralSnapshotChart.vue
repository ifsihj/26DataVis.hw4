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

function drawPanel(svg, tooltip, { title, keys, x, y, originX, originY, plotW }) {
  const urban = urbanDietConsumption.at(-1);
  const rural = ruralDietConsumption.at(-1);
  const panel = svg.append('g').attr('transform', `translate(${originX},${originY})`);
  panel.append('text').attr('x', 0).attr('y', -28).attr('fill', theme.ink).attr('font-size', '1rem').attr('font-weight', 800).text(title);
  const axis = panel.append('g').attr('transform', `translate(0,${y.range()[1] + 18})`)
    .call(d3.axisBottom(x).ticks(5));
  styleChartAxis(axis);
  panel.append('text').attr('x', plotW / 2).attr('y', y.range()[1] + 62)
    .attr('text-anchor', 'middle').attr('fill', theme.muted).attr('font-size', '0.86rem').attr('font-weight', 700)
    .text('2024 年消费量（kg / 人 / 年）');

  const rows = keys.map((key) => ({
    ...dietConsumptionCategories.find((item) => item.key === key),
    urban: urban[key],
    rural: rural[key],
  }));
  const row = panel.selectAll('g.snapshot-row').data(rows).join('g')
    .attr('class', 'snapshot-row').attr('transform', (item) => `translate(0,${y(item.label)})`);
  row.append('line').attr('x1', (item) => x(item.urban)).attr('x2', (item) => x(item.rural))
    .attr('y1', y.bandwidth() / 2).attr('y2', y.bandwidth() / 2)
    .attr('stroke', theme.neutral).attr('stroke-width', 2);
  row.append('circle').attr('cx', (item) => x(item.urban)).attr('cy', y.bandwidth() / 2).attr('r', 6)
    .attr('fill', theme.signal).attr('stroke', theme.paper).attr('stroke-width', 2);
  row.append('circle').attr('cx', (item) => x(item.rural)).attr('cy', y.bandwidth() / 2).attr('r', 6)
    .attr('fill', theme.positive).attr('stroke', theme.paper).attr('stroke-width', 2);
  row.append('text').attr('x', -14).attr('y', y.bandwidth() / 2 + 5).attr('text-anchor', 'end')
    .attr('fill', theme.inkSoft).attr('font-size', '0.88rem').attr('font-weight', 700).text((item) => item.label);
  row.append('rect').attr('width', plotW).attr('height', y.bandwidth()).attr('fill', 'transparent')
    .on('mousemove', (event, item) => showTooltip(tooltip, event, `
      <strong>${item.label} · 2024</strong><br/>
      城镇：${item.urban.toFixed(1)} kg / 人 / 年<br/>
      农村：${item.rural.toFixed(1)} kg / 人 / 年<br/>
      农村 / 城镇：${((item.rural / item.urban) * 100).toFixed(0)}%
    `))
    .on('mouseleave', () => hideTooltip(tooltip));
}

function draw() {
  const width = 1080;
  const height = 514;
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  svg.append('text').attr('class', 'chart-title').attr('x', 42).attr('y', 30)
    .text('2024 年城乡对照：分开量级后，差距与接近程度都更清楚');
  svg.append('text').attr('class', 'chart-note').attr('x', 42).attr('y', 54)
    .text('左图展示大宗类别，右图放大多样化食品。红棕点为城镇，绿色点为农村。');
  drawPanel(svg, tooltip, {
    title: '大宗食物',
    keys: ['staple', 'vegetables', 'fruit'],
    x: d3.scaleLinear().domain([0, 170]).range([0, 360]),
    y: d3.scaleBand().domain(['主食类', '蔬菜类', '水果坚果']).range([0, 238]).padding(0.42),
    originX: 154,
    originY: 130,
    plotW: 360,
  });
  drawPanel(svg, tooltip, {
    title: '多样化食品',
    keys: ['pork', 'redMeat', 'poultry', 'aquatic', 'dairy', 'condiments'],
    x: d3.scaleLinear().domain([0, 46]).range([0, 360]),
    y: d3.scaleBand().domain(['猪肉', '牛羊肉', '禽肉', '水产品', '蛋奶类', '油脂糖盐']).range([0, 238]).padding(0.34),
    originX: 674,
    originY: 130,
    plotW: 360,
  });
  const legend = svg.append('g').attr('transform', 'translate(790,28)');
  [
    { label: '城镇', color: theme.signal },
    { label: '农村', color: theme.positive },
  ].forEach((item, index) => {
    const group = legend.append('g').attr('transform', `translate(${index * 104},0)`);
    group.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 6).attr('fill', item.color);
    group.append('text').attr('x', 18).attr('y', 11).attr('class', 'legend-text').text(item.label);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card diet-snapshot-chart" />
</template>

<style scoped>
.diet-snapshot-chart {
  display: block;
  width: 100%;
  height: auto;
  min-height: 480px;
}
</style>
