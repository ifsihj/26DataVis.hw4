/**
 * area-chart.js — 面积图组件
 * 支持：单面积图、堆叠面积图、时间刷选
 */
const AreaChart = {
  /**
   * 单面积图
   */
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 16, right: 20, bottom: 32, left: 52 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'year';
    const yKey = opts.yKey || 'value';

    const xDomain = d3.extent(data, d => d[xKey]);
    const yMax = opts.yMax || d3.max(data, d => +d[yKey]) * 1.08;

    const xScale = d3.scaleLinear()
      .domain(xDomain).range([0, w]);

    const yScale = d3.scaleLinear()
      .domain([opts.yMin || 0, yMax]).range([h, 0]);

    // Grid
    if (opts.showGrid !== false) {
      svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));
    }

    // Axes
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(8));

    svg.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(opts.yFormat || d3.format(',')));

    // Area
    const areaGen = d3.area()
      .x(d => xScale(d[xKey]))
      .y0(yScale(0))
      .y1(d => yScale(d[yKey]))
      .defined(d => d[yKey] != null);

    svg.append('path')
      .datum(data)
      .attr('class', 'area-fill')
      .attr('d', areaGen)
      .attr('fill', opts.color || CONFIG.colors.accent);

    // Line on top
    const lineGen = d3.line()
      .x(d => xScale(d[xKey]))
      .y(d => yScale(d[yKey]))
      .defined(d => d[yKey] != null);

    svg.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr('stroke', opts.color || CONFIG.colors.accent)
      .attr('d', lineGen);

    // Hover
    const hoverZone = svg.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    hoverZone.on('mousemove', function(event) {
      const mx = d3.pointer(event)[0];
      const year = Math.round(xScale.invert(mx));
      const point = data.find(d => d[xKey] === year);
      if (point) {
        Tooltip.show(event, `
          <div class="tt-label">${year} 年</div>
          <div class="tt-value">${fmtNum(point[yKey])}</div>
        `);
      }
    }).on('mouseleave', () => Tooltip.hide());

    // Annotations
    if (opts.annotations) {
      drawAnnotations(svg, data, xScale, yScale, xKey, yKey);
    }

    if (opts.refLine !== undefined) {
      svg.append('line')
        .attr('class', 'ref-line')
        .attr('x1', 0).attr('y1', yScale(opts.refLine))
        .attr('x2', w).attr('y2', yScale(opts.refLine));
      if (opts.refLabel) {
        svg.append('text')
          .attr('class', 'ref-label')
          .attr('x', w).attr('y', yScale(opts.refLine) - 4)
          .attr('text-anchor', 'end')
          .text(opts.refLabel);
      }
    }

    if (opts.onClick) {
      svg.style('cursor', 'pointer');
      svg.on('click', opts.onClick);
    }

    return { svg, xScale, yScale };
  },
};
