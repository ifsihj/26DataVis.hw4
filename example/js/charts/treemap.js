/**
 * treemap.js — 矩形树图 (Treemap)
 * 层级数据展示，适合展示各品类在总量中的占比
 */
const Treemap = {
  render: function(container, data, opts = {}) {
    const { width: cw, height: ch } = getContainerSize(container);
    const margin = { top: 8, right: 8, bottom: 8, left: 8 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const el = d3.select(container);
    el.selectAll('*').remove();

    const svg = el.append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const valueKey = opts.valueKey || 'value';
    const labelKey = opts.labelKey || 'name';
    const colorKey = opts.colorKey || null;

    // Hierarchy
    const root = d3.hierarchy({ children: data })
      .sum(d => +d[valueKey])
      .sort((a, b) => b.value - a.value);

    const treemapLayout = d3.treemap()
      .size([w, h])
      .padding(4)
      .round(true);

    treemapLayout(root);

    const colors = CONFIG.morandiPalette(data.length);

    // Draw cells
    const cells = svg.selectAll('.tree-cell')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    cells.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', (d, i) => colorKey ? CONFIG.getColor(d.data[colorKey]) || colors[i] : colors[i])
      .attr('rx', 3)
      .attr('opacity', 0.85)
      .attr('stroke', CONFIG.colors.bg)
      .attr('stroke-width', 1.5)
      .on('mousemove', function(event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke', CONFIG.colors.accent);
        Tooltip.show(event, `
          <div class="tt-label">${d.data[labelKey]}</div>
          <div class="tt-value">${opts.valueFormat ? opts.valueFormat(d.data[valueKey]) : fmtNum(d.data[valueKey])}</div>
          <div class="tt-detail">占比 ${(d.data[valueKey] / root.value * 100).toFixed(1)}%</div>
        `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('opacity', 0.85).attr('stroke', CONFIG.colors.bg);
        Tooltip.hide();
      });

    // Labels
    cells.append('text')
      .attr('x', 6).attr('y', 16)
      .attr('font-size', '0.7rem')
      .attr('fill', CONFIG.colors.body)
      .attr('font-family', 'PingFang SC, sans-serif')
      .text(d => {
        const tw = d.x1 - d.x0;
        return tw > 40 ? d.data[labelKey] : '';
      });

    cells.append('text')
      .attr('x', 6).attr('y', 32)
      .attr('font-size', '0.65rem')
      .attr('fill', CONFIG.colors.caption)
      .attr('font-family', 'Roboto Mono, monospace')
      .text(d => {
        const tw = d.x1 - d.x0;
        if (tw < 50) return '';
        const pct = (d.data[valueKey] / root.value * 100).toFixed(1);
        return pct + '%';
      });

    return { svg, root };
  },
};
