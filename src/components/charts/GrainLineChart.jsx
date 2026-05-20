import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { grainData } from '../../data/grainData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

function GrainLineChart({ activeStep }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 760;
    const height = 420;
    const margin = { top: 34, right: 42, bottom: 48, left: 64 };
    const svg = clearSvg(svgRef, width, height);
    const tooltip = createTooltip();

    const x = d3.scaleLinear().domain(d3.extent(grainData, (d) => d.year)).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([280, 520]).range([height - margin.bottom, margin.top]);
    const areaY = d3.scaleLinear().domain([30000, 72000]).range([height - margin.bottom, margin.top]);
    const visibleCount = activeStep === 0 ? 3 : activeStep === 1 ? 8 : grainData.length;
    const visibleData = grainData.slice(0, visibleCount);

    svg.append('text').attr('x', margin.left).attr('y', 20).attr('class', 'chart-title').text('人均粮食占有量与粮食总产量');
    svg.append('text').attr('x', margin.left).attr('y', 40).attr('class', 'chart-note').text('mock data：人均粮食占有量 kg/人，面积表示总产量');

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6));
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5));

    const area = d3
      .area()
      .x((d) => x(d.year))
      .y0(height - margin.bottom)
      .y1((d) => areaY(d.grainProduction))
      .curve(d3.curveMonotoneX);

    svg.append('path').datum(visibleData).attr('class', 'area-fill').attr('d', area);

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.grainPerCapita))
      .curve(d3.curveMonotoneX);

    const path = svg.append('path').datum(visibleData).attr('class', 'grain-line').attr('d', line);
    const length = path.node()?.getTotalLength() ?? 0;
    path.attr('stroke-dasharray', `${length} ${length}`).attr('stroke-dashoffset', length).transition().duration(900).attr('stroke-dashoffset', 0);

    svg
      .selectAll('.grain-dot')
      .data(visibleData)
      .join('circle')
      .attr('class', 'grain-dot')
      .attr('cx', (d) => x(d.year))
      .attr('cy', (d) => y(d.grainPerCapita))
      .attr('r', 4.5)
      .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year}</strong><br/>人均粮食：${d.grainPerCapita} kg<br/>总产量：${d.grainProduction} 万吨<br/>主食占比：${d.stapleShare}%`))
      .on('mouseleave', () => hideTooltip(tooltip));

    const annotations = [
      { year: 1990, label: '温饱基础逐渐稳固' },
      { year: 2015, label: '粮仓更充盈，餐桌开始转向丰富' },
      { year: 2023, label: '粮食安全成为现代餐桌底座' },
    ].filter((item) => visibleData.some((d) => d.year === item.year));

    svg
      .selectAll('.annotation')
      .data(annotations)
      .join('text')
      .attr('class', 'annotation')
      .attr('x', (d) => x(d.year) + 10)
      .attr('y', (d) => y(grainData.find((row) => row.year === d.year).grainPerCapita) - 14)
      .text((d) => d.label);
  }, [activeStep]);

  return <svg ref={svgRef} className="chart-card" />;
}

export default GrainLineChart;
