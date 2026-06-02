/**
 * config.js — 全局配置
 * 深色科技风色板、类别映射、路由表、常量
 * 数据来源：国家统计局年度数据 (1949-2025) / FAO
 */
const CONFIG = {
  // --- 粮食·中国风暖色系色板 ---
  colors: {
    // 背景 & 面板
    bg: '#1a1510',
    bgAlt: '#1f1a14',
    card: '#252018',
    cardHover: '#2e281e',
    panel: '#1c1712',
    divider: '#3a3226',

    // 文字层级
    title: '#f2e8d5',
    body: '#d4c8b0',
    caption: '#9a8c72',
    muted: '#6b5f4a',

    // 强调色 — 麦浪金 / 丰收橙
    accent: '#d4a843',
    accentGlow: 'rgba(212,168,67,0.25)',
    accent2: '#c97e3b',
    accent2Glow: 'rgba(201,126,59,0.2)',

    // 预警/参考色
    warning: '#e8b84b',
    danger: '#c0392b',
    reference: '#d4a843',
    safe: '#8fa86a',
    faoLine: '#e8b84b',

    // 粮食品种 — 五谷色调
    rice: '#a8c080',
    wheat: '#d4b860',
    corn: '#c9974a',
    beans: '#b08060',
    soybean: '#c08050',
    tubers: '#cc8850',
    cereal: '#b0b870',

    // 消费结构品类
    grain_direct: '#c8b878',
    meat: '#c08060',
    egg_milk: '#b8c0a0',
    aquatic: '#98b0a0',
    vegetable: '#a0b878',
    other: '#b0a898',

    // FAO 大类
    grains: '#a8c080',
    oilseeds: '#d4b860',
    fruits: '#c08070',
    vegetables_fao: '#a0b878',
    nuts: '#d4c898',
    fibers: '#b0a890',
    livestock: '#b8b0a0',

    // 全球对比国家色
    china: '#d4a843',
    usa: '#88a0b0',
    india: '#c0a060',
    brazil: '#a0b878',
    japan: '#c88070',
    nigeria: '#b89860',
    indonesia: '#88b0a0',
    france: '#98a8b8',
    russia: '#b0a090',
    world_avg: '#8a8060',

    // 扩展色板
    sage: '#98b880',
    dusty_rose: '#c89888',
    slate_blue: '#8898a0',
    olive: '#a8b880',
    taupe: '#b8a898',
    mauve: '#b898a8',
    teal: '#88a898',
    rust: '#c89070',
    lavender: '#a0a0b8',
    mustard: '#d4c070',

    // 图表网格 & 轴线
    gridLine: '#2e2618',
    axisLine: '#3d3422',
    axisLabel: '#9a8c72',
  },

  // --- 品类中文名 ---
  labels: {
    rice: '稻谷', wheat: '小麦', corn: '玉米',
    beans: '豆类', soybean: '大豆', tubers: '薯类',
    cereal: '谷物',
    grain_direct: '谷物直接消费', meat: '肉禽',
    egg_milk: '蛋奶', aquatic: '水产',
    vegetable: '蔬菜', other: '其他',
    grains: '谷物类', oilseeds: '油料', fruits: '水果',
    vegetables_fao: '蔬菜', nuts: '坚果',
    fibers: '纤维作物', livestock: '畜产品',
  },

  // --- 粮食品种列表 ---
  grainCategories: ['rice', 'wheat', 'corn', 'soybean', 'tubers'],
  grainCategoriesAll: ['rice', 'wheat', 'corn', 'soybean', 'tubers', 'beans'],
  dietCategories: ['grain_direct', 'meat', 'egg_milk', 'aquatic', 'vegetable', 'other'],
  faoCategories: ['grains', 'oilseeds', 'fruits', 'vegetables_fao', 'nuts', 'fibers', 'livestock'],

  // --- 路由映射 ---
  routes: {
    'dashboard': { title: '仪表盘', page: 'page-dashboard' },
    'deep/1': { title: '人均粮食占有量详解', page: 'deep-panel-1', slide: 'slide-chart1' },
    'deep/2': { title: '粮食总产量详解', page: 'deep-panel-2', slide: 'slide-chart2' },
    'deep/3': { title: '主食消费结构详解', page: 'deep-panel-3', slide: 'slide-stream' },
    'deep/4': { title: '科技驱动增产详解', page: 'deep-panel-4', slide: null },
    'deep/5': { title: '粮食安全综合指标', page: 'deep-panel-5', slide: 'slide-compare' },
    'deep/6': { title: '75年产量全景', page: 'deep-panel-6', slide: 'slide-timeline' },
    'deep/7': { title: 'FAO生产价值分析', page: 'deep-panel-7', slide: null },
    'deep/8': { title: '作物结构演变', page: 'deep-panel-8', slide: null },
  },

  // --- 图表尺寸 ---
  chart: {
    margin: { top: 20, right: 30, bottom: 40, left: 50 },
    getInnerWidth: (w) => w - 70,
    getInnerHeight: (h) => h - 60,
  },

  // --- 关键事件 ---
  keyEvents: [],
  faoKeyEvents: [],
};

/**
 * 获取某品类的颜色
 */
CONFIG.getColor = function(key) {
  return this.colors[key] || '#b0bec5';
};

/**
 * 获取某品类的中文名
 */
CONFIG.getLabel = function(key) {
  return this.labels[key] || key;
};

/**
 * 数据文件路径 (processed data from real sources)
 */
CONFIG.dataPath = function(filename) {
  return `data/processed/${filename}`;
};

/**
 * 深色科技风离散色板生成器
 */
CONFIG.palette = function(n) {
  const baseColors = [
    '#00e5a0', '#4fc3f7', '#ffb74d', '#ef9a9a', '#a5d6a7',
    '#90caf9', '#ce93d8', '#80cbc4', '#ff8a65', '#ffe082',
    '#81c784', '#f48fb1', '#78909c', '#9fa8da', '#b0bec5',
  ];
  if (n <= baseColors.length) return baseColors.slice(0, n);
  return baseColors;
};

// Backward compatibility alias
CONFIG.morandiPalette = CONFIG.palette;
