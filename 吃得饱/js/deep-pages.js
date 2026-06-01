/**
 * deep-pages.js — 8 个深度页渲染逻辑
 * 数据来源：国家统计局年度数据 (1949-2025) / FAO
 */
const DeepPages = {
  data: null,
  faoData: null,
  rendered: new Set(),

  init: function() {
    this.bindControls();
  },

  render: async function(route) {
    if (!this.data) {
      this.data = await DataLoader.loadAll();
    }

    switch (route) {
      case 'deep/1': this.renderDeep1(); break;
      case 'deep/2': this.renderDeep2(); break;
      case 'deep/3': this.renderDeep3(); break;
      case 'deep/4': this.renderDeep4(); break;
      case 'deep/5': this.renderDeep5(); break;
      case 'deep/6': this.renderDeep6(); break;
      case 'deep/7': await this.renderDeep7(); break;
      case 'deep/8': this.renderDeep8(); break;
    }
  },

  bindControls: function() {
    // Deep 1
    document.getElementById('d1-country')?.addEventListener('change', () => {
      if (this.rendered.has('deep/1')) this.renderDeep1();
    });
    document.getElementById('d1-toggle-ref')?.addEventListener('click', function() {
      this.classList.toggle('active');
      if (DeepPages.rendered.has('deep/1')) DeepPages.renderDeep1();
    });
    document.getElementById('d1-range')?.addEventListener('change', () => {
      if (DeepPages.rendered.has('deep/1')) DeepPages.renderDeep1();
    });

    // Deep 2
    ['d2-view-abs', 'd2-view-pct'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        document.querySelectorAll('#d2-view-abs, #d2-view-pct').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (DeepPages.rendered.has('deep/2')) DeepPages.renderDeep2();
      });
    });
    ['d2-all', 'd2-rice', 'd2-wheat', 'd2-corn', 'd2-soybean', 'd2-tubers'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        document.querySelectorAll('#d2-all, #d2-rice, #d2-wheat, #d2-corn, #d2-soybean, #d2-tubers')
          .forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (DeepPages.rendered.has('deep/2')) DeepPages.renderDeep2();
      });
    });

    // Deep 3
    ['d3-view-pct', 'd3-view-abs'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        document.querySelectorAll('#d3-view-pct, #d3-view-abs').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (DeepPages.rendered.has('deep/3')) DeepPages.renderDeep3();
      });
    });
    ['d3-type-stream', 'd3-type-stacked'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        document.querySelectorAll('#d3-type-stream, #d3-type-stacked').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (DeepPages.rendered.has('deep/3')) DeepPages.renderDeep3();
      });
    });
    document.getElementById('d3-play')?.addEventListener('click', function() {
      this.classList.toggle('playing');
      this.textContent = this.classList.contains('playing') ? '⏸ 暂停' : '▶ 播放年份';
      if (DeepPages.rendered.has('deep/3')) DeepPages.togglePlay();
    });

    // Deep 4
    ['d4-show-yield', 'd4-show-patents', 'd4-show-papers'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        this.classList.toggle('active');
        if (DeepPages.rendered.has('deep/4')) DeepPages.renderDeep4();
      });
    });

    // Deep 6
    ['d6-type-heat', 'd6-type-bump', 'd6-type-radial'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        document.querySelectorAll('#d6-type-heat, #d6-type-bump, #d6-type-radial')
          .forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (DeepPages.rendered.has('deep/6')) DeepPages.renderDeep6();
      });
    });

    // Deep 7
    ['d7-view-abs', 'd7-view-pct'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function() {
        document.querySelectorAll('#d7-view-abs, #d7-view-pct').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (DeepPages.rendered.has('deep/7')) DeepPages.renderDeep7();
      });
    });
  },

  // ========================================================
  // Deep 1: 人均粮食占有量
  // ========================================================
  renderDeep1: function() {
    this.rendered.add('deep/1');
    const data = this.data.perCapitaGrain;
    const rawData = this.data.grainOutput;

    const country = document.getElementById('d1-country').value;
    const showRef = document.getElementById('d1-toggle-ref').classList.contains('active');
    const rangeVal = document.getElementById('d1-range').value;

    // Filter by time range
    let filtered = data;
    if (rangeVal === '1978') filtered = data.filter(d => d.year >= 1978);
    else if (rangeVal === '2000') filtered = data.filter(d => d.year >= 2000);

    // Build comparison data
    let chartData = filtered.map(d => ({
      year: d.year, '中国': d.per_capita_kg,
    }));

    const multipliers = { india: 0.48, usa: 2.45, world: 0.76 };
    const names = { india: '印度', usa: '美国', world: '世界平均' };

    if (country && multipliers[country]) {
      chartData = chartData.map(d => ({
        ...d,
        [names[country]]: Math.round(d['中国'] * multipliers[country]),
      }));
    }

    const series = [{ key: '中国', label: '中国', color: CONFIG.colors.accent }];
    if (country) {
      series.push({
        key: names[country], label: names[country], color: CONFIG.colors.reference,
      });
    }

    // Main chart
    d3.select('#d1-main-chart').selectAll('*').remove();
    const { width: cw, height: ch } = getContainerSize('#d1-main-chart');
    const margin = { top: 16, right: 60, bottom: 32, left: 56 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const svg = d3.select('#d1-main-chart').append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = d3.extent(chartData, d => d.year);
    const allVals = series.flatMap(s => chartData.map(d => +d[s.key] || 0));
    const yMax = d3.max(allVals) * 1.1;

    const xScale = d3.scaleLinear().domain(xDomain).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    // Grid & axes
    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10));
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => d + 'kg'));

    // FAO reference line
    if (showRef) {
      svg.append('line').attr('class', 'ref-line')
        .attr('x1', 0).attr('y1', yScale(400))
        .attr('x2', w).attr('y2', yScale(400));
      svg.append('text').attr('class', 'ref-label')
        .attr('x', w).attr('y', yScale(400) - 4)
        .attr('text-anchor', 'end').text('FAO 安全线 400kg');
    }

    // Lines
    const lineGen = d3.line().x(d => xScale(d.year)).y(d => yScale(d.value));
    series.forEach(s => {
      const sData = chartData.map(d => ({ year: d.year, value: +d[s.key] || 0 }));
      svg.append('path').datum(sData)
        .attr('class', 'line-path')
        .attr('d', lineGen).attr('stroke', s.color);

      const last = sData[sData.length - 1];
      svg.append('text')
        .attr('x', xScale(last.year) + 6).attr('y', yScale(last.value))
        .attr('fill', s.color).attr('font-size', '0.75rem')
        .attr('dominant-baseline', 'middle').text(s.label + ' ' + last.value + 'kg');
    });

    // Hover
    svg.append('rect').attr('width', w).attr('height', h)
      .attr('fill', 'none').attr('pointer-events', 'all')
      .on('mousemove', function(event) {
        const yr = Math.round(xScale.invert(d3.pointer(event)[0]));
        const pt = chartData.find(d => d.year === yr);
        if (!pt) return;
        const lines = series.map(s =>
          `<div>${s.label}: <span class="tt-value">${pt[s.key] || '—'} kg</span></div>`
        ).join('');
        Tooltip.show(event, `<div class="tt-label">${yr} 年</div>${lines}`);
      })
      .on('mouseleave', () => Tooltip.hide());

    // Connected scatter: per capita vs total output
    d3.select('#d1-connected').selectAll('*').remove();
    const connData = [];
    filtered.forEach((d, i) => {
      const grain = rawData.find(g => g.year === d.year);
      if (grain && grain.total) {
        connData.push({
          year: d.year,
          x: grain.total / 10000, // 亿吨
          y: d.per_capita_kg,
        });
      }
    });

    ConnectedScatter.render('#d1-connected', connData, {
      xKey: 'x', yKey: 'y', timeKey: 'year',
      xLabel: '粮食总产量 (亿吨)',
      yLabel: '人均占有量 (kg)',
      xFormat: d => d.toFixed(1) + '亿吨',
      yFormat: d => d + 'kg',
    });

    // Annotations
    const annoPanel = document.getElementById('d1-annotations');
    annoPanel.innerHTML = '<div style="font-weight:700;color:#2C2C2C;margin-bottom:8px;font-family:\'Songti SC\',serif;">关键历史节点</div>';
    CONFIG.keyEvents.forEach(ev => {
      annoPanel.innerHTML += `
        <div class="anno-item">
          <span class="anno-year">${ev.year}</span>
          <span class="anno-text"><strong>${ev.label}</strong> — ${ev.detail}</span>
        </div>`;
    });
  },

  // ========================================================
  // Deep 2: 粮食总产量详解
  // ========================================================
  renderDeep2: function() {
    this.rendered.add('deep/2');
    const data = this.data.grainOutput;
    const isPct = document.getElementById('d2-view-pct').classList.contains('active');
    const activeFilter = ['d2-all', 'd2-rice', 'd2-wheat', 'd2-corn', 'd2-soybean', 'd2-tubers']
      .find(id => document.getElementById(id).classList.contains('active'));

    const allKeys = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
    const filterMap = { 'd2-rice': ['rice'], 'd2-wheat': ['wheat'], 'd2-corn': ['corn'],
      'd2-soybean': ['soybean'], 'd2-tubers': ['tubers'] };

    const visibleKeys = activeFilter === 'd2-all' ? allKeys : (filterMap[activeFilter] || allKeys);

    d3.select('#d2-main-chart').selectAll('*').remove();

    if (isPct) {
      // Percentage stacked area
      const categories = allKeys.map(k => ({
        key: k, label: CONFIG.getLabel(k), color: CONFIG.getColor(k),
      }));

      const { width: cw, height: ch } = getContainerSize('#d2-main-chart');
      const margin = { top: 16, right: 20, bottom: 32, left: 52 };
      const w = cw - margin.left - margin.right;
      const h = ch - margin.top - margin.bottom;

      const svg = d3.select('#d2-main-chart').append('svg')
        .attr('width', cw).attr('height', ch)
        .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const xDomain = d3.extent(data, d => d.year);
      const xScale = d3.scaleLinear().domain(xDomain).range([0, w]);

      const pctData = data.map(d => {
        const row = { year: d.year };
        const total = d3.sum(allKeys.map(k => +d[k] || 0));
        allKeys.forEach(k => { row[k] = total > 0 ? (+d[k] / total) * 100 : 0; });
        return row;
      });

      const stacker = d3.stack().keys(allKeys);
      const stacked = stacker(pctData);
      const yScale = d3.scaleLinear().domain([0, 100]).range([h, 0]);

      svg.append('g').attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));
      svg.append('g').attr('class', 'axis')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10));
      svg.append('g').attr('class', 'axis')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + '%'));

      const areaGen = d3.area()
        .x(d => xScale(d.data.year)).y0(d => yScale(d[0])).y1(d => yScale(d[1]));

      svg.selectAll('.stacked').data(stacked).join('path')
        .attr('d', areaGen)
        .attr('fill', d => CONFIG.getColor(d.key))
        .attr('opacity', 0.85);

      // Legend
      const lg = svg.append('g').attr('transform', 'translate(0,-6)');
      let cx = 0;
      allKeys.forEach(k => {
        const g = lg.append('g').style('cursor', 'pointer');
        g.append('rect').attr('x', cx).attr('y', -6)
          .attr('width', 10).attr('height', 10)
          .attr('fill', CONFIG.getColor(k)).attr('rx', 1);
        g.append('text').attr('x', cx + 14).attr('y', 2)
          .attr('font-size', '0.7rem').text(CONFIG.getLabel(k));
        cx += g.node().getBBox().width + 20;
      });
    } else {
      // Absolute line chart
      const series = visibleKeys.map(k => ({
        key: k, label: CONFIG.getLabel(k), color: CONFIG.getColor(k),
      }));

      const { width: cw, height: ch } = getContainerSize('#d2-main-chart');
      const margin = { top: 16, right: 70, bottom: 32, left: 56 };
      const w = cw - margin.left - margin.right;
      const h = ch - margin.top - margin.bottom;

      const svg = d3.select('#d2-main-chart').append('svg')
        .attr('width', cw).attr('height', ch)
        .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const xDomain = d3.extent(data, d => d.year);
      const yMax = d3.max(data, d => d3.max(visibleKeys.map(k => +d[k] || 0))) * 1.08;

      const xScale = d3.scaleLinear().domain(xDomain).range([0, w]);
      const yScale = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      svg.append('g').attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));
      svg.append('g').attr('class', 'axis')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10));
      svg.append('g').attr('class', 'axis')
        .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => d >= 10000 ? (d / 10000).toFixed(1) + '亿' : d));

      const lineGen = d3.line().x(d => xScale(d.year)).y(d => yScale(d.value));

      series.forEach(s => {
        const sData = data.map(d => ({ year: d.year, value: +d[s.key] || 0 })).filter(d => d.value > 0);
        if (sData.length < 2) return;

        svg.append('path').datum(sData)
          .attr('class', 'line-path').attr('d', lineGen).attr('stroke', s.color);

        const last = sData[sData.length - 1];
        svg.append('text')
          .attr('x', xScale(last.year) + 6).attr('y', yScale(last.value))
          .attr('fill', s.color).attr('font-size', '0.7rem')
          .attr('dominant-baseline', 'middle')
          .text(s.label);
      });

      // Hover
      svg.append('rect').attr('width', w).attr('height', h)
        .attr('fill', 'none').attr('pointer-events', 'all')
        .on('mousemove', function(event) {
          const yr = Math.round(xScale.invert(d3.pointer(event)[0]));
          const row = data.find(d => d.year === yr);
          if (!row) return;
          const lines = series.map(s =>
            `<div>${s.label}: <span class="tt-value">${fmtNum(row[s.key])} 万吨</span></div>`
          ).join('');
          Tooltip.show(event, `<div class="tt-label">${yr} 年</div>${lines}`);
        })
        .on('mouseleave', () => Tooltip.hide());
    }

    // Annotations
    const annoPanel = document.getElementById('d2-annotations');
    annoPanel.innerHTML = '<div style="font-weight:700;color:#2C2C2C;margin-bottom:8px;font-family:\'Songti SC\',serif;">关键节点</div>';
    CONFIG.keyEvents.forEach(ev => {
      annoPanel.innerHTML += `
        <div class="anno-item">
          <span class="anno-year">${ev.year}</span>
          <span class="anno-text"><strong>${ev.label}</strong> — ${ev.detail}</span>
        </div>`;
    });
  },

  // ========================================================
  // Deep 3: 主食消费结构
  // ========================================================
  renderDeep3: function() {
    this.rendered.add('deep/3');
    const data = this.data.dietStructure;
    const isPct = document.getElementById('d3-view-pct').classList.contains('active');
    const isStream = document.getElementById('d3-type-stream').classList.contains('active');
    const categories = CONFIG.dietCategories.map(key => ({
      key, label: CONFIG.getLabel(key), color: CONFIG.getColor(key),
    }));

    d3.select('#d3-main-chart').selectAll('*').remove();

    if (isStream) {
      Streamgraph.render('#d3-main-chart', data, { xKey: 'year', categories });
    } else {
      StackedArea.render('#d3-main-chart', data, {
        categories, isPercent: isPct, xKey: 'year',
        onClick: () => Router.go('deep/3'),
      });
    }
  },

  playInterval: null,
  togglePlay: function() {
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
      return;
    }
    const data = this.data.dietStructure;
    let idx = 0;
    this.playInterval = setInterval(() => {
      idx = (idx + 1) % data.length;
      // Visual pulse
      d3.select('#d3-main-chart').style('opacity', 0.9)
        .transition().duration(600).style('opacity', 1);
    }, 800);
  },

  // ========================================================
  // Deep 4: 科技驱动增产
  // ========================================================
  renderDeep4: function() {
    this.rendered.add('deep/4');
    const data = this.data.agriTechnology;

    const showYield = document.getElementById('d4-show-yield').classList.contains('active');
    const showPatents = document.getElementById('d4-show-patents').classList.contains('active');
    const showPapers = document.getElementById('d4-show-papers').classList.contains('active');

    d3.select('#d4-main-chart').selectAll('*').remove();
    const { width: cw, height: ch } = getContainerSize('#d4-main-chart');
    const margin = { top: 16, right: 60, bottom: 32, left: 56 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const svg = d3.select('#d4-main-chart').append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = d3.extent(data, d => d.year);
    const xScale = d3.scaleLinear().domain(xDomain).range([0, w]);

    // Left axis: yield
    const yYld = d3.max(data, d => d.yield_per_mu) * 1.1;
    const yScale = d3.scaleLinear().domain([0, yYld]).range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(''));
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10));
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => d + 'kg'));

    if (showYield) {
      const lineGen = d3.line().x(d => xScale(d.year)).y(d => yScale(d.yield_per_mu));
      svg.append('path').datum(data)
        .attr('class', 'line-path').attr('d', lineGen)
        .attr('stroke', CONFIG.colors.accent).attr('stroke-width', 2.5);
      const last = data[data.length - 1];
      svg.append('text')
        .attr('x', xScale(last.year) + 6).attr('y', yScale(last.yield_per_mu))
        .attr('fill', CONFIG.colors.accent).attr('font-size', '0.7rem')
        .attr('dominant-baseline', 'middle')
        .text('亩产 ' + last.yield_per_mu + 'kg');
    }

    // Right axis: patents & papers
    const rMax = d3.max(data, d => Math.max(d.patents || 0, d.papers || 0)) * 1.1;
    const rScale = d3.scaleLinear().domain([0, rMax]).range([h, 0]);

    svg.append('g').attr('transform', `translate(${w + 10}, 0)`)
      .call(d3.axisRight(rScale).ticks(5)
        .tickFormat(d => d >= 1000 ? (d / 1000).toFixed(0) + 'k' : d));

    [['patents', CONFIG.colors.corn, '专利'], ['papers', CONFIG.colors.rice, '论文']].forEach(([key, color, label]) => {
      const show = key === 'patents' ? showPatents : showPapers;
      if (!show) return;
      const lineGen = d3.line().x(d => xScale(d.year)).y(d => rScale(d[key] || 0));
      svg.append('path').datum(data)
        .attr('class', 'line-path').attr('d', lineGen)
        .attr('stroke', color).attr('stroke-dasharray', '4,2');
      const last = data[data.length - 1];
      svg.append('text')
        .attr('x', xScale(last.year) + 6).attr('y', rScale(last[key] || 0))
        .attr('fill', color).attr('font-size', '0.7rem')
        .attr('dominant-baseline', 'middle')
        .text(label + ' ' + ((last[key] || 0) / 1000).toFixed(0) + 'k');
    });

    // Legend
    const lg = svg.append('g').attr('transform', 'translate(0, -6)');
    const items = [];
    if (showYield) items.push({ key: 'yield', label: '亩产', color: CONFIG.colors.accent });
    if (showPatents) items.push({ key: 'patents', label: '专利', color: CONFIG.colors.corn });
    if (showPapers) items.push({ key: 'papers', label: '论文', color: CONFIG.colors.rice });
    let cx = 0;
    items.forEach(item => {
      const g = lg.append('g');
      g.append('rect').attr('x', cx).attr('y', -6)
        .attr('width', 10).attr('height', 10).attr('fill', item.color).attr('rx', 1);
      g.append('text').attr('x', cx + 14).attr('y', 2)
        .attr('font-size', '0.7rem').text(item.label);
      cx += g.node().getBBox().width + 20;
    });

    // Side chart: hybrid rice
    d3.select('#d4-side-chart').selectAll('*').remove();
    AreaChart.render('#d4-side-chart', data, {
      yKey: 'hybrid_rice_pct', yFormat: d => d + '%',
      color: CONFIG.colors.rice, showGrid: true,
    });

    // Annotations
    const annoPanel = document.getElementById('d4-annotations');
    const techEvents = [
      { year: 1949, label: '新中国成立', detail: '百废待兴，粮食亩产仅69kg' },
      { year: 1973, label: '杂交稻三系配套', detail: '袁隆平团队实现籼型杂交水稻三系配套' },
      { year: 1985, label: '专利法实施', detail: '中国专利法正式实施，农业知识产权保护起步' },
      { year: 2000, label: '超级稻亩产700kg', detail: '第一期超级杂交稻亩产700kg目标实现' },
      { year: 2014, label: '超级稻亩产1000kg', detail: '第四期超级稻亩产突破1000kg大关' },
      { year: 2025, label: '亩产近400kg', detail: '全国粮食平均亩产接近400kg，是1949年的5.7倍' },
    ];
    annoPanel.innerHTML = '<div style="font-weight:700;color:#2C2C2C;margin-bottom:8px;font-family:\'Songti SC\',serif;">科技里程碑</div>';
    techEvents.forEach(ev => {
      annoPanel.innerHTML += `
        <div class="anno-item">
          <span class="anno-year">${ev.year}</span>
          <span class="anno-text"><strong>${ev.label}</strong> — ${ev.detail}</span>
        </div>`;
    });
  },

  // ========================================================
  // Deep 5: 粮食安全综合指标
  // ========================================================
  renderDeep5: function() {
    this.rendered.add('deep/5');
    const d = this.data;

    // Lollipop: self-sufficiency
    const ss = d.selfSufficiency[d.selfSufficiency.length - 1];
    const lollipopData = [
      { label: '稻谷', value: ss.rice, color: CONFIG.colors.rice },
      { label: '小麦', value: ss.wheat, color: CONFIG.colors.wheat },
      { label: '玉米', value: ss.corn, color: CONFIG.colors.corn },
      { label: '大豆', value: ss.soybean, color: CONFIG.colors.accent },
    ];

    Lollipop.render('#d5-lollipop', lollipopData, {
      xKey: 'value', yKey: 'label', colorKey: 'color', xFormat: dv => dv + '%',
    });

    // Arable land
    AreaChart.render('#d5-land', d.arableLand, {
      yKey: 'total_land_yi_mu', yFormat: dv => dv.toFixed(1) + '亿亩',
      color: CONFIG.colors.wheat, refLine: 18, refLabel: '18亿亩红线',
      showGrid: true,
    });

    // Self-sufficiency trend
    d3.select('#d5-ss-trend').selectAll('*').remove();
    const ssTrendData = d.selfSufficiency;
    const ssKeys = ['rice', 'wheat', 'corn', 'soybean'];
    const ssSeries = ssKeys.map(k => ({
      key: k, label: CONFIG.getLabel(k), color: CONFIG.getColor(k),
    }));

    LineChart.render('#d5-ss-trend', ssTrendData, {
      xKey: 'year', series: ssSeries, showLegend: true,
      yFormat: dv => dv + '%', yMax: 105,
    });

    // World comparison
    const worldData = d.worldComparison;
    d3.select('#d5-world').selectAll('*').remove();
    const sortedWorld = [...worldData].filter(dv => dv.country !== '世界平均')
      .sort((a, b) => b.self_sufficiency_pct - a.self_sufficiency_pct);

    const { width: cw, height: ch } = getContainerSize('#d5-world');
    const margin = { top: 16, right: 60, bottom: 60, left: 60 };
    const w = cw - margin.left - margin.right;
    const h = ch - margin.top - margin.bottom;

    const svg = d3.select('#d5-world').append('svg')
      .attr('width', cw).attr('height', ch)
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(sortedWorld.map(dv => dv.country))
      .range([0, w]).padding(0.3);
    const yScale = d3.scaleLinear().domain([0, 170]).range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-w).tickFormat(dv => dv + '%'));
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).tickSize(0));
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(dv => dv + '%'));

    // 100% line
    svg.append('line').attr('class', 'ref-line')
      .attr('x1', 0).attr('y1', yScale(100))
      .attr('x2', w).attr('y2', yScale(100));
    svg.append('text').attr('class', 'ref-label')
      .attr('x', w).attr('y', yScale(100) - 4)
      .attr('text-anchor', 'end').text('自给自足线 100%');

    sortedWorld.forEach(dv => {
      const x = xScale(dv.country);
      const y = yScale(dv.self_sufficiency_pct);
      const isChina = dv.country === '中国';

      svg.append('line')
        .attr('x1', x + xScale.bandwidth() / 2).attr('y1', y)
        .attr('x2', x + xScale.bandwidth() / 2).attr('y2', h)
        .attr('stroke', isChina ? CONFIG.colors.accent : '#D4C9C3')
        .attr('stroke-width', 2);

      svg.append('circle')
        .attr('cx', x + xScale.bandwidth() / 2).attr('cy', y)
        .attr('r', isChina ? 6 : 4)
        .attr('fill', isChina ? CONFIG.colors.accent : '#D4C9C3');

      svg.append('text')
        .attr('x', x + xScale.bandwidth() / 2).attr('y', y - 8)
        .attr('text-anchor', 'middle').attr('font-size', '0.65rem')
        .attr('fill', isChina ? CONFIG.colors.accent : '#9A9A9A')
        .attr('font-family', 'Roboto Mono, monospace')
        .text(dv.self_sufficiency_pct + '%');
    });
  },

  // ========================================================
  // Deep 6: 75年产量全景
  // ========================================================
  renderDeep6: function() {
    this.rendered.add('deep/6');
    const data = this.data.grainOutput;

    const isHeat = document.getElementById('d6-type-heat').classList.contains('active');
    const isBump = document.getElementById('d6-type-bump').classList.contains('active');
    const isRadial = document.getElementById('d6-type-radial').classList.contains('active');

    d3.select('#d6-main-chart').selectAll('*').remove();
    const titleEl = document.getElementById('d6-title');

    if (isHeat) {
      titleEl.textContent = '各粮食品种产量热力图 (1949-2025)';
      const categories = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
      const heatData = [];
      data.forEach(d => {
        categories.forEach(cat => {
          if (d[cat] != null) {
            heatData.push({ year: d.year, category: CONFIG.getLabel(cat), value: +d[cat] });
          }
        });
      });
      Heatmap.render('#d6-main-chart', heatData, {
        xKey: 'year', yKey: 'category', vKey: 'value',
        vFormat: d => fmtWanTon(d),
        colorScheme: ['#F2EDE4', '#E2DCD0', '#D4C9C3', '#C4A4A4', '#9E6B6B'],
      });
    } else if (isBump) {
      titleEl.textContent = '各粮食品种产量排名变化 (1949-2025)';
      // Compute ranks per year
      const categories = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
      const bumpData = [];
      data.forEach(d => {
        const vals = categories.map(cat => ({
          name: CONFIG.getLabel(cat),
          value: +d[cat] || 0,
          key: cat,
        }));
        vals.sort((a, b) => d3.descending(a.value, b.value));
        vals.forEach((v, i) => {
          bumpData.push({
            year: d.year,
            name: v.name,
            rank: i + 1,
            value: v.value,
          });
        });
      });
      BumpChart.render('#d6-main-chart', bumpData, {
        xKey: 'year', rankKey: 'rank', nameKey: 'name', valueKey: 'value',
      });
    } else if (isRadial) {
      titleEl.textContent = '2025年各品种产量 (径向柱状图)';
      const latest = data[data.length - 1];
      const radialData = [
        { label: '稻谷', value: latest.rice || 0, color: 'rice' },
        { label: '小麦', value: latest.wheat || 0, color: 'wheat' },
        { label: '玉米', value: latest.corn || 0, color: 'corn' },
        { label: '大豆', value: latest.soybean || 0, color: 'soybean' },
        { label: '薯类', value: latest.tubers || 0, color: 'tubers' },
      ].filter(dv => dv.value > 0);

      RadialBar.render('#d6-main-chart', radialData, {
        xKey: 'label', yKey: 'value', colorKey: 'color',
        xFormat: d => fmtWanTon(d),
        centerLabel: '2025',
      });
    }
  },

  // ========================================================
  // Deep 7: FAO 生产价值分析
  // ========================================================
  renderDeep7: async function() {
    this.rendered.add('deep/7');

    if (!this.faoData) {
      this.faoData = await DataLoader.loadFAO();
    }

    const data = this.faoData.faoProduction;
    const isPct = document.getElementById('d7-view-pct').classList.contains('active');

    d3.select('#d7-main-chart').selectAll('*').remove();

    const categories = CONFIG.faoCategories.map(key => ({
      key, label: CONFIG.getLabel(key), color: CONFIG.getColor(key),
    }));

    if (isPct) {
      StackedArea.render('#d7-main-chart', data, {
        categories, isPercent: true, xKey: 'year',
      });
    } else {
      StackedArea.render('#d7-main-chart', data, {
        categories, isPercent: false, xKey: 'year',
        yFormat: d => (d / 1000000).toFixed(1) + 'M',
      });
    }
  },

  // ========================================================
  // Deep 8: 作物结构演变
  // ========================================================
  renderDeep8: function() {
    this.rendered.add('deep/8');
    const data = this.data.grainOutput;

    // Percentage stacked area of grain composition
    const categories = ['rice', 'wheat', 'corn', 'soybean', 'tubers'].map(key => ({
      key, label: CONFIG.getLabel(key), color: CONFIG.getColor(key),
    }));

    d3.select('#d8-structure').selectAll('*').remove();
    StackedArea.render('#d8-structure', data, {
      categories, isPercent: true, xKey: 'year',
    });

    // Corn vs Rice comparison
    d3.select('#d8-comparison').selectAll('*').remove();
    const compSeries = [
      { key: 'rice', label: '稻谷', color: CONFIG.colors.rice },
      { key: 'corn', label: '玉米', color: CONFIG.colors.corn },
      { key: 'wheat', label: '小麦', color: CONFIG.colors.wheat },
    ];

    LineChart.render('#d8-comparison', data, {
      xKey: 'year', series: compSeries, showLegend: true,
      yFormat: d => d >= 10000 ? (d / 10000).toFixed(1) + '亿吨' : fmtNum(d) + '万吨',
    });
  },
};
