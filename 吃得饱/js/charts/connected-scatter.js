/**
 * connected-scatter.js — 连接散点图 (Connected Scatter Plot)
 * 展示两个变量随时间变化的轨迹关系
 */
const ConnectedScatter = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 24, right: 28, bottom: 44, left: 56 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'x';
    const yKey = opts.yKey || 'y';
    const timeKey = opts.timeKey || 'year';

    const xExtent = d3.extent(data, d => +d[xKey]);
    const yExtent = d3.extent(data, d => +d[yKey]);
    const xPad = (xExtent[1] - xExtent[0]) * 0.08;
    const yPad = (yExtent[1] - yExtent[0]) * 0.08;

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - xPad, xExtent[1] + xPad])
      .range([0, w]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPad, yExtent[1] + yPad])
      .range([h, 0]);

    // Color scale by time
    const colorScale = d3.scaleSequential()
      .domain(d3.extent(data, d => d[timeKey]))
      .interpolator(d3.interpolateRgb('#D4C9C3', '#9E6B6B'));

    // Grid
    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));
    svg.append('g').attr('class', 'grid')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickSize(-h).tickFormat(''));

    // Axes
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(opts.xFormat || d3.format(',')));

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(opts.yFormat || d3.format(',')));

    // Axis labels
    if (opts.xLabel) {
      svg.append('text')
        .attr('x', w / 2).attr('y', h + 36)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.7rem').attr('fill', '#888')
        .text(opts.xLabel);
    }
    if (opts.yLabel) {
      svg.append('text')
        .attr('x', -h / 2).attr('y', -42)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.7rem').attr('fill', '#888')
        .text(opts.yLabel);
    }

    // Connecting line
    const lineGen = d3.line()
      .x(d => xScale(+d[xKey]))
      .y(d => yScale(+d[yKey]))
      .defined(d => d[xKey] != null && d[yKey] != null);

    svg.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr('d', lineGen)
      .attr('stroke', '#D4C9C3')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    // Points
    svg.selectAll('.scatter-dot')
      .data(data.filter(d => d[xKey] != null && d[yKey] != null))
      .join('circle')
      .attr('cx', d => xScale(+d[xKey]))
      .attr('cy', d => yScale(+d[yKey]))
      .attr('r', 4)
      .attr('fill', d => colorScale(d[timeKey]))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mousemove', function(event, d) {
        d3.select(this).attr('r', 7).attr('stroke', '#9E6B6B').attr('stroke-width', 2);
        Tooltip.show(event, `
          <div class="tt-label">${d[timeKey]} 年</div>
          <div>${opts.xLabel || xKey}: <span class="tt-value">${fmtNum(d[xKey])}</span></div>
          <div>${opts.yLabel || yKey}: <span class="tt-value">${fmtNum(d[yKey])}</span></div>
        `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('r', 4).attr('stroke', '#fff').attr('stroke-width', 1);
        Tooltip.hide();
      });

    // Start and end labels
    const first = data[0], last = data[data.length - 1];
    [first, last].forEach((d, i) => {
      if (!d || d[xKey] == null) return;
      svg.append('text')
        .attr('x', xScale(+d[xKey]) + (i === 0 ? -8 : 8))
        .attr('y', yScale(+d[yKey]) - 8)
        .attr('text-anchor', i === 0 ? 'end' : 'start')
        .attr('font-size', '0.7rem')
        .attr('fill', '#9E6B6B')
        .attr('font-family', 'Songti SC, serif')
        .text(d[timeKey]);
    });

    return { svg, xScale, yScale };
  },
};
