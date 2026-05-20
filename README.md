# 从吃得饱到吃得好，再到吃得负责：中国人的餐桌变迁

## 项目简介

这是一个基于 React + D3.js 的 scroll-driven storytelling 数据可视化项目，展示中国人的餐桌如何从粮食安全、饮食丰富，走向食品浪费、碳足迹与可持续消费的反思。

页面采用纵向滚动叙事结构，不是传统 dashboard。用户向下滚动时，会依次进入三个场景：

- 吃得饱：粮食安全与温饱问题的解决
- 吃得好：饮食结构丰富化与外卖兴起
- 吃得负责：食品浪费、碳足迹与可持续消费

目前项目使用 mock data，后续可以替换为真实数据。

## 技术栈

- Vite
- React
- D3.js
- CSS
- IntersectionObserver

## 如何运行项目

1. 克隆仓库

```bash
git clone https://github.com/ifsihj/26DataVis.hw4.git
```

2. 进入项目目录

```bash
cd 26DataVis.hw4
```

3. 安装依赖

```bash
npm install
```

4. 启动项目

```bash
npm run dev
```

5. 打开浏览器访问终端中显示的地址，一般是：

```text
http://localhost:5173
```

## 项目结构说明

```text
src/
  App.jsx
  main.jsx

  data/
    grainData.js
    dietStructureData.js
    takeoutData.js
    carbonFootprintData.js
    foodWasteData.js

  components/
    layout/
      Hero.jsx
      ScrollSection.jsx
      SceneTitle.jsx
      StepText.jsx
      FinalSection.jsx

    charts/
      GrainLineChart.jsx
      DietStackedAreaChart.jsx
      TakeoutGrowthChart.jsx
      CarbonBarChart.jsx
      FoodWasteFlow.jsx
      FinalTimeline.jsx

    visuals/
      GrainBarnVisual.jsx
      PlateComparison.jsx
      ResponsiblePlate.jsx

  styles/
    global.css
    variables.css

  utils/
    useScrollStep.js
    chartUtils.js
```

`src/data/` 存放 mock 数据，之后可以替换为真实数据。

`src/components/charts/` 存放 D3 图表组件。

`src/components/layout/` 存放页面布局和滚动叙事组件。

`src/components/visuals/` 存放非传统图表的视觉隐喻组件，比如粮仓、餐盘等。

`src/utils/` 存放滚动监听和图表辅助函数。

## 协作方式：所有修改都通过 Pull Request

本项目采用 Pull Request 协作方式：

- main 分支保持稳定
- 不直接向 main push
- 每个功能开一个 feature 分支
- 修改完成后提交 PR
- 至少一名队友 review 后再 merge
- merge 前需要确认 npm run dev 可以正常运行

## 第一次参与项目

```bash
git clone https://github.com/ifsihj/26DataVis.hw4.git
cd 26DataVis.hw4
npm install
```

## 每次开始写代码前

```bash
git checkout main
git pull origin main
```

## 新建自己的分支

分支命名建议：

```text
feature/你的名字-功能名
```

例如：

```bash
git checkout -b feature/zhangsan-carbon-chart
```

## 修改代码后提交

```bash
git status
git add .
git commit -m "add carbon footprint chart"
```

## 推送自己的分支

```bash
git push -u origin feature/zhangsan-carbon-chart
```

## 创建 Pull Request

1. 打开 GitHub 仓库页面
2. 点击 Compare & pull request
3. base 选择 main
4. compare 选择自己的分支
5. 填写这次修改内容
6. 点击 Create pull request

## PR 描述模板

```markdown
### 本次修改内容

-

### 修改了哪些文件

-

### 如何测试

- [ ] 本地运行 npm run dev 没有报错
- [ ] 页面可以正常滚动
- [ ] 图表可以正常显示

### 是否需要队友重点检查

-
```

## 分支命名规范

- feature/姓名-功能
- fix/姓名-问题
- docs/姓名-文档
- style/姓名-样式

示例：

- feature/lisi-takeout-chart
- fix/wangwu-scroll-bug
- docs/zhaoliu-update-readme
- style/chenqi-hero-section

## commit 信息规范

推荐写法：

- add grain line chart
- fix carbon chart tooltip
- update README collaboration guide
- style hero section background
- refactor scroll step hook

不要写：

- update
- 111
- fix
- 改了一下

## 常见问题

### 1. 如果 git push 被拒绝怎么办？

先执行：

```bash
git pull origin main
```

然后根据提示解决冲突，再重新提交和 push。

### 2. 如果不小心在 main 上改了怎么办？

先新建分支保存当前修改：

```bash
git checkout -b feature/your-name-temp
git add .
git commit -m "save changes"
git push -u origin feature/your-name-temp
```

然后在 GitHub 上从这个分支创建 PR。

### 3. 如果 npm install 报错怎么办？

macOS / Linux 可以尝试：

```bash
rm -rf node_modules package-lock.json
npm install
```

Windows 用户可以手动删除 `node_modules` 文件夹和 `package-lock.json` 文件，然后重新运行：

```bash
npm install
```

### 4. 如果页面打不开怎么办？

检查是否已经运行：

```bash
npm run dev
```

并确认浏览器访问的是终端显示的本地地址。

## 数据替换说明

目前 `src/data/` 目录下是 mock data。

后续如果找到真实数据，只需要替换 `src/data/` 中对应文件的数据结构即可。替换时尽量保持字段名不变，否则图表组件也要同步修改。

建议替换数据时先只改一个文件，并运行 `npm run dev` 检查页面是否还能正常显示。

## 推荐分工

- A 同学：负责场景一“吃得饱”的数据和图表
- B 同学：负责场景二“吃得好”的数据和图表
- C 同学：负责场景三“吃得负责”的数据和图表
- D 同学：负责整体视觉风格、滚动动画和 README
- E 同学：负责真实数据收集和数据来源整理

## 数据来源

目前使用 mock data。

后续替换真实数据时，请在这里记录：

- 数据名称
- 来源链接
- 时间范围
- 字段说明
- 负责同学

示例：

```text
数据名称：
来源链接：
时间范围：
字段说明：
负责同学：
```
