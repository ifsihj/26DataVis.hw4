function Hero() {
  return (
    <section className="hero">
      <div className="hero__grain" />
      <div className="hero__content">
        <p className="eyebrow">Scroll-driven data story</p>
        <h1>从吃得饱到吃得好，再到吃得负责</h1>
        <p className="hero__subtitle">一部关于中国人餐桌变迁的数据故事</p>
      </div>
      <div className="hero__table" aria-hidden="true">
        <span className="bowl bowl--rice" />
        <span className="bowl bowl--veg" />
        <span className="bowl bowl--meat" />
        <span className="chopsticks" />
      </div>
      <div className="scroll-hint">向下滚动</div>
    </section>
  );
}

export default Hero;
