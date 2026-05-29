/**
 * config.js — 全局配置
 * 莫兰迪色板、类别映射、路由表、常量
 * 数据来源：国家统计局年度数据 (1949-2025) / FAO
 */
const CONFIG = {
  // --- 莫兰迪色板 ---
  colors: {
    // 背景 & 文字
    bg: '#F2EDE4',
    card: '#FFFFFF',
    divider: '#E2DCD0',

    title: '#2C2C2C',
    body: '#4A4A4A',
    caption: '#9A9A9A',

    // 粮食品种
    rice: '#A8B8A0',
    wheat: '#D4C9C3',
    corn: '#D4B8A0',
    beans: '#B8BFA8',
    soybean: '#C0B0A0',
    tubers: '#C4A494',
    cereal: '#B0B4A0',

    // 消费结构品类
    grain_direct: '#D0C4B8',
    meat: '#C4A4A4',
    egg_milk: '#A8BCC4',
    aquatic: '#98B4B8',
    vegetable: '#B0B898',
    other: '#C4B8B0',

    // FAO 大类
    grains: '#A8B8A0',
    oilseeds: '#D4B8A0',
    fruits: '#C4A4A4',
    vegetables_fao: '#B0B898',
    nuts: '#D4C9C3',
    fibers: '#B8BFA8',
    livestock: '#A8BCC4',

    // 强调色
    accent: '#9E6B6B',
    accent2: '#8D6B6B',
    reference: '#7B8B8B',
    safe: '#8BA89A',

    // 全球对比国家色
    china: '#9E6B6B',
    usa: '#8BA0A8',
    india: '#B0A880',
    brazil: '#A8B8A0',
    japan: '#C4A4A4',
    nigeria: '#D4B8A0',
    indonesia: '#B0B0A0',
    france: '#98A8B8',
    russia: '#C4B8A8',
    world_avg: '#7B8B8B',

    // 扩展色板 - 更多莫兰迪色调
    sage: '#A8B8A0',
    dusty_rose: '#C4A4A4',
    slate_blue: '#8B98A8',
    olive: '#A0A888',
    taupe: '#B8A898',
    mauve: '#B0A0B0',
    teal: '#88A8A0',
    rust: '#C4A894',
    lavender: '#B0B0C0',
    mustard: '#C4B898',
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
    'deep/1': { title: '人均粮食占有量详解', page: 'page-deep-1' },
    'deep/2': { title: '粮食总产量详解', page: 'page-deep-2' },
    'deep/3': { title: '主食消费结构详解', page: 'page-deep-3' },
    'deep/4': { title: '科技驱动增产详解', page: 'page-deep-4' },
    'deep/5': { title: '粮食安全综合指标', page: 'page-deep-5' },
    'deep/6': { title: '75年产量全景', page: 'page-deep-6' },
    'deep/7': { title: 'FAO生产价值分析', page: 'page-deep-7' },
    'deep/8': { title: '作物结构演变', page: 'page-deep-8' },
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
  return this.colors[key] || '#C4B8B0';
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
 * 莫兰迪色系离散色板生成器
 */
CONFIG.morandiPalette = function(n) {
  const baseColors = [
    '#A8B8A0', '#D4C9C3', '#D4B8A0', '#B8BFA8', '#C4A494',
    '#C4A4A4', '#A8BCC4', '#98B4B8', '#B0B898', '#C4B8B0',
    '#9E6B6B', '#7B8B8B', '#8BA0A8', '#B0A880', '#A8B8A0',
  ];
  if (n <= baseColors.length) return baseColors.slice(0, n);
  return baseColors;
};
