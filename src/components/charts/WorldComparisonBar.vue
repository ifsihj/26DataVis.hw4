<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { worldComparison } from '../../data/scene1Data.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const svgRef = ref(null);
const props = defineProps({
  filter: { type: String, default: 'all' },
});

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 58, right: 82, bottom: 46, left: 104 };
  const svg = clearSvg(svgRef, width, height)
    .attr('aria-label', '中国与主要国家人均粮食占有量横向柱状对比图');
  const tooltip = createTooltip();
  const data = [...worldComparison]
    .filter(item => {
      if (props.filter === 'above') return item.per_capita_kg >= 400;
      if (props.filter === 'below') return item.per_capita_kg < 400;
      return true;
    })
    .sort((a, b) => b.per_capita_kg - a.per_capita_kg);

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('中国已越过安全线，但全球资源条件差异显著');

  svg.append('text')
    .attr('x', margin.left).attr('y', 41)
    .attr('class', 'chart-note')
    .text(`2023 年截面数据 · kg / 人 / 年 · ${props.filter === 'all' ? '中国高亮' : `当前显示 ${data.length} 个国家或地区`}`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, item => item.per_capita_kg) * 1.12])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleBand()
    .domain(data.map(item => item.country))
    .range([margin.top, height - margin.bottom])
    .padding(0.28);

  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues([0, 400, 800, 1200])
      .tickFormat(value => `${value}`));
  styleChartAxis(xAxis);

  const yAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0));
  styleChartAxis(yAxis, { hideDomain: true });

  svg.append('text')
    .attr('x', width - margin.right).attr('y', height - 10)
    .attr('text-anchor', 'end')
    .attr('fill', theme.muted).attr('font-size', '0.78rem')
    .text('kg / 人 / 年');

  svg.append('line')
    .attr('x1', x(400)).attr('x2', x(400))
    .attr('y1', margin.top - 2).attr('y2', height - margin.bottom)
    .attr('stroke', theme.positive)
    .attr('stroke-dasharray', '5,4')
    .attr('stroke-width', 1.1)
    .attr('opacity', 0.68);

  svg.append('text')
    .attr('x', x(400) + 6).attr('y', margin.top - 10)
    .attr('fill', theme.positive)
    .attr('font-size', '0.78rem')
    .attr('font-weight', 700)
    .text('FAO 参考线 400 kg');

  svg.selectAll('.comparison-bar')
    .data(data)
    .join('rect')
    .attr('class', 'comparison-bar')
    .attr('x', x(0))
    .attr('y', item => y(item.country))
    .attr('width', item => x(item.per_capita_kg) - x(0))
    .attr('height', y.bandwidth())
    .attr('fill', item => {
      if (item.country === '中国') return theme.signal;
      if (item.country === '世界平均') return theme.positive;
      return theme.neutral;
    })
    .attr('opacity', item => item.country === '中国' ? 1 : 0.8)
    .attr('rx', 2)
    .on('mousemove', function(event, item) {
      d3.select(this).attr('opacity', 1);
      showTooltip(
        tooltip,
        event,
        `<strong>${item.country}</strong><br/>
         人均粮食：${item.per_capita_kg} kg / 人 / 年<br/>
         自给率：${item.self_sufficiency_pct}%`,
      );
    })
    .on('mouseleave', function(event, item) {
      d3.select(this).attr('opacity', item.country === '中国' ? 1 : 0.8);
      hideTooltip(tooltip);
    });

  svg.selectAll('.comparison-label')
    .data(data)
    .join('text')
    .attr('class', 'comparison-label')
    .attr('x', item => x(item.per_capita_kg) + 6)
    .attr('y', item => y(item.country) + y.bandwidth() / 2)
    .attr('dominant-baseline', 'middle')
    .attr('fill', item => item.country === '中国' ? theme.signal : theme.inkSoft)
    .attr('font-size', '0.78rem')
    .attr('font-weight', item => item.country === '中国' ? 800 : 600)
    .text(item => `${item.per_capita_kg}`);
}

onMounted(draw);
watch(() => props.filter, draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
