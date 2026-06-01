export const environmentalImpactTypes = [
  { key: 'land', label: '土地足迹' },
  { key: 'water', label: '水足迹' },
  { key: 'phosphorus', label: '磷足迹' },
  { key: 'nitrogen', label: '氮足迹' },
  { key: 'carbon', label: '碳足迹' },
];

export const environmentalImpactCategories = [
  { key: 'meat', label: '肉类', color: '#8f3328' },
  { key: 'poultry', label: '禽肉', color: '#b45d48' },
  { key: 'aquatic', label: '水产品', color: '#82939a' },
  { key: 'eggs', label: '蛋类', color: '#d4a64a' },
  { key: 'vegetables', label: '蔬菜', color: '#315f49' },
  { key: 'mushrooms', label: '菌菇类', color: '#78956a' },
  { key: 'roots', label: '根茎薯类', color: '#9b7258' },
  { key: 'cereals', label: '谷物', color: '#c49c6b' },
  { key: 'legumes', label: '豆类', color: '#648568' },
  { key: 'fruits', label: '水果', color: '#b99a56' },
];

export const foodWasteEnvironmentalImpactData = [
  {
    key: 'land',
    label: '土地足迹',
    values: { meat: 47, poultry: 5, aquatic: 0, eggs: 6, vegetables: 13, mushrooms: 2, roots: 0, cereals: 4, legumes: 9, fruits: 14 },
  },
  {
    key: 'water',
    label: '水足迹',
    values: { meat: 40, poultry: 21, aquatic: 0, eggs: 3, vegetables: 4, mushrooms: 1, roots: 2, cereals: 3, legumes: 12, fruits: 14 },
  },
  {
    key: 'phosphorus',
    label: '磷足迹',
    values: { meat: 29, poultry: 20, aquatic: 5, eggs: 5, vegetables: 4, mushrooms: 1, roots: 1, cereals: 12, legumes: 21, fruits: 2 },
  },
  {
    key: 'nitrogen',
    label: '氮足迹',
    values: { meat: 35, poultry: 18, aquatic: 2, eggs: 0, vegetables: 17, mushrooms: 2, roots: 0, cereals: 5, legumes: 8, fruits: 12 },
  },
  {
    key: 'carbon',
    label: '碳足迹',
    values: { meat: 67, poultry: 15, aquatic: 1, eggs: 1, vegetables: 2, mushrooms: 0, roots: 2, cereals: 6, legumes: 3, fruits: 3 },
  },
];
