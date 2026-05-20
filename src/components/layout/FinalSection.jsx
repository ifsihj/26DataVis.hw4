import FinalTimeline from '../charts/FinalTimeline.jsx';

function FinalSection() {
  return (
    <section className="final-section">
      <div className="final-section__inner">
        <p className="eyebrow">Final</p>
        <h2>从一碗饭，到一桌菜，再到一份责任</h2>
        <p>
          中国餐桌的变化不是简单的消费升级，而是国家发展、农业技术、城市化、收入增长、消费平台和环境意识共同塑造的结果。
        </p>
        <p>
          吃得饱，是发展给予生活的底线；吃得好，是时代给予个体的选择；吃得负责，则是我们给予未来的回答。
        </p>
        <FinalTimeline />
      </div>
    </section>
  );
}

export default FinalSection;
