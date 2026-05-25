export const environmentalImpactTypes = [
  { key: 'land', label: '土地足迹' },
  { key: 'water', label: '水足迹' },
  { key: 'phosphorus', label: '磷足迹' },
  { key: 'nitrogen', label: '氮足迹' },
  { key: 'carbon', label: '碳足迹' },
];

export const environmentalImpactCategories = [
  { key: 'meat', label: '肉类', color: '#6f94d4' },
  { key: 'poultry', label: '禽肉', color: '#f3a15f' },
  { key: 'aquatic', label: '水产品', color: '#b7b7b7' },
  { key: 'eggs', label: '蛋类', color: '#ffd84f' },
  { key: 'vegetables', label: '蔬菜', color: '#7fb5dc' },
  { key: 'mushrooms', label: '菌菇类', color: '#92c878' },
  { key: 'roots', label: '根茎薯类', color: '#5d6f93' },
  { key: 'cereals', label: '谷物', color: '#c17a45' },
  { key: 'legumes', label: '豆类', color: '#8e8e8e' },
  { key: 'fruits', label: '水果', color: '#bba247' },
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
