/**
 * BRAIDBAR form spam guard.
 *
 * Adds a hidden "honeypot" field and a minimum fill-in time to the store's
 * contact, appointment and newsletter forms. Real visitors never see or fill
 * the honeypot and always take more than a few seconds, while most spam bots
 * fill every field instantly. Suspicious submissions are stopped before they
 * reach Shopify, so they never become emails.
 *
 * This works together with Shopify's own hCaptcha protection
 * (Online Store > Preferences > Spam protection), which also blocks bots
 * that post to the store without running JavaScript.
 */
(() => {
  const MIN_SECONDS = 4;
  const FORM_SELECTOR = [
    'form[action*="/contact"]',
    'form#ContactForm',
    'form.bb-booking__form',
    'form[action*="/account"][id*="newsletter" i]',
    'form[id*="Newsletter" i]',
  ].join(',');

  const guard = (form) => {
    if (form.dataset.bbGuard) return;
    form.dataset.bbGuard = 'ready';

    const startedAt = Date.now();

    const trap = document.createElement('div');
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important;';
    trap.innerHTML =
      '<label>Leave this field empty<input type="text" name="bb_website" tabindex="-1" autocomplete="off" value=""></label>';
    form.appendChild(trap);
    const trapInput = trap.querySelector('input');

    form.addEventListener(
      'submit',
      (event) => {
        const tooFast = (Date.now() - startedAt) / 1000 < MIN_SECONDS;
        const trapped = trapInput.value.trim() !== '';
        if (!tooFast && !trapped) {
          // The honeypot must never travel with a real submission.
          trapInput.disabled = true;
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        if (tooFast && !trapped) {
          // A very quick human: let them try again after a short pause.
          const button = form.querySelector('[type="submit"]');
          if (button) {
            button.disabled = true;
            window.setTimeout(() => {
              button.disabled = false;
            }, (MIN_SECONDS * 1000) - (Date.now() - startedAt));
          }
        }
      },
      true
    );
  };

  const init = (root = document) => {
    root.querySelectorAll(FORM_SELECTOR).forEach(guard);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', (event) => init(event.target));
})();
