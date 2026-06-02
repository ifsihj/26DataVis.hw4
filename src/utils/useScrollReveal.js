import { onBeforeUnmount, onMounted } from "vue";

const revealGroups = [
  { selector: ".story-index__header", type: "left" },
  { selector: ".story-index__items > div", type: "up", stagger: 55 },
  { selector: ".scene-title__index", type: "left" },
  { selector: ".scene-title__copy", type: "up", delay: 80 },
  { selector: ".scene-title__image", type: "right", delay: 140 },
  { selector: ".enough-opening > *, .better-opening > *", type: "up", stagger: 80 },
  { selector: ".enough-metrics, .better-metrics", type: "up" },
  { selector: ".enough-reading-guide > article, .better-reading-guide > article", type: "up", stagger: 65 },
  { selector: ".enough-card", type: "up", stagger: 75 },
  { selector: ".enough-timeline", type: "up" },
  { selector: ".better-chart-block", type: "up" },
  { selector: ".responsible-waste", type: "none" },
  { selector: ".waste-opening", type: "up" },
  { selector: ".responsible-part__intro", type: "up" },
  { selector: ".waste-counter", type: "up" },
  { selector: ".chart-reading-guide > article", type: "up", stagger: 60 },
  { selector: ".waste-charts, .choice-charts", type: "up" },
  { selector: ".final-section .eyebrow, .final-section h2, .final-section__inner > p", type: "up", stagger: 80 },
  { selector: ".timeline__item", type: "up", stagger: 80 },
];

export function useScrollReveal() {
  let observer;
  let animationFrame;

  onMounted(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animationFrame = window.requestAnimationFrame(() => {
      document.documentElement.classList.add("reveal-enabled");

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-revealed");
            entry.target.closest(".scene-title, .responsible-waste")?.classList.add("is-reveal-active");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -10% 0px",
        },
      );

      const prepared = new Set();

      revealGroups.forEach(({ selector, type, delay = 0, stagger = 0 }) => {
        document.querySelectorAll(selector).forEach((node, index) => {
          if (prepared.has(node)) return;

          prepared.add(node);
          node.classList.add("reveal-item");
          node.dataset.reveal = type;
          node.style.setProperty("--reveal-delay", `${delay + Math.min(index, 5) * stagger}ms`);
          observer.observe(node);
        });
      });
    });
  });

  onBeforeUnmount(() => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    observer?.disconnect();
    document.documentElement.classList.remove("reveal-enabled");
  });
}
