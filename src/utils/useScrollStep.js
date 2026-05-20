import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useScrollStep(stepCount) {
  const activeStep = ref(0);
  const stepRefs = ref([]);
  let observer;

  const setStepRef = (index) => (node) => {
    if (node) stepRefs.value[index] = node.$el ?? node;
  };

  const updateClosestStep = () => {
    const focusY = window.innerHeight * 0.54;
    let nextStep = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    stepRefs.value.slice(0, stepCount).forEach((node, index) => {
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
      activeStep.value = nextStep;
    }
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          activeStep.value = Number(visible.target.dataset.step);
        }
      },
      {
        root: null,
        threshold: [0.35, 0.55, 0.75],
        rootMargin: '-22% 0px -32% 0px',
      },
    );

    stepRefs.value.slice(0, stepCount).forEach((node) => {
      if (node) observer.observe(node);
    });

    window.addEventListener('scroll', updateClosestStep, { passive: true });
    window.addEventListener('resize', updateClosestStep);
    updateClosestStep();
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    window.removeEventListener('scroll', updateClosestStep);
    window.removeEventListener('resize', updateClosestStep);
  });

  return { activeStep, setStepRef };
}
