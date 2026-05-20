import { useEffect, useRef, useState } from 'react';

export function useScrollStep(stepCount) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const updateClosestStep = () => {
      const focusY = window.innerHeight * 0.54;
      let nextStep = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      stepRefs.current.slice(0, stepCount).forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - focusY);
        const isNearViewport = rect.bottom > 0 && rect.top < window.innerHeight;

        if (isNearViewport && distance < closestDistance) {
          closestDistance = distance;
          nextStep = index;
        }
      });

      if (nextStep !== null) {
        setActiveStep(nextStep);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveStep(Number(visible.target.dataset.step));
        }
      },
      {
        root: null,
        threshold: [0.35, 0.55, 0.75],
        rootMargin: '-22% 0px -32% 0px',
      },
    );

    stepRefs.current.slice(0, stepCount).forEach((node) => {
      if (node) observer.observe(node);
    });

    window.addEventListener('scroll', updateClosestStep, { passive: true });
    window.addEventListener('resize', updateClosestStep);
    updateClosestStep();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateClosestStep);
      window.removeEventListener('resize', updateClosestStep);
    };
  }, [stepCount]);

  return { activeStep, stepRefs };
}
