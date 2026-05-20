import { foodWasteData } from '../../data/foodWasteData.js';

const latest = foodWasteData[foodWasteData.length - 1];

function FoodWasteFlow() {
  return (
    <div className="flow-card chart-card">
      <div className="flow-card__header">
        <p className="chart-title">食物浪费并不是孤立的一端</p>
        <p className="chart-note">mock data：2023 年浪费量约 {latest.wasteAmount} 百万吨，人均 {latest.perCapitaWaste} kg</p>
      </div>
      <div className="flow-row">
        <div className="flow-node">生产<br /><span>土地 / 水 / 能源</span></div>
        <div className="flow-arrow" />
        <div className="flow-node">运输<br /><span>冷链 / 油耗</span></div>
        <div className="flow-arrow" />
        <div className="flow-node">消费<br /><span>家庭 / 餐饮 / 外卖</span></div>
        <div className="flow-arrow flow-arrow--loss" />
        <div className="flow-node flow-node--loss">浪费<br /><span>资源投入被一并损失</span></div>
      </div>
      <div className="waste-icons" aria-label="剩饭图标阵列">
        {Array.from({ length: 28 }).map((_, index) => (
          <span key={index} className={index % 4 === 0 ? 'is-dim' : ''}>●</span>
        ))}
      </div>
    </div>
  );
}

export default FoodWasteFlow;
