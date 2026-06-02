/**
 * donut.js — 环形图 / 旭日图 (Donut / Sunburst)
 * 用于展示占比结构，支持多层钻取
 */
const Donut = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const size = Math.min(cw, ch) - 20;
    const radius = size / 2;
    const innerR = radius * (opts.innerRadius || 0.55);
    const outerR = radius * 0.95;
    const cx = cw / 2;
    const cy = ch / 2;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${cx},${cy})`);

    const valueKey = opts.valueKey || 'value';
    const labelKey = opts.labelKey || 'name';
    const colorKey = opts.colorKey || null;

    const sorted = [...data].sort((a, b) => d3.descending(+a[valueKey], +b[valueKey]));

    const pie = d3.pie()
      .value(d => +d[valueKey])
      .sort(null)
      .padAngle(0.02);

    const arcGen = d3.arc()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .cornerRadius(3);

    const hoverArc = d3.arc()
      .innerRadius(innerR - 4)
      .outerRadius(outerR + 6)
      .cornerRadius(3);

    const colors = CONFIG.morandiPalette(sorted.length);
    const arcs = pie(sorted);

    // Draw arcs
    arcs.forEach((arc, i) => {
      const d = arc.data;
      const color = colorKey ? CONFIG.getColor(d[colorKey]) || colors[i] : colors[i];

      svg.append('path')
        .attr('d', arcGen(arc))
        .attr('fill', color)
        .attr('opacity', 0.85)
        .attr('stroke', CONFIG.colors.bg)
        .attr('stroke-width', 2)
        .on('mousemove', function(event) {
          d3.select(this).transition().duration(200).attr('d', hoverArc(arc)).attr('opacity', 1);
          const pct = (arc.value / d3.sum(sorted, s => +s[valueKey]) * 100).toFixed(1);
          Tooltip.show(event, `
            <div class="tt-label">${d[labelKey]}</div>
            <div class="tt-value">${opts.valueFormat ? opts.valueFormat(d[valueKey]) : fmtNum(d[valueKey])}</div>
            <div class="tt-detail">占比 ${pct}%</div>
          `);
        })
        .on('mouseleave', function() {
          d3.select(this).transition().duration(300).attr('d', arcGen(arc)).attr('opacity', 0.85);
          Tooltip.hide();
        });

      // Labels for larger slices
      if (arc.endAngle - arc.startAngle > 0.25) {
        const centroid = arcGen.centroid(arc);
        const midAngle = (arc.startAngle + arc.endAngle) / 2;
        const labelR = (innerR + outerR) / 2;

        svg.append('text')
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '0.7rem')
          .attr('fill', CONFIG.colors.body)
          .attr('font-family', 'PingFang SC, sans-serif')
          .text(d[labelKey]);
      }
    });

    // Center text
    const total = d3.sum(sorted, s => +s[valueKey]);
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .attr('font-size', '1.1rem')
      .attr('fill', CONFIG.colors.title)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', 700)
      .text(opts.centerValue ? opts.centerValue(total) : fmtNum(total));

    if (opts.centerLabel) {
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('font-size', '0.7rem')
        .attr('fill', CONFIG.colors.caption)
        .attr('font-family', 'PingFang SC, sans-serif')
        .text(opts.centerLabel);
    }

    return { svg, arcs };
  },
};
