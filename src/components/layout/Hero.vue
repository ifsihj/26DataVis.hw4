<template>
  <section class="hero">
    <div class="hero__grain" />
    <div class="hero__content">
      <p class="eyebrow" style="color: rgba(255,247,232,0.7)">Scroll-driven data story</p>
      <h1>从吃得饱<br />到吃得好，<br />再到吃得负责</h1>
      <p class="hero__subtitle">一部关于中国人餐桌变迁的数据故事</p>
    </div>
    <div class="hero__table" aria-hidden="true">
      <span class="bowl bowl--rice" />
      <span class="bowl bowl--veg" />
      <span class="bowl bowl--meat" />
      <span class="chopsticks" />
    </div>
    <div class="scroll-hint">
      <span>向下滚动探索</span>
      <div class="scroll-hint__line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: grid;
  min-height: 100vh;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(rgba(42, 32, 24, 0.2), rgba(42, 32, 24, 0.44)),
    url('/assets/hero-table-grain.png') center / cover,
    radial-gradient(circle at 50% 35%, rgba(255, 243, 210, 0.55), transparent 24rem),
    linear-gradient(135deg, #8f2f24, #6c4a2f 46%, #2f4f3c);
}

.hero__grain {
  position: absolute;
  inset: 0;
  opacity: 0.24;
  background-image:
    linear-gradient(30deg, rgba(255, 255, 255, 0.08) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.08) 87.5%),
    linear-gradient(150deg, rgba(255, 255, 255, 0.08) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.08) 87.5%);
  background-size: 64px 112px;
}

.hero__content {
  position: relative;
  z-index: 2;
  width: min(980px, 82vw);
  color: #fff7e8;
  text-align: center;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
}

.hero h1 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(4rem, 7vw, 7.8rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: 0.02em;
}

.hero__subtitle {
  margin: 26px auto 0;
  max-width: 660px;
  font-size: 1.35rem;
  color: rgba(255, 247, 232, 0.86);
  font-weight: 300;
}

.hero__table {
  position: absolute;
  right: 8vw;
  bottom: 10vh;
  width: 360px;
  height: 160px;
  border-radius: 50%;
  background: rgba(77, 45, 30, 0.58);
  box-shadow: inset 0 0 38px rgba(255, 240, 190, 0.18), var(--shadow-lg);
}

.bowl {
  position: absolute;
  width: 86px;
  height: 44px;
  border-radius: 8px 8px 44px 44px;
  background: #fff2d2;
  box-shadow: inset 0 -12px rgba(75, 45, 30, 0.18);
}

.bowl--rice { left: 76px; top: 44px; }
.bowl--veg { left: 178px; top: 32px; background: #bdd69a; }
.bowl--meat { left: 142px; top: 92px; background: #c7684d; }

.chopsticks {
  position: absolute;
  right: 60px;
  top: 44px;
  width: 150px;
  height: 6px;
  background: #f5cf87;
  transform: rotate(-24deg);
  box-shadow: 0 14px 0 #e4b96f;
}

.scroll-hint {
  position: absolute;
  bottom: 34px;
  left: 50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: rgba(255, 247, 232, 0.75);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  transform: translateX(-50%);
  animation: floatHint 3s ease-in-out infinite;
}

.scroll-hint__line {
  width: 1px;
  height: 42px;
  background: linear-gradient(180deg, rgba(255, 247, 232, 0.75), transparent);
}

@keyframes floatHint {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}
</style>
