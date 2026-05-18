import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const assets = {
  heroPoster: 'https://playground.bravebrand.com/assets/backgrounds/signal-foundry-painted-city-hero.webp',
  heroVideo:
    'https://d8j0ntlcm91z4.cloudfront.net/user_30c6yRkxUog0TZ5432rCR7HN4Pe/hf_20260501_062927_2b8ce586-f555-4610-88ae-b2d3752ede3b.mp4',
  skyPoster: 'https://playground.bravebrand.com/assets/backgrounds/signal-foundry-sky-garden.webp',
  skyVideo:
    'https://d8j0ntlcm91z4.cloudfront.net/user_30c6yRkxUog0TZ5432rCR7HN4Pe/hf_20260501_082435_42398084-1c8d-48e5-a962-fe7c28c124e6.mp4',
  pixelFlower: 'https://playground.bravebrand.com/assets/backgrounds/signal-foundry-pixel-flower.webp',
};

const systemCards = [
  {
    title: 'Brand Wiki',
    body: 'The source of truth for audience, offer, proof, positioning, and language.',
  },
  {
    title: 'Copy Coach',
    body: 'Sharpens claims, pages, emails, and scripts against the brain.',
  },
  {
    title: 'Launch Packet',
    body: 'Turns choices into an agent-ready build spec.',
  },
  {
    title: 'Agent Handoff',
    body: 'Gives the builder everything needed to ship without guessing.',
  },
];

