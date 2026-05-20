import StepText from './StepText.jsx';
import { useScrollStep } from '../../utils/useScrollStep.js';

function ScrollSection({ id, tone = 'field', steps, renderVisual }) {
  const { activeStep, stepRefs } = useScrollStep(steps.length);

  return (
    <section className={`scrolly-section scrolly-section--${tone}`} id={id}>
      <div className="sticky-visual">{renderVisual(activeStep)}</div>
      <div className="scroll-steps">
        {steps.map((step, index) => (
          <StepText
            key={step.title}
            step={step}
            index={index}
            isActive={activeStep === index}
            setRef={(node) => {
              stepRefs.current[index] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default ScrollSection;
