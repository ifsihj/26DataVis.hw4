<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import {
  foodSupplyChainData,
  foodSupplyChainStages,
  responsibleChoiceSources,
} from '../../data/responsibleChoiceData.js';
import { clearSvg, createTooltip, hideTooltip, showTooltip } from '../../utils/chartUtils.js';

const svgRef = ref(null);
const viewMode = ref('absolute');
const selectedGroups = ref(['featured']);

const foodGroupOptions = [
  {
    key: 'featured',
    label: '重点食物',
    foods: ['牛肉（肉牛）', '羊肉', '奶酪', '黑巧克力', '咖啡', '猪肉', '禽肉', '大米', '豆奶', '豌豆', '香蕉', '坚果'],
  },
  {
    key: 'animal',
    label: '肉蛋奶水产',
    foods: ['牛肉（肉牛）', '牛肉（奶牛）', '羊肉', '奶酪', '养殖虾', '养殖鱼', '猪肉', '禽肉', '鸡蛋', '牛奶'],
  },
  {
    key: 'staple',
    label: '主食与豆类',
    foods: ['大米', '小麦与黑麦', '玉米', '木薯', '豆奶', '豌豆', '花生'],
  },
  {
    key: 'produce',
    label: '水果蔬菜',
    foods: ['西红柿', '根茎蔬菜', '香蕉', '苹果', '柑橘'],
  },
  {
    key: 'plant',
    label: '其他植物产品',
    foods: ['黑巧克力', '咖啡', '棕榈油', '橄榄油', '蔗糖', '坚果'],
  },
];

const selectedFoods = computed(() => {
  const activeGroups = foodGroupOptions.filter((group) => selectedGroups.value.includes(group.key));
  return new Set(activeGroups.flatMap((group) => group.foods));
});

const filteredData = computed(() =>
  foodSupplyChainData.filter((item) => selectedFoods.value.has(item.food)),
);

function toggleGroup(key) {
  if (selectedGroups.value.includes(key)) {
    if (selectedGroups.value.length === 1) return;
    selectedGroups.value = selectedGroups.value.filter((group) => group !== key);
    return;
  }
  selectedGroups.value = [...selectedGroups.value, key];
}

function drawStageIcon(parent, stage, x, y) {
  const icon = parent.append('g')
    .attr('transform', `translate(${x},${y})`)
    .attr('fill', 'none')
    .attr('stroke', stage.color)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3);

  if (stage.key === 'landUseChange') {
    icon.append('path').attr('d', 'M18 50V19 M18 20L3 38H13L0 52H36L23 38H33Z');
    icon.append('path').attr('d', 'M54 50V10 M54 11L40 29H49L37 42H70L59 29H67Z');
  } else if (stage.key === 'farm') {
    icon.append('path').attr('d', 'M2 53H70 M10 53V31L36 17L63 31V53 M22 53V39H40V53');
    icon.append('circle').attr('cx', 54).attr('cy', 14).attr('r', 7);
    icon.append('path').attr('d', 'M48 8L45 3 M60 8L63 3 M54 21V36');
  } else if (stage.key === 'animalFeed') {
    icon.append('path').attr('d', 'M10 52L17 13H55L62 52Z M17 23H55 M24 36H48');
    icon.append('path').attr('d', 'M32 13C27 3 22 3 18 2 M39 13C42 5 48 2 54 2');
  } else if (stage.key === 'processing') {
    icon.append('path').attr('d', 'M4 52V29H28V18H45V29H68V52Z M17 52V41H29V52 M45 52V41H57V52');
    icon.append('path').attr('d', 'M13 24V8 M26 16V4 M42 14V3');
  } else if (stage.key === 'transport') {
    icon.append('path').attr('d', 'M2 43V18H43V43H2Z M43 27H57L68 38V43H43Z');
    icon.append('circle').attr('cx', 17).attr('cy', 47).attr('r', 6);
    icon.append('circle').attr('cx', 54).attr('cy', 47).attr('r', 6);
  } else if (stage.key === 'retail') {
    icon.append('path').attr('d', 'M3 23H69L62 11H10Z M8 23V54H64V23 M24 54V34H46V54');
    icon.append('path').attr('d', 'M3 23C7 31 16 31 20 23C24 31 33 31 36 23C40 31 49 31 52 23C56 31 65 31 69 23');
  } else {
    icon.append('path').attr('d', 'M6 13H30V53H6Z M38 25H68V53H38Z M43 25L49 13H62L68 25');
    icon.append('path').attr('d', 'M12 21H24 M12 29H24 M44 34H62 M44 42H62');
  }
}

