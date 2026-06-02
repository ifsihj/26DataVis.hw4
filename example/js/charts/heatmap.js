/**
 * heatmap.js — 热力图 (Heatmap)
 * 矩阵式数据展示，适合展示多品类多年份的强度变化
 */
const Heatmap = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 50, right: 20, bottom: 40, left: 70 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'year';
    const yKey = opts.yKey || 'category';
    const vKey = opts.vKey || 'value';
    const colorScheme = opts.colorScheme || ['#141b22', '#1e2a36', '#2a3a4a', '#00e5a0', '#4fc3f7'];

    // Get unique x/y values
    const xVals = [...new Set(data.map(d => d[xKey]))].sort();
    const yVals = [...new Set(data.map(d => d[yKey]))];

    const xBand = d3.scaleBand().domain(xVals).range([0, w]).padding(0.02);
    const yBand = d3.scaleBand().domain(yVals).range([0, h]).padding(0.02);

    const vExtent = d3.extent(data, d => +d[vKey]);
    const colorScale = d3.scaleSequential()
      .domain(vExtent)
      .interpolator(d3.interpolateRgb(colorScheme[0], colorScheme[colorScheme.length - 1]));

    // Cells
    svg.selectAll('.heat-cell')
      .data(data)
      .join('rect')
      .attr('class', 'heat-cell')
      .attr('x', d => xBand(d[xKey]))
      .attr('y', d => yBand(d[yKey]))
      .attr('width', xBand.bandwidth())
      .attr('height', yBand.bandwidth())
      .attr('fill', d => colorScale(+d[vKey]))
      .attr('rx', 1)
      .on('mousemove', function(event, d) {
        d3.select(this).attr('stroke', CONFIG.colors.accent).attr('stroke-width', 1.5);
        Tooltip.show(event, `
          <div class="tt-label">${d[yKey]} · ${d[xKey]}</div>
          <div class="tt-value">${opts.vFormat ? opts.vFormat(d[vKey]) : fmtNum(d[vKey])}</div>
        `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('stroke', null).attr('stroke-width', null);
        Tooltip.hide();
      });

    // X axis (years)
    const xTickVals = xVals.filter((v, i) => i % 5 === 0 || i === xVals.length - 1);
    svg.append('g').attr('class', 'axis')
      .call(d3.axisTop(xBand).tickValues(xTickVals).tickFormat(d3.format('d')));

    // Y axis (categories)
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yBand).tickSize(0));

    // Color legend
    const legendW = 120, legendH = 8;
    const lgX = w - legendW, lgY = -32;
    const lg = svg.append('g').attr('transform', `translate(${lgX}, ${lgY})`);

    const gradientId = 'heat-legend-' + Math.random().toString(36).slice(2, 8);
    const gradient = lg.append('defs').append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', colorScheme[0]);
    gradient.append('stop').attr('offset', '50%').attr('stop-color', colorScheme[2]);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', colorScheme[4]);

    lg.append('rect')
      .attr('width', legendW).attr('height', legendH)
      .attr('fill', `url(#${gradientId})`)
      .attr('rx', 2);

    lg.append('text').attr('x', -4).attr('y', legendH / 2 + 3)
      .attr('text-anchor', 'end').attr('font-size', '0.6rem').attr('fill', CONFIG.colors.caption)
      .text(vExtent[0]);
    lg.append('text').attr('x', legendW + 4).attr('y', legendH / 2 + 3)
      .attr('text-anchor', 'start').attr('font-size', '0.6rem').attr('fill', CONFIG.colors.caption)
      .text(vExtent[1]);

    return { svg, xBand, yBand, colorScale };
  },
};
