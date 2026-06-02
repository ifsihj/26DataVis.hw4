<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Hero from "./components/layout/Hero.vue";
import StoryMarquee from "./components/layout/StoryMarquee.vue";
import SceneTitle from "./components/layout/SceneTitle.vue";
import FinalSection from "./components/layout/FinalSection.vue";
import EnoughSection from "./components/layout/EnoughSection.vue";
import BetterDietSection from "./components/layout/BetterDietSection.vue";
import ResponsibleWasteSection from "./components/layout/ResponsibleWasteSection.vue";
import { useScrollReveal } from "./utils/useScrollReveal.js";

const scrollProgress = ref(0);
const presentationMode = ref(false);
const assetUrl = (fileName) => `${import.meta.env.BASE_URL}assets/${fileName}`;

useScrollReveal();

function setPresentationMode(enabled) {
  presentationMode.value = enabled;
  document.documentElement.classList.toggle("presentation-mode", enabled);
}

function togglePresentationMode() {
  setPresentationMode(!presentationMode.value);
}

function updateGlobalProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = docHeight > 0 ? scrollTop / docHeight : 0;
}

function handleGlobalKeydown(event) {
  if (event.key === "Escape" && presentationMode.value) {
    setPresentationMode(false);
  }
}

onMounted(() => {
  window.addEventListener("scroll", updateGlobalProgress, { passive: true });
  window.addEventListener("keydown", handleGlobalKeydown);
  updateGlobalProgress();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateGlobalProgress);
  window.removeEventListener("keydown", handleGlobalKeydown);
  document.documentElement.classList.remove("presentation-mode");
});
</script>

<template>
  <div class="scroll-progress">
    <div
      class="scroll-progress__fill"
      :style="{ width: `${scrollProgress * 100}%` }"
    />
  </div>

  <button
    class="presentation-toggle"
    type="button"
    :aria-pressed="presentationMode"
    :aria-label="presentationMode ? '退出演示模式' : '进入演示模式'"
    @click="togglePresentationMode"
  >
    <span>{{ presentationMode ? "EXIT" : "PRESENT" }}</span>
    <b>{{ presentationMode ? "退出演示" : "演示模式" }}</b>
  </button>

  <main>
    <Hero />
    <StoryMarquee />

    <SceneTitle
      eyebrow="Scene 01"
      title="吃得饱"
      subtitle="从匮乏到稳定供给，粮食安全并非一条单调上升的曲线。土地、技术与制度，共同写下这份答案。"
    />
    <EnoughSection />

    <SceneTitle
      eyebrow="Scene 02"
      title="吃得好"
      subtitle="当主食不再占据餐桌的全部，丰富开始成为新的尺度。饮食结构的变化，也映照城乡生活的靠近。"
      :image="assetUrl('scene-rich-table.png')"
    />
    <BetterDietSection />

    <SceneTitle
      eyebrow="Scene 03"
      title="吃得负责"
      subtitle="丰盛之后，问题不再只是拥有多少。每一次丢弃与选择，都牵动餐桌之外的土地、水与气候。"
      :image="assetUrl('scene-responsible-table.png')"
    />
    <ResponsibleWasteSection />
    <FinalSection />
  </main>
</template>
