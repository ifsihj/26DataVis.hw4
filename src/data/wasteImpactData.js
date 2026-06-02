export const wasteImpactData = {
  sourceName: 'UNEP Food Waste Index Report 2024',
  sourceUrl: 'https://www.unep.org/resources/publication/food-waste-index-report-2024',
  year: 2022,
  annualWasteTonnes: 1052000000,
  perCapitaKg: 132,
  sectors: [
    { key: 'household', label: '家庭', tonnes: 631000000, share: 60, color: '#8f3328' },
    { key: 'foodService', label: '餐饮服务', tonnes: 290000000, share: 28, color: '#d6ad5a' },
    { key: 'retail', label: '零售', tonnes: 131000000, share: 12, color: '#537c4a' },
  ],
};

export const wasteCounterCopy = {
  headline: '在你阅读这一页时，浪费仍在继续。',
  note: '以下换算基于 UNEP《Food Waste Index Report 2024》中的 2022 年全球食品浪费估计。',
};
