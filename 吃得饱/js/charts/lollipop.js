/**
 * lollipop.js — 棒棒糖图组件
 * 用于排名类数据展示（自给率排名等）
 */
const Lollipop = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 16, right: 40, bottom: 16, left: 80 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'value';
    const yKey = opts.yKey || 'label';
    const colorKey = opts.colorKey || 'color';

    // Sort data
    const sorted = [...data].sort((a, b) => a[xKey] - b[xKey]);

    const yScale = d3.scaleBand()
      .domain(sorted.map(d => d[yKey]))
      .range([0, h])
      .padding(0.4);

    const xMax = d3.max(sorted, d => +d[xKey]) * 1.15;
    const xScale = d3.scaleLinear()
      .domain([0, xMax]).range([0, w]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisBottom(xScale).tickSize(-h).tickFormat(''));

    // Axes
    svg.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale).tickSize(0));

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(opts.xFormat || (d => d + '%')));

    // Lines & circles
    sorted.forEach(d => {
      const y = yScale(d[yKey]) + yScale.bandwidth() / 2;
      const x = xScale(d[xKey]);
      const c = d[colorKey] || CONFIG.colors.accent;

      svg.append('line')
        .attr('x1', 0).attr('y1', y)
        .attr('x2', x).attr('y2', y)
        .attr('stroke', c)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.6);

      svg.append('circle')
        .attr('cx', x).attr('cy', y)
        .attr('r', 5)
        .attr('fill', c);

      // Value label
      svg.append('text')
        .attr('x', x + 8).attr('y', y + 3)
        .attr('font-size', '0.7rem')
        .attr('fill', c)
        .attr('font-family', 'Roboto Mono, monospace')
        .text(opts.valueFormat ? opts.valueFormat(d[xKey]) : (d[xKey] + '%'));
    });

    return { svg, xScale, yScale };
  },
};
