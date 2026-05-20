function ResponsiblePlate() {
  const current = [
    { label: '谷物', size: 22, color: '#d2a857' },
    { label: '蔬菜水果', size: 26, color: '#4f7b4b' },
    { label: '猪牛肉', size: 34, color: '#8f2f24' },
    { label: '奶蛋水产', size: 18, color: '#4c7b82' },
  ];
  const responsible = [
    { label: '谷物', size: 28, color: '#d2a857' },
    { label: '蔬菜水果', size: 38, color: '#4f7b4b' },
    { label: '猪牛肉', size: 14, color: '#8f2f24' },
    { label: '奶蛋水产', size: 20, color: '#4c7b82' },
  ];

  return (
    <div className="responsible-card chart-card">
      <div>
        <p className="chart-title">餐盘的影子：当前选择与低碳选择</p>
        <p className="chart-note">mock scenario：减少高碳肉类、增加植物性食物，估算碳足迹下降 31%</p>
      </div>
      <div className="plate-pair">
        <MiniPlate title="当前餐盘" items={current} carbon="5.8 kg CO2e" />
        <MiniPlate title="更低碳餐盘" items={responsible} carbon="4.0 kg CO2e" />
      </div>
      <div className="carbon-saving">碳足迹减少 <strong>31%</strong></div>
    </div>
  );
}

function MiniPlate({ title, items, carbon }) {
  let offset = 0;
  const gradient = items.map((item) => {
    const segment = `${item.color} ${offset}% ${offset + item.size}%`;
    offset += item.size;
    return segment;
  });

  return (
    <div className="mini-plate-wrap">
      <div className="mini-plate" style={{ background: `conic-gradient(${gradient.join(', ')})` }} />
      <h3>{title}</h3>
      <p>{carbon}</p>
    </div>
  );
}

export default ResponsiblePlate;
