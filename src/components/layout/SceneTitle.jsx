function SceneTitle({ eyebrow, title, subtitle }) {
  return (
    <section className="scene-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </section>
  );
}

export default SceneTitle;
