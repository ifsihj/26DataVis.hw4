import { dietStructureData, dietCategoryLabels } from '../../data/dietStructureData.js';

const years = [1980, 2000, 2020];
const colors = {
  grain: '#d2a857',
  meat: '#8f2f24',
  egg: '#e5c46a',
  dairy: '#f4e8c5',
  aquatic: '#4c7b82',
  vegetables: '#4f7b4b',
  fruit: '#d08a43',
  oil: '#7a5b3a',
};

function PlateComparison({ activeStep }) {
  const year = years[Math.min(activeStep, years.length - 1)];
  const item = dietStructureData.find((row) => row.year === year);
  let offset = 0;
  const segments = Object.entries(colors).map(([key, color]) => {
    const value = item[key];
    const segment = `${color} ${offset}% ${offset + value}%`;
    offset += value;
    return segment;
  });

  return (
    <div className="plate-card">
      <div className="plate-card__meta">
        <p className="chart-title">{year} 年餐盘结构</p>
        <p className="chart-note">多样性指数：{item.diversityIndex}</p>
      </div>
      <div className="plate" style={{ background: `conic-gradient(${segments.join(', ')})` }}>
        <div className="plate__inner">{year}</div>
      </div>
      <div className="plate-legend">
        {Object.keys(colors).map((key) => (
          <span key={key}><i style={{ backgroundColor: colors[key] }} />{dietCategoryLabels[key]}</span>
        ))}
      </div>
    </div>
  );
}

export default PlateComparison;