function Reveal({
  children,
  className,
  delay = 0,
  scale = 0.98,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: reducedMotion ? 0.2 : 0.9, delay: reducedMotion ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function TextCta({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <a
      href="mailto:hello@signalfoundry.ai"
      className={`group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        dark
          ? 'text-[var(--paper)] focus-visible:outline-[var(--paper)]'
          : 'text-[var(--ink)] focus-visible:outline-[var(--ink)]'
      }`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="top"
      data-hero-video
      className="relative h-screen min-h-[720px] overflow-hidden bg-[var(--ink)] text-[var(--paper)]"
      style={{ background: `url("${assets.heroPoster}") center / cover no-repeat` }}
    >
      <motion.video
        className="absolute inset-0 h-full w-full object-cover"
        src={assets.heroVideo}
        poster={assets.heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 1.4, ease }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.28)_0%,rgba(8,7,6,0.04)_38%,rgba(8,7,6,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(7,6,5,0.66),transparent_38%)]" />

      <motion.nav
        className="absolute left-3 right-3 top-5 z-20 mx-auto flex max-w-[760px] items-center justify-between gap-2 rounded-full border border-white/20 bg-white/16 px-2 py-2 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_60px_rgba(20,15,8,0.18)] backdrop-blur-2xl backdrop-saturate-150 sm:left-1/2 sm:right-auto sm:top-7 sm:w-auto sm:min-w-[640px] sm:-translate-x-1/2 sm:gap-3 sm:px-4 sm:text-[0.76rem]"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.2 : 0.85, ease }}
      >
        <a href="#top" className="flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Signal Foundry</span>
        </a>
        <div className="flex min-w-0 items-center gap-3 sm:gap-7">
          <a href="#about" className="transition-opacity hover:opacity-70">
            About
          </a>
          <a href="#writing" className="transition-opacity hover:opacity-70">
            Writing
          </a>
          <a href="#careers" className="transition-opacity hover:opacity-70">
            Careers
          </a>
        </div>
        <a
          href="mailto:hello@signalfoundry.ai"
          className="shrink-0 rounded-full bg-[var(--ink)] px-3 py-3 text-[var(--paper)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-4"
        >
          Get Signal
        </a>
      </motion.nav>

      <div className="absolute right-5 top-[92px] z-10 hidden max-w-[170px] text-right font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/78 sm:block md:right-8">
        <span>New York / 08:16 AM</span>
      </div>

      <div className="relative z-10 flex h-full min-h-[720px] items-end px-4 pb-7 pt-28 sm:px-8 md:px-12 md:pb-12">
        <motion.article
          className="max-w-[690px] rounded-[24px] border border-white/24 bg-[rgba(72,62,76,0.42)] p-6 text-white shadow-[0_28px_70px_rgba(10,8,6,0.22)] backdrop-blur-2xl backdrop-saturate-150 sm:p-8 md:p-10"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.95, delay: reducedMotion ? 0 : 0.25, ease }}
        >
          <h1 className="font-serif text-[clamp(3.35rem,9vw,7.4rem)] font-normal leading-[0.89] tracking-[-0.04em]">
            AI that turns ideas into operating companies.
          </h1>
          <p className="mt-6 max-w-[560px] font-sans text-[clamp(1rem,1.7vw,1.28rem)] leading-[1.45] text-white/82">
            Signal Foundry is an applied AI lab building the company brain, launch packet, and agent handoff for founders who want to move from insight to execution.
          </p>
          <div className="mt-8">
            <TextCta dark>Begin the handoff</TextCta>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section id="about" className="bg-[var(--paper)] px-4 py-20 text-[var(--ink)] sm:px-8 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <div className="skyArt min-h-[520px] rounded-[34px] shadow-[var(--shadow)] md:h-[58vh]">
            <video
              className="skyVideo"
              src={assets.skyVideo}
              poster={assets.skyPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(251,250,245,0.76)_0%,rgba(251,250,245,0.2)_48%,rgba(32,135,201,0.16)_100%)]" />

            <div className="relative z-[2] grid min-h-[520px] gap-8 p-6 sm:p-9 md:h-full md:grid-cols-[1.06fr_0.74fr] md:p-12">
              <div className="flex max-w-[680px] flex-col justify-end">
                <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--blue)]">
                  Founder operating system
                </p>
                <h2 className="font-serif text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.92] tracking-[-0.04em]">
                  From founder insight to agent-ready execution.
                </h2>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <motion.div
                  className="ml-auto max-w-[330px] rounded-[24px] border border-white/60 bg-white/52 p-5 shadow-[0_20px_52px_rgba(32,135,201,0.14)] backdrop-blur-xl"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.25, ease }}
                >
                  <div className="mb-5 flex items-center justify-between font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    <span>Launch Packet</span>
                    <span>Ready</span>
                  </div>
                  <p className="font-sans text-[1.05rem] leading-[1.45] text-[var(--ink)]">
                    Audience, offer, proof, positioning, and agent build context are gathered into one execution packet.
                  </p>
                </motion.div>

                <p className="max-w-[360px] self-end rounded-[22px] border border-white/44 bg-[rgba(255,253,248,0.5)] p-5 font-sans text-[1rem] leading-[1.5] text-[var(--muted)] backdrop-blur-xl">
                  The system keeps the founder signal intact while turning it into decisions builders can act on.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section id="writing" className="bg-[var(--paper)] px-4 py-20 text-[var(--ink)] sm:px-8 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 md:grid-cols-[0.85fr_1fr] md:gap-16">
        <Reveal scale={0.96}>
          <img
            src={assets.pixelFlower}
            alt="Pixel flower"
            loading="lazy"
            className="mx-auto w-full max-w-[480px] mix-blend-multiply"
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="max-w-[640px]">
            <div className="space-y-5 font-sans text-[clamp(1.08rem,2vw,1.42rem)] leading-[1.52] text-[var(--muted)]">
              <p>We envision a world where anyone with an idea and some unique insight can start a business.</p>
              <p>A world where someone can wake up with an idea for a company, open their laptop, and create it in real time.</p>
            </div>
            <h2 className="mt-10 font-serif text-[clamp(3.1rem,7vw,7.2rem)] font-normal leading-[0.94] tracking-[-0.045em]">
              Where starting up a real world company is as easy as playing a video game.
            </h2>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SystemSection() {
  return (
    <section id="careers" className="bg-[var(--cream)] px-4 py-20 text-[var(--ink)] sm:px-8 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[var(--blue)]">
            What gets built
          </p>
          <h2 className="max-w-[860px] font-serif text-[clamp(3.2rem,7.8vw,7.6rem)] font-normal leading-[0.92] tracking-[-0.045em]">
            A company brain, not another chat thread.
          </h2>
        </Reveal>

        <motion.div
          className="mt-14 grid gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {systemCards.map((card) => (
            <motion.article
              key={card.title}
              className="rounded-[26px] border border-[var(--line)] bg-white p-7 shadow-[0_16px_45px_rgba(45,35,20,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(45,35,20,0.15)] md:p-9"
              variants={{
                hidden: { opacity: 1, y: 24, scale: 0.98 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.72, ease } },
              }}
              whileHover={{ y: -6 }}
            >
              <h3 className="font-sans text-[1.4rem] font-semibold tracking-[-0.03em] md:text-[1.7rem]">
                {card.title}
              </h3>
              <p className="mt-4 max-w-[450px] font-sans text-[1.02rem] leading-[1.5] text-[var(--muted)] md:text-[1.12rem]">
                {card.body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--ink)] px-4 py-20 text-[var(--paper)] sm:px-8 md:px-12 md:py-28"
      style={{ background: `url("${assets.heroPoster}") center / cover no-repeat` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.62),rgba(10,9,8,0.82))]" />
      <div className="relative z-10 mx-auto max-w-[1180px]">
        <Reveal>
          <h2 className="max-w-[940px] font-serif text-[clamp(3.25rem,8vw,8rem)] font-normal leading-[0.9] tracking-[-0.045em]">
            Agentic companies are on the horizon. We&apos;re building them.
          </h2>
          <div className="mt-9">
            <TextCta dark>Get to know us</TextCta>
          </div>
        </Reveal>

        <footer className="mt-24 font-sans">
          <div className="flex flex-col gap-5 border-t border-white/28 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[1.2rem] font-semibold tracking-[-0.02em]">Signal Foundry</span>
            <span className="text-sm text-white/66">Applied intelligence for company creation.</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <HeroSection />
      <SupportSection />
      <ManifestoSection />
      <SystemSection />
      <ClosingSection />
    </main>
  );
}
