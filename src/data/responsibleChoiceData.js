export const responsibleChoiceSources = {
  foodImpacts: {
    label: 'Poore & Nemecek (2018), Science / Our World in Data',
    url: 'https://ourworldindata.org/grapher/food-emissions-supply-chain',
  },
};

export const foodSupplyChainStages = [
  { key: 'landUseChange', label: '土地用途变化', color: '#289b4b' },
  { key: 'farm', label: '农场', color: '#a57c63' },
  { key: 'animalFeed', label: '动物饲料', color: '#f47a37' },
  { key: 'processing', label: '加工', color: '#3979a8' },
  { key: 'transport', label: '运输', color: '#ed5b61' },
  { key: 'retail', label: '零售', color: '#f0c419' },
  { key: 'packaging', label: '包装', color: '#b7adaa' },
];

export const foodSupplyChainData = [
  { food: '苹果', landUseChange: -0.029, farm: 0.226, animalFeed: 0, processing: 0.004, transport: 0.096, retail: 0.017, packaging: 0.045, losses: 0.071 },
  { food: '香蕉', landUseChange: -0.026, farm: 0.27, animalFeed: 0, processing: 0.06, transport: 0.296, retail: 0.021, packaging: 0.066, losses: 0.175 },
  { food: '牛肉（肉牛）', landUseChange: 23.238, farm: 56.228, animalFeed: 2.681, processing: 1.811, transport: 0.494, retail: 0.234, packaging: 0.352, losses: 14.44 },
  { food: '牛肉（奶牛）', landUseChange: 1.266, farm: 21.916, animalFeed: 3.504, processing: 1.548, transport: 0.592, retail: 0.254, packaging: 0.375, losses: 3.848 },
  { food: '蔗糖', landUseChange: 1.263, farm: 0.491, animalFeed: 0, processing: 0.037, transport: 0.795, retail: 0.037, packaging: 0.084, losses: 0.492 },
  { food: '木薯', landUseChange: 0.589, farm: 0.22, animalFeed: 0, processing: 0, transport: 0.094, retail: 0.039, packaging: 0.045, losses: 0.329 },
  { food: '奶酪', landUseChange: 4.467, farm: 13.096, animalFeed: 2.353, processing: 0.74, transport: 0.139, retail: 0.333, packaging: 0.172, losses: 2.577 },
  { food: '柑橘', landUseChange: -0.146, farm: 0.307, animalFeed: 0, processing: 0, transport: 0.094, retail: 0.017, packaging: 0.045, losses: 0.072 },
  { food: '咖啡', landUseChange: 3.819, farm: 10.754, animalFeed: 0, processing: 0.613, transport: 0.135, retail: 0.052, packaging: 1.687, losses: 11.467 },
  { food: '黑巧克力', landUseChange: 25.815, farm: 6.687, animalFeed: 0, processing: 0.334, transport: 0.111, retail: 0.038, packaging: 0.722, losses: 12.94 },
  { food: '鸡蛋', landUseChange: 0.71, farm: 1.32, animalFeed: 2.205, processing: 0, transport: 0.084, retail: 0.036, packaging: 0.161, losses: 0.153 },
  { food: '养殖鱼', landUseChange: 1.195, farm: 8.056, animalFeed: 1.834, processing: 0.045, transport: 0.248, retail: 0.09, packaging: 0.138, losses: 2.027 },
  { food: '花生', landUseChange: 0.485, farm: 1.576, animalFeed: 0, processing: 0.411, transport: 0.133, retail: 0.047, packaging: 0.109, losses: 0.469 },
  { food: '羊肉', landUseChange: 0.648, farm: 27.026, animalFeed: 3.283, processing: 1.54, transport: 0.679, retail: 0.301, packaging: 0.348, losses: 5.898 },
  { food: '玉米', landUseChange: 0.475, farm: 0.717, animalFeed: 0, processing: 0.078, transport: 0.09, retail: 0.039, packaging: 0.09, losses: 0.211 },
  { food: '牛奶', landUseChange: 0.512, farm: 1.509, animalFeed: 0.244, processing: 0.154, transport: 0.093, retail: 0.265, packaging: 0.1, losses: 0.274 },
  { food: '坚果', landUseChange: -3.258, farm: 3.374, animalFeed: 0, processing: 0.051, transport: 0.107, retail: 0.043, packaging: 0.124, losses: -0.008 },
  { food: '橄榄油', landUseChange: -0.324, farm: 3.672, animalFeed: 0, processing: 0.567, transport: 0.414, retail: 0.039, packaging: 0.74, losses: 0.316 },
  { food: '棕榈油', landUseChange: 2.756, farm: 1.875, animalFeed: 0, processing: 1.125, transport: 0.185, retail: 0.039, packaging: 0.788, losses: 0.549 },
  { food: '豌豆', landUseChange: 0, farm: 0.717, animalFeed: 0, processing: 0, transport: 0.095, retail: 0.039, packaging: 0.045, losses: 0.079 },
  { food: '猪肉', landUseChange: 2.244, farm: 2.477, animalFeed: 4.298, processing: 0.416, transport: 0.501, retail: 0.278, packaging: 0.432, losses: 1.659 },
  { food: '禽肉', landUseChange: 3.508, farm: 0.928, animalFeed: 2.452, processing: 0.607, transport: 0.381, retail: 0.244, packaging: 0.293, losses: 1.452 },
  { food: '大米', landUseChange: -0.022, farm: 3.554, animalFeed: 0, processing: 0.065, transport: 0.096, retail: 0.063, packaging: 0.084, losses: 0.612 },
  { food: '根茎蔬菜', landUseChange: 0.013, farm: 0.154, animalFeed: 0, processing: 0, transport: 0.114, retail: 0.039, packaging: 0.045, losses: 0.062 },
  { food: '养殖虾', landUseChange: 0.331, farm: 13.454, animalFeed: 4.03, processing: 0, transport: 0.331, retail: 0.352, packaging: 0.536, losses: 7.832 },
  { food: '豆奶', landUseChange: 0.18, farm: 0.093, animalFeed: 0, processing: 0.163, transport: 0.11, retail: 0.27, packaging: 0.098, losses: 0.062 },
  { food: '西红柿', landUseChange: 0.373, farm: 0.705, animalFeed: 0, processing: 0.012, transport: 0.177, retail: 0.017, packaging: 0.146, losses: 0.658 },
  { food: '小麦与黑麦', landUseChange: 0.097, farm: 0.82, animalFeed: 0, processing: 0.21, transport: 0.125, retail: 0.056, packaging: 0.087, losses: 0.178 },
].map((item) => ({
  ...item,
  total: Number(foodSupplyChainStages.reduce((sum, stage) => sum + item[stage.key], 0).toFixed(3)),
})).sort((a, b) => b.total - a.total);
