# BRAIDBAR Shopify theme updates

This repository contains the custom BRAIDBAR storefront files prepared for the unpublished Shopify theme `gid://shopify/OnlineStoreTheme/190835622201`.

## Included updates

- Responsive BRAIDBAR header, full-screen mobile navigation and footer
- English and Portuguese storefront copy
- Responsive homepage, search, About, FAQs and appointment templates
- A bilingual appointment form with 23 braiding services and EUR prices
- Five catalogue wigs transcribed from the supplied catalogue
- Clear catalogue photography, including the supplied ZIP images
- Local theme assets so homepage images do not depend on fragile external file URLs

## October 2026 fixes

- Prices: shown as `€360.00` (dot decimals). BRAIDBAR sections use `snippets/bb-money.liquid`;
  `assets/braidbar-price-format.js` converts any remaining `€360,00` text from base-theme blocks
  (product page, collection cards, cart drawer). For checkout and emails, also set
  Shopify admin → Settings → General → Store defaults → Currency display → Change formatting
  to `€{{amount}}` / `€{{amount}} EUR`.
- Search: the search page uses its own product-only form with prefix matching
  (`type=product`, `options[prefix]=last`), shows the number of matches, and labels
  suggestions clearly when nothing matches.
- Mobile menu: the panel now opens directly under the sticky header wherever the page is
  scrolled (`assets/braidbar-header.js`); scroll lock moved to `html` so the header stays put.
- Contact details (phone/WhatsApp, email, Lisbon studio) live in `snippets/bb-contact.liquid`
  and appear in the footer, FAQs and booking page, plus HairSalon structured data for Google.
  New English/Portuguese copy lives in `snippets/bb-text.liquid` so the locale files stay untouched.
- Featured hair cards: no white boxes; image, title and price sit directly on the page background.
- Spacing: shared `--bb-gutter` and `--bb-section-space` tokens keep page edges and section
  spacing identical across home, FAQs, booking, header menu and footer.
- These files are uploaded to the unpublished Shopify theme "BRAIDBAR — Back up"
  (`gid://shopify/OnlineStoreTheme/189421813959`).

## Catalogue source files

- `catalogue/wigs.json` contains the five wig products and EUR pricing
- `catalogue/appointments.json` contains the appointment menu and inclusions
- `catalogue/images/` contains the full product image set

The Shopify theme remains unpublished until the merchant explicitly requests publication. Product prices in Shopify should only be synchronized after the store currency is confirmed as EUR.
