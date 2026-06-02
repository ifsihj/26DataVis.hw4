/**
 * radial-bar.js — 径向柱状图 (Circular Bar Chart)
 * 用于展示周期性或分类数据，视觉冲击力强
 */
const RadialBar = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const size = Math.min(cw, ch) - 40;
    const innerRadius = size * 0.3;
    const outerRadius = size * 0.48;
    const cx = cw / 2;
    const cy = ch / 2;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${cx},${cy})`);

    const xKey = opts.xKey || 'label';
    const yKey = opts.yKey || 'value';
    const colorKey = opts.colorKey || null;

    const sorted = [...data].sort((a, b) => d3.descending(+a[yKey], +b[yKey]));
    const maxVal = d3.max(sorted, d => +d[yKey]);
    const barCount = sorted.length;
    const barAngle = (2 * Math.PI) / barCount;

    // Scales
    const rScale = d3.scaleLinear()
      .domain([0, maxVal * 1.05])
      .range([innerRadius, outerRadius]);

    // Background rings
    [0.25, 0.5, 0.75, 1].forEach(pct => {
      svg.append('circle')
        .attr('r', rScale(maxVal * pct))
        .attr('fill', 'none')
        .attr('stroke', CONFIG.colors.gridLine)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', pct === 1 ? '0' : '3,3');
    });

    // Bars
    const arcGen = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => rScale(+d[yKey]))
      .startAngle((d, i) => i * barAngle - Math.PI / 2 - barAngle * 0.4)
      .endAngle((d, i) => i * barAngle - Math.PI / 2 + barAngle * 0.4);

    const colors = CONFIG.morandiPalette(barCount);

    sorted.forEach((d, i) => {
      const color = colorKey ? CONFIG.getColor(d[colorKey]) || colors[i] : colors[i];

      svg.append('path')
        .attr('d', arcGen(d, i))
        .attr('fill', color)
        .attr('opacity', 0.88)
        .attr('stroke', CONFIG.colors.bg)
        .attr('stroke-width', 1)
        .on('mousemove', function(event) {
          d3.select(this).attr('opacity', 1).attr('stroke', CONFIG.colors.accent);
          Tooltip.show(event, `
            <div class="tt-label">${d[xKey]}</div>
            <div class="tt-value">${opts.xFormat ? opts.xFormat(d[yKey]) : fmtNum(d[yKey])}</div>
          `);
        })
        .on('mouseleave', function() {
          d3.select(this).attr('opacity', 0.88).attr('stroke', CONFIG.colors.bg);
          Tooltip.hide();
        });

      // Label
      const angle = i * barAngle - Math.PI / 2;
      const labelR = outerRadius + 24;
      const labelX = labelR * Math.cos(angle);
      const labelY = labelR * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI;
      const anchor = angle > Math.PI / 2 || angle < -Math.PI / 2 ? 'end' : 'start';

      svg.append('text')
        .attr('x', labelX).attr('y', labelY)
        .attr('text-anchor', anchor)
        .attr('dominant-baseline', 'middle')
        .attr('transform', `rotate(${rotation},${labelX},${labelY})`)
        .attr('font-size', '0.65rem')
        .attr('fill', CONFIG.colors.body)
        .attr('font-family', 'PingFang SC, sans-serif')
        .text(d[xKey].length > 6 ? d[xKey].slice(0, 6) + '…' : d[xKey]);
    });

    // Center label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '0.85rem')
      .attr('fill', CONFIG.colors.title)
      .attr('font-family', 'Songti SC, serif')
      .attr('font-weight', 700)
      .text(opts.centerLabel || '');

    return { svg };
  },
};
