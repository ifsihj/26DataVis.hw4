<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, default: '' },
});
</script>

<template>
  <section class="scene-title" :class="{ 'scene-title--with-image': image }">
    <div class="scene-title__copy">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>
    <img v-if="image" class="scene-title__image" :src="image" alt="" />
  </section>
</template>
