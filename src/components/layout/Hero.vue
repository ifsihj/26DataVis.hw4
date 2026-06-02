<script setup>
const heroBackground = `
  linear-gradient(90deg, rgba(244, 239, 230, 1) 0%, rgba(244, 239, 230, 0.98) 42%, rgba(244, 239, 230, 0.72) 62%, rgba(244, 239, 230, 0.12) 100%),
  linear-gradient(180deg, rgba(244, 239, 230, 0.12), rgba(244, 239, 230, 0.54)),
  url('${import.meta.env.BASE_URL}assets/hero-table-grain.png') 72% center / cover
`;

const chapters = [
  { index: "01", title: "吃得饱", subtitle: "粮食安全" },
  { index: "02", title: "吃得好", subtitle: "饮食丰富" },
  { index: "03", title: "吃得负责", subtitle: "可持续消费" },
];
<<<<<<< HEAD

function scrollToChapter(chapterIndex) {
  const sceneTitles = document.querySelectorAll(".scene-title");
  const target = sceneTitles[chapterIndex];
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
=======
>>>>>>> fb68221a5bfecc63f4139d931012ea1e4cd72cd0
</script>

<template>
  <section class="hero">
    <div class="hero__backdrop" :style="{ background: heroBackground }" />

    <header class="hero__masthead">
      <span>CHINA TABLE</span>
      <i />
      <span>1949 — PRESENT</span>
    </header>

    <div class="hero__edition" aria-hidden="true">
      <span>DATA ESSAY</span>
      <b>01</b>
      <small>FOOD SYSTEMS<br />IN TRANSITION</small>
    </div>

    <div class="hero__content">
      <p class="hero__kicker">一张餐桌，七十余年的中国变迁</p>
      <h1>中国人的餐桌</h1>
      <p class="hero__deck">
        从吃得饱，到吃得好，<br />
        再到吃得负责
      </p>
      <p class="hero__summary">
        从温饱、丰盛到节制，食物记录发展的尺度，也提出面向未来的问题。
      </p>
    </div>

    <p class="hero__caption">
      餐桌从来不只是日常。它映照土地、技术与收入，也容纳我们对未来的选择。
    </p>

    <footer class="hero__footer">
      <p class="hero__scroll">向下展开叙事</p>
      <nav class="hero__chapters" aria-label="故事章节">
<<<<<<< HEAD
        <div
          v-for="(chapter, idx) in chapters"
          :key="chapter.index"
          role="button"
          :tabindex="0"
          :aria-label="`跳转到${chapter.title}`"
          @click="scrollToChapter(idx)"
          @keydown.enter="scrollToChapter(idx)"
          @keydown.space.prevent="scrollToChapter(idx)"
        >
=======
        <div v-for="chapter in chapters" :key="chapter.index">
>>>>>>> fb68221a5bfecc63f4139d931012ea1e4cd72cd0
          <b>{{ chapter.index }}</b>
          <span>{{ chapter.title }}</span>
          <small>{{ chapter.subtitle }}</small>
        </div>
      </nav>
    </footer>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: clamp(680px, 88vh, 900px);
  overflow: hidden;
  background: #f4efe6;
  color: #29251f;
}

.hero__backdrop {
  position: absolute;
  inset: 0;
}

