<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const sections = ref([]);
const activeIndex = ref(0);

const sectionConfig = [
  { label: "封面", selector: ".hero" },
  { label: "吃得饱", selector: ".scene-title" },
  { label: "吃得好", selector: ".scene-title" },
  { label: "吃得负责", selector: ".scene-title" },
  { label: "结语", selector: ".final-section" },
];

let observer = null;

function resolveElements() {
  const hero = document.querySelector(".hero");
  const sceneTitles = document.querySelectorAll(".scene-title");
  const final = document.querySelector(".final-section");

  return [
    hero,
    sceneTitles[0] || null,
    sceneTitles[1] || null,
    sceneTitles[2] || null,
    final,
  ].filter(Boolean);
}

function scrollToSection(index) {
  const els = resolveElements();
  if (els[index]) {
    els[index].scrollIntoView({ behavior: "smooth" });
  }
}

onMounted(() => {
  const els = resolveElements();
  sections.value = els;

  // Track which section occupies the most viewport area
  const visibilityMap = new Map();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target, entry.intersectionRatio);
      });

      // Find the element with highest visibility among all tracked sections
      let bestIdx = activeIndex.value;
      let bestRatio = 0;
      els.forEach((el, idx) => {
        const ratio = visibilityMap.get(el) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIdx = idx;
        }
      });
      activeIndex.value = bestIdx;
    },
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    }
  );

  els.forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <nav class="section-nav" aria-label="页面导航">
    <button
      v-for="(cfg, idx) in sectionConfig"
      :key="cfg.label"
      class="section-nav__dot"
      :class="{ 'is-active': activeIndex === idx }"
      :aria-label="`跳转到${cfg.label}`"
      :aria-current="activeIndex === idx ? 'true' : undefined"
      @click="scrollToSection(idx)"
    >
      <span class="section-nav__label">{{ cfg.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.section-nav {
  position: fixed;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-nav__dot {
  position: relative;
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--muted-light);
  cursor: pointer;
  transition:
    background 280ms var(--ease-out),
    transform 280ms var(--ease-out),
    box-shadow 280ms var(--ease-out);
  outline: none;
}

.section-nav__dot:hover {
  background: var(--amber);
  transform: scale(1.5);
}

.section-nav__dot.is-active {
  background: var(--red);
  transform: scale(1.35);
  box-shadow: 0 0 8px rgba(158, 61, 50, 0.4);
}

.section-nav__label {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.68rem;
  font-family: var(--font-sans);
  color: var(--muted);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease, color 220ms ease;
  letter-spacing: 0.06em;
}

.section-nav__dot:hover .section-nav__label,
.section-nav__dot.is-active .section-nav__label {
  opacity: 1;
  color: var(--ink-soft);
}

.section-nav__dot.is-active .section-nav__label {
  color: var(--red);
  font-weight: 700;
}

@media (max-width: 820px) {
  .section-nav {
    right: 10px;
    gap: 10px;
  }

  .section-nav__dot {
    width: 6px;
    height: 6px;
  }

  .section-nav__label {
    display: none;
  }
}
</style>
