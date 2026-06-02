/**
 * navigator.js — 深度页滑动导航控制器
 * 3D 水平推入 + 滚动导航点 + 键盘/手势交互
 * 保留 Overlay / Router 别名以兼容已有代码
 */
const Navigator = {
  current: null,
  backdrop: null,
  closeBtn: null,
  scrollContainer: null,
  navDots: null,
  slideObserver: null,
  isAnimating: false,

  /**
   * 初始化：滚动导航点 + 深度页面板基础设施
   */
  init() {
    this.backdrop = document.getElementById('deep-backdrop');
    this.closeBtn = document.getElementById('deep-close');
    this.scrollContainer = document.getElementById('scroll-container');

    // Backdrop click → close
    this.backdrop.addEventListener('click', () => this.close());

    // Close button click → close
    this.closeBtn.addEventListener('click', () => this.close());

    // Escape key → close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.current) {
        this.close();
      }
    });

    // --- Slide Navigation Dots ---
    this.navDots = document.querySelectorAll('.slide-nav .nav-dot');
    const slides = this.scrollContainer.querySelectorAll('.slide');

    // Click dot → scroll to slide
    this.navDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide);
        if (!isNaN(idx) && slides[idx]) {
          slides[idx].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // IntersectionObserver to track active slide
    this.slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const slideEl = entry.target;
          const slideIdx = Array.from(slides).indexOf(slideEl);
          if (slideIdx >= 0) {
            this._setActiveDot(slideIdx);
          }
        }
      });
    }, {
      threshold: 0.5,
      root: this.scrollContainer,
    });

    slides.forEach(slide => this.slideObserver.observe(slide));
  },

  /**
   * Highlight the active navigation dot
   */
  _setActiveDot(idx) {
    this.navDots.forEach(d => d.classList.remove('active'));
    const target = document.querySelector(`.nav-dot[data-slide="${idx}"]`);
    if (target) target.classList.add('active');
  },

  /**
   * Open deep panel with 3D horizontal push
   * @param {string} route - e.g. 'deep/1'
   */
  open(route) {
    if (this.current === route || this.isAnimating) return;

    // Close previous if any
    if (this.current) {
      this._hideCurrentPanel();
    }

    const routeConfig = CONFIG.routes[route];
    if (!routeConfig) return;

    const panelEl = document.getElementById(routeConfig.page);
    if (!panelEl) return;

    this.isAnimating = true;

    // Prepare panel
    panelEl.classList.add('active');
    panelEl.scrollTop = 0;

    // Show backdrop
    this.backdrop.classList.add('active');

    // Push main view slightly
    document.getElementById('app-root').classList.add('deep-open');

    // Disable body scroll
    document.body.style.overflow = 'hidden';
    this.scrollContainer.style.overflowY = 'hidden';

    // Show close button with slight delay
    setTimeout(() => {
      if (this.current === route) {
        this.closeBtn.classList.add('visible');
        this.isAnimating = false;
      }
    }, 400);

    this.current = route;

    // Trigger render event
    const event = new CustomEvent('navigator-open', {
      detail: { route, title: routeConfig.title },
    });
    document.dispatchEvent(event);
  },

  /**
   * Close current deep panel
   */
  close() {
    if (!this.current || this.isAnimating) return;
    this.isAnimating = true;

    this._hideCurrentPanel();
    this.current = null;

    // Restore main view
    document.getElementById('app-root').classList.remove('deep-open');

    // Restore scroll
    document.body.style.overflow = '';
    this.scrollContainer.style.overflowY = '';

    // Cleanup
    document.dispatchEvent(new CustomEvent('navigator-close'));

    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  },

  /**
   * Internal: hide the current panel
   */
  _hideCurrentPanel() {
    if (!this.current) return;
    const routeConfig = CONFIG.routes[this.current];
    if (routeConfig) {
      const panelEl = document.getElementById(routeConfig.page);
      if (panelEl) {
        panelEl.classList.remove('active');
      }
    }
    this.backdrop.classList.remove('active');
    this.closeBtn.classList.remove('visible');
  },
};

/** Backward compatibility aliases */
const Overlay = {
  init() { /* Navigator.init() already called */ },
  open(route) { Navigator.open(route); },
  close() { Navigator.close(); },
  get current() { return Navigator.current; },
};

const Router = {
  init() { /* Navigator.init() already called */ },
  go(route) { Navigator.open(route); },
  back() { Navigator.close(); },
  get currentRoute() { return Navigator.current; },
};
