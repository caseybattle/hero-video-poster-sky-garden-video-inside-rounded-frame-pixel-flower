# Verification

## Date
2026-05-17

## Commands
- `npm run build`
- `node scripts/verify-ui.cjs`

## Build Result
PASS

Vite built successfully after TypeScript compile:
- CSS bundle: `dist/assets/index-Cmg2AoT3.css`
- JS bundle: `dist/assets/index-NcwpyjOe.js`

## Browser Verification Method
Automated Chromium checks through `playwright-core` using local Chrome at:
`C:/Program Files/Google/Chrome/Application/chrome.exe`

Dev server:
`http://127.0.0.1:5173/`

## Checked Viewports
- Desktop: 1440 x 1000
- Mobile: 390 x 844
- Reduced motion: 1440 x 1000 with `prefers-reduced-motion: reduce`

## Results
- Page title is `Casey -- 3D Creator`.
- Casey heading detected on desktop, mobile, and reduced-motion checks.
- No visible Jack copy detected.
- Horizontal overflow: `0` on desktop, mobile, and reduced-motion checks.
- Section count: `5`.
- Project card behavior: `sticky` on desktop, `static` on mobile.
- Marquee movement: transform changes on normal scroll.
- Reduced-motion marquee: transform remains stopped at `translateX(0px)`.
- Keyboard focus: nav link receives visible `solid` outline.

## Screenshots
- `verification/desktop.png`
- `verification/desktop-bottom.png`
- `verification/mobile.png`
- `verification/mobile-bottom.png`
- `verification/reduced-motion.png`

## Notes
- Hero heading scale was reduced from the Jack-sized desktop value so Casey's longer name does not clip.
- Project labels use proof-safe language: `Portfolio Study` and `Concept Study`.
- Project CTA uses `Request Case Study` mailto behavior until real project URLs exist.
