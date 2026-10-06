import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, Code2, Globe, Layers3, Menu, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardPreview } from './dashboard-preview';

const projects = [
  { number: '01', type: 'Business Website', title: 'Digital Presence', description: 'Company profile yang terasa premium, cepat, dan fokus membangun kepercayaan.', className: 'project-visual project-visual-web' },
  { number: '02', type: 'Business System', title: 'Operations OS', description: 'Interface operasional yang menyatukan data, workflow, dan aktivitas bisnis.', className: 'project-visual project-visual-system' },
  { number: '03', type: 'Custom Experience', title: 'Brand Experience', description: 'Landing page dan digital experience yang dibuat mengikuti karakter brand.', className: 'project-visual project-visual-brand' },
];

const services = [
  { icon: Globe, number: '01', title: 'Website & Company Profile', text: 'Website modern yang membuat bisnis terlihat profesional sejak first impression.' },
  { icon: Layers3, number: '02', title: 'Digital Product', text: 'Landing page, portal, dan interface produk yang dirancang untuk pengalaman pengguna.' },
  { icon: Code2, number: '03', title: 'Custom System', text: 'Sistem digital yang mengikuti workflow bisnis, bukan memaksa bisnis mengikuti template.' },
];

const processCopy = [
  'Understand the business, audience, and goal.',
  'Define the visual and digital direction.',
  'Turn the direction into a clear interface.',
  'Build responsive, polished, production-ready work.',
  'Review, refine, and launch with confidence.',
];

export function Brand() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 34" fill="none"><path d="M14 2 1 31h8l9-21-4-8ZM20 12l-5 12h8l3 7h7L20 12Z" fill="currentColor" /></svg></span><span>alvin<span className="font-medium">studio</span><span className="text-primary">.</span></span></span>;
}

