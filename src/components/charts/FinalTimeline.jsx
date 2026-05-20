function FinalTimeline() {
  const items = [
    { stage: '吃得饱', keyword: '粮食安全', text: '发展给予生活的底线' },
    { stage: '吃得好', keyword: '饮食丰富', text: '时代给予个体的选择' },
    { stage: '吃得负责', keyword: '可持续消费', text: '我们给予未来的回答' },
  ];

  return (
    <div className="timeline">
      {items.map((item, index) => (
        <div className="timeline__item" key={item.stage}>
          <span className="timeline__dot">{index + 1}</span>
          <h3>{item.stage}</h3>
          <strong>{item.keyword}</strong>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export default FinalTimeline;
