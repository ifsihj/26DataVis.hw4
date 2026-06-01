# 吃得饱 — 中国粮食安全数据可视化

## 项目简介

场景一「吃得饱」：基于真实国家统计局数据（1949-2025）的中国粮食安全数据叙事可视化。

采用**仪表盘 + 深度钻取**的双层架构：
- **仪表盘**：6 个图表 + 5 个关键指标卡片 + 历史事件时间线，一页纵览76年粮食变迁
- **8个深度页**：点击任意图表进入详细分析，含连接散点图、流图、热力图、凹凸图、径向柱状图等多种高级图表类型

视觉风格：莫兰迪色系 × 报纸叙事风

## 技术栈

- 纯原生 HTML/CSS/JavaScript（无框架，无构建工具）
- D3.js v7（CDN 加载）
- Hash 路由 SPA
- 零依赖，零安装

## 数据来源

- **国家统计局年度数据**（1949-2025）：粮食产量、播种面积、人口等 40+ 指标
- **FAO**（联合国粮农组织）：农业生产价值数据
- 部分指标（膳食结构、自给率、科技指标）基于公开趋势的合理估算

## 如何运行

项目是纯静态页面，**无需安装任何依赖**。只需启动一个静态文件服务器：

```bash
# 方式一：Python
python -m http.server 8080

# 方式二：Node.js (如果安装了 npx)
npx serve .

# 方式三：VS Code Live Server 插件
# 右键 index.html → Open with Live Server
```

然后浏览器打开 `http://localhost:8080`

## 项目结构

```
吃得饱/
├── index.html              # SPA 主页面
├── README.md
├── .gitignore
├── css/
│   └── style.css           # 全局样式（莫兰迪色系 + 报纸风格）
├── js/
│   ├── config.js           # 色板、路由、常量
│   ├── data-loader.js      # CSV/JSON 数据加载
│   ├── utils.js            # 工具函数（Tooltip、格式化、标注）
│   ├── router.js           # Hash 路由
│   ├── dashboard.js        # 仪表盘编排（6图 + 5卡片 + 时间线）
│   ├── deep-pages.js       # 8个深度页渲染逻辑
│   └── charts/             # 可复用图表组件（14个）
│       ├── line-chart.js      # 折线图
│       ├── area-chart.js      # 面积图
│       ├── stacked-area.js    # 堆叠面积图
│       ├── grouped-bar.js     # 分组柱状图
│       ├── radar.js           # 雷达图
│       ├── lollipop.js        # 棒棒糖图
│       ├── radial-bar.js      # 径向柱状图
│       ├── connected-scatter.js # 连接散点图
│       ├── streamgraph.js     # 流图
│       ├── heatmap.js         # 热力图
│       ├── treemap.js         # 矩形树图
│       ├── bump-chart.js      # 凹凸图（排名变化）
│       └── donut.js           # 环形图
└── data/
    ├── 年度数据.csv            # 原始数据：国家统计局
    ├── FAOSTAT_data_zh_5-27-2026.csv  # 原始数据：FAO
    ├── process_real_data.py    # 数据预处理脚本
    ├── processed/              # 预处理后的标准化CSV（供D3加载）
    │   ├── grain_output.csv
    │   ├── per_capita_grain.csv
    │   ├── diet_structure.csv
    │   ├── self_sufficiency.csv
    │   ├── agri_technology.csv
    │   ├── world_comparison.csv
    │   ├── arable_land.csv
    │   ├── key_events.json
    │   ├── fao_production_value.csv
    │   └── fao_top_crops.csv
    └── 假数据/                 # 原始假数据（仅供参考）
```

## 仪表盘布局

| 行 | 左 | 右 |
|---|---|---|
| 指标卡片 | 人均粮食 · 总产 · 自给率 · 亩产 · 耕地 |
| 1 | 人均粮食占有量折线+面积 | 分品种产量堆叠面积 |
| 2 | 消费结构流图（全宽） |  |
| 3 | 全球对比柱状图 | 粮食安全雷达 |
| 4 | 关键事件时间线（全宽） |  |

## 深度页列表

1. 人均粮食占有量详解 + 连接散点图
2. 粮食总产量详解（分品种 + 百分比视图）
3. 主食消费结构详解（流图/堆叠 + 自动播放）
4. 科技驱动增产（亩产双轴图 + 杂交稻覆盖率）
5. 粮食安全综合指标（棒棒糖图 + 耕地面积 + 全球自给率对比）
6. 75年产量全景（热力图/凹凸图/径向柱状图三视图切换）
7. FAO 生产价值分析（7大类农产品趋势）
8. 作物结构演变（品种占比 + 玉米vs稻谷对比）
