<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AgriTechnologyTrend from '../charts/AgriTechnologyTrend.vue';
import GrainStackedArea from '../charts/GrainStackedArea.vue';
import KeyEventsTimeline from '../charts/KeyEventsTimeline.vue';
import MetricCards from '../charts/MetricCards.vue';
import PerCapitaLineChart from '../charts/PerCapitaLineChart.vue';
import WorldComparisonBar from '../charts/WorldComparisonBar.vue';
import {
  agriTechnology,
  grainOutput,
  perCapitaGrain,
  worldComparison,
} from '../../data/scene1Data.js';

const flippedCards = ref(new Set());
const activeDetailId = ref(null);

const latestPerCapita = perCapitaGrain[perCapitaGrain.length - 1];
const latestOutput = grainOutput[grainOutput.length - 1];
const latestTechnology = agriTechnology[agriTechnology.length - 1];
const chinaComparison = worldComparison.find(item => item.country === '中国');

const cards = [
  {
    id: 'per-capita',
    index: '01',
    kicker: '从不足到安全',
    title: '人均粮食占有量',
    value: `${Math.round(latestPerCapita.per_capita_kg)} kg`,
    note: '1949 年为 209 kg，如今稳定越过 FAO 400 kg 安全线。',
    chart: PerCapitaLineChart,
    chartProps: { progress: 1 },
    detailTitle: '一条曲线，记录从温饱压力到粮食安全',
    detailCopy: '人均粮食占有量并不是一条平滑上升的直线。困难时期、结构调整与持续增产都留在曲线上。越过 400 kg 安全线之后，问题才逐渐从“有没有”转向“吃什么”。',
    detailFacts: ['1949 年：209 kg', '2025 年：508 kg', 'FAO 参考线：400 kg'],
  },
  {
    id: 'production',
    index: '02',
    kicker: '七亿吨背后',
    title: '粮食总产结构',
    value: `${(latestOutput.total / 10000).toFixed(1)} 亿吨`,
    note: '稻麦稳、玉米增。总量增长背后，作物结构也在改变。',
    chart: GrainStackedArea,
    chartProps: { progress: 1 },
    detailTitle: '增产不只是数字变大，也是结构在重组',
    detailCopy: '稻谷和小麦构成口粮基础，玉米的增长则连接起饲料、养殖与更丰富的餐桌。分品种面积图让“吃得饱”和后续的“吃得好”自然衔接。',
    detailFacts: ['1949 年：1.13 亿吨', `2025 年：${(latestOutput.total / 10000).toFixed(1)} 亿吨`, '玉米成为增长最显著的品种'],
  },
  {
    id: 'world',
    index: '03',
    kicker: '放进全球坐标',
    title: '全球人均粮食对比',
    value: `${Math.round(chinaComparison.per_capita_kg)} kg`,
    note: '全球坐标帮助我们理解：中国已经跨过安全线，但资源条件仍然有自身约束。',
    chart: WorldComparisonBar,
    detailTitle: '跨过安全线之后，还要看见资源禀赋的差异',
    detailCopy: '人均粮食占有量并不等同于饮食质量，但它提供了一个清晰的全球坐标。不同国家的人口规模、土地条件与农业结构差异很大，中国的答案必须建立在自身资源条件上。',
    detailFacts: ['中国：494 kg', '世界平均：370 kg', 'FAO 参考线：400 kg'],
  },
  {
    id: 'technology',
    index: '04',
    kicker: '土地之外的增量',
    title: '农业科技与亩产',
    value: `${Math.round(latestTechnology.yield_per_mu)} kg`,
    unit: '每亩',
    note: '耕地有限，稳定增产越来越依赖单产提升与农业技术积累。',
    chart: AgriTechnologyTrend,
    detailTitle: '有限土地上的增量，越来越依赖农业科技',
    detailCopy: '耕地不是无限扩张的变量。长期粮食安全更依赖品种改良、农业基础设施与生产技术积累。亩产的持续提升，是总产量增长的重要基础。',
    detailFacts: ['1949 年：69 kg / 亩', `2025 年：${Math.round(latestTechnology.yield_per_mu)} kg / 亩`, '杂交稻覆盖率持续提升'],
  },
];

const activeDetail = computed(() => cards.find(card => card.id === activeDetailId.value) || null);

function isFlipped(id) {
  return flippedCards.value.has(id);
}