.hero__masthead {
  position: absolute;
  top: 30px;
  right: 5vw;
  left: 5vw;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 18px;
  color: rgba(41, 37, 31, 0.62);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.hero__masthead i {
  flex: 1;
  height: 1px;
  background: rgba(41, 37, 31, 0.2);
}

.hero__content {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: center;
  min-height: clamp(680px, 88vh, 900px);
  width: min(1180px, 90vw);
  margin: 0 auto;
  padding: 108px 0 170px;
}

.hero__edition {
  position: absolute;
  top: 108px;
  right: 5vw;
  z-index: 2;
  display: grid;
  justify-items: end;
  color: rgba(41, 37, 31, 0.62);
  text-align: right;
}

.hero__edition span,
.hero__edition small {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  line-height: 1.65;
}

.hero__edition b {
  margin: 8px -0.08em 10px 0;
  color: rgba(158, 61, 50, 0.76);
  font-family: Georgia, serif;
  font-size: 5rem;
  font-weight: 400;
  letter-spacing: -0.14em;
  line-height: 0.9;
}

.hero__kicker,
.hero__summary,
.hero__scroll {
  margin: 0;
}

.hero__caption {
  position: absolute;
  right: 5vw;
  bottom: 124px;
  z-index: 2;
  width: min(300px, 22vw);
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid rgba(41, 37, 31, 0.26);
  color: rgba(41, 37, 31, 0.62);
  font-size: 0.74rem;
  line-height: 1.7;
}

.hero__kicker {
  color: #9e3d32;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.hero h1 {
  max-width: 1040px;
  margin: 24px 0 0;
  font-family: var(--font-serif);
  font-size: clamp(5.4rem, 8vw, 8.6rem);
  font-weight: 900;
  letter-spacing: -0.09em;
  line-height: 0.94;
}

.hero__deck {
  max-width: 720px;
  margin: 22px 0 0;
  color: #9e3d32;
  font-family: var(--font-serif);
  font-size: clamp(2.15rem, 4vw, 4.1rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1.12;
}

.hero__summary {
  max-width: 560px;
  margin-top: 24px;
  color: rgba(41, 37, 31, 0.7);
  font-size: 1.02rem;
  line-height: 1.8;
}

.hero__footer {
  position: absolute;
  right: 5vw;
  bottom: 30px;
  left: 5vw;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(540px, 720px);
  gap: 34px;
  align-items: end;
  border-top: 1px solid rgba(41, 37, 31, 0.22);
}

.hero__scroll {
  padding-top: 18px;
  color: rgba(41, 37, 31, 0.62);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.hero__chapters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hero__chapters div {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3px 10px;
  padding: 16px 14px 0;
  border-left: 1px solid rgba(41, 37, 31, 0.22);
<<<<<<< HEAD
  cursor: pointer;
  transition:
    background 220ms ease,
    border-color 220ms ease,
    transform 220ms ease;
}

.hero__chapters div:hover,
.hero__chapters div:focus-visible {
  background: rgba(158, 61, 50, 0.06);
  border-left-color: var(--red);
}

.hero__chapters div:active {
  transform: translateY(1px);
}

.hero__chapters div:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: -2px;
  border-radius: 2px;
=======
>>>>>>> fb68221a5bfecc63f4139d931012ea1e4cd72cd0
}

.hero__chapters b {
  grid-row: 1 / 3;
  color: #9e3d32;
  font-family: var(--font-serif);
  font-size: 1.65rem;
  line-height: 1;
}

.hero__chapters span {
  color: #29251f;
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 800;
}

.hero__chapters small {
  color: rgba(41, 37, 31, 0.58);
  font-size: 0.72rem;
}

@media (max-width: 720px) {
  .hero {
    min-height: 760px;
  }

  .hero__backdrop {
    background-position: 62% center !important;
  }

  .hero__masthead {
    top: 24px;
    right: 24px;
    left: 24px;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.52rem;
    letter-spacing: 0.14em;
  }

  .hero__masthead i {
    display: none;
  }

  .hero__content {
    align-content: start;
    min-height: 760px;
    width: auto;
    padding: 148px 24px 230px;
  }

  .hero__edition,
  .hero__caption {
    display: none;
  }

  .hero__kicker {
    max-width: 210px;
    font-size: 0.7rem;
    line-height: 1.7;
  }

  .hero h1 {
    max-width: 340px;
    margin-top: 18px;
    font-size: clamp(4rem, 18vw, 5rem);
    letter-spacing: -0.1em;
    line-height: 0.98;
  }

  .hero__deck {
    max-width: 340px;
    margin-top: 18px;
    font-size: clamp(2.15rem, 10vw, 3rem);
    letter-spacing: -0.08em;
    line-height: 1.14;
  }

  .hero__summary {
    max-width: 290px;
    margin-top: 20px;
    font-size: 0.9rem;
    line-height: 1.75;
  }

  .hero__footer {
    right: 24px;
    bottom: 24px;
    left: 24px;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .hero__scroll {
    padding-top: 14px;
  }

  .hero__chapters div {
    display: block;
    padding: 12px 8px 0;
  }

  .hero__chapters b,
  .hero__chapters span,
  .hero__chapters small {
    display: block;
  }

  .hero__chapters b {
    margin-bottom: 6px;
    font-size: 1.2rem;
  }

  .hero__chapters span {
    font-size: 0.82rem;
  }

  .hero__chapters small {
    margin-top: 3px;
    font-size: 0.62rem;
  }
}
</style>
