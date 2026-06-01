/**
 * utils.js — 共享工具函数
 * Tooltip, 格式化, SVG创建, 交互辅助
 */

// --- Tooltip ---
const Tooltip = {
  el: null,

  init: function() {
    this.el = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('display', 'none');
  },

  show: function(event, html) {
    if (!this.el) this.init();
    const [x, y] = d3.pointer(event, document.body);
    this.el
      .style('display', 'block')
      .style('left', (x + 14) + 'px')
      .style('top', (y - 10) + 'px')
      .html(html);
  },

  hide: function() {
    if (this.el) this.el.style('display', 'none');
  },
};

// --- 格式化数字 ---
function fmtNum(n) {
  if (n == null) return '—';
  if (typeof n === 'number') return n.toLocaleString('zh-CN');
  return n;
}

function fmtPct(n) {
  if (n == null) return '—';
  return n + '%';
}

function fmtYear(n) {
  return String(n);
}

function fmtWanTon(n) {
  if (n == null) return '—';
  if (n >= 10000) return (n / 10000).toFixed(2) + '亿吨';
  return fmtNum(n) + '万吨';
}

function fmtKilo(n) {
  if (n == null) return '—';
  return n.toFixed(1) + 'kg';
}

// --- 安全获取容器尺寸 ---
function getContainerSize(selector) {
  const el = document.querySelector(selector);
  if (!el) return { width: 600, height: 400 };
  const rect = el.getBoundingClientRect();
  return {
    width: Math.max(rect.width - 4, 300),
    height: Math.max(rect.height - 4, 200),
  };
}

// --- 创建 SVG ---
function createSVG(container, width, height) {
  const svg = d3.select(container)
    .selectAll('svg')
    .data([null])
    .join('enter')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.select(container).select('svg')
    .attr('width', width)
    .attr('height', height);

  return d3.select(container).select('svg');
}

// --- 添加网格 ---
function addGrid(svg, gX, gY, height, width) {
  svg.append('g')
    .attr('class', 'grid')
    .call(d3.axisBottom(gX).tickSize(height).tickFormat(''));

  svg.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(gY).tickSize(-width).tickFormat(''));
}

// --- 绘制参考线 ---
function drawRefLine(svg, x, y, x2, y2, label) {
  const g = svg.append('g');
  g.append('line')
    .attr('class', 'ref-line')
    .attr('x1', x).attr('y1', y)
    .attr('x2', x2).attr('y2', y2);
  if (label) {
    g.append('text')
      .attr('class', 'ref-label')
      .attr('x', x2).attr('y', y2 - 4)
      .attr('text-anchor', 'end')
      .text(label);
  }
}

// --- 绘制关键事件标注 ---
function drawAnnotations(svg, data, xScale, yScale, keyX = 'year', keyY = 'value') {
  if (!CONFIG.keyEvents.length) return;

  const g = svg.append('g').attr('class', 'annotations');
  const eventsByYear = {};
  CONFIG.keyEvents.forEach(ev => { eventsByYear[ev.year] = ev; });

  Object.values(eventsByYear).forEach(ev => {
    const px = xScale(ev[keyX] || ev.year);
    if (px < 0 || px > xScale.range()[1]) return;

    const point = data.find(d => d[keyX] === ev.year);
    if (!point) return;
    const py = yScale(point[keyY]);

    g.append('line')
      .attr('class', 'annotation-line')
      .attr('x1', px).attr('y1', py)
      .attr('x2', px).attr('y2', py + 30);

    g.append('circle')
      .attr('class', 'annotation-dot')
      .attr('cx', px).attr('cy', py)
      .attr('r', 3);

    g.append('text')
      .attr('class', 'annotation-label')
      .attr('x', px).attr('y', py + 42)
      .attr('text-anchor', 'middle')
      .text(ev.label);
  });
}

// --- 图例 ---
function drawLegend(svg, items, x, y, onClick) {
  const g = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${x}, ${y})`);

  let cx = 0;
  items.forEach((item) => {
    const ig = g.append('g')
      .attr('class', 'legend-item')
      .attr('data-key', item.key)
      .classed('disabled', item.active === false)
      .on('click', () => {
        if (onClick) onClick(item.key);
      });

    ig.append('rect')
      .attr('x', cx).attr('y', -6)
      .attr('width', 10).attr('height', 10)
      .attr('fill', item.color)
      .attr('rx', 1);

    ig.append('text')
      .attr('x', cx + 14).attr('y', 2)
      .text(item.label);

    cx += ig.node().getBBox().width + 20;
  });
}

// --- 颜色插值 (莫兰迪渐变) ---
function morandiInterpolate(t) {
  // 在两个莫兰迪色调之间插值
  const c1 = d3.rgb('#A8B8A0');
  const c2 = d3.rgb('#C4A4A4');
  return d3.interpolate(c1, c2)(t);
}

// --- 平滑过渡 ---
function smoothTransition(selection, duration = 600) {
  return selection.transition().duration(duration).ease(d3.easeCubicInOut);
}

// --- 响应式断点检测 ---
function isMobile() {
  return window.innerWidth < 768;
}
function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}
