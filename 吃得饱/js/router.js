/**
 * router.js — 基于 hash 的 SPA 路由
 */
const Router = {
  currentRoute: null,

  init: function() {
    window.addEventListener('hashchange', () => this.navigate());
    // 初始路由
    if (!location.hash || location.hash === '#') {
      location.hash = '#dashboard';
    } else {
      this.navigate();
    }
  },

  navigate: function() {
    const hash = location.hash.slice(1) || 'dashboard';
    const route = CONFIG.routes[hash];

    if (!route) {
      location.hash = '#dashboard';
      return;
    }

    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));

    // 显示目标页面
    const target = document.getElementById(route.page);
    if (target) {
      target.classList.add('active');
    }

    this.currentRoute = hash;

    // 触发自定义事件，通知页面渲染
    const event = new CustomEvent('route-change', { detail: { route: hash, title: route.title } });
    document.dispatchEvent(event);
  },

  go: function(route) {
    location.hash = `#${route}`;
  },

  back: function() {
    this.go('dashboard');
  },
};
