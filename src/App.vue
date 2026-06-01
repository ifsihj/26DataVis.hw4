<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Hero from "./components/layout/Hero.vue";
import StoryMarquee from "./components/layout/StoryMarquee.vue";
import SceneTitle from "./components/layout/SceneTitle.vue";
import FinalSection from "./components/layout/FinalSection.vue";
import EnoughSection from "./components/layout/EnoughSection.vue";
import ResponsibleWasteSection from "./components/layout/ResponsibleWasteSection.vue";

const scrollProgress = ref(0);
const assetUrl = (fileName) => `${import.meta.env.BASE_URL}assets/${fileName}`;

function updateGlobalProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = docHeight > 0 ? scrollTop / docHeight : 0;
}

onMounted(() => {
  window.addEventListener("scroll", updateGlobalProgress, { passive: true });
  updateGlobalProgress();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateGlobalProgress);
});
</script>

<template>
  <div class="scroll-progress">
    <div
      class="scroll-progress__fill"
      :style="{ width: `${scrollProgress * 100}%` }"
    />
  </div>

  <main>
    <Hero />
    <StoryMarquee />

    <SceneTitle
      eyebrow="Scene 01 / Food Security"
      title="吃得饱"
      subtitle="七十六年，从人均二百公斤到五百公斤。粮食安全不是一条单调上升的曲线，而是土地、技术与制度共同写下的答案。"
    />
    <EnoughSection />

    <SceneTitle
      eyebrow="Responsible Consumption"
      title="吃得负责"
      subtitle="从看见浪费，到理解代价。每一次丢弃和选择，都牵动着餐桌之外的土地、水、能源与气候。"
      :image="assetUrl('scene-responsible-table.png')"
    />
    <ResponsibleWasteSection />
    <FinalSection />
  </main>
</template>
