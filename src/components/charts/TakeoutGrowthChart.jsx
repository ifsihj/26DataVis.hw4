import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { takeoutData } from '../../data/takeoutData.js';
import { chartColors, clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

function TakeoutGrowthChart() {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 760;
    const height = 410;
    const margin = { top: 42, right: 42, bottom: 48, left: 64 };
    const svg = clearSvg(svgRef, width, height);
    const tooltip = createTooltip();
    const x = d3.scaleBand().domain(takeoutData.map((d) => d.year)).range([margin.left, width - margin.right]).padding(0.28);
    const y = d3.scaleLinear().domain([0, 230]).nice().range([height - margin.bottom, margin.top]);

    svg.append('text').attr('x', margin.left).attr('y', 22).attr('class', 'chart-title').text('外卖订单增长与城市配送网络');
    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5));

    svg
      .selectAll('rect')
      .data(takeoutData)
      .join('rect')
      .attr('x', (d) => x(d.year))
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 7)
      .attr('fill', chartColors.red)
      .attr('opacity', 0.84)
      .on('mousemove', (event, d) => showTooltip(tooltip, event, `<strong>${d.year}</strong><br/>订单量：${d.orderCount} 亿单<br/>用户：${d.users} 亿<br/>市场规模：${d.marketSize} 亿元`))
      .on('mouseleave', () => hideTooltip(tooltip))
      .transition()
      .duration(800)
      .delay((_, index) => index * 65)
      .attr('y', (d) => y(d.orderCount))
      .attr('height', (d) => y(0) - y(d.orderCount));

    const route = d3.line().curve(d3.curveCatmullRom)([
      [120, 90],
      [250, 130],
      [360, 82],
      [520, 145],
      [650, 86],
    ]);
    svg.append('path').attr('class', 'route-line').attr('d', route);
    svg.selectAll('.route-dot').data([[120, 90], [360, 82], [650, 86]]).join('circle').attr('class', 'route-dot').attr('cx', (d) => d[0]).attr('cy', (d) => d[1]).attr('r', 5);
  }, []);

  return <svg ref={svgRef} className="chart-card" />;
}

export default TakeoutGrowthChart;
