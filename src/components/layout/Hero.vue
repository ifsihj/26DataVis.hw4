<script setup>
const heroBackground = `
  linear-gradient(90deg, rgba(5, 4, 3, 0.9), rgba(5, 4, 3, 0.32) 48%, rgba(5, 4, 3, 0.82)),
  linear-gradient(180deg, rgba(5, 4, 3, 0.26), rgba(5, 4, 3, 0.92)),
  url('${import.meta.env.BASE_URL}assets/hero-table-grain.png') center / cover
`;
</script>

<template>
  <section class="hero">
    <div class="hero__backdrop" :style="{ background: heroBackground }" />
    <div class="hero__noise" />

    <div class="hero__chrome hero__chrome--top">
      <span>SCROLL DATA STORY</span>
      <i />
      <span>CHINA TABLE / 1980-2023</span>
    </div>

    <div class="hero__content">
      <p class="eyebrow">A documentary data narrative</p>
      <h1>
        从吃得饱
        <span>到吃得好</span>
        再到吃得负责
      </h1>
      <p class="hero__subtitle">一部关于中国人餐桌变迁的数据故事</p>
    </div>

    <div class="hero__plate" aria-hidden="true">
      <span class="hero__plate-ring hero__plate-ring--outer" />
      <span class="hero__plate-ring hero__plate-ring--inner" />
      <span class="hero__food hero__food--rice" />
      <span class="hero__food hero__food--veg" />
      <span class="hero__food hero__food--meat" />
      <span class="hero__food hero__food--fruit" />
      <span class="hero__chopsticks" />
    </div>

    <div class="hero__chapters" aria-label="故事章节">
      <span><b>01</b> 粮食安全</span>
      <span><b>02</b> 饮食丰富</span>
      <span><b>03</b> 可持续消费</span>
    </div>

    <div class="scroll-hint">
      <span>向下滚动</span>
      <div class="scroll-hint__line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #050403;
  color: #fff7e8;
}

.hero__backdrop {
  position: absolute;
  inset: 0;
  transform: scale(1.04);
  animation: heroSlowZoom 12s ease-in-out infinite alternate;
}

.hero__noise {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.14) 0 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px);
  background-size: 24px 24px, 38px 38px;
  mix-blend-mode: screen;
  pointer-events: none;
}

.hero__chrome {
  position: absolute;
  z-index: 3;
  left: 48px;
  right: 48px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: rgba(255, 247, 232, 0.62);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.hero__chrome--top {
  top: 34px;
}

.hero__chrome i {
  flex: 1;
  height: 1px;
  background: rgba(255, 247, 232, 0.22);
}

.hero__content {
  position: relative;
  z-index: 2;
  display: grid;
  min-height: 100vh;
  align-content: center;
  width: min(1120px, 88vw);
  margin: 0 auto;
  padding: 10vh 0 18vh;
}

.hero h1 {
  display: grid;
  gap: 0.04em;
  max-width: 980px;
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(4.8rem, 9.2vw, 10.8rem);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: 0;
  text-shadow: 0 18px 70px rgba(0, 0, 0, 0.5);
}

.hero h1 span {
  padding-left: 0.42em;
  color: #f0c86b;
  font-style: italic;
}

.hero__subtitle {
  max-width: 720px;
  margin: 28px 0 0;
  color: rgba(255, 247, 232, 0.78);
  font-size: 1.28rem;
  line-height: 1.8;
}

.hero__plate {
  position: absolute;
  right: min(8vw, 112px);
  bottom: 14vh;
  z-index: 2;
  width: 300px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgba(255, 249, 232, 0.06);
  filter: drop-shadow(0 30px 70px rgba(0, 0, 0, 0.48));
}

.hero__plate-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 247, 232, 0.22);
  border-radius: 50%;
}

.hero__plate-ring--outer {
  animation: rotatePlate 18s linear infinite;
}

.hero__plate-ring--inner {
  inset: 62px;
  border-color: rgba(240, 200, 107, 0.26);
  animation: rotatePlate 12s linear infinite reverse;
}

.hero__food {
  position: absolute;
  display: block;
  border-radius: 999px;
  box-shadow: inset 0 -10px rgba(0, 0, 0, 0.16);
}

.hero__food--rice {
  top: 92px;
  left: 86px;
  width: 82px;
  height: 54px;
  background: #fff0c8;
}

.hero__food--veg {
  top: 74px;
  right: 82px;
  width: 66px;
  height: 66px;
  background: #5f8d4e;
}

.hero__food--meat {
  right: 94px;
  bottom: 82px;
  width: 88px;
  height: 52px;
  background: #a54235;
}

.hero__food--fruit {
  left: 82px;
  bottom: 88px;
  width: 58px;
  height: 58px;
  background: #d88d40;
}

.hero__chopsticks {
  position: absolute;
  top: 76px;
  right: -18px;
  width: 190px;
  height: 5px;
  border-radius: 999px;
  background: #e6bd72;
  transform: rotate(-28deg);
  box-shadow: 0 16px 0 #c89652;
}

.hero__chapters {
  position: absolute;
  right: 48px;
  bottom: 42px;
  z-index: 3;
  display: flex;
  gap: 18px;
  color: rgba(255, 247, 232, 0.68);
  font-size: 0.82rem;
}

.hero__chapters span {
  padding: 10px 12px;
  border: 1px solid rgba(255, 247, 232, 0.16);
  border-radius: 999px;
  background: rgba(5, 4, 3, 0.32);
  backdrop-filter: blur(12px);
}

.hero__chapters b {
  margin-right: 8px;
  color: #f0c86b;
}

.scroll-hint {
  position: absolute;
  bottom: 42px;
  left: 48px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: rgba(255, 247, 232, 0.72);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  animation: floatHint 3s ease-in-out infinite;
}

.scroll-hint__line {
  width: 1px;
  height: 52px;
  background: linear-gradient(180deg, rgba(255, 247, 232, 0.7), transparent);
}

@keyframes heroSlowZoom {
  from { transform: scale(1.04); }
  to { transform: scale(1.1); }
}

@keyframes rotatePlate {
  to { transform: rotate(360deg); }
}

@keyframes floatHint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (max-width: 980px) {
  .hero__plate,
  .hero__chapters {
    display: none;
  }

  .hero__chrome {
    left: 28px;
    right: 28px;
  }

  .scroll-hint {
    left: 28px;
  }
}
</style>
