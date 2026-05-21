<script setup>
import { computed } from 'vue';
import DietComparisonChart from './DietComparisonChart.vue';
import DietStackedAreaChart from './DietStackedAreaChart.vue';
import TakeoutChart from './TakeoutChart.vue';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

/**
 * Use continuous scrollProgress (0→1 across the whole section)
 * to drive the visual, not activeStep. This gives each chart
 * enough scroll room to fully reveal before transitioning.
 *
 * Phase 1 (progress 0.00–0.30):  comparison bars — "1980 vs 2023"
 * Phase 2 (progress 0.30–0.70):  stacked area  — "40年结构演变"
 * Phase 3 (progress 0.70–1.00):  takeout        — "外卖爆发"
 *
 * Opacity cross-fade avoids jarring step cuts.
 * Using CSS grid overlay (one cell) so all phases stack
 * and the container auto-sizes to the tallest phase.
 */

function remap(t, lo, hi) {
  if (t <= lo) return 0;
  if (t >= hi) return 1;
  return (t - lo) / (hi - lo);
}

const comparisonProgress = computed(() => remap(props.progress, 0, 0.3));
const stackedProgress = computed(() => remap(props.progress, 0.3, 0.7));
const takeoutProgress = computed(() => remap(props.progress, 0.7, 1));

const comparisonOpacity = computed(() => {
  if (props.progress <= 0.3) return 1;
  if (props.progress <= 0.35) return 1 - (props.progress - 0.3) / 0.05;
  return 0;
});

const stackedAreaOpacity = computed(() => {
  const p = props.progress;
  if (p < 0.25) return 0;
  if (p < 0.3) return (p - 0.25) / 0.05;
  if (p <= 0.7) return 1;
  if (p <= 0.75) return 1 - (p - 0.7) / 0.05;
  return 0;
});

const takeoutOpacity = computed(() => {
  const p = props.progress;
  if (p < 0.65) return 0;
  if (p < 0.7) return (p - 0.65) / 0.05;
  return 1;
});
</script>

<template>
  <div class="scene-two-wrap">
    <div
      class="scene-two-phase"
      :style="{ opacity: comparisonOpacity, pointerEvents: comparisonOpacity > 0 ? 'auto' : 'none' }"
    >
      <DietComparisonChart :active-step="activeStep" :progress="comparisonProgress" />
    </div>
    <div
      class="scene-two-phase scene-two-phase--stacked"
      :style="{ opacity: stackedAreaOpacity, pointerEvents: stackedAreaOpacity > 0 ? 'auto' : 'none' }"
    >
      <DietStackedAreaChart :active-step="activeStep" :progress="stackedProgress" />
    </div>
    <div
      class="scene-two-phase"
      :style="{ opacity: takeoutOpacity, pointerEvents: takeoutOpacity > 0 ? 'auto' : 'none' }"
    >
      <TakeoutChart :active-step="activeStep" :progress="takeoutProgress" />
    </div>
  </div>
</template>

<style scoped>
.scene-two-wrap {
  display: grid;
  width: 100%;
}

.scene-two-phase {
  grid-area: 1 / 1;
  transition: opacity 80ms linear;
  will-change: opacity;
}

.scene-two-phase--stacked {
  z-index: 1;
}
</style>
