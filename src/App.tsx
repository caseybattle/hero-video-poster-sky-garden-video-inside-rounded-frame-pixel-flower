import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const HERO_MODEL_PATH = '/avatar-head.glb';
const HERO_MODEL_BYTES = '51893304';
const HERO_MODEL_SHA256 = 'cac07733089ee566e655c5397ecf82b70c8ef8836bc1b1b839f766e34744c5c3';

type ProjectScrollDebug = {
  active: boolean;
  pin: boolean;
  scrub: boolean | number;
  target: string;
  travel: number;
  mode?: 'framer-sticky-stack' | 'gsap-pin-stack' | 'sticky-stack' | 'horizontal-track';
  cards?: number;
};

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const decorations = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    className: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    className: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    className: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    className: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
];

const services = [
  {
    number: '01',
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    number: '02',
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    number: '03',
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    number: '04',
    name: 'Branding',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    number: '05',
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

const projects = [
  {
    number: '01',
    name: 'Nextlevel Studio',
    category: 'Portfolio Study',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ],
  },
  {
    number: '02',
    name: 'Aura Brand Identity',
    category: 'Concept Study',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    ],
  },
  {
    number: '03',
    name: 'Solaris Digital',
    category: 'Portfolio Study',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    ],
  },
];

type FadeInProps = {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

function FadeIn({
  children,
  as = 'div',
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: FadeInProps) {
  const MotionTag = useMemo(() => motion.create(as as never), [as]) as React.ElementType;
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionTag
      className={className}
      initial={prefersReducedMotion ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [query]);

  return matches;
}

type MagnetProps = {
  children: ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
};

function Magnet({
  children,
  className,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0, active: false });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const inside =
      x >= -padding && x <= rect.width + padding && y >= -padding && y <= rect.height + padding;

    if (!inside) {
      setPosition({ x: 0, y: 0, active: false });
      return;
    }

    setPosition({
      x: (x - rect.width / 2) / strength,
      y: (y - rect.height / 2) / strength,
      active: true,
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0, active: false })}
      style={{
        transform: prefersReducedMotion
          ? 'translate3d(0, 0, 0)'
          : `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: prefersReducedMotion ? 'none' : position.active ? activeTransition : inactiveTransition,
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
    >
      {children}
    </div>
  );
}

function ContactButton() {
  return (
    <a
      href="mailto:hello@casey.studio"
      className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white outline outline-2 -outline-offset-[3px] outline-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#BBCCD7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C0C0C] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      }}
    >
      Contact Me
      <Mail aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

function HeroAvatar() {
  const hostRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(1.8, 2.6, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x9fd2ff, 1.2);
    rimLight.position.set(-2, 1.4, 3);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1.25));

    const group = new THREE.Group();
    scene.add(group);

    let frame = 0;
    let pointerTilt = { x: 0, y: 0 };
    let loaded = false;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const loader = new GLTFLoader();
    loader.load(
      HERO_MODEL_PATH,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const meshes = new Set<THREE.Object3D>();
        const materials = new Set<THREE.Material>();
        const textures = new Set<THREE.Texture>();
        model.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            meshes.add(object);
            const material = (object as THREE.Mesh).material;
            const materialList = Array.isArray(material) ? material : [material];
            materialList.forEach((item) => {
              if (!item) return;
              materials.add(item);
              Object.values(item).forEach((value) => {
                if (value instanceof THREE.Texture) textures.add(value);
              });
            });
          }
        });
        model.position.sub(center);
        const maxAxis = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(2.65 / maxAxis);
        group.add(model);
        loaded = true;
        host.dataset.modelLoaded = 'true';
        host.dataset.modelSrc = HERO_MODEL_PATH;
        host.dataset.modelBytes = HERO_MODEL_BYTES;
        host.dataset.modelSha256 = HERO_MODEL_SHA256;
        host.dataset.modelMeshCount = String(meshes.size);
        host.dataset.modelMaterialCount = String(materials.size);
        host.dataset.modelTextureCount = String(textures.size);
        host.dataset.modelBoxX = size.x.toFixed(4);
        host.dataset.modelBoxY = size.y.toFixed(4);
        host.dataset.modelBoxZ = size.z.toFixed(4);
      },
      undefined,
      () => {
        host.dataset.modelLoaded = 'false';
        setFailed(true);
      },
    );

    const onPointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion) return;
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      pointerTilt = { x: THREE.MathUtils.clamp(-ny * 0.18, -0.18, 0.18), y: THREE.MathUtils.clamp(nx * 0.34, -0.34, 0.34) };
    };

    const render = () => {
      if (loaded) {
        const idle = prefersReducedMotion ? 0 : Math.sin(Date.now() * 0.0007) * 0.035;
        group.rotation.x += (pointerTilt.x - group.rotation.x) * 0.06;
        group.rotation.y += (pointerTilt.y + idle - group.rotation.y) * 0.06;
        host.dataset.rotationX = group.rotation.x.toFixed(4);
        host.dataset.rotationY = group.rotation.y.toFixed(4);
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize);
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
          object.geometry.dispose();
        }
      });
    };
  }, [prefersReducedMotion]);

  if (failed) {
    return (
      <img
        src="/casey-portrait.png"
        alt="Casey"
        className="hero-portrait h-full w-full select-none object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
        draggable={false}
      />
    );
  }

  return (
    <div
      ref={hostRef}
      data-hero-3d
      data-model-loaded="false"
      data-model-src={HERO_MODEL_PATH}
      data-model-bytes={HERO_MODEL_BYTES}
      data-model-sha256={HERO_MODEL_SHA256}
      aria-label="Casey 3D portrait"
      className="h-full w-full drop-shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
    />
  );
}

function LiveProjectButton() {
  return (
    <a
      href="mailto:hello@casey.studio?subject=Casey%203D%20case%20study%20request"
      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 focus-visible:ring-4 focus-visible:ring-[#BBCCD7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C0C0C] sm:px-10 sm:py-3.5 sm:text-base"
    >
      Live Project
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

function HeroSection() {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Price', href: '#price' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: 'mailto:hello@casey.studio' },
  ];

  return (
    <section
      className="relative flex h-screen min-h-[680px] flex-col overflow-x-clip bg-[#55A8F5] bg-cover bg-center"
      style={{ backgroundImage: "url('/casey-sky-background.png')" }}
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-b from-black/10 via-transparent to-[#0C0C0C]/55" />
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-30 flex w-full justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider text-[#F7FBFF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="transition-opacity duration-200 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BBCCD7]"
          >
            {item.label}
          </a>
        ))}
      </FadeIn>

      <div className="relative z-20 mt-6 w-full overflow-hidden px-2 sm:mt-4 md:-mt-5">
        <FadeIn as="div" delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap text-center text-[13.8vw] font-black uppercase leading-none tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.32)] sm:text-[13.6vw] md:text-[12.8vw] lg:text-[12.2vw]">
            Hi, i&apos;m casey
          </h1>
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:h-[460px] sm:w-[460px] sm:translate-y-0 md:h-[560px] md:w-[560px] lg:h-[660px] lg:w-[660px]">
        <FadeIn as="div" delay={0.6} y={30} className="h-full w-full">
          <HeroAvatar />
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn as="p" delay={0.35} y={20} className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-[#F7FBFF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:max-w-[220px] md:max-w-[260px]">
          a 3d creator shaping cinematic identity, motion, and immersive web moments
        </FadeIn>
        <FadeIn as="div" delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [offset, setOffset] = useState(200);
  const rowOne = marqueeImages.slice(0, 11);
  const rowTwo = marqueeImages.slice(11);

  useEffect(() => {
    if (prefersReducedMotion) {
      setOffset(200);
      return;
    }

    let frame = 0;
    const updateOffset = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateOffset();
      });
    };

    updateOffset();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <MarqueeRow
          images={rowOne}
          reduceLoad={Boolean(prefersReducedMotion)}
          transform={prefersReducedMotion ? 'translateX(0px)' : `translateX(${offset - 200}px)`}
        />
        <MarqueeRow
          images={rowTwo}
          reduceLoad={Boolean(prefersReducedMotion)}
          transform={prefersReducedMotion ? 'translateX(0px)' : `translateX(${-1 * (offset - 200)}px)`}
        />
      </div>
    </section>
  );
}

function MarqueeRow({
  images,
  transform,
  reduceLoad,
}: {
  images: string[];
  transform: string;
  reduceLoad: boolean;
}) {
  const repeated = reduceLoad ? images : [...images, ...images, ...images];

  return (
    <div data-marquee-row className="flex gap-3" style={{ transform, willChange: 'transform' }}>
      {repeated.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[193px] w-[300px] flex-none rounded-2xl object-cover sm:h-[232px] sm:w-[360px] md:h-[270px] md:w-[420px]"
        />
      ))}
    </div>
  );
}

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.92', 'center 0.52'],
  });
  const aboutText =
    "I build polished 3D visuals, motion-led brand moments, and immersive web scenes for people who want their work to feel impossible to ignore. Every frame is shaped for impact, clarity, and a memorable first impression. Let's build something incredible together!";

  return (
    <section ref={sectionRef} id="about" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10">
      {decorations.map((item) => (
        <AboutDecoration
          key={item.src}
          item={item}
          progress={scrollYProgress}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
        />
      ))}

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-10 text-center sm:gap-14 md:gap-16">
        <FadeIn as="h2" delay={0} y={40} className="hero-heading text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
          About me
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText text={aboutText} />
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

function AboutDecoration({
  item,
  progress,
  prefersReducedMotion,
}: {
  item: (typeof decorations)[number];
  progress: MotionValue<number>;
  prefersReducedMotion: boolean;
}) {
  const fromX = item.x < 0 ? -190 : 190;
  const fromY = item.className.includes('bottom') ? 120 : -120;
  const x = useTransform(progress, [0, 1], [fromX, 0]);
  const y = useTransform(progress, [0, 1], [fromY, 0]);
  const rotate = useTransform(progress, [0, 1], [item.x < 0 ? -16 : 16, 0]);
  const opacity = useTransform(progress, [0, 0.35, 1], [0, 0.75, 1]);

  return (
    <motion.div
      className={`pointer-events-none absolute z-0 ${item.className}`}
      style={{
        x: prefersReducedMotion ? 0 : x,
        y: prefersReducedMotion ? 0 : y,
        rotate: prefersReducedMotion ? 0 : rotate,
        opacity: prefersReducedMotion ? 1 : opacity,
      }}
    >
      <img src={item.src} alt="" loading="lazy" className="w-full object-contain" />
    </motion.div>
  );
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const nodes = useMemo(() => {
    let index = 0;
    const total = text.length;

    return text.split(' ').flatMap((word, wordIndex, words) => {
      const chars = word.split('').map((char) => {
        const current = index;
        index += 1;
        return (
          <AnimatedCharacter key={`${wordIndex}-${current}`} char={char} index={current} total={total} progress={scrollYProgress} />
        );
      });

      const result: ReactNode[] = [
        <span key={`word-${wordIndex}`} className="inline-block">
          {chars}
        </span>,
      ];

      if (wordIndex < words.length - 1) {
        const current = index;
        index += 1;
        result.push(
          <AnimatedCharacter key={`space-${wordIndex}`} char=" " isSpace index={current} total={total} progress={scrollYProgress} />,
        );
      }

      return result;
    });
  }, [scrollYProgress, text]);

  if (prefersReducedMotion) {
    return (
      <p
        ref={ref}
        className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
      >
        {text}
      </p>
    );
  }

  return (
    <p
      ref={ref}
      aria-label={text}
      className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
    >
      {nodes}
    </p>
  );
}

function AnimatedCharacter({
  char,
  index,
  total,
  progress,
  isSpace = false,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isSpace?: boolean;
}) {
  const start = total <= 1 ? 0 : (index / total) * 0.85;
  const end = Math.min(1, start + 0.15);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const display = isSpace ? '\u00A0' : char;

  return (
    <span aria-hidden="true" className={isSpace ? 'relative inline-block w-[0.35em]' : 'relative inline-block'}>
      <span className="opacity-0">{display}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {display}
      </motion.span>
    </span>
  );
}

function ServicesSection() {
  return (
    <section id="price" className="rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn as="h2" className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none sm:mb-20 md:mb-28">
        Services
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map((service, index) => (
          <FadeIn
            key={service.number}
            delay={index * 0.1}
            className="grid grid-cols-[minmax(82px,0.35fr)_1fr] gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 last:border-b sm:gap-8 sm:py-10 md:py-12"
          >
            <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-[#0C0C0C]">
              {service.number}
            </span>
            <div className="flex flex-col justify-center gap-3">
              <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase leading-tight">
                {service.name}
              </h3>
              <p className="max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] font-light leading-relaxed opacity-60">
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardCount = container.querySelectorAll('[data-project-card]').length;
    const debug: ProjectScrollDebug = {
      active: true,
      pin: false,
      scrub: true,
      target: '[data-project-card]',
      travel: cardCount,
      mode: 'framer-sticky-stack',
      cards: cardCount,
    };
    container.dataset.projectMode = 'framer-sticky-stack';
    container.dataset.projectTravel = String(cardCount);
    (window as typeof window & { __projectScrollDebug?: ProjectScrollDebug }).__projectScrollDebug = debug;
  }, []);

  return (
    <section
      ref={containerRef}
      id="projects"
      data-project-mode="framer-sticky-stack"
      className="relative z-10 -mt-10 w-full overflow-x-clip rounded-t-[40px] bg-[#0C0C0C] px-5 py-16 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-24"
    >
      <FadeIn as="h2" className="hero-heading mb-10 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight md:mb-14">
        Project
      </FadeIn>
      <div data-project-stack className="relative mx-auto w-full max-w-[1180px] pb-[18vh] [perspective:1400px]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isStackedViewport = useMediaQuery('(min-width: 640px)');
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.94', 'start 0.2'],
  });
  const targetScale = 1 - (total - 1 - index) * 0.016;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.7, 1, 0.82]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, index === total - 1 ? 0 : -2.4]);
  const stickyTop = isStackedViewport
    ? `calc(clamp(68px, 8vh, 92px) + ${index * 36}px)`
    : `${24 + index * 18}px`;

  return (
      <motion.article
        ref={cardRef}
        data-project-card
        data-project-card-index={index}
        className="project-liquid-card sticky mx-auto mb-6 flex min-h-[560px] w-full origin-top flex-col overflow-hidden rounded-[40px] border-2 border-transparent bg-[#0C0C0C] p-4 text-[#D7E2EA] will-change-transform last:mb-0 sm:h-[calc(100vh-7rem)] sm:min-h-[520px] sm:max-h-[680px] sm:rounded-[50px] sm:p-6 md:h-[calc(100vh-11rem)] md:min-h-[560px] md:max-h-[760px] md:rounded-[60px] md:p-8"
        style={{
          top: stickyTop,
          scale: prefersReducedMotion ? 1 : scale,
          rotateX: prefersReducedMotion ? 0 : rotateX,
          zIndex: index + 1,
          transformStyle: 'preserve-3d',
          '--project-glow-opacity': prefersReducedMotion ? 0.75 : glowOpacity,
        } as CSSProperties}
      >
        <div className="mb-5 flex shrink-0 flex-col gap-5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
            <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-[#D7E2EA]">
              {project.number}
            </span>
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/60 sm:text-base">
                {project.category}
              </p>
              <h3 className="text-[clamp(1.35rem,4vw,4.2rem)] font-black uppercase leading-none">
                {project.name}
              </h3>
            </div>
          </div>
          <div className="sm:shrink-0">
            <LiveProjectButton />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 sm:grid-cols-[40%_1fr]">
          <div className="grid min-h-0 gap-4 sm:grid-rows-[0.42fr_0.58fr]">
            <img
              src={project.images[0]}
              alt={`${project.name} preview 1`}
              loading="lazy"
              className="h-[130px] w-full rounded-[40px] object-cover sm:h-full sm:rounded-[50px] md:rounded-[60px]"
            />
            <img
              src={project.images[1]}
              alt={`${project.name} preview 2`}
              loading="lazy"
              className="h-[170px] w-full rounded-[40px] object-cover sm:h-full sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
          <img
            src={project.images[2]}
            alt={`${project.name} preview 3`}
            loading="lazy"
            className="h-[300px] w-full rounded-[40px] object-cover sm:h-full sm:rounded-[50px] md:rounded-[60px]"
          />
        </div>
      </motion.article>
  );
}

function FooterSection() {
  const footerLinks = [
    { label: 'About', href: '#about' },
    { label: 'Price', href: '#price' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: 'mailto:hello@casey.studio' },
  ];

  return (
    <footer className="relative z-20 overflow-hidden bg-[#0C0C0C] px-5 pb-8 pt-20 text-[#D7E2EA] sm:px-8 md:px-10 md:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D7E2EA]/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[min(760px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(89,224,255,0.18),rgba(182,0,168,0.1)_38%,transparent_70%)] blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#D7E2EA]/60">
              Available for select projects
            </p>
            <h2 className="hero-heading max-w-4xl text-[clamp(3.5rem,11vw,150px)] font-black uppercase leading-none tracking-tight">
              Let&apos;s build
            </h2>
          </div>
          <ContactButton />
        </div>

        <div className="grid gap-8 border-y border-[#D7E2EA]/15 py-8 md:grid-cols-[1fr_auto] md:items-center">
          <a
            href="mailto:hello@casey.studio"
            className="group inline-flex w-fit items-center gap-3 text-[clamp(1.25rem,3vw,2.4rem)] font-black uppercase leading-none tracking-tight transition-opacity hover:opacity-75"
          >
            hello@casey.studio
            <ArrowUpRight aria-hidden="true" className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/75 sm:text-base">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-[#D7E2EA]">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 text-xs font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/45 sm:flex-row sm:items-center sm:justify-between">
          <span>Casey -- 3D Creator</span>
          <span>2026 Portfolio</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#0C0C0C] font-kanit">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <FooterSection />
    </main>
  );
}
