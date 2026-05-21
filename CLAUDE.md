# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build via Vite
- `npm run preview` — Preview production build locally

## Tech Stack

- **Vite 5** + **Vue 3** (Composition API, `<script setup>`) + **D3.js 7**
- No TypeScript, no Vue Router, no Pinia — single-page scrollytelling app
- Background: radial/linear gradient overlays on cream (#f7efe0) base; serif font for headings (Georgia/Noto Serif SC), sans-serif for body

## Project Architecture

```
src/
  App.vue                      # Root — orchestrates all sections, defines step text data
  main.js                      # Mounts app, imports global CSS

  data/                        # Mock data modules — plain JS arrays/objects
    grainData.js, dietStructureData.js, takeoutData.js,
    carbonFootprintData.js, foodWasteData.js

  components/
    layout/                    # Page-level sections & scaffolding
      Hero.vue                 # Full-screen hero
      SceneTitle.vue           # Section divider with title + image
      ScrollSection.vue        # Generic scrollytelling wrapper (sticky visual + step text)
      StepText.vue             # Step card inside scroll section
      TechSection.vue          # Scene 1 → Scene 2 transition
      DietJourneySection.vue   # Scene 2 — self-contained, manages own scroll logic
      InsightSection.vue       # Scene 2 → Scene 3 transition
      FinalSection.vue         # Closing section with timeline

    charts/                    # D3.js chart components
    visuals/                   # CSS-based visual metaphors (grain barn, plates)
```

## Scroll-Driven Storytelling Pattern

Three scenes, each with a scroll-triggered visual + text card progression:

1. **ScrollSection** (generic, used by Scene 1 & 3) — receives `steps` array as prop, uses `useScrollStep()` composable to track `activeStep` and `scrollProgress`, exposes these to the `#visual` slot. Charts reactively re-render via `watch`.

2. **DietJourneySection** (Scene 2, self-contained) — manages its own scroll listeners directly; renders different visual cards per step using `v-if`/`v-else-if`.

3. **`useScrollStep(stepCount, sectionRef)` composable** (`src/utils/useScrollStep.js`):
   - Uses `IntersectionObserver` with multiple thresholds (0.35, 0.55, 0.75) and root margin to detect which step is in view
   - Also tracks `scrollProgress` (0–1) via a `scroll` event listener for smooth animation interpolation
   - Returns `{ activeStep, scrollProgress, setStepRef }`

## Chart Conventions

- Charts are Vue SFCs with `<script setup>` + D3 rendering in `onMounted`/`watch`
- Each chart receives `activeStep` and optionally `progress` (0–1) as props
- Use `clearSvg(svgRef, width, height)` from `chartUtils.js` to reset SVG on re-render
- Charts use `viewBox` for responsive scaling (typical: 760×420 or similar)
- Common chart utility functions in `src/utils/chartUtils.js`:
  - `clearSvg(svgRef, width, height)` — clears and sets viewBox
  - `createTooltip()` / `showTooltip()` / `hideTooltip()` — D3 tooltip helpers
  - `chartColors` — shared color palette object
- Tooltip: absolutely positioned `.chart-tooltip` div, shown/hidden via opacity

## CSS Conventions

- Global styles in `src/styles/global.css`; CSS custom properties in `variables.css`
- No CSS framework — hand-written CSS with `grid` layout
- Responsive breakpoint at 1180px (tablet/mobile fallback)
- Key utility classes: `.chart-card`, `.barn-card`, `.plate-card` (card containers), `.chart-title`, `.chart-note`, `.annotation`

## Data

- All data is mock data in `src/data/*.js` — plain arrays of objects
- Scene 1 data: grain data (years with per-capita, production, staple share)
- Scene 2 data: diet structure (per-year category percentages + diversity index), takeout data
- Scene 3 data: carbon footprints, food waste categories

## Git Conventions

- PR-based workflow: feature branches → PR → review → merge to main
- Branch naming: `feature/name-desc`, `fix/name-desc`, `docs/name-desc`
- Commit messages: imperative style ("add grain line chart", not "added" or "update")
