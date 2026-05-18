# BattleLabs.co Cinematic Founder Homepage Reference

## Core Copy

- Hero headline: `AI that turns ideas into operating companies.`
- Hero support copy: `BattleLabs.co is an applied AI lab building the company brain, launch packet, and agent handoff for founders who want to move from insight to execution.`
- Main section headline: `From founder insight to agent-ready execution.`
- Manifesto paragraphs:
  - `We envision a world where anyone with an idea and some unique insight can start a business.`
  - `A world where someone can wake up with an idea for a company, open their laptop, and create it in real time.`
- Manifesto headline: `Where starting up a real world company is as easy as playing a video game.`
- System headline: `A company brain, not another chat thread.`
- Closing headline: `Agentic companies are on the horizon. We're building them.`
- Footer line: `Applied intelligence for company creation.`

## Hosted Assets

- Hero poster: `https://playground.bravebrand.com/assets/backgrounds/signal-foundry-painted-city-hero.webp`
- Hero video: `https://d8j0ntlcm91z4.cloudfront.net/user_30c6yRkxUog0TZ5432rCR7HN4Pe/hf_20260501_062927_2b8ce586-f555-4610-88ae-b2d3752ede3b.mp4`
- Sky-garden poster: `https://playground.bravebrand.com/assets/backgrounds/signal-foundry-sky-garden.webp`
- Sky-garden video: `https://d8j0ntlcm91z4.cloudfront.net/user_30c6yRkxUog0TZ5432rCR7HN4Pe/hf_20260501_082435_42398084-1c8d-48e5-a962-fe7c28c124e6.mp4`
- Pixel flower: `https://playground.bravebrand.com/assets/backgrounds/signal-foundry-pixel-flower.webp`

## Fonts

Use this exact Google Fonts link in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Color Tokens

```css
:root {
  --ink: #151313;
  --paper: #fffdf8;
  --line: #e8e3d8;
  --muted: #6d6962;
  --glass: rgba(72, 62, 76, 0.42);
  --blue: #2087c9;
  --cream: #fbfaf5;
  --shadow: 0 28px 70px rgba(45, 35, 20, 0.16);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Required Sky Frame CSS

```css
.skyArt {
  position: relative;
  overflow: hidden;
  background: url('https://playground.bravebrand.com/assets/backgrounds/signal-foundry-sky-garden.webp') center / cover no-repeat;
}

.skyVideo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}
```

## Motion

- Use Framer Motion.
- Use `const ease = [0.16, 1, 0.3, 1] as const;`.
- Hero video fades/scales in.
- Nav slides down.
- Hero card slides/fades up.
- Section panels fade/scale in on viewport entry.
- Support copy and system cards stagger.
- Cards lift subtly on hover.
- Reduced motion should collapse to simple fades.