function formatValue(value) {
  if (Math.abs(value) >= 10) return value.toFixed(1);
  if (Math.abs(value) >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

function formatTooltip(item, isRelative) {
  const positiveTotal = d3.sum(foodSupplyChainStages, (stage) => Math.max(0, item[stage.key]));
  return `
    <strong>${item.food}</strong><br/>
    ${foodSupplyChainStages.map((stage) => {
      const value = item[stage.key];
      const share = positiveTotal > 0 ? (value / positiveTotal) * 100 : 0;
      return `${stage.label}：${formatValue(value)} kg${isRelative ? `（${formatValue(share)}%）` : ''}`;
    }).join('<br/>')}
    <br/><strong>合计：${formatValue(item.total)} kg CO₂e/kg</strong>
  `;
}

function resetHoverState() {
  const svg = d3.select(svgRef.value);
  svg.selectAll('.supply-segment').style('opacity', null).style('filter', null);
  svg.selectAll('.stage-schematic').style('opacity', null).style('filter', null);
  svg.selectAll('.stage-banner').style('stroke', null).style('stroke-width', null);
  hideTooltip(createTooltip());
}

function draw() {
  const width = 1080;
  const rowHeight = 34;
  const margin = { top: 230, right: 58, bottom: 86, left: 232 };
  const innerH = Math.max(270, filteredData.value.length * rowHeight);
  const height = margin.top + innerH + margin.bottom;
  const innerW = width - margin.left - margin.right;
  const svg = clearSvg(svgRef, width, height);
  const tooltip = createTooltip();
  const isRelative = viewMode.value === 'relative';

  svg.on('mouseleave', resetHoverState);

  const data = filteredData.value.map((item) => {
    const positiveTotal = d3.sum(foodSupplyChainStages, (stage) => Math.max(0, item[stage.key]));
    let positiveOffset = 0;
    let negativeOffset = 0;
    const segments = foodSupplyChainStages.map((stage) => {
      const rawValue = item[stage.key];
      const value = isRelative && positiveTotal > 0 ? (rawValue / positiveTotal) * 100 : rawValue;
      const x0 = value >= 0 ? positiveOffset : negativeOffset + value;
      const x1 = value >= 0 ? positiveOffset + value : negativeOffset;
      if (value >= 0) positiveOffset += value;
      else negativeOffset += value;
      return { ...stage, food: item.food, total: item.total, positiveTotal, rawValue, value, x0, x1 };
    });
    return { ...item, positiveOffset, negativeOffset, segments };
  });

  const maxPositive = isRelative ? 100 : d3.max(data, (d) => d.positiveOffset) * 1.04;
  const minNegative = Math.min(0, d3.min(data, (d) => d.negativeOffset));
  const negativeGutter = minNegative < 0 ? (isRelative ? 112 : 48) : 0;

  const xPositive = d3.scaleLinear()
    .domain([0, maxPositive])
    .nice()
    .range([0, innerW]);

  const xNegative = d3.scaleLinear()
    .domain([minNegative, 0])
    .range([-negativeGutter, 0]);

  const x = (value) => value < 0 ? xNegative(value) : xPositive(value);

  const y = d3.scaleBand()
    .domain(data.map((d) => d.food))
    .range([0, innerH])
    .padding(0.22);

  const schematic = svg.append('g')
    .attr('transform', 'translate(40,24)');
  const nodeWidth = 132;
  const gap = 14;

  foodSupplyChainStages.forEach((stage, index) => {
    const nodeX = index * (nodeWidth + gap);
    const stageNode = schematic.append('g')
      .datum(stage)
      .attr('class', 'stage-schematic')
      .attr('data-stage', stage.key);

    drawStageIcon(stageNode, stage, nodeX + 30, 0);

    if (index < foodSupplyChainStages.length - 1) {
      schematic.append('line')
        .attr('x1', nodeX + 106)
        .attr('x2', nodeX + 137)
        .attr('y1', 31)
        .attr('y2', 31)
        .attr('stroke', '#8f8a84')
        .attr('stroke-width', 3);
      schematic.append('path')
        .attr('d', `M${nodeX + 137},24 L${nodeX + 148},31 L${nodeX + 137},38 Z`)
        .attr('fill', '#8f8a84');
    }

    stageNode.append('rect')
      .attr('class', 'stage-banner')
      .attr('x', nodeX)
      .attr('y', 70)
      .attr('width', nodeWidth)
      .attr('height', 28)
      .attr('fill', stage.color);

    stageNode.append('text')
      .attr('x', nodeX + nodeWidth / 2)
      .attr('y', 90)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff9ed')
      .attr('font-size', '0.86rem')
      .attr('font-weight', 800)
      .text(stage.label);
  });

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  function highlightSegment(activeSegment, stageKey) {
    svg.selectAll('.supply-segment')
      .style('opacity', function () { return this === activeSegment ? 1 : 0.16; })
      .style('filter', function () { return this === activeSegment ? 'brightness(0.76) saturate(1.35)' : 'none'; });

    svg.selectAll('.stage-schematic')
      .style('opacity', (stage) => stage.key === stageKey ? 1 : 0.2)
      .style('filter', (stage) => stage.key === stageKey ? 'brightness(0.76) saturate(1.35)' : 'none');

    svg.selectAll('.stage-banner')
      .style('stroke', (stage) => stage.key === stageKey ? '#2d241a' : 'none')
      .style('stroke-width', (stage) => stage.key === stageKey ? 2.5 : 0);
  }

  function highlightRow(food) {
    svg.selectAll('.supply-segment')
      .style('opacity', (segment) => segment.food === food ? 1 : 0.16)
      .style('filter', (segment) => segment.food === food ? 'brightness(0.82) saturate(1.24)' : 'none');

    svg.selectAll('.stage-schematic').style('opacity', 1).style('filter', null);
    svg.selectAll('.stage-banner').style('stroke', null).style('stroke-width', null);
  }

  function clearStageHighlight() {
    svg.selectAll('.supply-segment').style('opacity', null).style('filter', null);
    svg.selectAll('.stage-schematic').style('opacity', null).style('filter', null);
    svg.selectAll('.stage-banner').style('stroke', null).style('stroke-width', null);
  }

  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(
      d3.axisBottom(xPositive)
        .ticks(10)
        .tickFormat((value) => isRelative ? `${value}%` : value)
        .tickSize(-innerH),
    )
    .selectAll('line')
    .attr('stroke', 'rgba(45,36,26,0.08)');

  g.append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll('text')
    .attr('x', (food) => food === '坚果' ? -negativeGutter - 14 : -14)
    .attr('fill', 'var(--ink-soft)')
    .attr('font-family', 'var(--font-serif)')
    .attr('font-size', '0.82rem')
    .style('cursor', 'pointer')
    .on('mouseenter', (event, food) => {
      const item = data.find((row) => row.food === food);
      highlightRow(food);
      showTooltip(tooltip, event, formatTooltip(item, isRelative));
    })
    .on('mousemove', (event, food) => {
      const item = data.find((row) => row.food === food);
      highlightRow(food);
      showTooltip(tooltip, event, formatTooltip(item, isRelative));
    })
    .on('mouseout', () => {
      clearStageHighlight();
      hideTooltip(tooltip);
    });

  g.selectAll('.domain').attr('stroke', 'var(--line)');
  g.selectAll('.tick text')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.74rem');

  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y2', innerH)
    .attr('stroke', 'rgba(45,36,26,0.52)')
    .attr('stroke-width', 1.4);

  const rows = g.selectAll('.supply-row')
    .data(data)
    .join('g')
    .attr('class', 'supply-row')
    .attr('data-food', (d) => d.food)
    .attr('transform', (d) => `translate(0,${y(d.food)})`);

  rows.selectAll('.supply-segment')
    .data((d) => d.segments.filter((segment) => segment.value !== 0))
    .join('rect')
    .attr('class', 'supply-segment')
    .attr('data-stage', (d) => d.label)
    .attr('x', x(0))
    .attr('width', 0)
    .attr('height', y.bandwidth())
    .attr('fill', (d) => d.color)
    .attr('stroke', 'rgba(255,249,237,0.78)')
    .attr('stroke-width', 0.45)
    .style('cursor', 'pointer')
    .on('mouseenter', function (_, segment) { highlightSegment(this, segment.key); })
    .on('mousemove', (event, segment) => {
      highlightSegment(event.currentTarget, segment.key);
      const item = data.find((row) => row.food === segment.food);
      showTooltip(tooltip, event, formatTooltip(item, isRelative));
    })
    .on('mouseout', () => {
      clearStageHighlight();
      hideTooltip(tooltip);
    })
    .transition()
    .duration(500)
    .delay((_, index) => index * 8)
    .ease(d3.easeCubicOut)
    .attr('x', (d) => x(d.x0))
    .attr('width', (d) => Math.max(0.7, Math.abs(x(d.x1) - x(d.x0))));

  if (!isRelative) {
    rows.append('text')
      .attr('x', (d) => x(d.positiveOffset) + 6)
      .attr('y', y.bandwidth() / 2 + 4)
      .attr('fill', 'var(--muted)')
      .attr('font-family', 'var(--font-serif)')
      .attr('font-size', '0.68rem')
      .attr('font-weight', 800)
      .text((d) => formatValue(d.total));
  }

  svg.append('text')
    .attr('x', margin.left + innerW / 2)
    .attr('y', height - 42)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.86rem')
    .attr('font-weight', 800)
    .text(isRelative ? '各生命周期阶段在正向排放中的占比（%）' : '每千克食物产生的温室气体排放（kg CO₂e / kg）');

  svg.append('text')
    .attr('x', 24)
    .attr('y', height - 12)
    .attr('fill', 'var(--muted)')
    .attr('font-size', '0.66rem')
    .text(`数据来源：${responsibleChoiceSources.foodImpacts.label}`);
}

onMounted(draw);
watch([viewMode, filteredData], draw, { deep: true });
</script>

<template>
  <div class="supply-chain-panel chart-card" @mouseleave="resetHoverState">
    <div class="supply-chain-controls">
      <div>
        <span class="control-label">阅读方式</span>
        <div class="control-buttons" role="group" aria-label="选择绝对值或相对值">
          <button
            type="button"
            :class="{ 'is-active': viewMode === 'absolute' }"
            :aria-pressed="viewMode === 'absolute'"
            @click="viewMode = 'absolute'"
          >
            绝对值
          </button>
          <button
            type="button"
            :class="{ 'is-active': viewMode === 'relative' }"
            :aria-pressed="viewMode === 'relative'"
            @click="viewMode = 'relative'"
          >
            相对值
          </button>
        </div>
      </div>
      <div>
        <span class="control-label">展示食物类别</span>
        <div class="control-buttons control-buttons--wrap" role="group" aria-label="筛选展示的食物类别">
          <button
            v-for="group in foodGroupOptions"
            :key="group.key"
            type="button"
            :class="{ 'is-active': selectedGroups.includes(group.key) }"
            :aria-pressed="selectedGroups.includes(group.key)"
            @click="toggleGroup(group.key)"
          >
            {{ group.label }}
          </button>
        </div>
      </div>
    </div>
    <p class="supply-chain-hint">
      {{ viewMode === 'absolute'
        ? '绝对值用于比较不同食物的总体碳足迹。'
        : '相对值将每种食物的正向排放归一化为 100%，用于比较生命周期结构。' }}
      当前展示 {{ filteredData.length }} 类食物。
    </p>
    <svg ref="svgRef" class="food-supply-chain-chart" />
  </div>
</template>

<style scoped>
.supply-chain-panel {
  grid-column: 1 / -1;
  min-height: 0;
  padding: 20px;
}

.supply-chain-controls {
  display: grid;
  gap: 14px;
  margin-bottom: 12px;
}

.control-label {
  display: block;
  margin-bottom: 7px;
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.control-buttons {
  display: flex;
  gap: 8px;
}

.control-buttons--wrap {
  flex-wrap: wrap;
}

.control-buttons button {
  padding: 7px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 249, 237, 0.66);
  color: var(--ink-soft);
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
}

.control-buttons button.is-active {
  border-color: var(--green);
  background: var(--green);
  color: #fff9ed;
}

.supply-chain-hint {
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.6;
}

.food-supply-chain-chart {
  display: block;
  width: 100%;
  max-width: 100%;
}
</style>
