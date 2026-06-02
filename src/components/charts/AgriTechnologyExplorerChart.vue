<script setup>
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { agriTechnology } from '../../data/scene1Data.js';
import {
  clearSvg,
  createTooltip,
  evidenceChartTheme as theme,
  hideTooltip,
  showTooltip,
  styleChartAxis,
} from '../../utils/chartUtils.js';

const props = defineProps({
  metrics: {
    type: Array,
    default: () => ['yield_per_mu', 'hybrid_rice_pct', 'patents', 'papers'],
  },
});

const svgRef = ref(null);
const metricInfo = {
  yield_per_mu: { label: '粮食亩产', unit: 'kg / 亩', color: theme.positive },
  hybrid_rice_pct: { label: '杂交稻覆盖率', unit: '%', color: theme.accent },
  patents: { label: '农业专利', unit: '项', color: theme.signal },
  papers: { label: '农业论文', unit: '篇', color: theme.series[3] },
};

function normalizeMetric(metric) {
  const rows = agriTechnology.filter(item => Number.isFinite(item[metric]));
  const baseline = rows[0]?.[metric] || 1;
  return rows.map(item => ({ ...item, indexValue: (item[metric] / baseline) * 100 }));
}

function draw() {
  const width = 760;
  const height = 430;
  const margin = { top: 82, right: 84, bottom: 52, left: 72 };
  const svg = clearSvg(svgRef, width, height)
    .attr('aria-label', '农业科技驱动指标标准化趋势图');
  const tooltip = createTooltip();
  const metrics = props.metrics.length ? props.metrics : ['yield_per_mu'];
  const series = metrics.map(metric => ({ metric, rows: normalizeMetric(metric) }));

  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('科技积累与单产提升并行发生');

  svg.append('text')
    .attr('x', margin.left).attr('y', 42)
    .attr('class', 'chart-note')
    .text('各序列以首个有效年份 = 100 标准化 · 对数轴 · 悬停查看原始量');

  const x = d3.scaleLinear()
    .domain(d3.extent(agriTechnology, item => item.year))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLog()
    .domain([90, d3.max(series, item => d3.max(item.rows, row => row.indexValue)) * 1.12])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickValues([1950, 1970, 1990, 2010, 2025]).tickFormat(d3.format('d')));
  styleChartAxis(xAxis);

  const yAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5, '~g'));
  styleChartAxis(yAxis);

  svg.append('text')
    .attr('x', margin.left - 48).attr('y', margin.top - 18)
    .attr('fill', theme.muted).attr('font-size', '0.78rem')
    .text('指数 · 对数轴');

  const line = d3.line()
    .x(item => x(item.year))
    .y(item => y(item.indexValue))
    .curve(d3.curveMonotoneX);

  series.forEach(({ metric, rows }) => {
    svg.append('path')
      .datum(rows)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', metricInfo[metric].color)
      .attr('stroke-width', 2.5);
  });

  const endpointLabels = series
    .map(({ metric, rows }) => {
      const last = rows[rows.length - 1];
      return { metric, last, labelY: y(last.indexValue) };
    })
    .sort((a, b) => a.labelY - b.labelY);

  endpointLabels.forEach((item, index) => {
    if (index && item.labelY - endpointLabels[index - 1].labelY < 16) {
      item.labelY = endpointLabels[index - 1].labelY + 16;
    }
  });

  endpointLabels.forEach(({ metric, last, labelY }) => {
    svg.append('line')
      .attr('x1', x(last.year) + 2)
      .attr('x2', x(last.year) + 7)
      .attr('y1', y(last.indexValue))
      .attr('y2', labelY)
      .attr('stroke', metricInfo[metric].color)
      .attr('stroke-width', 1);

    svg.append('text')
      .attr('x', x(last.year) + 7)
      .attr('y', labelY)
      .attr('dominant-baseline', 'middle')
      .attr('fill', metricInfo[metric].color)
      .attr('font-size', '0.76rem')
      .attr('font-weight', 800)
      .text(metricInfo[metric].label);
  });

  const guide = svg.append('line')
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom)
    .attr('stroke', theme.signal)
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
      const item = agriTechnology.reduce((best, candidate) =>
        Math.abs(candidate.year - targetYear) < Math.abs(best.year - targetYear) ? candidate : best
      );
      guide.attr('x1', x(item.year)).attr('x2', x(item.year)).attr('opacity', 0.5);
      const lines = metrics
        .map(metric => {
          const value = item[metric];
          return Number.isFinite(value)
            ? `<div>${metricInfo[metric].label}：<strong>${value.toLocaleString()} ${metricInfo[metric].unit}</strong></div>`
            : '';
        })
        .join('');
      showTooltip(tooltip, event, `<strong>${item.year} 年</strong>${lines}`);
    })
    .on('mouseleave', () => {
      guide.attr('opacity', 0);
      hideTooltip(tooltip);
    });
}

onMounted(draw);
watch(() => props.metrics, draw, { deep: true });
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
