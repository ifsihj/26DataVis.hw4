<script setup>
const chapters = [
  { index: "01", title: "粮食安全", note: "Food security" },
  { index: "02", title: "农业科技", note: "Agricultural technology" },
  { index: "03", title: "餐桌丰富", note: "Dietary diversity" },
  { index: "04", title: "食品浪费", note: "Food waste" },
  { index: "05", title: "碳足迹", note: "Carbon footprint" },
];
</script>

<template>
  <section class="story-index" aria-label="专题索引">
    <div class="story-index__header">
      <span>CONTENTS</span>
      <small>中国餐桌变迁专题</small>
    </div>
    <div class="story-index__items">
      <div v-for="chapter in chapters" :key="chapter.index">
        <b>{{ chapter.index }}</b>
        <span>{{ chapter.title }}</span>
        <small>{{ chapter.note }}</small>
      </div>
    </div>
  </section>
</template>
