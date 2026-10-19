/**
 * BRAIDBAR price display normaliser.
 *
 * Shows every euro price on the storefront with a dot as the decimal
 * separator (€360,00 -> €360.00, €1.360,00 -> €1,360.00, 360,00 € -> €360.00).
 *
 * BRAIDBAR's own sections already print dot prices from Liquid (snippets/bb-money).
 * This script covers prices rendered by the base theme's blocks and anything
 * updated later in the page (variant changes, cart drawer, infinite scroll).
 * It only rewrites visible text that contains a euro sign next to a number,
 * so form values, scripts and other text are never touched.
 */
(() => {
  const EURO_BEFORE = /€\s?(\d{1,3}(?:\.\d{3})+|\d+),(\d{2})(?!\d)/g;
  const EURO_AFTER = /(\d{1,3}(?:\.\d{3})+|\d+),(\d{2})\s?€/g;
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE']);

  const toDot = (_match, whole, cents) => `€${whole.replace(/\./g, ',')}.${cents}`;

  const formatText = (text) => {
    if (!text || text.indexOf('€') === -1 || text.indexOf(',') === -1) return text;
    return text.replace(EURO_BEFORE, toDot).replace(EURO_AFTER, toDot);
  };

  const shouldSkip = (node) => {
    const parent = node.parentElement;
    if (!parent) return true;
    if (SKIP_TAGS.has(parent.tagName)) return true;
    return parent.isContentEditable;
  };

  const formatNode = (node) => {
    if (node.nodeType !== Node.TEXT_NODE || shouldSkip(node)) return;
    const updated = formatText(node.nodeValue);
    if (updated !== node.nodeValue) node.nodeValue = updated;
  };

  const formatTree = (root) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      formatNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && SKIP_TAGS.has(root.tagName)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      formatNode(node);
      node = walker.nextNode();
    }

    // Attributes that screen readers announce for prices.
    if (root.querySelectorAll) {
      root.querySelectorAll('[aria-label*="€"]').forEach((element) => {
        const label = element.getAttribute('aria-label');
        const updated = formatText(label);
        if (updated !== label) element.setAttribute('aria-label', updated);
      });
    }
  };

  const init = () => {
    try {
      formatTree(document.body);

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') {
            formatNode(mutation.target);
          } else {
            mutation.addedNodes.forEach(formatTree);
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (error) {
      console.warn('[BRAIDBAR] Price formatting was skipped.', error);
    }
  };

  window.BraidbarFormatPrice = formatText;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
