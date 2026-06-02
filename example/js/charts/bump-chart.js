/**
 * bump-chart.js — 凹凸图 / 排名变化图 (Bump Chart)
 * 展示各品类在不同时期的排名变化
 */
const BumpChart = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 24, right: 100, bottom: 40, left: 40 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'year';
    const rankKey = opts.rankKey || 'rank';
    const nameKey = opts.nameKey || 'name';
    const valueKey = opts.valueKey || 'value';
    const colorKey = opts.colorKey || null;

    // Unique entities and time points
    const entities = [...new Set(data.map(d => d[nameKey]))];
    const timePoints = [...new Set(data.map(d => d[xKey]))].sort();

    // Color mapping
    const colors = CONFIG.morandiPalette(entities.length);
    const entityColors = {};
    entities.forEach((e, i) => { entityColors[e] = colorKey ? CONFIG.getColor(e) || colors[i] : colors[i]; });

    // Scales
    const xScale = d3.scalePoint().domain(timePoints).range([0, w]).padding(0.5);
    const yScale = d3.scaleLinear().domain([entities.length + 0.5, 0.5]).range([h, 0]);

    // Grid
    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));

    // Axes
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(entities.length).tickFormat(d => {
        const item = data.find(r => r[rankKey] === d && timePoints.includes(r[xKey]));
        return item ? '#' + d : '';
      }));

    // Draw lines per entity
    entities.forEach(entity => {
      const entityData = timePoints.map(t => {
        const row = data.find(d => d[xKey] === t && d[nameKey] === entity);
        return row ? { time: t, rank: +row[rankKey], value: row[valueKey] } : null;
      }).filter(Boolean);

      if (entityData.length < 2) return;

      const lineGen = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.rank))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(entityData)
        .attr('d', lineGen)
        .attr('fill', 'none')
        .attr('stroke', entityColors[entity])
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.7)
        .attr('stroke-linecap', 'round');

      // Dots
      svg.selectAll(`.bump-${entity.replace(/\s/g, '')}`)
        .data(entityData)
        .join('circle')
        .attr('cx', d => xScale(d.time))
        .attr('cy', d => yScale(d.rank))
        .attr('r', 4)
        .attr('fill', entityColors[entity])
        .attr('stroke', CONFIG.colors.bg)
        .attr('stroke-width', 1);
    });

    // End labels
    const lastTime = timePoints[timePoints.length - 1];
    entities.forEach(entity => {
      const last = data.find(d => d[xKey] === lastTime && d[nameKey] === entity);
      if (!last) return;
      svg.append('text')
        .attr('x', xScale(lastTime) + 8)
        .attr('y', yScale(+last[rankKey]) + 3)
        .attr('fill', entityColors[entity])
        .attr('font-size', '0.7rem')
        .attr('font-family', 'PingFang SC, sans-serif')
        .text(entity);
    });

    // Hover line
    const hoverLine = svg.append('line')
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', CONFIG.colors.divider)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3')
      .style('display', 'none');

    svg.append('rect').attr('width', w).attr('height', h)
      .attr('fill', 'none').attr('pointer-events', 'all')
      .on('mousemove', function(event) {
        const mx = d3.pointer(event)[0];
        const time = timePoints.reduce((a, b) =>
          Math.abs(xScale(b) - mx) < Math.abs(xScale(a) - mx) ? b : a);
        hoverLine.style('display', null)
          .attr('x1', xScale(time)).attr('x2', xScale(time));
      })
      .on('mouseleave', () => hoverLine.style('display', 'none'));

    return { svg, xScale, yScale, entityColors };
  },
};