export function StudioHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [service, setService] = useState('Project baru');
  const [copied, setCopied] = useState(false);

  const consult = (name = 'Project baru') => {
    setService(name);
    setCopied(false);
    setConsultationOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealObserver = reduce ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver?.observe(el));

    const electricCanvas = document.querySelector<HTMLCanvasElement>('.studio-electric-canvas');
    const electricContext = electricCanvas?.getContext('2d');
    let electricFrame = 0;
    type CrackLine = { points: Array<{ x: number; y: number }>; depth: number; width: number };
    let crackBursts: Array<{ x: number; y: number; life: number; seed: number; lines: CrackLine[] }> = [];

    const resizeElectricCanvas = () => {
      if (!electricCanvas || !electricContext) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      electricCanvas.width = Math.floor(window.innerWidth * ratio);
      electricCanvas.height = Math.floor(window.innerHeight * ratio);
      electricCanvas.style.width = '100vw';
      electricCanvas.style.height = '100vh';
      electricContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resizeElectricCanvas();
    window.addEventListener('resize', resizeElectricCanvas);

    const makeRealisticCracks = (x: number, y: number, seed: number): CrackLine[] => {
      const lines: CrackLine[] = [];
      const mainBranches = 7 + Math.floor(Math.random() * 3);

      for (let branch = 0; branch < mainBranches; branch += 1) {
        const angle = seed + branch * (Math.PI * 2 / mainBranches) + (Math.random() - 0.5) * 0.6;
        const length = 65 + Math.random() * 105;
        const segments = 6 + Math.floor(Math.random() * 3);
        const points = [{ x, y }];
        let px = x;
        let py = y;
        let currentAngle = angle;

        for (let segment = 1; segment <= segments; segment += 1) {
          currentAngle += (Math.random() - 0.5) * 0.62;
          const step = length / segments * (0.78 + Math.random() * 0.44);
          px += Math.cos(currentAngle) * step;
          py += Math.sin(currentAngle) * step;
          points.push({ x: px, y: py });

          if (segment >= 2 && segment < segments && Math.random() < 0.6) {
            const subAngle = currentAngle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.8);
            const subLength = 18 + Math.random() * 42;
            const subPoints = [{ x: px, y: py }];
            let sx = px;
            let sy = py;
            const subSegments = 2 + Math.floor(Math.random() * 2);
            for (let sub = 0; sub < subSegments; sub += 1) {
              sx += Math.cos(subAngle + (Math.random() - 0.5) * 0.4) * (subLength / subSegments);
              sy += Math.sin(subAngle + (Math.random() - 0.5) * 0.4) * (subLength / subSegments);
              subPoints.push({ x: sx, y: sy });
            }
            lines.push({ points: subPoints, depth: 0.65 + Math.random() * 0.35, width: 0.65 + Math.random() * 0.55 });
          }
        }
        lines.push({ points, depth: 0.8 + Math.random() * 0.2, width: 0.95 + Math.random() * 0.65 });
      }
      return lines;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches || reduce) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty('--cursor-x', event.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', event.clientY + 'px');
      document.documentElement.style.setProperty('--hero-mx', (x * 18) + 'px');
      document.documentElement.style.setProperty('--hero-my', (y * 18) + 'px');
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onPointerDown = (event: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches || reduce || event.button !== 0) return;
      crackBursts.push({
        x: event.clientX,
        y: event.clientY,
        life: 1,
        seed: Math.random() * Math.PI * 2,
        lines: makeRealisticCracks(event.clientX, event.clientY, Math.random() * Math.PI * 2),
      });
      if (crackBursts.length > 5) crackBursts = crackBursts.slice(-5);
    };
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    const drawElectric = () => {
      if (!electricContext) return;
      electricContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      electricContext.lineCap = 'round';
      electricContext.lineJoin = 'round';

      // Neon lamp halo: stays around the cursor, never leaves a trail.
      const cursorX = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cursor-x'));
      const cursorY = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cursor-y'));
      if (Number.isFinite(cursorX) && Number.isFinite(cursorY)) {
        const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.08;

        electricContext.shadowColor = 'rgba(255, 184, 0, 0.9)';
        electricContext.shadowBlur = 26;
        electricContext.fillStyle = 'rgba(255, 216, 61, 0.16)';
        electricContext.beginPath();
        electricContext.arc(cursorX, cursorY, 9 * pulse, 0, Math.PI * 2);
        electricContext.fill();

        electricContext.shadowColor = 'rgba(255, 184, 0, 0.95)';
        electricContext.shadowBlur = 17;
        electricContext.strokeStyle = 'rgba(255, 216, 61, 0.82)';
        electricContext.lineWidth = 1.35;
        electricContext.beginPath();
        electricContext.arc(cursorX, cursorY, 5.5 * pulse, 0, Math.PI * 2);
        electricContext.stroke();

        electricContext.shadowColor = 'rgba(255, 184, 0, 1)';
        electricContext.shadowBlur = 24;
        electricContext.fillStyle = 'rgba(255, 247, 194, 1)';
        electricContext.beginPath();
        electricContext.arc(cursorX, cursorY, 2.25, 0, Math.PI * 2);
        electricContext.fill();
      }

      // Sharper, high-contrast ground fracture on click.
      for (let i = crackBursts.length - 1; i >= 0; i -= 1) {
        const crack = crackBursts[i];
        crack.life -= 0.058;
        if (crack.life <= 0) { crackBursts.splice(i, 1); continue; }

        const progress = 1 - crack.life;
        const reveal = Math.min(1, progress * 1.9);
        const alpha = Math.pow(crack.life, 1.35);

        for (const line of crack.lines) {
          const total = line.points.length - 1;
          const exact = reveal * total;
          const visible = Math.max(1, Math.ceil(exact));

          for (let seg = 1; seg <= visible && seg <= total; seg += 1) {
            const a = line.points[seg - 1];
            const b = line.points[seg];
            const local = Math.min(1, Math.max(0, exact - (seg - 1)));
            const ex = a.x + (b.x - a.x) * local;
            const ey = a.y + (b.y - a.y) * local;
            const taper = 1 - ((seg - 1) / Math.max(total, 1)) * 0.62;
            const width = Math.max(0.35, line.width * taper);

            // Strong black fracture body / physical depth.
            electricContext.shadowBlur = 3;
            electricContext.shadowColor = 'rgba(0, 0, 0, 0.75)';
            electricContext.strokeStyle = 'rgba(3, 6, 5, ' + alpha * 0.92 * line.depth + ')';
            electricContext.lineWidth = width + 3.2;
            electricContext.beginPath();
            electricContext.moveTo(a.x, a.y);
            electricContext.lineTo(ex, ey);
            electricContext.stroke();

            // Bright warm edge makes the crack readable against the dark page.
            electricContext.shadowBlur = 10;
            electricContext.shadowColor = 'rgba(255, 184, 0, ' + alpha * 0.75 * line.depth + ')';
            electricContext.strokeStyle = 'rgba(255, 216, 61, ' + alpha * 0.82 * line.depth + ')';
            electricContext.lineWidth = width + 0.8;
            electricContext.beginPath();
            electricContext.moveTo(a.x, a.y);
            electricContext.lineTo(ex, ey);
            electricContext.stroke();

            // Fine hot inner fracture.
            electricContext.shadowBlur = 4;
            electricContext.strokeStyle = 'rgba(255, 247, 194, ' + alpha * 0.58 * line.depth + ')';
            electricContext.lineWidth = Math.max(0.3, width * 0.42);
            electricContext.beginPath();
            electricContext.moveTo(a.x, a.y);
            electricContext.lineTo(ex, ey);
            electricContext.stroke();
          }
        }
      }

      electricContext.shadowBlur = 0;
      electricFrame = requestAnimationFrame(drawElectric);
    };
    electricFrame = requestAnimationFrame(drawElectric);

    const magnetic = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    const handlers = new Map<HTMLElement, (event: PointerEvent) => void>();
    magnetic.forEach((el) => {
      const move = (event: PointerEvent) => {
        if (window.matchMedia('(pointer: coarse)').matches || reduce) return;
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        el.style.setProperty('--mag-x', `${x}px`);
        el.style.setProperty('--mag-y', `${y}px`);
      };
      handlers.set(el, move);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
      });
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', resizeElectricCanvas);
      cancelAnimationFrame(electricFrame);
      if (electricResetTimer) clearTimeout(electricResetTimer);
      revealObserver?.disconnect();
      magnetic.forEach((el) => {
        const handler = handlers.get(el);
        if (handler) el.removeEventListener('pointermove', handler);
      });
    };
  }, []);

  const nav = [
    { text: 'Work', href: '/work' },
    { text: 'Services', href: '/services' },
    { text: 'Process', href: '/process' },
    { text: 'Portfolio', href: '/portfolio' },
    { text: 'Contact', href: '/contact' },
  ];

  return <>
    <canvas className="studio-electric-canvas" aria-hidden="true" />

    <header className={`site-header studio-header ${isScrolled ? 'site-header-scrolled' : ''}`}>
      <div className="container-site flex h-full items-center justify-between">
        <a href="/" aria-label="Alvin Studio beranda" data-cursor-label="Home"><Brand /></a>
        <nav className="hidden items-center gap-8 text-xs font-medium md:flex" aria-label="Navigasi utama">
          {nav.map((item) => <a key={item.href} href={item.href} className="studio-nav-link" data-cursor-label={item.text}>{item.text}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="studio" className="hidden md:inline-flex magnetic" data-magnetic data-cursor-label="Start" onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav studio-mobile-nav" aria-label="Navigasi seluler">
        {nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.text}</a>)}
        <Button variant="studio" onClick={() => { setMenuOpen(false); consult(); }}>Start a project <ArrowUpRight /></Button>
      </nav>}
    </header>

    <main className="studio-page text-slate-50 text-slate-50">
      <section className="studio-hero">
        <div className="studio-hero-video" aria-hidden="true">
          <video
            className="studio-hero-video-media absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.pexels.com/videos/5473804/pictures/preview-0.jpg"
          >
            <source src="https://www.pexels.com/download/video/5473804/" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0B1519]/80 mix-blend-multiply z-10 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.025] z-10 pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <div className="container-site studio-hero-inner">
          <div className="studio-hero-copy relative z-20 text-slate-50 font-sans flex flex-col text-left items-start justify-start max-w-4xl text-slate-50">
            <div className="studio-kicker hero-reveal hero-reveal-1"><span className="live-dot" /> Independent digital studio · Indonesia</div>
            <h1 className="hero-reveal hero-reveal-2 max-w-4xl text-slate-50 text-white font-extrabold font-sans">We build <span>digital experiences</span> people remember.</h1>
            <p className="hero-reveal hero-reveal-3 text-slate-300/90 text-slate-300/90 font-medium">Alvin Studio membantu bisnis membangun website, digital product, dan custom system dengan visual yang kuat dan pengalaman yang terasa premium.</p>
            <div className="hero-actions hero-reveal hero-reveal-4 flex flex-row justify-start items-center gap-4">
              <Button variant="studio" className="magnetic" data-magnetic onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
              <Button variant="studioOutline" asChild><a href="/work">Explore our work <ArrowDown /></a></Button>
            </div>
            <div className="hero-meta hero-reveal hero-reveal-5 text-slate-300/90"><span>Strategy</span><i /><span>Design</span><i /><span>Development</span><i /><span>Experience</span></div>
          </div>
        </div>
        <div className="hero-scroll-note text-slate-300/90"><span>Scroll to explore</span><ArrowDown size={13} /></div>
      </section>

      <div className="studio-marquee text-slate-50" aria-hidden="true"><div>STRATEGY <i>✦</i> DESIGN <i>✦</i> DEVELOPMENT <i>✦</i> EXPERIENCE <i>✦</i> STRATEGY <i>✦</i> DESIGN <i>✦</i></div></div>

      <section className="studio-intro bg-transparent text-slate-50 bg-transparent" data-reveal="up">
        <div className="container-site studio-intro-grid bg-transparent bg-transparent">
          <p className="studio-index text-slate-300/90 text-slate-300/90 font-medium">[ 01 ]</p>
          <div>
            <p className="studio-eyebrow">Alvin Studio</p>
            <h2 className="text-slate-50 text-white font-extrabold font-sans">Bukan sekadar website.<br /><span>Kami membangun cara brand kamu hadir secara digital.</span></h2>
          </div>
          <p className="studio-intro-copy text-slate-300/90 bg-transparent bg-transparent text-slate-300/90 font-medium">Dari visual identity sampai interface yang siap dipakai, setiap detail dirancang supaya bisnis terlihat lebih meyakinkan, lebih mudah dipahami, dan siap berkembang.</p>
        </div>
      </section>

      <section className="studio-work section bg-transparent text-slate-50 bg-transparent" id="work">
        <div className="container-site">
          <div className="studio-section-head" data-reveal="up">
            <div><p className="studio-eyebrow">Selected work</p><h2 className="text-slate-50 text-white font-extrabold font-sans">Built with purpose.</h2></div>
            <p className="text-slate-300/90 text-slate-300/90 font-medium">Beberapa contoh arah digital experience yang bisa kami bangun untuk bisnis dan brand.</p>
          </div>

          <div className="studio-project-grid">
            {projects.map((project, index) => (
              <article className="studio-project-card bg-transparent/5 shadow-[0_18px_55px_rgba(0,0,0,0.16)]" key={project.number} data-reveal={index === 0 ? 'scale' : 'up'} style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}>
                <div className={project.className}>
                  <span className="project-number">{project.number}</span>
                  {project.number === '02' ? (
                    <div className="project-dashboard-wrap">
                      <DashboardPreview />
                      <button
                        type="button"
                        className="project-cafe-link"
                        onClick={() => window.open("https://netlify.app", "_blank")}
                      >
                        View project <ArrowUpRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="project-shape"><span>{project.number === '01' ? 'YOUR BRAND' : 'MAKE IT MATTER.'}</span></div>
                  )}
                  <span className="project-hover-label">View project <ArrowUpRight size={15} /></span>
                  <span className="project-arrow"><ArrowUpRight size={19} /></span>
                </div>
                <div className="project-copy text-slate-50">
                  <div><span>{project.type}</span><h3 className="text-slate-50 text-white font-extrabold font-sans">{project.title}</h3></div>
                  <p className="text-slate-300/90 text-slate-300/90 font-medium">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-services section bg-transparent text-slate-50 bg-transparent" id="services">
        <div className="container-site">
          <div className="studio-section-head" data-reveal="up">
            <div><p className="studio-eyebrow">What we do</p><h2 className="text-slate-50 text-white font-extrabold font-sans">One studio.<br />Three ways to build.</h2></div>
            <p className="text-slate-300/90 text-slate-300/90 font-medium">Kami menjaga proses tetap simpel, tapi hasil akhirnya tetap punya karakter.</p>
          </div>
          <div className="studio-service-list">
            {services.map((item, index) => {
              const Icon = item.icon;
              return (
                <article className="studio-service-row text-slate-50" key={item.number} data-reveal="left" style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties} onClick={() => consult(item.title)}>
                  <span className="service-number text-slate-300/90">{item.number}</span>
                  <span className="service-icon"><Icon size={22} /></span>
                  <h3 className="text-slate-50 text-white font-extrabold font-sans">{item.title}</h3>
                  <p className="text-slate-300/90 text-slate-300/90 font-medium">{item.text}</p>
                  <ArrowUpRight className="service-arrow" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="studio-process section bg-transparent text-slate-50 bg-transparent" id="process">
        <div className="container-site">
          <div className="studio-process-head bg-transparent bg-transparent" data-reveal="up">
            <p className="studio-eyebrow">How we work</p>
            <h2 className="text-slate-50 text-white font-extrabold font-sans">Clear process.<br /><span>Better output.</span></h2>
          </div>
          <div className="process-grid">
            {processCopy.map((copy, index) => (
              <div className="process-item text-slate-50" key={copy} data-reveal="up" style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}>
                <span>0{index + 1}</span>
                <h3 className="text-slate-50 text-white font-extrabold font-sans">{['Discover', 'Direction', 'Design', 'Build', 'Launch'][index]}</h3>
                <p className="text-slate-300/90 text-slate-300/90 font-medium">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-cta bg-transparent text-slate-50 bg-transparent" id="contact" data-reveal="scale">
        <div className="container-site studio-cta-inner bg-transparent bg-transparent">
          <div>
            <p className="studio-eyebrow">Have a project in mind?</p>
            <h2 className="text-slate-50 text-white font-extrabold font-sans">Let's make something<br /><span>worth remembering.</span></h2>
          </div>
          <Button variant="studio" className="magnetic" data-magnetic onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
        </div>
      </section>
    </main>

    <footer className="footer studio-footer bg-transparent text-slate-50 bg-transparent">
      <div className="container-site">
        <div className="studio-footer-top bg-transparent bg-transparent">
          <div><a href="/" aria-label="Alvin Studio beranda"><Brand /></a><p className="text-slate-300/90 text-slate-300/90 font-medium">Digital experiences. Real business impact.</p></div>
          <div className="studio-footer-links text-slate-300/90 bg-transparent bg-transparent">{nav.map((item) => <a key={item.href} href={item.href}>{item.text}</a>)}</div>
        </div>
        <div className="footer-bottom text-slate-300/90"><span>© 2026 Alvin Studio. All rights reserved.</span><span>Built with intention.</span></div>
      </div>
    </footer>

    <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Start a project</DialogTitle><DialogDescription>Diskusikan {service} bersama Alvin Studio.</DialogDescription></DialogHeader>
        <div className="contact-options"><MessageCircle className="mb-3 text-primary" size={24} /><p className="text-sm font-semibold text-slate-50 text-slate-300/90 font-medium">Topik project siap dibagikan.</p><p className="mt-2 text-xs leading-relaxed text-slate-300/90 text-slate-300/90 font-medium">Kanal kontak belum dikonfigurasi. Salin pesan ini untuk dipakai saat menghubungi Alvin Studio.</p></div>
        <Button variant="studio" onClick={async () => { try { await navigator.clipboard.writeText(`Halo Alvin Studio, saya ingin membahas ${service}.`); setCopied(true); } catch { setCopied(false); } }}>{copied ? <><CheckCircle2 />Topik tersalin</> : <>Salin topik <ArrowRight /></>}</Button>
      </DialogContent>
    </Dialog>
  </>;

}
