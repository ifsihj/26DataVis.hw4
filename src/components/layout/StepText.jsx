function StepText({ step, index, isActive, setRef }) {
  return (
    <article
      ref={setRef}
      className={`step-card ${isActive ? 'is-active' : ''}`}
      data-step={index}
    >
      <p className="step-card__kicker">{step.kicker}</p>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </article>
  );
}

export default StepText;
