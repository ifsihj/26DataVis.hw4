/**
 * stacked-area.js — 堆叠面积图组件
 * 支持：百分比堆叠、绝对堆叠、品类切换、视图切换
 */
const StackedArea = {
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
    const categories = opts.categories || [];
    const isPercent = opts.isPercent || false;

    const xDomain = d3.extent(data, d => d[xKey]);
    const xScale = d3.scaleLinear()
      .domain(xDomain).range([0, w]);

    // Prepare stack data
    const stacker = d3.stack()
      .keys(categories.map(c => c.key));

    let stackedData;
    if (isPercent) {
      const pctData = data.map(d => {
        const row = { [xKey]: d[xKey] };
        const total = d3.sum(categories.map(c => +d[c.key] || 0));
        categories.forEach(c => {
          row[c.key] = total > 0 ? (+d[c.key] / total) * 100 : 0;
        });
        return row;
      });
      stackedData = stacker(pctData);
    } else {
      stackedData = stacker(data.map(d => {
        const row = { [xKey]: d[xKey] };
        categories.forEach(c => { row[c.key] = +d[c.key] || 0; });
        return row;
      }));
    }

    const yMax = d3.max(stackedData[stackedData.length - 1], d => d[1]);
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.05]).range([h, 0]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));

    // Axes
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(8));

    const yTicks = isPercent
      ? d3.axisLeft(yScale).ticks(5).tickFormat(d => d + '%')
      : d3.axisLeft(yScale).ticks(6).tickFormat(opts.yFormat || d3.format(','));

    svg.append('g')
      .attr('class', 'axis')
      .call(yTicks);

    // Draw areas
    const areaGen = d3.area()
      .x(d => xScale(d.data[xKey]))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));

    let activeKeys = new Set(categories.map(c => c.key));

    const colorMap = {};
    categories.forEach(c => { colorMap[c.key] = c.color; });

    svg.selectAll('.stacked-area')
      .data(stackedData)
      .join('path')
      .attr('class', 'stacked-area')
      .attr('d', areaGen)
      .attr('fill', d => colorMap[d.key])
      .attr('data-key', d => d.key)
      .attr('opacity', d => activeKeys.has(d.key) ? 0.85 : 0.1);

    // Hover
    const hoverZone = svg.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    hoverZone.on('mousemove', function(event) {
      const mx = d3.pointer(event)[0];
      const year = Math.round(xScale.invert(mx));
      const row = data.find(d => d[xKey] === year);
      if (row) {
        const lines = categories
          .filter(c => activeKeys.has(c.key))
          .map(c => {
            const val = isPercent
              ? (d3.sum(categories.map(cc => +row[cc.key])) > 0
                ? ((+row[c.key] / d3.sum(categories.map(cc => +row[cc.key]))) * 100).toFixed(1) + '%'
                : '0%')
              : fmtNum(row[c.key]);
            return `<div>${c.label}: <span class="tt-value">${val}</span></div>`;
          }).join('');
        Tooltip.show(event, `<div class="tt-label">${year} 年</div>${lines}`);
      }
    }).on('mouseleave', () => Tooltip.hide());

    // Legend
    if (opts.showLegend !== false) {
      const lg = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0, -6)`);

      let cx = 0;
      categories.forEach(c => {
        const ig = lg.append('g')
          .attr('class', 'legend-item')
          .attr('data-key', c.key)
          .on('click', () => {
            if (activeKeys.has(c.key)) {
              if (activeKeys.size <= 1) return;
              activeKeys.delete(c.key);
            } else {
              activeKeys.add(c.key);
            }
            svg.selectAll('.stacked-area')
              .attr('opacity', d => activeKeys.has(d.key) ? 0.85 : 0.1);
            ig.classed('disabled', !activeKeys.has(c.key));
          });

        ig.append('rect')
          .attr('x', cx).attr('y', -6)
          .attr('width', 10).attr('height', 10)
          .attr('fill', c.color).attr('rx', 1);

        ig.append('text')
          .attr('x', cx + 14).attr('y', 2)
          .text(c.label);

        cx += ig.node().getBBox().width + 20;
      });
    }

    if (opts.onClick) {
      svg.style('cursor', 'pointer');
      svg.on('click', opts.onClick);
    }

    return { svg, xScale, yScale, stackedData };
  },
};
