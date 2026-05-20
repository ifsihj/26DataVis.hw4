import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { carbonFootprintData } from '../../data/carbonFootprintData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

function CarbonBarChart() {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 760;
    const height = 430;
    const margin = { top: 38, right: 40, bottom: 48, left: 88 };
    const data = [...carbonFootprintData].sort((a, b) => a.carbonKgPerKg - b.carbonKgPerKg);
    const svg = clearSvg(svgRef, width, height);
    const tooltip = createTooltip();
    const x = d3.scaleLinear().domain([0, 40]).range([margin.left, width - margin.right]);
    const y = d3.scaleBand().domain(data.map((d) => d.food)).range([height - margin.bottom, margin.top]).padding(0.26);

    svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('不同食物单位重量碳足迹');
    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).ticks(5));
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', margin.left)
      .attr('y', (d) => y(d.food))
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .attr('rx', 6)
      .attr('fill', (d) => (d.food === '牛肉' ? chartColors.red : d.category === '动物性' ? '#b66a45' : chartColors.green))
      .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.food}</strong><br/>碳排放：${d.carbonKgPerKg} kg CO2e/kg<br/>用水：${d.waterUse} L/kg<br/>土地：${d.landUse} m2/kg<br/>蛋白质：${d.protein} g/100g`))
      .on('mouseleave', () => hideTooltip(tooltip))
      .transition()
      .duration(850)
      .attr('width', (d) => x(d.carbonKgPerKg) - margin.left);

    svg
      .selectAll('.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => x(d.carbonKgPerKg) + 8)
      .attr('y', (d) => y(d.food) + y.bandwidth() / 2 + 4)
      .text((d) => d.carbonKgPerKg);
  }, []);

  return <svg ref={svgRef} className="chart-card" />;
}

export default CarbonBarChart;
