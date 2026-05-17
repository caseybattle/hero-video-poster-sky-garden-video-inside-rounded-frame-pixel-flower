# Casey 3D Creator Portfolio PRD

## Decision Type
Product and creative implementation for a personal 3D creator landing page.

## Objective
Build a polished dark-theme portfolio landing page that adapts the supplied "Jack" specification to Casey, using Casey's provided portrait as the hero identity asset.

## Audience
Prospective clients, collaborators, and creative partners evaluating Casey's 3D, motion, branding, and web design work.

## Primary User Outcome
The visitor immediately understands that Casey is a 3D creator, sees a premium visual style, scans services, reviews project examples, and has an obvious contact action.

## Required Stack
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Vite

## Required Global Style
- Background: `#0C0C0C` on `html`, `body`, `#root`, and main wrapper.
- Font: Kanit from Google Fonts, weights 300-900.
- Reset: `box-sizing: border-box`, `margin: 0`, `padding: 0`.
- Main wrapper: `overflow-x: clip`.
- `.hero-heading`: vertical gradient text from `#646973` to `#BBCCD7`.

## Section Order
1. HeroSection
2. MarqueeSection
3. AboutSection
4. ServicesSection
5. ProjectsSection

## Casey-Specific Adaptation
- Page title changes from `Jack -- 3D Creator` to `Casey -- 3D Creator`.
- Hero headline changes from `Hi, i'm jack` to `Hi, i'm casey`.
- Hero portrait uses the local image supplied by Casey:
  `public/casey-portrait.png`.
- Generic "Jack" references are not allowed in visible UI.
- Brand voice should read confident, direct, and creator-led rather than template-generic.
- Visible copy should position Casey around cinematic 3D identity, motion, and immersive web presentation.
- Do not imply client proof, live project links, or measurable outcomes that are not supplied.

## Functional Requirements
- Navbar has four links: About, Price, Projects, Contact.
- Contact CTA appears in hero and about sections.
- Hero portrait has a magnetic mouse-following hover effect.
- Hero, decorative images, services, and key content use Framer Motion entrance animations.
- Marquee section uses two scroll-driven horizontal image rows from the supplied GIF URLs.
- About paragraph uses character-by-character scroll opacity reveal.
- Services section uses a white rounded-top panel with five service rows.
- Projects section uses three sticky-stacking cards with supplied project names and image URLs.
- Project CTAs must use honest placeholder language until real project URLs are supplied.

## Responsive Requirements
- Mobile-first Tailwind breakpoints.
- Fluid typography with `clamp()` where specified.
- No horizontal overflow on mobile or desktop.
- Text must not overlap or overflow controls.
- Sticky project cards must remain visually usable on desktop and degrade cleanly on smaller screens.

## Accessibility Requirements
- Images that communicate content need useful alt text.
- Decorative images use empty alt text.
- Buttons and links must be keyboard reachable.
- Keyboard focus states must be visible on nav links, contact CTAs, and project controls.
- Motion must not block access to content.
- `prefers-reduced-motion` must disable or simplify marquee movement, entrance movement, magnetic hover, character reveal, and sticky scaling.
- Color contrast should remain readable against the dark and white surfaces.

## Assumptions
- Contact destination is temporary until Casey supplies a preferred email or form URL.
- Project CTA destination is a case-study request email until real project URLs exist.
- Supplied remote GIF/project/decorative assets may be loaded from their original hosts.
- Casey's portrait can be masked/cropped to fit the provided 3D floating-head style.
- Supplied project examples are treated as portfolio case-study placeholders unless Casey provides real project URLs, roles, tools, or outcomes.

## Consensus Gate Requirement
Before continuing implementation, three independent agent reviews must evaluate:
- Product and brand fit.
- Implementation feasibility and responsive behavior.
- Risk, accessibility, and spec fidelity.

## Acceptance Criteria
- App builds successfully.
- Local dev server runs.
- Browser verification covers desktop and mobile first viewport plus scroll through all sections.
- No visible "Jack" copy remains.
- PRD and consensus result are stored under `docs/`.
- Reduced-motion behavior is verified.
- Keyboard focus treatment is verified.
- Mobile project cards render as normal stacked cards, with sticky scaling reserved for desktop.
