<script setup>
defineProps({
  step: { type: Object, required: true },
  index: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
});
</script>

<template>
  <article class="step-card" :class="{ 'is-active': isActive }" :data-step="index">
    <p class="step-card__kicker">{{ step.kicker }}</p>
    <h3>{{ step.title }}</h3>
    <p>{{ step.body }}</p>
  </article>
</template>
