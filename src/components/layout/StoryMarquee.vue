<template>
  <section class="story-marquee" aria-label="故事关键词">
    <div class="story-marquee__track">
      <span v-for="item in repeatedWords" :key="item.id">{{ item.word }}</span>
    </div>
  </section>
</template>

<script setup>
const words = [
  '粮食安全',
  '主食占比',
  '农业科技',
  '餐桌丰富',
  '城市外卖',
  '食品浪费',
  '碳足迹',
  '可持续饮食',
];

const repeatedWords = Array.from({ length: 4 }).flatMap((_, loop) =>
  words.map((word, index) => ({ id: `${loop}-${index}`, word })),
);
</script>
