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

export function clearSvg(svgRef, width = 760, height = 420) {
  const svg = d3.select(svgRef.current);
  svg.selectAll('*').remove();
  svg.attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img');
  return svg;
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
