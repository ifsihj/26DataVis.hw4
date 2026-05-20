<script setup>
import { computed } from 'vue';
import { grainData } from '../../data/grainData.js';

const props = defineProps({
  activeStep: { type: Number, default: 0 },
});

const fillLevels = [42, 68, 88];
const latest = grainData[grainData.length - 1];
const fillLevel = computed(() => fillLevels[props.activeStep] ?? fillLevels[0]);
</script>

<template>
  <div class="barn-card">
    <div class="barn">
      <div class="barn__roof" />
      <div class="barn__body">
        <div class="barn__grain" :style="{ height: `${fillLevel}%` }" />
        <div class="barn__lines" />
      </div>
    </div>
    <div class="barn-card__copy">
      <p>粮仓填充度</p>
      <strong>{{ fillLevel }}%</strong>
      <span>2023 mock：人均粮食 {{ latest.grainPerCapita }} kg</span>
    </div>
  </div>
</template>
