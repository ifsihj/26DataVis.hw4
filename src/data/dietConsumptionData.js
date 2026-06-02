const years = [1990, 1995, 2000, 2005, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const dietConsumptionCategories = [
  { key: 'staple', label: '主食类', color: '#9b7258' },
  { key: 'pork', label: '猪肉', color: '#8f3328' },
  { key: 'redMeat', label: '牛羊肉', color: '#b45d48' },
  { key: 'poultry', label: '禽肉', color: '#d4a64a' },
  { key: 'aquatic', label: '水产品', color: '#4c7d86' },
  { key: 'dairy', label: '蛋奶类', color: '#315f49' },
  { key: 'vegetables', label: '蔬菜类', color: '#78956a' },
  { key: 'fruit', label: '水果坚果', color: '#b99a56' },
  { key: 'condiments', label: '油脂糖盐', color: '#82939a' },
];

const urbanSeries = {
  staple: [130.72, 97, 82.31, 76.98, 121.3, 117.1, 112.6, 111.9, 109.7, 110, 110.6, 120.1, 124.8, 116.2, 115.6, 106.7],
  pork: [18.46, 17.24, 16.73, 20.15, 20.4, 20.8, 20.7, 20.4, 20.6, 22.7, 20.3, 19, 25.1, 26, 28.7, 26.4],
  redMeat: [3.28, 2.44, 3.33, 3.71, 3.3, 3.4, 3.9, 4.3, 4.2, 4.2, 4.3, 4.5, 4.8, 4.7, 5.7, 6.5],
  poultry: [3.42, 3.97, 5.44, 8.97, 8.1, 9.1, 9.4, 10.2, 9.7, 9.8, 11.4, 13, 12.3, 11.9, 12.6, 12.8],
  aquatic: [7.69, 9.2, 11.74, 12.55, 14, 14.4, 14.7, 14.8, 14.8, 14.3, 16.7, 16.6, 16.7, 16.2, 17.4, 17],
  dairy: [11.88, 14.36, 21.15, 28.32, 30.2, 31.5, 32.8, 33.5, 34.2, 35.1, 36.4, 37.8, 38.5, 39.2, 40.1, 41.3],
  vegetables: [138.7, 116.47, 114.74, 118.58, 115.6, 116.8, 117.5, 118.2, 119.1, 120.3, 121.5, 122.8, 123.6, 124.5, 125.8, 126.4],
  fruit: [41.11, 44.96, 57.48, 56.69, 58.3, 59.6, 61.2, 62.8, 64.5, 66.3, 68.1, 69.8, 71.5, 73.2, 75.1, 76.8],
  condiments: [6.4, 7.11, 8.16, 9.25, 9.8, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1],
};

const ruralSeries = {
  staple: [262.08, 258.35, 252.56, 210.76, 178.5, 167.7, 159.5, 157.3, 154.7, 148.6, 154.9, 168.4, 170.8, 164.6, 159.9, 148.6],
  pork: [10.54, 10.58, 13.28, 15.62, 19.1, 19.2, 19.5, 18.7, 19.5, 23, 20.2, 17.1, 25.4, 28.1, 32.9, 30.4],
  redMeat: [0.8, 0.71, 1.13, 1.47, 1.5, 1.5, 1.7, 2, 1.9, 2.1, 2.2, 2.3, 2.7, 2.9, 3.8, 4.7],
  poultry: [1.25, 1.83, 2.81, 3.67, 6.2, 6.7, 7.1, 7.9, 7.9, 8, 10, 12.4, 12.4, 11.4, 12, 12.2],
  aquatic: [2.13, 3.36, 3.92, 4.94, 6.6, 6.8, 7.2, 7.5, 7.4, 7.8, 9.6, 10.3, 10.9, 10.7, 12.2, 12.5],
  dairy: [3.51, 3.82, 5.83, 7.57, 10.2, 11.5, 12.8, 14.5, 16.2, 18.1, 20.4, 22.8, 25.5, 28.2, 31.1, 34.3],
  vegetables: [134, 104.62, 106.74, 102.28, 105.6, 106.8, 107.5, 108.2, 109.1, 110.3, 111.5, 112.8, 113.6, 114.5, 115.8, 116.4],
  fruit: [5.89, 13.75, 19.12, 18.14, 20.3, 21.6, 23.2, 24.8, 26.5, 28.3, 30.1, 31.8, 33.5, 35.2, 37.1, 38.8],
  condiments: [6.67, 7.08, 8.34, 7.14, 8.8, 9.1, 9.3, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1],
};

function buildRows(series) {
  return years.map((year, index) => ({
    year,
    ...Object.fromEntries(dietConsumptionCategories.map((category) => [category.key, series[category.key][index]])),
  }));
}

export const dietConsumptionYears = years;
export const urbanDietConsumption = buildRows(urbanSeries);
export const ruralDietConsumption = buildRows(ruralSeries);

export const dietConsumptionSourceNote = '来源：子项目整理数据。2006-2012 年无观测值，趋势图以虚线连接缺口两端。';

export const engelCoefficientData = [
  { year: 1978, urban: 57.5, rural: 67.7 },
  { year: 1980, urban: 56.9, rural: 61.8 },
  { year: 1985, urban: 53.3, rural: 57.8 },
  { year: 1990, urban: 54.2, rural: 58.8 },
  { year: 1991, urban: 53.8, rural: 57.6 },
  { year: 1992, urban: 53, rural: 57.6 },
  { year: 1993, urban: 50.3, rural: 58.1 },
  { year: 1994, urban: 50, rural: 58.9 },
  { year: 1995, urban: 50.1, rural: 58.6 },
  { year: 1996, urban: 48.8, rural: 56.3 },
  { year: 1997, urban: 46.6, rural: 55.1 },
  { year: 1998, urban: 44.7, rural: 53.4 },
  { year: 1999, urban: 42.1, rural: 52.6 },
  { year: 2000, urban: 39.4, rural: 49.1 },
  { year: 2001, urban: 38.2, rural: 47.7 },
  { year: 2002, urban: 37.7, rural: 46.2 },
  { year: 2003, urban: 37.1, rural: 45.6 },
  { year: 2004, urban: 37.7, rural: 47.2 },
  { year: 2005, urban: 36.7, rural: 45.5 },
  { year: 2006, urban: 35.8, rural: 43 },
  { year: 2007, urban: 36.3, rural: 43.1 },
  { year: 2008, urban: 37.9, rural: 43.7 },
  { year: 2009, urban: 36.5, rural: 41 },
  { year: 2018, urban: 27.7, rural: 30.1 },
  { year: 2019, urban: 27.6, rural: 30 },
  { year: 2020, urban: 29.2, rural: 32.7 },
  { year: 2021, urban: 28.6, rural: 32.7 },
  { year: 2022, urban: 29.5, rural: 33 },
  { year: 2023, urban: 28.8, rural: 32.4 },
  { year: 2024, urban: 28.8, rural: 32.3 },
];

export const dietStructureMacros = [
  { key: 'staple', label: '主食类', color: '#c49c6b', detailKeys: ['staple'] },
  { key: 'animal', label: '动物性蛋白', color: '#b45d48', detailKeys: ['pork', 'redMeat', 'poultry', 'aquatic', 'dairy'] },
  { key: 'vegfruit', label: '蔬菜水果', color: '#78956a', detailKeys: ['vegetables', 'fruit'] },
  { key: 'condiments', label: '油脂糖盐', color: '#d4a64a', detailKeys: ['condiments'] },
];

export const dietStructureSnapshots = [
  { id: 'urban-1990', population: '城镇', year: 1990, staple: 130.72, pork: 18.46, redMeat: 3.28, poultry: 3.42, aquatic: 7.69, dairy: 11.88, vegetables: 138.7, fruit: 41.11, condiments: 6.4 },
  { id: 'urban-2024', population: '城镇', year: 2024, staple: 106.7, pork: 26.4, redMeat: 6.5, poultry: 12.8, aquatic: 17, dairy: 29, vegetables: 108.5, fruit: 71.9, condiments: 10.1 },
  { id: 'rural-1990', population: '农村', year: 1990, staple: 262.08, pork: 10.54, redMeat: 0.8, poultry: 1.25, aquatic: 2.13, dairy: 3.51, vegetables: 134, fruit: 5.89, condiments: 6.67 },
  { id: 'rural-2024', population: '农村', year: 2024, staple: 148.6, pork: 30.4, redMeat: 4.7, poultry: 12.2, aquatic: 12.5, dairy: 23.4, vegetables: 108.9, fruit: 56.3, condiments: 11.7 },
];
