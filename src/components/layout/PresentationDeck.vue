<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { responsibleChoiceSources } from "../../data/responsibleChoiceData.js";
import { wasteImpactData } from "../../data/wasteImpactData.js";

const emit = defineEmits(["close"]);
const deckRef = ref(null);

const sourceGroups = [
  {
    index: "01",
    title: "粮食安全",
    source: "国家统计局 / FAO",
    detail: "粮食总产、人均占有量与 400 kg 参考线；用于回答供给是否稳定。",
    url: "https://www.stats.gov.cn/",
  },
  {
    index: "02",
    title: "城乡饮食",
    source: "子项目整理数据",
    detail: "城乡九类食物消费、恩格尔系数与 2024 年快照；用于观察餐桌结构变化。",
  },
  {
    index: "03",
    title: "全球浪费",
    source: "UNEP Food Waste Index Report 2024",
    detail: "采用报告中的 2022 年全球食品浪费估计与环节占比。",
    url: wasteImpactData.sourceUrl,
  },
  {
    index: "04",
    title: "食物碳足迹",
    source: "Poore & Nemecek (2018) / OWID",
    detail: "按生命周期拆解土地变化、农场、饲料、加工、运输、零售与包装。",
    url: responsibleChoiceSources.foodImpacts.url,
  },
];

function handleKeydown(event) {
  if (event.key === "Escape") emit("close");
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.requestAnimationFrame(() => deckRef.value?.focus());
});

onBeforeUnmount(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <section
    ref="deckRef"
    class="presentation-deck"
    tabindex="-1"
    aria-label="数据来源演示页"
  >
    <header class="deck-header">
      <span>CHINA TABLE / DATA ESSAY</span>
      <b>01</b>
      <small>DATA SOURCE</small>
      <button class="deck-exit" type="button" @click="emit('close')">
        EXIT / 退出演示
      </button>
    </header>

    <article class="deck-slide">
      <p class="deck-kicker">DATA NOTE / SOURCE MAP</p>
      <h1>数据从哪里来？</h1>
      <p class="deck-lead">
        这不是一套单一来源的数据。我们把官方统计、国际组织报告、
        同行评议研究与子项目整理数据放在一起，用不同证据回答不同问题。
      </p>

      <div class="source-grid">
        <a
          v-for="source in sourceGroups"
          :key="source.index"
          class="source-card"
          :href="source.url || undefined"
          :target="source.url ? '_blank' : undefined"
          :rel="source.url ? 'noreferrer' : undefined"
        >
          <b>{{ source.index }}</b>
          <span>{{ source.title }}</span>
          <strong>{{ source.source }}</strong>
          <small>{{ source.detail }}</small>
        </a>
      </div>

      <footer class="deck-note">
        <span>数据处理说明</span>
        <p>
          图中统一年份、单位与分类；城乡饮食序列存在观测缺口，折线图以虚线连接。
          农业科技、耕地等部分指标包含趋势估算。分类浪费率与环境足迹数组在正式发布前仍需补齐外部引用。
        </p>
      </footer>
    </article>
  </section>
</template>

<style scoped>
.presentation-deck {
  position: fixed;
  inset: 0;
  z-index: 105;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  outline: 0;
  background: #f1ece3;
  color: #29251f;
}

.deck-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 4vw;
  border-bottom: 1px solid rgba(41, 37, 31, 0.16);
  color: rgba(41, 37, 31, 0.62);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.deck-header b {
  margin-left: auto;
  color: #9e3d32;
  font-family: Georgia, serif;
  font-size: 1.6rem;
  font-weight: 400;
}

.deck-exit {
  margin-left: 10px;
  padding: 7px 9px;
  border: 1px solid rgba(41, 37, 31, 0.2);
  background: transparent;
  color: rgba(41, 37, 31, 0.7);
  cursor: pointer;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.deck-slide {
  overflow-y: auto;
  padding: clamp(42px, 8vh, 90px) 7vw 48px;
  animation: slideIn 420ms ease both;
}

.deck-kicker {
  margin: 0 0 18px;
  color: #9e3d32;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

h1 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(4.6rem, 8vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.09em;
  line-height: 0.96;
}

.deck-lead {
  max-width: 820px;
  margin: 24px 0 0;
  color: rgba(41, 37, 31, 0.72);
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.8;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}

.source-card {
  display: grid;
  gap: 8px;
  min-height: 205px;
  padding: 18px;
  border-top: 2px solid #9e3d32;
  background: rgba(255, 255, 255, 0.34);
  color: inherit;
  text-decoration: none;
}

.source-card b {
  color: #9e3d32;
  font-family: Georgia, serif;
  font-size: 1.55rem;
  font-weight: 400;
}

.source-card span,
.source-card strong {
  font-family: var(--font-serif);
}

.source-card strong {
  font-size: 1.1rem;
}

.source-card small,
.deck-note p {
  color: rgba(41, 37, 31, 0.68);
  font-size: 0.82rem;
  line-height: 1.65;
}

.deck-note {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 20px;
  max-width: 980px;
  margin-top: 34px;
  padding-top: 16px;
  border-top: 1px solid rgba(41, 37, 31, 0.2);
}

.deck-note span {
  color: #9e3d32;
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 800;
}

.deck-note p {
  margin: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translate3d(18px, 0, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}

@media (max-width: 900px) {
  .source-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .deck-header,
  .deck-slide {
    padding-right: 18px;
    padding-left: 18px;
  }

  .deck-header small {
    display: none;
  }

  h1 {
    font-size: 4.2rem;
  }

  .source-grid,
  .deck-note {
    grid-template-columns: 1fr;
  }
}
</style>
