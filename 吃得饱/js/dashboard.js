/**
 * dashboard.js — 仪表盘
 * 4行6图 | 莫兰迪色系 | 防重叠
 */
const Dashboard = {
  data: null,

  render: async function() {
    this.data = await DataLoader.loadAll();
    this.renderMetricCards();
    this.renderChart1();
    this.renderChart2();
    this.renderStream();
    this.renderChart4();
    this.renderRadar();
    this.renderTimeline();
  },

  // ============ 指标卡片 ============
  renderMetricCards: function() {
    const d = this.data;
    const g = d.grainOutput, pc = d.perCapitaGrain;
    const ss = d.selfSufficiency, tech = d.agriTechnology, land = d.arableLand;
    const L = g.length - 1;

    const metrics = [
      { label: '人均粮食', value: Math.round(pc[L].per_capita_kg), unit: 'kg',
        detail: '1949→' + Math.round(pc[L].per_capita_kg) },
      { label: '粮食总产', value: (g[L].total / 10000).toFixed(1), unit: '亿吨',
        detail: '增' + ((g[L].total / g[0].total - 1) * 100).toFixed(0) + '%' },
      { label: '口粮自给率', value: Math.round((ss[L].rice + ss[L].wheat) / 2), unit: '%',
        detail: '稻麦>94%' },
      { label: '亩产', value: Math.round(tech[L].yield_per_mu), unit: 'kg',
        detail: '69→' + Math.round(tech[L].yield_per_mu) },
      { label: '耕地', value: land[L].total_land_yi_mu.toFixed(1), unit: '亿亩',
        detail: '守住18亿红线' },
    ];

    const row = d3.select('#metric-cards');
    row.selectAll('*').remove();
    metrics.forEach(m => {
      const c = row.append('div').attr('class', 'metric-card');
      c.append('div').attr('class', 'label').text(m.label);
      c.append('span').attr('class', 'value').text(m.value);
      c.append('span').attr('class', 'unit').text(m.unit);
      c.append('div').attr('class', 'delta').text(m.detail);
    });
  },

  // ============ Row1 左: 人均粮食占有量 ============
  renderChart1: function() {
    const el = d3.select('#chart-1 .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.perCapitaGrain;
    const m = { top: 14, right: 20, bottom: 34, left: 52 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g').attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, w]);
    const yS = d3.scaleLinear().domain([0, d3.max(data, d => d.per_capita_kg) * 1.06]).range([h, 0]);

    // Grid
    svg.append('g').attr('class', 'grid').call(d3.axisLeft(yS).tickSize(-w).tickFormat('').ticks(6));
    // X axis — 每10年一个刻度
    const xTicks = d3.range(1950, 2030, 10);
    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xS).tickValues(xTicks).tickFormat(d3.format('d')));
    // Y axis
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yS).ticks(5).tickFormat(d => d + 'kg'));

    // FAO 400kg line
    svg.append('line').attr('class', 'ref-line')
      .attr('x1', 0).attr('y1', yS(400)).attr('x2', w).attr('y2', yS(400));
    svg.append('text').attr('x', w).attr('y', yS(400) - 5)
      .attr('text-anchor', 'end').attr('class', 'ref-label').text('FAO 安全线 400kg');

    // Area
    svg.append('path').datum(data)
      .attr('fill', CONFIG.colors.accent).attr('opacity', 0.25)
      .attr('d', d3.area().x(d => xS(d.year)).y0(yS(0)).y1(d => yS(d.per_capita_kg)));
    // Line
    svg.append('path').datum(data)
      .attr('fill', 'none').attr('stroke', CONFIG.colors.accent).attr('stroke-width', 2.2)
      .attr('d', d3.line().x(d => xS(d.year)).y(d => yS(d.per_capita_kg)));

    // End label
    const last = data[data.length - 1];
    svg.append('text').attr('x', xS(last.year) + 5).attr('y', yS(last.per_capita_kg))
      .attr('fill', CONFIG.colors.accent).attr('font-size', '0.75rem').attr('font-weight', 600)
      .attr('dominant-baseline', 'middle').text(last.per_capita_kg + 'kg');

    // Hover
    svg.append('rect').attr('width', w).attr('height', h).attr('fill', 'none').attr('pointer-events', 'all')
      .on('mousemove', function(ev) {
        const yr = Math.round(xS.invert(d3.pointer(ev)[0]));
        const pt = data.find(d => d.year === yr);
        if (pt) Tooltip.show(ev, `<b>${yr}</b> &nbsp; ${pt.per_capita_kg} kg`);
      }).on('mouseleave', () => Tooltip.hide());

    el.style('cursor', 'pointer').on('click', () => Router.go('deep/1'));
  },

  // ============ Row1 右: 分品种堆叠面积 ============
  renderChart2: function() {
    const el = d3.select('#chart-2 .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.grainOutput;
    const keys = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
    const m = { top: 20, right: 16, bottom: 34, left: 52 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g').attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, w]);

    const stacker = d3.stack().keys(keys);
    const stacked = stacker(data.map(d => {
      const row = { year: d.year };
      keys.forEach(k => { row[k] = +d[k] || 0; });
      return row;
    }));

    const yMax = d3.max(stacked[stacked.length - 1], d => d[1]) * 1.03;
    const yS = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    svg.append('g').attr('class', 'grid').call(d3.axisLeft(yS).tickSize(-w).tickFormat('').ticks(6));
    const xTicks = d3.range(1950, 2030, 10);
    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xS).tickValues(xTicks).tickFormat(d3.format('d')));
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yS).ticks(5).tickFormat(d => d >= 10000 ? (d / 10000).toFixed(1) + '亿' : d + '万'));

    // Stacked areas
    svg.selectAll('.st').data(stacked).join('path')
      .attr('d', d3.area().x(d => xS(d.data.year)).y0(d => yS(d[0])).y1(d => yS(d[1])))
      .attr('fill', d => CONFIG.getColor(d.key)).attr('opacity', 0.8);

    // Legend at top-left
    const lg = svg.append('g').attr('transform', 'translate(0, -6)');
    let cx = 0;
    keys.forEach(k => {
      const g = lg.append('g').style('cursor', 'pointer');
      g.append('rect').attr('x', cx).attr('y', -5).attr('width', 9).attr('height', 9)
        .attr('fill', CONFIG.getColor(k)).attr('rx', 1);
      g.append('text').attr('x', cx + 11).attr('y', 2)
        .attr('font-size', '0.62rem').attr('fill', '#666').text(CONFIG.getLabel(k));
      cx += g.node().getBBox().width + 14;
    });

    // Hover
    svg.append('rect').attr('width', w).attr('height', h).attr('fill', 'none').attr('pointer-events', 'all')
      .on('mousemove', function(ev) {
        const yr = Math.round(xS.invert(d3.pointer(ev)[0]));
        const row = data.find(d => d.year === yr);
        if (!row) return;
        const lines = keys.map(k => `<div>${CONFIG.getLabel(k)}: ${fmtNum(row[k])} 万吨</div>`).join('');
        Tooltip.show(ev, `<b>${yr} 年</b><br>${lines}`);
      }).on('mouseleave', () => Tooltip.hide());

    el.style('cursor', 'pointer').on('click', () => Router.go('deep/2'));
  },

  // ============ Row2: 消费结构流图（全宽） ============
  renderStream: function() {
    const el = d3.select('#chart-stream .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.dietStructure;
    const cats = CONFIG.dietCategories.map(k => ({ key: k, label: CONFIG.getLabel(k), color: CONFIG.getColor(k) }));
    const keys = cats.map(c => c.key);
    const m = { top: 22, right: 20, bottom: 36, left: 20 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g').attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, w]);

    const stacker = d3.stack().keys(keys).offset(d3.stackOffsetSilhouette).order(d3.stackOrderInsideOut);
    const stacked = stacker(data.map(d => {
      const row = { year: d.year };
      keys.forEach(k => { row[k] = +d[k] || 0; });
      return row;
    }));

    const yExt = d3.extent(stacked.flatMap(s => s.flatMap(d => [d[0], d[1]])));
    const yS = d3.scaleLinear().domain(yExt).range([h, 0]);

    // Streams
    svg.selectAll('.st').data(stacked).join('path')
      .attr('d', d3.area().curve(d3.curveBasis)
        .x(d => xS(d.data.year)).y0(d => yS(d[0])).y1(d => yS(d[1])))
      .attr('fill', d => CONFIG.getColor(d.key)).attr('opacity', 0.78)
      .attr('stroke', '#fff').attr('stroke-width', 0.3);

    // Center X axis
    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${h / 2})`)
      .call(d3.axisBottom(xS).tickValues(d3.range(1950, 2030, 10)).tickFormat(d3.format('d')));

    // Legend
    const lg = svg.append('g').attr('transform', 'translate(0, -10)');
    let cx = 0;
    cats.forEach(c => {
      const g = lg.append('g').style('cursor', 'pointer');
      g.append('rect').attr('x', cx).attr('y', -5).attr('width', 8).attr('height', 8)
        .attr('fill', c.color).attr('rx', 1);
      g.append('text').attr('x', cx + 10).attr('y', 2)
        .attr('font-size', '0.6rem').attr('fill', '#666').text(c.label);
      cx += g.node().getBBox().width + 14;
    });

    el.style('cursor', 'pointer').on('click', () => Router.go('deep/3'));
  },

  // ============ Row3 左: 全球对比柱状 ============
  renderChart4: function() {
    const el = d3.select('#chart-4 .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.worldComparison;
    const m = { top: 14, right: 16, bottom: 50, left: 52 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g').attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleBand().domain(data.map(d => d.country)).range([0, w]).padding(0.3);
    const yS = d3.scaleLinear().domain([0, d3.max(data, d => d.per_capita_kg) * 1.12]).range([h, 0]);

    svg.append('g').attr('class', 'grid').call(d3.axisLeft(yS).tickSize(-w).tickFormat('').ticks(5));
    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xS).tickSize(0))
      .selectAll('text').attr('transform', 'rotate(-25)').attr('text-anchor', 'end')
      .attr('dx', '-0.5em').attr('dy', '0.2em').attr('font-size', '0.6rem');
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yS).ticks(5).tickFormat(d => d + 'kg'));

    // FAO line
    svg.append('line').attr('class', 'ref-line').attr('x1', 0).attr('y1', yS(400))
      .attr('x2', w).attr('y2', yS(400));

    svg.selectAll('.b').data(data).join('rect')
      .attr('x', d => xS(d.country)).attr('y', d => yS(d.per_capita_kg))
      .attr('width', xS.bandwidth()).attr('height', d => h - yS(d.per_capita_kg))
      .attr('fill', d => d.country === '中国' ? CONFIG.colors.accent : '#D4C9C3')
      .attr('rx', 2)
      .on('mousemove', function(ev, d) {
        d3.select(this).attr('opacity', 0.8);
        Tooltip.show(ev, `<b>${d.country}</b> &nbsp; ${d.per_capita_kg} kg`);
      }).on('mouseleave', function() { d3.select(this).attr('opacity', 1); Tooltip.hide(); });

    // Value labels on bars (only if bar is tall enough)
    svg.selectAll('.bl').data(data).join('text')
      .attr('x', d => xS(d.country) + xS.bandwidth() / 2)
      .attr('y', d => yS(d.per_capita_kg) - 5)
      .attr('text-anchor', 'middle').attr('font-size', '0.55rem')
      .attr('fill', '#666').attr('font-family', 'Roboto Mono, monospace')
      .text(d => d.per_capita_kg);

    el.style('cursor', 'pointer').on('click', () => Router.go('deep/1'));
  },

  // ============ Row3 右: 雷达 ============
  renderRadar: function() {
    const el = d3.select('#chart-radar .chart-svg');
    el.selectAll('*').remove();
    const d = this.data;
    const ss = d.selfSufficiency[d.selfSufficiency.length - 1];
    const pc = d.perCapitaGrain[d.perCapitaGrain.length - 1];
    const land = d.arableLand[d.arableLand.length - 1];
    const tech = d.agriTechnology[d.agriTechnology.length - 1];

    Radar.render('#chart-radar .chart-svg', null, {
      categories: ['口粮自给', '人均占有', '亩产水平', '耕地保障', '科技支撑'],
      maxValue: 100,
      series: [
        { key: 'cn', label: '中国', color: CONFIG.colors.accent, values: [
          Math.round((ss.rice + ss.wheat) / 2),
          Math.round(Math.min(100, pc.per_capita_kg / 500 * 100)),
          Math.round(Math.min(100, tech.yield_per_mu / 400 * 100)),
          Math.round(land.total_land_yi_mu / 20 * 100),
          Math.round(Math.min(100, tech.patents / 4500 * 100)),
        ]},
        { key: 'w', label: '世界平均', color: CONFIG.colors.reference, values: [80, 70, 60, 70, 50] },
      ],
    });
    el.style('cursor', 'pointer').on('click', () => Router.go('deep/5'));
  },

  // ============ Row4: 关键事件时间线 ============
  renderTimeline: function() {
    const el = d3.select('#chart-timeline .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    // 只选最重要的 ~11 个事件，避免标签重叠
    const allEvents = CONFIG.keyEvents;
    const keyYears = [1949, 1958, 1973, 1978, 1982, 1996, 2003, 2006, 2013, 2020, 2025];
    const events = allEvents.filter(e => keyYears.includes(e.year));
    // 缩短标签
    const shortLabels = {
      '新中国成立': '新中国成立',
      '人民公社化': '人民公社化',
      '杂交稻突破': '杂交稻突破',
      '改革开放': '改革开放',
      '家庭联产承包责任制': '联产承包',
      '粮食总产突破5亿吨': '总产破5亿吨',
      '粮食产量低谷': '产量低谷',
      '取消农业税': '取消农业税',
      '人均粮食突破450kg': '人均>450kg',
      '全面小康': '全面小康',
      '粮食产量创新高': '产量创新高',
    };

    const m = { top: 8, right: 24, bottom: 8, left: 24 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g').attr('transform', `translate(${m.left},${m.top})`);

    const years = events.map(e => e.year);
    const xS = d3.scaleLinear().domain(d3.extent(years)).range([30, w - 30]);
    const midY = h / 2;

    // Main line
    svg.append('line').attr('x1', 0).attr('y1', midY).attr('x2', w).attr('y2', midY)
      .attr('stroke', '#D4C9C3').attr('stroke-width', 1.5);

    events.forEach((ev, i) => {
      const px = xS(ev.year);
      const side = i % 2 === 0 ? -1 : 1;
      const gap = 8 + Math.floor(i / 2) % 2 * 12; // 8 or 20 px spacing
      const tickLen = 18 + gap;

      // Tick
      svg.append('line').attr('x1', px).attr('y1', midY + side * 4)
        .attr('x2', px).attr('y2', midY + side * tickLen)
        .attr('stroke', '#C4B8B0').attr('stroke-width', 0.7);

      // Dot
      svg.append('circle').attr('cx', px).attr('cy', midY).attr('r', 4.5)
        .attr('fill', CONFIG.colors.accent).attr('stroke', '#fff').attr('stroke-width', 1.5);

      // Year above dot
      svg.append('text').attr('x', px).attr('y', midY + side * tickLen + side * 2)
        .attr('text-anchor', 'middle').attr('font-size', '0.58rem')
        .attr('fill', CONFIG.colors.accent).attr('font-weight', 700)
        .attr('font-family', 'Roboto Mono, monospace').text(ev.year);

      // Short label on opposite side
      const label = shortLabels[ev.label] || ev.label.slice(0, 6);
      svg.append('text').attr('x', px).attr('y', midY - side * tickLen + side * 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.56rem').attr('fill', '#4A4A4A')
        .attr('font-family', 'PingFang SC, sans-serif').text(label);
    });

    el.style('cursor', 'pointer').on('click', () => Router.go('deep/6'));
  },
};
