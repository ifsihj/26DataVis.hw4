/**
 * dashboard.js — 仪表盘（幻灯片版）
 * 每个全屏 slide 进入视口时懒渲染对应图表
 * 深色科技风 · 流畅入场动画
 */
const Dashboard = {
  data: null,
  rendered: new Set(),
  observer: null,

  /**
   * 初始化：加载数据 → 渲染指标卡片 → 设置幻灯片观察器
   */
  async init() {
    this.data = await DataLoader.loadAll();
    this.renderMetricCards();
    this.setupSlideObserver();
  },

  /**
   * IntersectionObserver 监听每张幻灯片
   * 当 slide 成为活跃 snap 点时，触发图表懒渲染
   */
  setupSlideObserver() {
    const scrollContainer = document.getElementById('scroll-container');

    // Slide → chart render mapping
    const slideRenderMap = {
      'slide-metrics':  () => this.activateMetrics(),
      'slide-chart1':   () => this.renderChart1(),
      'slide-chart2':   () => this.renderChart2(),
      'slide-stream':   () => this.renderStream(),
      'slide-compare':  () => { this.renderCompare(); this.renderRadar(); },
      'slide-timeline': () => this.renderTimeline(),
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          const slideId = entry.target.id;
          const renderFn = slideRenderMap[slideId];

          if (renderFn && !this.rendered.has(slideId)) {
            this.rendered.add(slideId);
            // Small delay for smooth animation staging
            setTimeout(() => renderFn(), 200);
          }

          // Trigger reveal animations within this slide
          entry.target.querySelectorAll('.reveal-section').forEach(el => {
            el.classList.add('visible');
          });
        }
      });
    }, {
      threshold: [0.4, 0.6],
      root: scrollContainer,
    });

    // Observe all chart slides
    Object.keys(slideRenderMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });

    // Immediately render hero slide metrics (visible on load)
    setTimeout(() => {
      const metricsSlide = document.getElementById('slide-metrics');
      if (metricsSlide) {
        const rect = metricsSlide.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight) {
          this.rendered.add('slide-metrics');
          this.activateMetrics();
          metricsSlide.querySelectorAll('.reveal-section').forEach(el => {
            el.classList.add('visible');
          });
        }
      }
    }, 400);
  },

  // ============ 指标卡片 ============
  _metricsAnimated: false,

  activateMetrics() {
    if (this._metricsAnimated) return;
    this._metricsAnimated = true;

    const row = document.getElementById('metric-cards');
    if (!row) return;
    row.classList.add('visible');

    // Counting animation after bounce-in
    setTimeout(() => {
      row.querySelectorAll('.metric-card').forEach((card, i) => {
        setTimeout(() => {
          const valEl = card.querySelector('.value');
          const target = parseFloat(card.dataset.targetValue);
          if (!isNaN(target) && valEl) {
            this._countUp(valEl, target, 1400);
          }
        }, i * 80);
      });
    }, 400);
  },

  _countUp(el, target, duration) {
    const start = performance.now();
    const decimals = (target % 1 !== 0) ? 1 : 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = (target * eased);
      el.textContent = current.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals);
        el.style.color = 'var(--accent)';
        el.style.transform = 'scale(1.12)';
        setTimeout(() => {
          el.style.transform = '';
          el.style.color = '';
        }, 250);
      }
    };
    requestAnimationFrame(tick);
  },

  renderMetricCards() {
    const d = this.data;
    const g = d.grainOutput, pc = d.perCapitaGrain;
    const ss = d.selfSufficiency, tech = d.agriTechnology, land = d.arableLand;
    const L = g.length - 1;

    const curPC = Math.round(pc[L].per_capita_kg);
    const curGrain = +(g[L].total / 10000).toFixed(1);
    const curSS = Math.round((ss[L].rice + ss[L].wheat) / 2);
    const curYield = Math.round(tech[L].yield_per_mu);
    const curLand = +land[L].total_land_yi_mu.toFixed(1);
    const pc0 = Math.round(pc[0].per_capita_kg);
    const grain0 = +(+g[0].total / 10000).toFixed(2);
    const yield0 = 69;

    const metrics = [
      {
        label: '人均粮食', value: curPC, unit: 'kg',
        baseline: pc0 + ' kg',
        growth: '+' + Math.round((curPC / pc0 - 1) * 100) + '%',
        subtitle: 'FAO 安全线 400 kg，已大幅超越',
      },
      {
        label: '粮食总产', value: curGrain, unit: '亿吨',
        baseline: grain0 + ' 亿吨',
        growth: '×' + (curGrain / grain0).toFixed(1),
        subtitle: '76 年翻了近两番',
      },
      {
        label: '口粮自给率', value: curSS, unit: '%',
        baseline: '稻麦均值',
        growth: '基本自给',
        subtitle: '口粮绝对安全',
      },
      {
        label: '亩产', value: curYield, unit: 'kg',
        baseline: yield0 + ' kg',
        growth: '×' + (curYield / yield0).toFixed(1),
        subtitle: '科技驱动的增长奇迹',
      },
      {
        label: '耕地', value: curLand, unit: '亿亩',
        baseline: '红线 18 亿亩',
        growth: '+' + (curLand - 18).toFixed(1),
        subtitle: '严守红线，留有余量',
      },
    ];

    const wheatPairs = [
      ['l1','r1'], ['l2','r2'], ['l1','r3'], ['l3','r1'], ['l2','r2']
    ];

    const row = d3.select('#metric-cards');
    row.selectAll('*').remove();

    metrics.forEach((m, i) => {
      const card = row.append('div')
        .attr('class', 'metric-card bounce-in')
        .attr('data-target-value', m.value);

      // Wheat peeking out from card edges into the gap
      const wp = wheatPairs[i];
      card.append('div')
        .attr('class', 'wheat-spray wheat-left wheat-' + wp[0])
        .style('position','absolute').style('bottom','30%').style('right','100%')
        .style('width','44px').style('height','60px').style('z-index','1')
        .style('pointer-events','none').style('background-repeat','no-repeat')
        .style('background-position','right center').style('background-size','contain')
        .style('transform','translateX(10px) rotate(-50deg) scale(0)')
        .style('transform-origin','right bottom')
        .style('opacity','0')
        .style('transition','all 0.5s cubic-bezier(0.34,1.56,0.64,1)');
      card.append('div')
        .attr('class', 'wheat-spray wheat-right wheat-' + wp[1])
        .style('position','absolute').style('bottom','30%').style('left','100%')
        .style('width','44px').style('height','60px').style('z-index','1')
        .style('pointer-events','none').style('background-repeat','no-repeat')
        .style('background-position','left center').style('background-size','contain')
        .style('transform','translateX(-10px) rotate(50deg) scale(0)')
        .style('transform-origin','left bottom')
        .style('opacity','0')
        .style('transition','all 0.5s cubic-bezier(0.34,1.56,0.64,1)');

      card.append('div').attr('class', 'label').text(m.label);

      const vw = card.append('div').attr('class', 'value-wrap');
      vw.append('span').attr('class', 'value').text('0');
      vw.append('span').attr('class', 'unit').text(m.unit);

      card.append('div').attr('class', 'growth').text(m.growth);
      card.append('div').attr('class', 'baseline').text(m.baseline);
      card.append('div').attr('class', 'subtitle').text(m.subtitle);
    });
  },

  // ============ Slide 2: 人均粮食占有量 ============
  renderChart1() {
    const el = d3.select('#chart-1 .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.perCapitaGrain;
    const m = { top: 14, right: 60, bottom: 38, left: 52 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, w]);
    const yS = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.per_capita_kg) * 1.06])
      .range([h, 0]);

    // Grid
    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yS).tickSize(-w).tickFormat('').ticks(6));

    // Axes
    const xTicks = d3.range(1950, 2030, 10);
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xS).tickValues(xTicks).tickFormat(d3.format('d')));
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yS).ticks(5).tickFormat(d => d + 'kg'));

    // FAO 400kg reference line
    svg.append('line').attr('class', 'ref-line')
      .attr('x1', 0).attr('y1', yS(400))
      .attr('x2', w).attr('y2', yS(400));
    svg.append('text')
      .attr('x', w).attr('y', yS(400) - 5)
      .attr('text-anchor', 'end').attr('class', 'ref-label')
      .text('FAO 安全线 400kg');

    // Area fill
    svg.append('path').datum(data)
      .attr('fill', CONFIG.colors.accent).attr('opacity', 0.18)
      .attr('d', d3.area()
        .x(d => xS(d.year)).y0(yS(0)).y1(d => yS(d.per_capita_kg))
      );

    // Line
    svg.append('path').datum(data)
      .attr('fill', 'none').attr('stroke', CONFIG.colors.accent)
      .attr('stroke-width', 2.5)
      .attr('d', d3.line().x(d => xS(d.year)).y(d => yS(d.per_capita_kg)));

    // End label
    const last = data[data.length - 1];
    svg.append('text')
      .attr('x', xS(last.year) + 6).attr('y', yS(last.per_capita_kg))
      .attr('fill', CONFIG.colors.accent).attr('font-size', '0.8rem')
      .attr('font-weight', 700).attr('dominant-baseline', 'middle')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(last.per_capita_kg + 'kg');

    // Hover interaction
    svg.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'none').attr('pointer-events', 'all')
      .on('mousemove', function(ev) {
        const yr = Math.round(xS.invert(d3.pointer(ev)[0]));
        const pt = data.find(d => d.year === yr);
        if (pt) Tooltip.show(ev,
          `<span class="tt-label">${yr} 年</span><br>` +
          `<span class="tt-value">${pt.per_capita_kg} kg</span>`
        );
      })
      .on('mouseleave', () => Tooltip.hide());
  },

  // ============ Slide 3: 分品种堆叠面积 ============
  renderChart2() {
    const el = d3.select('#chart-2 .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.grainOutput;
    const keys = ['rice', 'wheat', 'corn', 'soybean', 'tubers'];
    const m = { top: 20, right: 16, bottom: 38, left: 52 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, w]);

    const stacker = d3.stack().keys(keys);
    const stacked = stacker(data.map(d => {
      const row = { year: d.year };
      keys.forEach(k => { row[k] = +d[k] || 0; });
      return row;
    }));

    const yMax = d3.max(stacked[stacked.length - 1], d => d[1]) * 1.03;
    const yS = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    // Grid & axes
    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yS).tickSize(-w).tickFormat('').ticks(6));
    const xTicks = d3.range(1950, 2030, 10);
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xS).tickValues(xTicks).tickFormat(d3.format('d')));
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yS).ticks(5)
        .tickFormat(d => d >= 10000 ? (d / 10000).toFixed(1) + '亿' : d + '万'));

    // Stacked areas
    svg.selectAll('.st').data(stacked).join('path')
      .attr('d', d3.area()
        .x(d => xS(d.data.year)).y0(d => yS(d[0])).y1(d => yS(d[1]))
      )
      .attr('fill', d => CONFIG.getColor(d.key))
      .attr('opacity', 0.85);

    // Legend
    const lg = svg.append('g').attr('transform', 'translate(0, -8)');
    let cx = 0;
    keys.forEach(k => {
      const g = lg.append('g').style('cursor', 'pointer');
      g.append('rect').attr('x', cx).attr('y', -6)
        .attr('width', 10).attr('height', 10)
        .attr('fill', CONFIG.getColor(k)).attr('rx', 2);
      g.append('text').attr('x', cx + 14).attr('y', 2)
        .attr('font-size', '0.65rem').attr('fill', CONFIG.colors.caption)
        .text(CONFIG.getLabel(k));
      cx += g.node().getBBox().width + 16;
    });

    // Hover
    svg.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'none').attr('pointer-events', 'all')
      .on('mousemove', function(ev) {
        const yr = Math.round(xS.invert(d3.pointer(ev)[0]));
        const row = data.find(d => d.year === yr);
        if (!row) return;
        const lines = keys
          .map(k => `<div>${CONFIG.getLabel(k)}: <span class="tt-value">${fmtNum(row[k])}</span> 万吨</div>`)
          .join('');
        Tooltip.show(ev, `<span class="tt-label">${yr} 年</span><br>${lines}`);
      })
      .on('mouseleave', () => Tooltip.hide());
  },

  // ============ Slide 4: 消费结构流图 ============
  renderStream() {
    const el = d3.select('#chart-stream .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.dietStructure;
    const cats = CONFIG.dietCategories.map(k => ({
      key: k, label: CONFIG.getLabel(k), color: CONFIG.getColor(k),
    }));
    const keys = cats.map(c => c.key);
    const m = { top: 24, right: 20, bottom: 40, left: 20 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, w]);

    const stacker = d3.stack().keys(keys)
      .offset(d3.stackOffsetSilhouette)
      .order(d3.stackOrderInsideOut);
    const stacked = stacker(data.map(d => {
      const row = { year: d.year };
      keys.forEach(k => { row[k] = +d[k] || 0; });
      return row;
    }));

    const yExt = d3.extent(stacked.flatMap(s => s.flatMap(d => [d[0], d[1]])));
    const yS = d3.scaleLinear().domain(yExt).range([h, 0]);

    svg.selectAll('.st').data(stacked).join('path')
      .attr('d', d3.area().curve(d3.curveBasis)
        .x(d => xS(d.data.year))
        .y0(d => yS(d[0])).y1(d => yS(d[1]))
      )
      .attr('fill', d => CONFIG.getColor(d.key))
      .attr('opacity', 0.82)
      .attr('stroke', CONFIG.colors.bg).attr('stroke-width', 0.4);

    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h / 2})`)
      .call(d3.axisBottom(xS)
        .tickValues(d3.range(1950, 2030, 10)).tickFormat(d3.format('d'))
      );

    // Legend
    const lg = svg.append('g').attr('transform', 'translate(0, -12)');
    let cx = 0;
    cats.forEach(c => {
      const g = lg.append('g').style('cursor', 'pointer');
      g.append('rect').attr('x', cx).attr('y', -6)
        .attr('width', 9).attr('height', 9)
        .attr('fill', c.color).attr('rx', 2);
      g.append('text').attr('x', cx + 12).attr('y', 2)
        .attr('font-size', '0.63rem').attr('fill', CONFIG.colors.caption)
        .text(c.label);
      cx += g.node().getBBox().width + 16;
    });
  },

  // ============ Slide 5 左: 全球对比柱状 ============
  renderCompare() {
    const el = d3.select('#chart-compare .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const data = this.data.worldComparison;
    const m = { top: 14, right: 16, bottom: 56, left: 52 };
    const w = W - m.left - m.right, h = H - m.top - m.bottom;

    const svg = el.append('svg').append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    const xS = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, w]).padding(0.3);
    const yS = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.per_capita_kg) * 1.12])
      .range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yS).tickSize(-w).tickFormat('').ticks(5));
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xS).tickSize(0))
      .selectAll('text')
      .attr('transform', 'rotate(-25)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.5em').attr('dy', '0.2em')
      .attr('font-size', '0.62rem')
      .attr('fill', CONFIG.colors.caption);
    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yS).ticks(5).tickFormat(d => d + 'kg'));

    // FAO reference
    svg.append('line').attr('class', 'ref-line')
      .attr('x1', 0).attr('y1', yS(400))
      .attr('x2', w).attr('y2', yS(400));

    // Bars
    svg.selectAll('.b').data(data).join('rect')
      .attr('x', d => xS(d.country))
      .attr('y', d => yS(d.per_capita_kg))
      .attr('width', xS.bandwidth())
      .attr('height', d => h - yS(d.per_capita_kg))
      .attr('fill', d => d.country === '中国' ? CONFIG.colors.accent : '#2a3a4a')
      .attr('rx', 3)
      .on('mousemove', function(ev, d) {
        d3.select(this).attr('opacity', 0.85)
          .attr('filter', 'drop-shadow(0 0 8px rgba(212,168,67,0.3))');
        Tooltip.show(ev, `<b>${d.country}</b> &nbsp; <span class="tt-value">${d.per_capita_kg} kg</span>`);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('opacity', 1).attr('filter', null);
        Tooltip.hide();
      });

    // Value labels
    svg.selectAll('.bl').data(data).join('text')
      .attr('x', d => xS(d.country) + xS.bandwidth() / 2)
      .attr('y', d => yS(d.per_capita_kg) - 6)
      .attr('text-anchor', 'middle').attr('font-size', '0.58rem')
      .attr('fill', CONFIG.colors.caption)
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(d => d.per_capita_kg);
  },

  // ============ Slide 5 右: 雷达 ============
  renderRadar() {
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
        {
          key: 'cn', label: '中国', color: CONFIG.colors.accent,
          values: [
            Math.round((ss.rice + ss.wheat) / 2),
            Math.round(Math.min(100, pc.per_capita_kg / 500 * 100)),
            Math.round(Math.min(100, tech.yield_per_mu / 400 * 100)),
            Math.round(land.total_land_yi_mu / 20 * 100),
            Math.round(Math.min(100, tech.patents / 4500 * 100)),
          ],
        },
        {
          key: 'w', label: '世界平均', color: CONFIG.colors.reference,
          values: [80, 70, 60, 70, 50],
        },
      ],
    });
  },

  // ============ Slide 6: 关键事件时间线 ============
  renderTimeline() {
    const el = d3.select('#chart-timeline .chart-svg');
    el.selectAll('*').remove();
    const box = el.node().getBoundingClientRect();
    const W = box.width, H = box.height;
    if (W < 100 || H < 100) return;

    const allEvents = CONFIG.keyEvents;
    const keyYears = [1949, 1958, 1973, 1978, 1982, 1996, 2003, 2006, 2013, 2020, 2025];
    const events = allEvents.filter(e => keyYears.includes(e.year));

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

    const svg = el.append('svg').append('g')
      .attr('transform', `translate(${m.left},${m.top})`);

    const years = events.map(e => e.year);
    const xS = d3.scaleLinear()
      .domain(d3.extent(years))
      .range([40, w - 40]);
    const midY = h / 2;

    // Main line
    svg.append('line')
      .attr('x1', 0).attr('y1', midY)
      .attr('x2', w).attr('y2', midY)
      .attr('stroke', CONFIG.colors.divider)
      .attr('stroke-width', 1.5);

    events.forEach((ev, i) => {
      const px = xS(ev.year);
      const side = i % 2 === 0 ? -1 : 1;
      const gap = 8 + Math.floor(i / 2) % 2 * 14;
      const tickLen = 18 + gap;

      // Tick line
      svg.append('line')
        .attr('x1', px).attr('y1', midY + side * 4)
        .attr('x2', px).attr('y2', midY + side * tickLen)
        .attr('stroke', CONFIG.colors.axis)
        .attr('stroke-width', 0.8);

      // Dot
      svg.append('circle')
        .attr('cx', px).attr('cy', midY)
        .attr('r', 5)
        .attr('fill', CONFIG.colors.accent)
        .attr('stroke', CONFIG.colors.bg)
        .attr('stroke-width', 2);

      // Year
      svg.append('text')
        .attr('x', px).attr('y', midY + side * tickLen + side * 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.6rem')
        .attr('fill', CONFIG.colors.accent)
        .attr('font-weight', 700)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(ev.year);

      // Label
      const label = shortLabels[ev.label] || ev.label.slice(0, 6);
      svg.append('text')
        .attr('x', px).attr('y', midY - side * tickLen + side * 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.58rem')
        .attr('fill', CONFIG.colors.body)
        .text(label);
    });
  },
};