function toggleCard(id) {
  const next = new Set(flippedCards.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  flippedCards.value = next;
}

function openDetail(id) {
  activeDetailId.value = id;
}

function closeDetail() {
  activeDetailId.value = null;
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeDetail();
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <section class="enough-section" id="enough">
    <div class="enough-section__inner">
      <header class="enough-opening">
        <div>
          <p class="eyebrow">Scene 01 / Food Security</p>
          <h2>从二百公斤<br />到五百公斤</h2>
        </div>
        <p>
          七十六年里，中国人的餐桌先解决了最朴素的问题：有没有足够的粮食。
          这不是一条单调上升的曲线，而是土地、技术与制度共同写下的答案。
          先读关键指标，再点击卡片翻到背面，从结论进入图表。
        </p>
      </header>

      <section class="enough-metrics">
        <div class="enough-subheading">
          <p class="eyebrow">关键指标</p>
          <h3>先看今天的粮食安全底盘</h3>
          <p>总量、人均、口粮自给率、亩产和耕地，共同构成“吃得饱”的基本条件。</p>
        </div>
        <MetricCards />
      </section>

      <div class="enough-reading-guide">
        <article>
          <strong>先看有没有</strong>
          <span>人均粮食占有量跨过 400 kg 安全线，回答最基本的供给问题。</span>
        </article>
        <article>
          <strong>再看怎么增长</strong>
          <span>稻麦稳、玉米增，亩产提升与科技积累共同支撑七亿吨粮食。</span>
        </article>
        <article>
          <strong>最后放进坐标</strong>
          <span>全球比较帮助我们理解成绩，也提醒我们看见土地与人口约束。</span>
        </article>
      </div>

      <div class="enough-section__cards">
        <article
          v-for="card in cards"
          :key="card.id"
          class="enough-card"
          :class="{ 'is-flipped': isFlipped(card.id) }"
          tabindex="0"
          role="button"
          :aria-label="`${card.title}，点击${isFlipped(card.id) ? '返回摘要' : '查看图表'}`"
          @click="toggleCard(card.id)"
          @keydown.enter.prevent="toggleCard(card.id)"
          @keydown.space.prevent="toggleCard(card.id)"
        >
          <div class="enough-card__inner">
            <div class="enough-card__face enough-card__front">
              <div class="enough-card__topline">
                <span>{{ card.index }}</span>
                <small>{{ card.kicker }}</small>
              </div>
              <div>
                <h3>{{ card.title }}</h3>
                <strong>{{ card.value }}</strong>
                <em v-if="card.unit">{{ card.unit }}</em>
                <p>{{ card.note }}</p>
              </div>
              <div class="enough-card__action">点击翻面 <i>↗</i></div>
            </div>

            <div class="enough-card__face enough-card__back">
              <div class="enough-card__chart-heading">
                <div>
                  <small>{{ card.kicker }}</small>
                  <h3>{{ card.title }}</h3>
                </div>
                <span>点击空白处返回</span>
              </div>
              <component :is="card.chart" v-if="isFlipped(card.id)" v-bind="card.chartProps || {}" />
              <button type="button" @click.stop="openDetail(card.id)">展开侧边详情</button>
            </div>
          </div>
        </article>
      </div>

      <section class="enough-timeline">
        <div class="enough-subheading">
          <p class="eyebrow">七十六年回望</p>
          <h3>曲线的每一次转折，都有历史背景</h3>
          <p>
            从土地改革、杂交稻突破，到家庭联产承包责任制和取消农业税。
            粮食安全不是单一技术指标，而是一条由政策、生产方式和农业科技共同推动的长线进程。
          </p>
        </div>
        <KeyEventsTimeline />
      </section>

      <p class="enough-section__footnote">
        注：粮食总产量与人均粮食占有量采用统计数据；农业科技、耕地和部分综合指标序列包含趋势估算，用于呈现长期变化。
      </p>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="enough-panel">
      <div v-if="activeDetail" class="enough-detail-layer">
        <button class="enough-detail-layer__backdrop" type="button" aria-label="关闭侧边详情" @click="closeDetail" />
        <aside class="enough-detail" aria-label="吃得饱图表详情">
          <button class="enough-detail__close" type="button" aria-label="关闭侧边详情" @click="closeDetail">×</button>
          <p class="eyebrow">{{ activeDetail.kicker }}</p>
          <h2>{{ activeDetail.detailTitle }}</h2>
          <p class="enough-detail__copy">{{ activeDetail.detailCopy }}</p>
          <div class="enough-detail__chart">
            <component :is="activeDetail.chart" v-bind="activeDetail.chartProps || {}" />
          </div>
          <div class="enough-detail__facts">
            <span v-for="fact in activeDetail.detailFacts" :key="fact">{{ fact }}</span>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.enough-section {
  padding: 56px 5vw 92px;
  color: #2d241a;
  background:
    radial-gradient(circle at 18% 7%, rgba(143, 51, 40, 0.14), transparent 26rem),
    linear-gradient(180deg, #efe1c7 0%, #d5c09e 54%, #70836d 100%);
}

.enough-section__inner {
  max-width: 1180px;
  margin: 0 auto;
}

.enough-opening,
.enough-metrics,
.enough-timeline {
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 12px;
  background: rgba(255, 249, 237, 0.78);
  box-shadow: 0 28px 70px rgba(45, 36, 26, 0.14);
}

.enough-opening {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(320px, 0.78fr);
  gap: 26px 48px;
  align-items: end;
  padding: 38px;
  background:
    linear-gradient(135deg, rgba(255, 249, 237, 0.94), rgba(234, 216, 183, 0.86)),
    #fff9ed;
}

.enough-opening h2 {
  margin: 0;
  color: #2d241a;
  font-family: var(--font-serif);
  font-size: clamp(3.4rem, 6vw, 6.4rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.enough-opening > p {
  margin: 0;
  color: rgba(45, 36, 26, 0.7);
  font-size: 1.02rem;
  line-height: 1.9;
}

.enough-metrics {
  margin-top: 28px;
  padding: 28px;
}

.enough-subheading {
  max-width: 790px;
  margin-bottom: 20px;
}

.enough-subheading h3 {
  margin: 0 0 8px;
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
}

.enough-subheading p:last-child {
  margin: 0;
  color: rgba(45, 36, 26, 0.66);
  line-height: 1.75;
}

.enough-reading-guide {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 28px 0 18px;
}

.enough-reading-guide article {
  display: grid;
  gap: 7px;
  min-height: 112px;
  padding: 16px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(255, 249, 237, 0.58);
}

.enough-reading-guide strong {
  color: #8f3328;
}

.enough-reading-guide span {
  color: rgba(45, 36, 26, 0.68);
  font-size: 0.9rem;
  line-height: 1.65;
}

.enough-section__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.enough-card {
  min-height: 410px;
  outline: none;
  perspective: 1400px;
  cursor: pointer;
}

.enough-card:focus-visible {
  border-radius: 12px;
  box-shadow: 0 0 0 3px rgba(143, 51, 40, 0.34);
}

.enough-card__inner {
  position: relative;
  height: 100%;
  min-height: inherit;
  transform-style: preserve-3d;
  transition: transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
}

.enough-card.is-flipped .enough-card__inner {
  transform: rotateY(180deg);
}

.enough-card__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border: 1px solid rgba(45, 36, 26, 0.13);
  border-radius: 12px;
  backface-visibility: hidden;
  box-shadow: 0 20px 52px rgba(45, 36, 26, 0.14);
}

.enough-card__front {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 26px;
  background:
    linear-gradient(135deg, rgba(255, 249, 237, 0.94), rgba(234, 216, 183, 0.82)),
    #fff9ed;
  transition: border-color 220ms ease, transform 220ms ease;
}

.enough-card:hover .enough-card__front {
  border-color: rgba(143, 51, 40, 0.38);
  transform: translateY(-3px);
}

.enough-card__topline,
.enough-card__chart-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.enough-card__topline span {
  color: rgba(143, 51, 40, 0.26);
  font-family: var(--font-serif);
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 0.9;
}

.enough-card small {
  color: #8f3328;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.enough-card h3 {
  margin: 0 0 18px;
  color: #2d241a;
  font-family: var(--font-serif);
  font-size: 2rem;
  line-height: 1.1;
}

.enough-card__front strong {
  display: block;
  color: #8f3328;
  font-family: var(--font-serif);
  font-size: clamp(3.8rem, 6vw, 6rem);
  line-height: 1;
  letter-spacing: -0.06em;
}

.enough-card__front em {
  display: block;
  margin-top: 8px;
  color: rgba(45, 36, 26, 0.62);
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.enough-card__front p {
  max-width: 440px;
  margin: 22px 0 0;
  color: rgba(45, 36, 26, 0.7);
  line-height: 1.75;
}

.enough-card__action {
  color: #315f49;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.enough-card__action i {
  margin-left: 8px;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: normal;
}

.enough-card__back {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 10px;
  padding: 16px;
  background: rgba(255, 249, 237, 0.98);
  color: var(--ink);
  transform: rotateY(180deg);
}

.enough-card__chart-heading h3 {
  margin: 4px 0 0;
  font-size: 1.2rem;
}

.enough-card__chart-heading span {
  color: var(--muted);
  font-size: 0.68rem;
}

.enough-card__back :deep(svg.chart-card) {
  height: 292px;
  min-height: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.enough-card__back button,
.enough-detail__close {
  border: 1px solid rgba(143, 47, 36, 0.26);
  border-radius: 999px;
  background: rgba(143, 47, 36, 0.08);
  color: var(--red);
  cursor: pointer;
  font-weight: 800;
}

.enough-card__back button {
  justify-self: end;
  padding: 8px 14px;
  font-size: 0.78rem;
}

.enough-timeline {
  margin-top: 28px;
  padding: 30px;
  background:
    linear-gradient(135deg, rgba(255, 249, 237, 0.94), rgba(208, 222, 200, 0.74)),
    #fff9ed;
}

.enough-timeline :deep(svg.chart-card) {
  display: block;
  width: 100%;
  height: 360px;
  min-height: 360px;
  border: 0;
  background: rgba(255, 249, 237, 0.54);
  box-shadow: none;
}

.enough-section__footnote {
  margin: 24px 0 0;
  color: rgba(45, 36, 26, 0.62);
  font-size: 0.76rem;
  line-height: 1.7;
}

.enough-detail-layer {
  position: fixed;
  inset: 0;
  z-index: 120;
}

.enough-detail-layer__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  border: 0;
  background: rgba(45, 36, 26, 0.46);
  cursor: pointer;
}

.enough-detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(760px, 92vw);
  overflow-y: auto;
  padding: 48px 42px;
  border-left: 1px solid rgba(45, 36, 26, 0.14);
  background:
    radial-gradient(circle at 84% 12%, rgba(49, 95, 73, 0.16), transparent 24rem),
    linear-gradient(180deg, #efe1c7, #d5c09e);
  box-shadow: -24px 0 72px rgba(45, 36, 26, 0.3);
  color: #2d241a;
}

.enough-detail__close {
  position: absolute;
  top: 20px;
  right: 22px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  font-size: 1.5rem;
}

.enough-detail h2 {
  max-width: 620px;
  margin: 16px 0 14px;
  font-family: var(--font-serif);
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 1.08;
}

.enough-detail__copy {
  color: rgba(45, 36, 26, 0.72);
  line-height: 1.9;
}

.enough-detail__chart {
  margin-top: 24px;
  padding: 14px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 12px;
  background: rgba(255, 249, 237, 0.94);
}

.enough-detail__chart :deep(svg.chart-card) {
  height: auto;
  min-height: 380px;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.enough-detail__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.enough-detail__facts span {
  padding: 12px;
  border: 1px solid rgba(45, 36, 26, 0.12);
  border-radius: 8px;
  background: rgba(255, 249, 237, 0.58);
  color: rgba(45, 36, 26, 0.74);
  font-size: 0.82rem;
  line-height: 1.5;
}

.enough-panel-enter-active,
.enough-panel-leave-active {
  transition: opacity 360ms ease;
}

.enough-panel-enter-active .enough-detail,
.enough-panel-leave-active .enough-detail {
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.enough-panel-enter-from,
.enough-panel-leave-to {
  opacity: 0;
}

.enough-panel-enter-from .enough-detail,
.enough-panel-leave-to .enough-detail {
  transform: translateX(100%);
}

@media (max-width: 820px) {
  .enough-section {
    padding: 46px 24px 72px;
  }

  .enough-opening,
  .enough-section__cards,
  .enough-reading-guide {
    grid-template-columns: 1fr;
  }

  .enough-opening,
  .enough-metrics,
  .enough-timeline {
    padding: 20px;
  }

  .enough-card {
    min-height: 390px;
  }

  .enough-detail {
    padding: 48px 20px 28px;
  }

  .enough-detail__facts {
    grid-template-columns: 1fr;
  }
}
</style>
