/**
 * BRAIDBAR header behaviour.
 *
 * Keeps the mobile navigation panel directly under the visible header bar,
 * wherever the visitor has scrolled to, and closes it on link tap, Escape,
 * outside tap or when the screen widens to the desktop layout.
 */
(() => {
  const DESKTOP_QUERY = window.matchMedia('(min-width: 1100px)');

  const setup = (root = document) => {
    const menu = root.querySelector('.bb-site-header__mobile-menu');
    if (!menu || menu.hasAttribute('data-bb-ready')) return;
    menu.setAttribute('data-bb-ready', '');

    const summary = menu.querySelector('summary');
    const panel = menu.querySelector('.bb-site-header__mobile-panel');
    const bar = menu.closest('.bb-site-header__main') || menu.closest('.bb-site-header');
    if (!summary || !panel || !bar) return;

    const placePanel = () => {
      if (!menu.open || DESKTOP_QUERY.matches) return;

      // Bottom edge of the header bar as the visitor sees it right now.
      const desiredTop = Math.max(0, Math.round(bar.getBoundingClientRect().bottom));
      panel.style.setProperty('--bb-menu-top', `${desiredTop}px`);
      panel.style.removeProperty('top');

      // If any ancestor turns position:fixed into a local container
      // (transform, filter, backdrop-filter...), correct for the offset.
      const actualTop = Math.round(panel.getBoundingClientRect().top);
      const drift = actualTop - desiredTop;
      if (Math.abs(drift) > 1) {
        panel.style.top = `${desiredTop - drift}px`;
      }
    };

    const setState = (isOpen) => {
      document.documentElement.classList.toggle('bb-menu-open', isOpen);
      summary.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        placePanel();
        window.requestAnimationFrame(placePanel);
      }
    };

    const close = () => {
      if (menu.open) menu.open = false;
    };

    summary.setAttribute('aria-expanded', String(menu.open));
    menu.addEventListener('toggle', () => setState(menu.open));

    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.open) {
        close();
        summary.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (menu.open && !menu.contains(event.target)) close();
    });

    window.addEventListener('resize', placePanel, { passive: true });
    window.addEventListener('scroll', placePanel, { passive: true });
    window.addEventListener('orientationchange', placePanel);

    const onBreakpoint = () => {
      if (DESKTOP_QUERY.matches) close();
    };
    if (DESKTOP_QUERY.addEventListener) {
      DESKTOP_QUERY.addEventListener('change', onBreakpoint);
    } else if (DESKTOP_QUERY.addListener) {
      DESKTOP_QUERY.addListener(onBreakpoint);
    }

    // Returning with the browser back button should never show a stale open menu.
    window.addEventListener('pageshow', () => {
      close();
      setState(false);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setup(), { once: true });
  } else {
    setup();
  }

  document.addEventListener('shopify:section:load', (event) => setup(event.target));
})();
