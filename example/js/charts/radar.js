/**
 * radar.js — 雷达图组件
 * 用于粮食安全多维度综合展示
 */
const Radar = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const size = Math.min(cw, ch) - 60;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = size / 2;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${cx},${cy})`);

    const categories = opts.categories || [];
    const series = opts.series || []; // [{key, label, color, values}]

    if (!categories.length) return;

    const angleStep = (Math.PI * 2) / categories.length;
    const rScale = d3.scaleLinear()
      .domain([0, opts.maxValue || 100])
      .range([0, radius]);

    // Background rings
    const levels = [20, 40, 60, 80, 100];
    levels.forEach(l => {
      const r = rScale(l);
      svg.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', CONFIG.colors.gridLine)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', l === 100 ? '0' : '3,3');
    });

    // Axes
    categories.forEach((cat, i) => {
      const angle = -Math.PI / 2 + angleStep * i;
      const x = rScale(100) * Math.cos(angle);
      const y = rScale(100) * Math.sin(angle);

      svg.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x).attr('y2', y)
        .attr('stroke', CONFIG.colors.gridLine)
        .attr('stroke-width', 0.5);

      const labelR = rScale(110);
      svg.append('text')
        .attr('class', 'radar-label')
        .attr('x', labelR * Math.cos(angle))
        .attr('y', labelR * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(cat);
    });

    // Data series
    const lineGen = d3.lineRadial()
      .angle((d, i) => angleStep * i - Math.PI / 2)
      .radius(d => rScale(d))
      .curve(d3.curveLinearClosed);

    series.forEach(s => {
      const values = s.values;

      // Area fill
      svg.append('path')
        .datum(values)
        .attr('class', 'radar-area')
        .attr('d', lineGen)
        .attr('fill', s.color)
        .attr('stroke', s.color)
        .attr('stroke-width', 1.5);

      // Dots
      values.forEach((v, i) => {
        const angle = -Math.PI / 2 + angleStep * i;
        const px = rScale(v) * Math.cos(angle);
        const py = rScale(v) * Math.sin(angle);

        svg.append('circle')
          .attr('cx', px).attr('cy', py)
          .attr('r', 3)
          .attr('fill', s.color);
      });
    });

    // Legend
    if (series.length > 1) {
      const lg = svg.append('g')
        .attr('transform', `translate(${-radius}, ${radius + 30})`);

      series.forEach((s, i) => {
        const ig = lg.append('g')
          .attr('transform', `translate(${i * 120}, 0)`);

        ig.append('rect')
          .attr('width', 10).attr('height', 10)
          .attr('fill', s.color).attr('rx', 1);

        ig.append('text')
          .attr('x', 14).attr('y', 8)
          .attr('font-size', '0.7rem')
          .attr('fill', CONFIG.colors.body)
          .text(s.label);
      });
    }

    return { svg };
  },
};
