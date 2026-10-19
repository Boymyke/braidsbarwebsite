(() => {
  const selectors = [
    '.bb-home__section > .bb-shell > *',
    '.bb-collection-header .bb-shell > *',
    '.bb-booking__intro',
    '.bb-booking__layout',
    '.bb-about__hero-copy',
    '.bb-about__hero-media',
    '.bb-about__story-grid > *',
    '.bb-about__value-grid > *',
    '.bb-about__cta-inner',
    '.bb-faqs__hero-inner > *',
    '.bb-faqs__item',
    '.bb-faqs__contact',
    '.bb-cart-shell .cart-page > *',
    '.bb-search > *',
    '.bb-booking__contact',
    '.bb-site-footer__grid > *',
    '.product-grid__item',
  ].join(',');

  const revealAll = (root = document) => {
    root.querySelectorAll('.bb-reveal').forEach((element) => {
      element.classList.add('bb-reveal--visible');
    });
  };

  const init = (root = document) => {
    try {
      const elements = [...root.querySelectorAll(selectors)].filter(
        (element) => !element.hasAttribute('data-bb-reveal-ready')
      );

      if (!elements.length) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.setAttribute('data-bb-reveal-ready', ''));
        return;
      }

      elements.forEach((element, index) => {
        element.setAttribute('data-bb-reveal-ready', '');
        element.classList.add('bb-reveal');
        element.style.setProperty('--bb-reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      });

      document.documentElement.classList.add('bb-motion-ready');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('bb-reveal--visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );

      elements.forEach((element) => observer.observe(element));
      window.setTimeout(() => revealAll(root), 2400);
    } catch (error) {
      document.documentElement.classList.remove('bb-motion-ready');
      revealAll(root);
      console.warn('[BRAIDBAR] Motion enhancement was skipped.', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', (event) => init(event.target));

  // Soft shadow under the sticky header once the page is scrolled.
  // On wide screens the theme scrolls inside .page-wrapper instead of the window.
  const header = () => document.querySelector('.bb-site-header');
  const scrollOffset = () => {
    const wrapper = document.querySelector('.page-wrapper');
    return Math.max(window.scrollY || 0, wrapper ? wrapper.scrollTop : 0);
  };
  let ticking = false;
  const updateHeader = () => {
    ticking = false;
    const element = header();
    if (element) element.classList.toggle('bb-site-header--scrolled', scrollOffset() > 8);
  };
  document.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    },
    { passive: true, capture: true }
  );
  updateHeader();
})();
