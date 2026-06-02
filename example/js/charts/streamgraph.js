/**
 * streamgraph.js — 流图 (Streamgraph)
 * 堆叠面积图的变体，围绕中心轴对称，展示数据组成随时间的变化
 */
const Streamgraph = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 24, right: 24, bottom: 36, left: 24 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'year';
    const categories = opts.categories || [];
    if (!categories.length) return;

    const keys = categories.map(c => c.key);

    // Stack with offset
    const stacker = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetSilhouette)
      .order(d3.stackOrderInsideOut);

    const stacked = stacker(data.map(d => {
      const row = { [xKey]: d[xKey] };
      keys.forEach(k => { row[k] = +d[k] || 0; });
      return row;
    }));

    const xDomain = d3.extent(data, d => d[xKey]);
    const xScale = d3.scaleLinear().domain(xDomain).range([0, w]);

    const yExtent = d3.extent(stacked.flatMap(s => s.flatMap(d => [d[0], d[1]])));
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([h, 0]);

    // Area generator with curve
    const areaGen = d3.area()
      .x(d => xScale(d.data[xKey]))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveBasis);

    // Draw streams
    const colorMap = {};
    categories.forEach(c => { colorMap[c.key] = c.color; });

    svg.selectAll('.stream')
      .data(stacked)
      .join('path')
      .attr('class', 'stream')
      .attr('d', areaGen)
      .attr('fill', d => colorMap[d.key])
      .attr('opacity', 0.82)
      .attr('stroke', CONFIG.colors.bg)
      .attr('stroke-width', 0.3)
      .on('mousemove', function(event, d) {
        d3.select(this).attr('opacity', 0.95);
        Tooltip.show(event, `
          <div class="tt-label">${CONFIG.getLabel(d.key)}</div>
        `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('opacity', 0.82);
        Tooltip.hide();
      });

    // X axis (simplified)
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h / 2})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(8));

    // Legend at top
    const lg = svg.append('g').attr('transform', 'translate(0, -14)');
    let cx = 0;
    categories.forEach(c => {
      const g = lg.append('g').style('cursor', 'pointer');
      g.append('rect')
        .attr('x', cx).attr('y', -6)
        .attr('width', 10).attr('height', 10)
        .attr('fill', c.color).attr('rx', 1);
      g.append('text')
        .attr('x', cx + 14).attr('y', 2)
        .attr('font-size', '0.7rem').attr('fill', CONFIG.colors.body)
        .text(c.label);
      cx += g.node().getBBox().width + 18;
    });

    return { svg, xScale, yScale, stacked };
  },
};
