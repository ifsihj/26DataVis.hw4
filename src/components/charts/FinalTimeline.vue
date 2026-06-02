<script setup>
const items = [
  { stage: '吃得饱', keyword: '粮食安全', text: '发展的底线' },
  { stage: '吃得好', keyword: '饮食丰富', text: '生活的选择' },
  { stage: '吃得负责', keyword: '可持续消费', text: '丰盛之后的回答' },
];

function scrollToChapter(chapterIndex) {
  const sceneTitles = document.querySelectorAll('.scene-title');
  const target = sceneTitles[chapterIndex];
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <div class="timeline">
    <div
      v-for="(item, index) in items"
      :key="item.stage"
      class="timeline__item"
      role="button"
      :tabindex="0"
      :aria-label="`跳转到${item.stage}`"
      @click="scrollToChapter(index)"
      @keydown.enter="scrollToChapter(index)"
      @keydown.space.prevent="scrollToChapter(index)"
    >
      <span class="timeline__dot">{{ index + 1 }}</span>
      <h3>{{ item.stage }}</h3>
      <strong>{{ item.keyword }}</strong>
      <p>{{ item.text }}</p>
    </div>
  </div>
</template>
