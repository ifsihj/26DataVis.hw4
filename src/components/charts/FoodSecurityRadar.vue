<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { selfSufficiency, perCapitaGrain, agriTechnology, arableLand } from '../../data/scene1Data.js';
import { clearSvg } from '../../utils/chartUtils.js';

const svgRef = ref(null);

function draw() {
  const width = 420;
  const height = 380;
  const svg = clearSvg(svgRef, width, height);

  const ss = selfSufficiency[selfSufficiency.length - 1];
  const pc = perCapitaGrain[perCapitaGrain.length - 1];
  const land = arableLand[arableLand.length - 1];
  const tech = agriTechnology[agriTechnology.length - 1];

  const categories = ['口粮自给', '人均占有', '亩产水平', '耕地保障', '科技支撑'];
  const maxValue = 100;

  const series = [
    {
      key: 'cn', label: '中国', color: '#9E6B6B',
      values: [
        Math.round((ss.rice + ss.wheat) / 2),
        Math.round(Math.min(100, pc.per_capita_kg / 500 * 100)),
        Math.round(Math.min(100, tech.yield_per_mu / 400 * 100)),
        Math.round(land.total_land_yi_mu / 20 * 100),
        Math.round(Math.min(100, (tech.patents || 2600) / 4500 * 100)),
      ],
    },
    {
      key: 'world', label: '世界平均', color: '#7B8B8B',
      values: [80, 70, 60, 70, 50],
    },
  ];

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 40;

  const angleStep = (Math.PI * 2) / categories.length;
  const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

  // Background rings
  d3.range(20, 101, 20).forEach(l => {
    const r = rScale(l);
    svg.append('circle')
      .attr('cx', cx).attr('cy', cy)
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', '#E2DCD0')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', l === 100 ? '0' : '3,3');
  });

  // Category axes
  categories.forEach((cat, i) => {
    const angle = -Math.PI / 2 + angleStep * i;
    const x = cx + rScale(100) * Math.cos(angle);
    const y = cy + rScale(100) * Math.sin(angle);
    svg.append('line')
      .attr('x1', cx).attr('y1', cy)
      .attr('x2', x).attr('y2', y)
      .attr('stroke', '#E2DCD0').attr('stroke-width', 0.5);
    const labelR = rScale(115);
    svg.append('text')
      .attr('x', cx + labelR * Math.cos(angle))
      .attr('y', cy + labelR * Math.sin(angle))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '0.7rem').attr('fill', '#4A4A4A')
      .text(cat);
  });

  // Data series
  const lineGen = d3.lineRadial()
    .angle((d, i) => angleStep * i - Math.PI / 2)
    .radius(d => rScale(d))
    .curve(d3.curveLinearClosed);

  series.forEach(s => {
    svg.append('path')
      .datum(s.values)
      .attr('d', lineGen)
      .attr('transform', `translate(${cx},${cy})`)
      .attr('fill', s.color).attr('fill-opacity', 0.15)
      .attr('stroke', s.color).attr('stroke-width', 1.5);

    s.values.forEach((v, i) => {
      const angle = -Math.PI / 2 + angleStep * i;
      const px = cx + rScale(v) * Math.cos(angle);
      const py = cy + rScale(v) * Math.sin(angle);
      svg.append('circle')
        .attr('cx', px).attr('cy', py)
        .attr('r', 3).attr('fill', s.color);
    });
  });

  // Legend
  const lg = svg.append('g')
    .attr('transform', `translate(${cx - radius}, ${cy + radius + 24})`);
  series.forEach((s, i) => {
    const g = lg.append('g').attr('transform', `translate(${i * 120}, 0)`);
    g.append('rect').attr('width', 10).attr('height', 10)
      .attr('fill', s.color).attr('rx', 1);
    g.append('text').attr('x', 14).attr('y', 9)
      .attr('font-size', '0.7rem').attr('fill', '#4A4A4A').text(s.label);
  });
}

onMounted(draw);
</script>

<template>
  <svg ref="svgRef" class="chart-card" />
</template>
