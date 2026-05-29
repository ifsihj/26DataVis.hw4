/**
 * grouped-bar.js — 分组柱状图组件
 * 用于全球对比等场景
 */
const GroupedBar = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 24, right: 20, bottom: 40, left: 52 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xKey = opts.xKey || 'country';
    const yKey = opts.yKey || 'value';
    const groupKey = opts.groupKey || null;

    if (groupKey) {
      // Grouped: multi-series
      const groups = Array.from(new Set(data.map(d => d[xKey])));
      const subGroups = Array.from(new Set(data.map(d => d[groupKey])));

      const x0 = d3.scaleBand()
        .domain(groups)
        .range([0, w])
        .padding(0.15);

      const x1 = d3.scaleBand()
        .domain(subGroups)
        .range([0, x0.bandwidth()])
        .padding(0.1);

      const yMax = d3.max(data, d => +d[yKey]) * 1.15;
      const yScale = d3.scaleLinear()
        .domain([opts.yMin || 0, yMax]).range([h, 0]);

      const color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(subGroups.map((_, i) => {
          const c = Object.values(CONFIG.colors);
          return c[i % c.length];
        }));

      svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x0).tickSize(0));

      svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).ticks(6).tickFormat(opts.yFormat || d3.format(',')));

      svg.selectAll('.group-bar')
        .data(data)
        .join('rect')
        .attr('x', d => x0(d[xKey]) + x1(d[groupKey]))
        .attr('y', d => yScale(d[yKey]))
        .attr('width', x1.bandwidth())
        .attr('height', d => h - yScale(d[yKey]))
        .attr('fill', d => color(d[groupKey]))
        .attr('rx', 2)
        .on('mousemove', function(event, d) {
          Tooltip.show(event, `
            <div class="tt-label">${d[xKey]} · ${d[groupKey]}</div>
            <div class="tt-value">${fmtNum(d[yKey])}</div>
          `);
        })
        .on('mouseleave', () => Tooltip.hide());

      return { svg, x0, x1, yScale };
    } else {
      // Simple bar
      const xScale = d3.scaleBand()
        .domain(data.map(d => d[xKey]))
        .range([0, w])
        .padding(0.25);

      const yMax = d3.max(data, d => +d[yKey]) * 1.15;
      const yScale = d3.scaleLinear()
        .domain([0, yMax]).range([h, 0]);

      const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d[xKey]))
        .range(d3.schemeTableau10);

      svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(xScale).tickSize(0));

      svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).ticks(6).tickFormat(opts.yFormat || d3.format(',')));

      svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d[xKey]))
        .attr('y', d => yScale(d[yKey]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => h - yScale(d[yKey]))
        .attr('fill', d => d[xKey] === '中国' ? CONFIG.colors.accent : CONFIG.colors.caption)
        .attr('rx', 2)
        .on('mousemove', function(event, d) {
          Tooltip.show(event, `
            <div class="tt-label">${d[xKey]}</div>
            <div class="tt-value">${fmtNum(d[yKey])}</div>
          `);
        })
        .on('mouseleave', () => Tooltip.hide());

      return { svg, xScale, yScale };
    }
  },
};
