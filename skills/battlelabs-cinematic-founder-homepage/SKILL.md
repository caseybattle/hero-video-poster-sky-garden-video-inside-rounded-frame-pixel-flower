---
name: battlelabs-cinematic-founder-homepage
description: Use when building, modifying, verifying, or recreating the BattleLabs.co cinematic founder-facing homepage pattern: React, Tailwind CSS, Framer Motion, warm paper/ink styling, hosted painterly video assets, glass navigation, hero card, sky-garden support panel, manifesto, system cards, and closing CTA.
---

# BattleLabs Cinematic Founder Homepage

Use this skill when Casey asks for a BattleLabs.co site, Signal Foundry-style applied AI lab homepage, founder operating system page, venture studio homepage, or another site based on this visual system.

## Start Here

1. Work in the existing Vite app unless Casey asks for a separate app.
2. Inspect these files before editing:
   - `src/App.tsx`
   - `src/index.css`
   - `index.html`
   - `scripts/verify-ui.cjs`
   - `docs/SIGNAL_FOUNDRY_PRD.md`
3. Preserve the cinematic founder-studio register: warm paper, editorial serif type, glass overlays, precise UI signals, and hosted moving imagery.
4. Do not replace the hosted Playground/CloudFront assets with gradients, generated images, placeholders, or stock imagery unless Casey explicitly changes the art direction.

## Current Site Pattern

The homepage is a complete company page, not a one-screen landing page:

1. Full-screen video hero with glass nav and lower-left glass card.
2. White support section with a large rounded sky-garden video frame.
3. Warm manifesto section with pixel flower art and large serif statement.
4. Cream system section with four product cards.
5. Dark cinematic closing CTA and footer.

Use `references/design-system.md` for exact copy, assets, colors, layout, motion, and verification details.

## Brand Rules

- Visible brand is `BattleLabs.co`.
- Browser title is `BattleLabs.co`.
- Default contact link is `mailto:hello@battlelabs.co`.
- Keep supplied strategic copy intact unless Casey asks to rewrite it.
- If adapting for a sub-brand, replace only the brand layer first: title, nav, footer, hero support copy, mailto, verifier expectations, and PRD label.

## Implementation Rules

- Use React, Tailwind CSS, and Framer Motion.
- Use semantic `<section>` elements.
- Use `Instrument Serif` for large editorial headings.
- Use `Inter Tight` for nav, body, labels, cards, and CTAs.
- Keep videos behind overlays and copy with clear z-index layering.
- Use video tags with `autoPlay`, `muted`, `loop`, `playsInline`, and `preload="metadata"`.
- Respect reduced motion with `useReducedMotion` and the CSS `prefers-reduced-motion` override.
- Avoid SaaS dashboard tropes, chatbot UI, generic AI gradients, glowing blobs, and stock art.
- Mobile must feel composed: full-height hero, centered nav pill, bottom glass card, stacked manifesto, one-column cards.

## Verification

Run these before claiming completion:

```powershell
npm run build
npm run verify:ui
```

Confirm the verifier checks:

- title is `BattleLabs.co`
- hero video and painted-city poster are wired
- sky-garden video sits inside the rounded `.skyArt` frame
- sky frame has no white bars
- pixel flower appears in manifesto
- five semantic sections render
- four system cards render
- no horizontal overflow on desktop or mobile
- no browser console errors

If the external assets fail only in Node probes with `unable to verify the first certificate`, verify through Chrome/browser rendering before treating the page as broken.
