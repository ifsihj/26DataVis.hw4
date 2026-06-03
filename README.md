# 中国人的餐桌

一个基于 Vue 3 + D3 的数据叙事可视化项目，主题是中国人的餐桌如何从“吃得饱”，走向“吃得好”，再到“吃得负责”。

项目不是传统 dashboard，而是一篇可滚动阅读的数据专题：用户沿页面向下阅读，依次进入粮食安全、饮食结构、食品浪费与环境代价等章节。页面同时提供章节导航、滚动淡入动画、图表交互，以及一页式 presentation 模式用于说明数据来源。

## 在线部署

本项目通过 GitHub Pages 部署，Vite `base` 已配置为：

```js
base: "/26DataVis.hw4/";
```

推送到 `main` 后会触发 `.github/workflows/deploy.yml`，自动构建并发布 `dist/`。

## 技术栈

- Vue 3
- Vite
- D3.js
- CSS
- IntersectionObserver
- GitHub Actions + GitHub Pages

## 本地运行

```bash
npm install
npm run dev
```

本地预览生产构建：

```bash
npm run build
npm run preview
```

## 页面结构

```text
src/
  App.vue
  main.js

  components/
    layout/
      Hero.vue
      StoryMarquee.vue
      SectionNav.vue
      SceneTitle.vue
      EnoughSection.vue
      BetterDietSection.vue
      ResponsibleWasteSection.vue
      FinalSection.vue
      PresentationDeck.vue

    charts/
      MetricCards.vue
      PerCapitaLineChart.vue
      GrainStackedArea.vue
      WorldComparisonBar.vue
      AgriTechnologyTrend.vue
      EngelCoefficientChart.vue
      DietStructureDonutChart.vue
      DietConsumptionTrendChart.vue
      DietUrbanRuralSnapshotChart.vue
      FoodWasteCompositionChart.vue
      FoodWasteRateChart.vue
      FoodWasteEnvironmentalImpactChart.vue
      FoodSupplyChainChart.vue
      FinalTimeline.vue

  data/
    scene1Data.js
    dietConsumptionData.js
    wasteImpactData.js
    foodWasteCompositionData.js
    foodWasteRateData.js
    foodWasteEnvironmentalImpactData.js
    responsibleChoiceData.js

  styles/
    variables.css
    global.css

  utils/
    chartUtils.js
    useScrollReveal.js
```

## 主要交互

- 右侧章节导航：快速跳转到封面、三章正文和结尾。
- Hero 章节索引：点击后跳转到对应章节。
- 滚动动效：章节标题、阅读卡片和图表区块会随滚动淡入。
- 粮食安全卡片：点击卡片翻面查看图表，并可展开侧边分析。
- 图表 tooltip：多数 D3 图表支持悬停查看详细数值。
- 碳足迹生命周期图：左侧筛选面板可切换阅读方式和食物类别。
- Presentation 模式：右下角按钮打开一页“数据从哪里来”的演示页，按 `Esc` 或点击退出按钮返回正文。

## 数据来源

当前项目混合使用官方统计、国际组织报告、同行评议研究与课程子项目整理数据。

| 模块         | 数据来源                                            | 用途                                              |
| ------------ | --------------------------------------------------- | ------------------------------------------------- |
| 粮食安全     | 国家统计局 / FAO                                    | 粮食总产、人均粮食占有量、FAO 400 kg 参考线等     |
| 城乡饮食     | 子项目整理数据                                      | 城乡九类食物消费、恩格尔系数与 2024 年快照        |
| 全球食品浪费 | UNEP Food Waste Index Report 2024                   | 2022 年全球食品浪费估计与家庭、餐饮服务、零售占比 |
| 食物碳足迹   | Poore & Nemecek (2018), Science / Our World in Data | 不同食物的生命周期温室气体排放拆解                |

需要注意：

- 城乡饮食序列存在观测缺口，图中以虚线连接缺口两端。
- 农业科技、耕地等部分指标包含趋势估算，用于呈现长期变化。
- 分类浪费率与环境足迹数组在正式发布前仍需补齐外部引用。

## 协作建议

- `main` 分支保持可部署状态。
- 大改动建议开 feature 分支，通过 Pull Request 合并。
- 合并前确认没有冲突标记，并运行 `npm run build`。
- 如果修改了数据结构，同步检查依赖这些字段的 D3 图表。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
```
