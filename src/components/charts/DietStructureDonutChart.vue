<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import {
  dietStructureMacros,
  dietStructureSnapshots,
} from '../../data/dietConsumptionData.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 1080;
  const height = 620;
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  let lockedKey = null;
  const positions = [
    { x: 250, y: 226 },
    { x: 786, y: 226 },
    { x: 250, y: 488 },
    { x: 786, y: 488 },
  ];
  const pie = d3.pie().sort(null).value((item) => item.value).padAngle(0.012);
  const arc = d3.arc().innerRadius(54).outerRadius(100).cornerRadius(4);
  const arcLabel = d3.arc().innerRadius(77).outerRadius(77);
  const prepared = dietStructureSnapshots.map((snapshot, index) => {
    const values = dietStructureMacros.map((macro) => ({
      ...macro,
      value: d3.sum(macro.detailKeys, (key) => snapshot[key]),
    }));
    const total = d3.sum(values, (item) => item.value);
    return { ...snapshot, ...positions[index], total, values: values.map((item) => ({ ...item, share: (item.value / total) * 100 })) };
  });

  svg.append('text').attr('class', 'chart-title').attr('x', 54).attr('y', 30)
    .text('四个餐盘快照：从主食集中，到更多类别共同构成');
  svg.append('text').attr('class', 'chart-note').attr('x', 54).attr('y', 54)
    .text('九类食物归并为四个大类。悬停可同步比较，点击扇区可锁定同类高亮。');
  svg.on('click', () => {
    lockedKey = null;
    reset();
  });
  svg.append('text').attr('x', 518).attr('y', 96).attr('text-anchor', 'end')
    .attr('fill', theme.ink).attr('font-size', '1rem').attr('font-weight', 800).text('1990 年');
  svg.append('text').attr('x', 562).attr('y', 96).attr('text-anchor', 'start')
    .attr('fill', theme.ink).attr('font-size', '1rem').attr('font-weight', 800).text('2024 年');
  svg.append('text').attr('x', 74).attr('y', 230).attr('fill', theme.inkSoft).attr('font-size', '1rem').attr('font-weight', 800).text('城镇');
  svg.append('text').attr('x', 74).attr('y', 492).attr('fill', theme.inkSoft).attr('font-size', '1rem').attr('font-weight', 800).text('农村');
  svg.append('line').attr('x1', 540).attr('x2', 540).attr('y1', 106).attr('y2', 574).attr('stroke', theme.grid).attr('stroke-dasharray', '4 7');
  svg.append('line').attr('x1', 102).attr('x2', 1008).attr('y1', 356).attr('y2', 356).attr('stroke', theme.grid).attr('stroke-dasharray', '4 7');

  const units = svg.selectAll('g.donut-unit').data(prepared).join('g')
    .attr('class', 'donut-unit').attr('transform', (item) => `translate(${item.x},${item.y})`);
  units.append('text').attr('y', -118).attr('text-anchor', 'middle')
    .attr('fill', theme.ink).attr('font-size', '0.96rem').attr('font-weight', 800)
    .text((item) => `${item.population} ${item.year}`);
  units.append('text').attr('y', -8).attr('text-anchor', 'middle')
    .attr('fill', theme.muted).attr('font-size', '0.72rem').text('总量');
  units.append('text').attr('y', 15).attr('text-anchor', 'middle')
    .attr('fill', theme.ink).attr('font-size', '1.12rem').attr('font-weight', 800)
    .text((item) => item.total.toFixed(0));
  units.append('text').attr('y', 35).attr('text-anchor', 'middle')
    .attr('fill', theme.muted).attr('font-size', '0.7rem').text('kg / 人');

  units.each(function (snapshot) {
    const group = d3.select(this);
    const arcs = pie(snapshot.values).map((item) => ({ ...item, snapshot }));
    group.selectAll('path.donut-slice').data(arcs).join('path')
      .attr('class', 'donut-slice').attr('data-macro', (item) => item.data.key)
      .attr('fill', (item) => item.data.color).attr('stroke', theme.paper).attr('stroke-width', 3)
      .attr('d', arc)
      .on('mouseenter', (_, item) => highlight(item.data.key))
      .on('mousemove', (event, item) => {
        highlight(item.data.key);
        showTooltip(tooltip, event, tooltipHtml(snapshot, item));
      })
      .on('mouseleave', () => {
        if (!lockedKey) reset();
      })
      .on('click', (event, item) => {
        event.stopPropagation();
        lockedKey = lockedKey === item.data.key ? null : item.data.key;
        if (lockedKey) {
          highlight(lockedKey);
          showTooltip(tooltip, event, tooltipHtml(snapshot, item));
        } else {
          reset();
        }
      });
    group.selectAll('text.arc-label').data(arcs.filter((item) => item.data.share >= 7)).join('text')
      .attr('class', 'arc-label').attr('transform', (item) => `translate(${arcLabel.centroid(item)})`)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('fill', theme.paper).attr('font-size', '0.72rem').attr('font-weight', 800)
      .text((item) => `${item.data.share.toFixed(0)}%`);
  });

  function highlight(key) {
    svg.selectAll('.donut-slice').attr('opacity', (item) => item.data.key === key ? 1 : 0.18)
      .attr('filter', (item) => item.data.key === key ? 'brightness(0.9) saturate(1.18)' : null);
    svg.selectAll('.macro-legend').attr('opacity', (item) => item.key === key ? 1 : 0.34);
  }
  function reset() {
    svg.selectAll('.donut-slice').attr('opacity', 1).attr('filter', null);
    svg.selectAll('.macro-legend').attr('opacity', 1);
    hideTooltip(tooltip);
  }
  function tooltipHtml(snapshot, item) {
    return `
      <strong>${snapshot.population} ${snapshot.year} · ${item.data.label}</strong><br/>
      ${item.data.value.toFixed(1)} kg / 人 / 年<br/>
      结构占比：${item.data.share.toFixed(1)}%
    `;
  }

  const legend = svg.append('g').attr('transform', 'translate(238,592)');
  dietStructureMacros.forEach((macro, index) => {
    const item = legend.append('g').datum(macro).attr('class', 'macro-legend')
      .attr('transform', `translate(${index * 176},0)`)
      .style('cursor', 'pointer')
      .on('mouseenter', () => highlight(macro.key))
      .on('mouseleave', () => {
        if (!lockedKey) reset();
      })
      .on('click', (event) => {
        event.stopPropagation();
        lockedKey = lockedKey === macro.key ? null : macro.key;
        if (lockedKey) highlight(lockedKey);
        else reset();
      });
    item.append('rect').attr('width', 14).attr('height', 14).attr('rx', 3).attr('fill', macro.color);
    item.append('text').attr('x', 22).attr('y', 12).attr('class', 'legend-text').text(macro.label);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card diet-structure-donut-chart" />
</template>

<style scoped>
.diet-structure-donut-chart {
  display: block;
  width: 100%;
  height: auto;
  min-height: 590px;
}
</style>
