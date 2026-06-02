<script setup>
import { ref } from 'vue';
import StepText from './StepText.vue';
import { useScrollStep } from '../../utils/useScrollStep.js';

const props = defineProps({
  id: { type: String, required: true },
  tone: { type: String, default: 'field' },
  steps: { type: Array, required: true },
});

const sectionRef = ref(null);
const { activeStep, scrollProgress, setStepRef } = useScrollStep(props.steps.length, sectionRef);
</script>

<template>
  <section ref="sectionRef" class="scrolly-section" :class="`scrolly-section--${tone}`" :id="id">
    <div class="sticky-visual">
      <slot name="visual" :active-step="activeStep" :scroll-progress="scrollProgress" />
    </div>
    <div class="scroll-steps">
      <StepText
        v-for="(step, index) in steps"
        :key="step.title"
        :ref="setStepRef(index)"
        :step="step"
        :index="index"
        :is-active="activeStep === index"
      />
    </div>
  </section>
</template>
