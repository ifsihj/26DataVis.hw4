import * as d3 from 'd3';

export const chartColors = {
  grain: '#b88446',
  grainSoft: '#ecd4a9',
  red: '#8f2f24',
  green: '#315f49',
  ink: '#2f2821',
  muted: '#8f806e',
  cream: '#f7efe0',
  amber: '#d4a64a',
};

export const evidenceChartTheme = {
  ink: '#2d241a',
  inkSoft: '#5a4a3a',
  muted: '#8f806e',
  axis: '#b9a98f',
  grid: '#dfd0b9',
  paper: '#fff9ed',
  signal: '#8f3328',
  positive: '#315f49',
  accent: '#d4a64a',
  neutral: '#c8bba5',
  neutralLight: '#e5dac7',
  series: ['#315f49', '#d4a64a', '#b45d48', '#78956a', '#9b7258'],
};

export function clearSvg(svgRef, width = 760, height = 420) {
  const node = svgRef.value ?? svgRef.current;
  const svg = d3.select(node);
  svg.selectAll('*').remove();
  svg.attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img');
  return svg;
}

export function styleChartAxis(axis, { hideDomain = false } = {}) {
  axis.selectAll('.domain')
    .style('stroke', hideDomain ? 'none' : evidenceChartTheme.axis)
    .style('stroke-width', 1);

  axis.selectAll('.tick line')
    .style('stroke', evidenceChartTheme.axis)
    .style('stroke-width', 0.9);

  axis.selectAll('.tick text')
    .style('fill', evidenceChartTheme.muted)
    .style('font-size', '0.82rem')
    .style('font-family', 'Arial, "Noto Sans SC", sans-serif');

  return axis;
}

export function createTooltip() {
  let tooltip = d3.select('body').select('.chart-tooltip');
  if (tooltip.empty()) {
    tooltip = d3.select('body').append('div').attr('class', 'chart-tooltip');
  }
  return tooltip;
}

export function showTooltip(tooltip, event, html) {
  tooltip
    .html(html)
    .style('opacity', 1)
    .style('left', `${event.pageX + 14}px`)
    .style('top', `${event.pageY - 20}px`);
}

export function hideTooltip(tooltip) {
  tooltip.style('opacity', 0);
}
