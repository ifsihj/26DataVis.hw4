<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { perCapitaGrain, grainOutput } from '../../data/scene1Data.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const svgRef = ref(null);

const currentYear = computed(() => {
  const minYear = perCapitaGrain[0].year;
  const maxYear = perCapitaGrain[perCapitaGrain.length - 1].year;
  return minYear + (maxYear - minYear) * props.progress;
});

function interpolatePerCapita(year) {
  const index = d3.bisector(d => d.year).right(perCapitaGrain, year);
  if (index <= 0) return perCapitaGrain[0];
  if (index >= perCapitaGrain.length) return perCapitaGrain[perCapitaGrain.length - 1];
  const prev = perCapitaGrain[index - 1];
  const next = perCapitaGrain[index];
  const t = (year - prev.year) / (next.year - prev.year);
  return prev.per_capita_kg + (next.per_capita_kg - prev.per_capita_kg) * t;
}

function interpolateTotal(year) {
  const index = d3.bisector(d => d.year).right(grainOutput, year);
  if (index <= 0) return grainOutput[0];
  if (index >= grainOutput.length) return grainOutput[grainOutput.length - 1];
  const prev = grainOutput[index - 1];
  const next = grainOutput[index];
  const t = (year - prev.year) / (next.year - prev.year);
  return prev.total + (next.total - prev.total) * t;
}

function draw() {
  const width = 760;
  const height = 420;
  const margin = { top: 42, right: 60, bottom: 42, left: 64 };
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();

  const x = d3.scaleLinear()
    .domain(d3.extent(perCapitaGrain, d => d.year))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, 560])
    .range([height - margin.bottom, margin.top]);

  const areaY = d3.scaleLinear()
    .domain([0, 80000])
    .range([height - margin.bottom, margin.top]);

  const year = Math.round(currentYear.value);
  const visiblePC = perCapitaGrain.filter(d => d.year <= year);
  const visibleGO = grainOutput.filter(d => d.year <= year);

  // Current point
  const pcPoint = interpolatePerCapita(year);
  const totalPoint = interpolateTotal(year);

  // Title
  svg.append('text')
    .attr('x', margin.left).attr('y', 22)
    .attr('class', 'chart-title')
    .text('人均粮食占有量与粮食总产量');

  svg.append('text')
    .attr('x', margin.left).attr('y', 40)
    .attr('class', 'chart-note')
    .text('数据来源：国家统计局年度数据 (1949-2025) · 滚动推进年份');

  // Grid
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat('').ticks(6))
    .selectAll('.tick line').attr('stroke', '#E2DCD0').attr('stroke-dasharray', '2,3');

  // Axes
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(10));

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => d + 'kg'));

  // FAO 400kg safety line
  svg.append('line')
    .attr('x1', margin.left).attr('y1', y(400))
    .attr('x2', width - margin.right).attr('y2', y(400))
    .attr('stroke', '#7B8B8B').attr('stroke-dasharray', '6,4').attr('stroke-width', 0.8);

  svg.append('text')
    .attr('x', width - margin.right).attr('y', y(400) - 5)
    .attr('text-anchor', 'end')
    .attr('fill', '#7B8B8B').attr('font-size', '0.65rem')
    .attr('font-family', 'PingFang SC, sans-serif')
    .text('FAO 安全线 400kg');

  // Area (grain production)
  const area = d3.area()
    .x(d => x(d.year))
    .y0(height - margin.bottom)
    .y1(d => areaY(d.total))
    .curve(d3.curveMonotoneX);

  svg.append('path')
    .datum(visibleGO)
    .attr('d', area)
    .attr('fill', '#9E6B6B').attr('opacity', 0.15);

  // Line (per capita)
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.per_capita_kg))
    .curve(d3.curveMonotoneX);

  svg.append('path')
    .datum(visiblePC)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#9E6B6B').attr('stroke-width', 2.5);

  // Current cursor line
  svg.append('line')
    .attr('x1', x(year)).attr('x2', x(year))
    .attr('y1', margin.top).attr('y2', height - margin.bottom)
    .attr('stroke', '#8f2f24').attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

  // Current dot
  svg.append('circle')
    .attr('cx', x(year)).attr('cy', y(pcPoint))
    .attr('r', 6)
    .attr('fill', '#f7efe0').attr('stroke', '#8f2f24').attr('stroke-width', 2.5);

  // Year label
  svg.append('text')
    .attr('x', Math.min(x(year) + 12, width - 170)).attr('y', y(pcPoint) - 16)
    .attr('fill', '#315f49').attr('font-size', '0.86rem').attr('font-weight', 700)
    .text(`${year} 年 / ${Math.round(pcPoint)} kg`);

  // Data dots
  svg.selectAll('.data-dot')
    .data(visiblePC)
    .join('circle')
    .attr('class', 'data-dot')
    .attr('cx', d => x(d.year)).attr('cy', d => y(d.per_capita_kg))
    .attr('r', 4)
    .attr('fill', '#f7efe0').attr('stroke', '#9E6B6B').attr('stroke-width', 1.5)
    .on('mousemove', (event, d) => {
      const totalRow = grainOutput.find(g => g.year === d.year);
      showTooltip(tooltip, event,
        `<strong>${d.year}</strong><br/>
         人均粮食：${d.per_capita_kg} kg<br/>
         总产量：${totalRow ? Math.round(totalRow.total).toLocaleString() : '—'} 万吨`
      );
    })
    .on('mouseleave', () => hideTooltip(tooltip));
}

onMounted(draw);
watch(() => [props.activeStep, props.progress], draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
