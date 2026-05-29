/**
 * line-chart.js — 可复用折线图组件
 * 支持：单/多折线、图例切换、tooltip、标注
 */
const LineChart = {
  /**
   * @param {string|Element} container - CSS 选择器或 DOM 元素
   * @param {Array} data - 数据数组
   * @param {Object} opts
   * @param {string} opts.xKey - X 轴字段名
   * @param {string} opts.yKey - Y 轴字段名（单线）
   * @param {Array} opts.series - 多线时: [{key, label, color}]
   * @param {Function} opts.yFormat - Y 轴格式化函数
   * @param {boolean} opts.showGrid - 是否显示网格
   * @param {Function} opts.onClick - 点击回调
   * @param {Array} opts.annotations - 标注点
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

    // Prepare series
    let series = opts.series;
    if (!series) {
      series = [{ key: yKey, label: opts.yLabel || yKey, color: opts.color || CONFIG.colors.accent }];
    }

    const xDomain = d3.extent(data, d => d[xKey]);
    const yMax = opts.yMax || d3.max(data, d => {
      return d3.max(series.map(s => +d[s.key] || 0));
    });
    const yMin = opts.yMin || 0;

    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, w]);

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax * 1.08])
      .range([h, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(8);
    const yAxis = d3.axisLeft(yScale).ticks(6)
      .tickFormat(opts.yFormat || d3.format(','));

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
      .call(xAxis);

    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis);

    // Lines
    const lineGen = d3.line()
      .x(d => xScale(d[xKey]))
      .y(d => yScale(d[yKey]))
      .defined(d => d[yKey] != null);

    let activeKeys = new Set(series.map(s => s.key));

    series.forEach(s => {
      const path = svg.append('path')
        .datum(data)
        .attr('class', 'line-path')
        .attr('d', d => lineGen(d.map(r => ({ [xKey]: r[xKey], [yKey]: r[s.key] }))))
        .attr('stroke', s.color)
        .attr('data-key', s.key);

      // Dots on hover
      const dots = svg.selectAll(`.dot-${s.key.replace(/\s/g, '')}`)
        .data(data.filter(d => d[s.key] != null))
        .join('circle')
        .attr('r', 0)
        .attr('fill', s.color)
        .attr('cx', d => xScale(d[xKey]))
        .attr('cy', d => yScale(d[s.key]));

      // Hover interaction
      const hoverZone = svg.append('rect')
        .attr('width', w).attr('height', h)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

      hoverZone.on('mousemove', function(event) {
        const mx = d3.pointer(event)[0];
        const year = Math.round(xScale.invert(mx));
        const point = data.find(d => d[xKey] === year);

        if (point) {
          dots.attr('r', 4);
          const activeSeriess = series.filter(s => activeKeys.has(s.key));
          const ttLines = activeSeriess.map(s =>
            `<div>${s.label}: <span class="tt-value">${fmtNum(point[s.key])}</span></div>`
          ).join('');
          Tooltip.show(event, `
            <div class="tt-label">${year} 年</div>
            ${ttLines}
          `);
        }
      }).on('mouseleave', function() {
        dots.attr('r', 0);
        Tooltip.hide();
      });
    });

    // Reference line
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

    // Annotations
    if (opts.annotations) {
      drawAnnotations(svg, data, xScale, yScale, xKey, yKey);
    }

    // Legend
    if (series.length > 1 && opts.showLegend !== false) {
      const lg = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0, -8)`);

      let cx = 0;
      series.forEach(s => {
        const ig = lg.append('g')
          .attr('class', 'legend-item')
          .attr('data-key', s.key)
          .on('click', () => {
            if (activeKeys.has(s.key)) {
              if (activeKeys.size <= 1) return;
              activeKeys.delete(s.key);
            } else {
              activeKeys.add(s.key);
            }
            // Update lines
            svg.selectAll('.line-path').each(function() {
              const k = d3.select(this).attr('data-key');
              d3.select(this).style('display', activeKeys.has(k) ? null : 'none');
            });
            ig.classed('disabled', !activeKeys.has(s.key));
          });

        ig.append('rect')
          .attr('x', cx).attr('y', -6)
          .attr('width', 10).attr('height', 10)
          .attr('fill', s.color).attr('rx', 1);

        ig.append('text')
          .attr('x', cx + 14).attr('y', 2)
          .text(s.label);

        cx += ig.node().getBBox().width + 20;
      });
    }

    // Click handler
    if (opts.onClick) {
      svg.style('cursor', 'pointer');
      svg.on('click', opts.onClick);
    }

    return { svg: svg, xScale, yScale };
  },
};
