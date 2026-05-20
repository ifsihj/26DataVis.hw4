<script setup>
import StepText from './StepText.vue';
import { useScrollStep } from '../../utils/useScrollStep.js';

const props = defineProps({
  id: { type: String, required: true },
  tone: { type: String, default: 'field' },
  steps: { type: Array, required: true },
});

const { activeStep, setStepRef } = useScrollStep(props.steps.length);
</script>

<template>
  <section class="scrolly-section" :class="`scrolly-section--${tone}`" :id="id">
    <div class="sticky-visual">
      <slot name="visual" :active-step="activeStep" />
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
