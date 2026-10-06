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
    let lastPoint: { x: number; y: number } | null = null;
    let electricPoints: Array<{ x: number; y: number; life: number; strand: number; width: number }> = [];
    let electricResetTimer: ReturnType<typeof setTimeout> | undefined;

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

    const spawnLightning = (x: number, y: number) => {
      if (!lastPoint) { lastPoint = { x, y }; return; }
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 5) return;

      const normalX = -dy / Math.max(distance, 1);
      const normalY = dx / Math.max(distance, 1);
      const steps = Math.max(2, Math.min(9, Math.ceil(distance / 18)));
      const strands = 3;

      for (let strand = 0; strand < strands; strand += 1) {
        const center = (strands - 1) / 2;
        const spread = (strand - center) * 4.5;
        const amplitude = 5 + Math.random() * 7;
        const width = strand === 2 ? 1.45 : 0.7 + Math.random() * 0.55;

        for (let i = 0; i <= steps; i += 1) {
          const t = i / steps;
          const edgeFade = Math.sin(Math.PI * t);
          const jitter = i === 0 || i === steps ? 0 : (Math.random() - 0.5) * amplitude * edgeFade;
          electricPoints.push({
            x: lastPoint.x + dx * t + normalX * (spread + jitter),
            y: lastPoint.y + dy * t + normalY * (spread + jitter),
            life: 0.78 + Math.random() * 0.22,
            strand,
            width,
          });
        }
      }

      // Small random side sparks make the cluster feel like electricity rather than parallel lines.
      if (Math.random() > 0.35) {
        const branchT = 0.35 + Math.random() * 0.35;
        const bx = lastPoint.x + dx * branchT;
        const by = lastPoint.y + dy * branchT;
        const branchAngle = Math.atan2(dy, dx) + (Math.random() > 0.5 ? 1 : -1) * (0.65 + Math.random() * 0.55);
        const branchLength = Math.min(24, 8 + distance * 0.22);
        const branchSteps = 3;
        for (let i = 0; i <= branchSteps; i += 1) {
          const t = i / branchSteps;
          const jitter = i === 0 || i === branchSteps ? 0 : (Math.random() - 0.5) * 7;
          electricPoints.push({
            x: bx + Math.cos(branchAngle) * branchLength * t + normalX * jitter,
            y: by + Math.sin(branchAngle) * branchLength * t + normalY * jitter,
            life: 0.5 + Math.random() * 0.35,
            strand: 10,
            width: 0.65,
          });
        }
      }

      if (electricPoints.length > 520) electricPoints = electricPoints.slice(-520);
      lastPoint = { x, y };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches || reduce) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty('--cursor-x', event.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', event.clientY + 'px');
      document.documentElement.style.setProperty('--hero-mx', (x * 18) + 'px');
      document.documentElement.style.setProperty('--hero-my', (y * 18) + 'px');
      spawnLightning(event.clientX, event.clientY);
      if (electricResetTimer) clearTimeout(electricResetTimer);
      electricResetTimer = setTimeout(() => { lastPoint = null; }, 90);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawElectric = () => {
      if (!electricContext) return;
      electricContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      electricContext.lineCap = 'round';
      electricContext.lineJoin = 'round';

      for (let i = electricPoints.length - 1; i >= 0; i -= 1) {
        electricPoints[i].life -= 0.075;
        if (electricPoints[i].life <= 0) electricPoints.splice(i, 1);
      }

      for (let i = 1; i < electricPoints.length; i += 1) {
        const a = electricPoints[i - 1];
        const b = electricPoints[i];
        if (a.strand !== b.strand) continue;
        const distance = Math.hypot(b.x - a.x, b.y - a.y);
        if (distance > 34) continue;
        const alpha = Math.min(a.life, b.life);
        electricContext.strokeStyle = 'rgba(240, 199, 94, ' + alpha * (a.strand === 2 ? 0.9 : 0.58) + ')';
        electricContext.shadowColor = 'rgba(240, 199, 94, ' + alpha * 0.9 + ')';
        electricContext.shadowBlur = a.strand === 2 ? 9 : 5;
        electricContext.lineWidth = Math.min(a.width, b.width);
        electricContext.beginPath();
        electricContext.moveTo(a.x, a.y);
        electricContext.lineTo(b.x, b.y);
        electricContext.stroke();
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
    { text: 'Work', id: 'work' },
    { text: 'Services', id: 'services' },
    { text: 'Process', id: 'process' },
    { text: 'Contact', id: 'contact' },
  ];

  return <>
    <canvas className="studio-electric-canvas" aria-hidden="true" />
    <header className={`site-header studio-header ${isScrolled ? 'site-header-scrolled' : ''}`}>
      <div className="container-site flex h-full items-center justify-between">
        <a href="#" aria-label="Alvin Studio beranda" data-cursor-label="Home"><Brand /></a>
        <nav className="hidden items-center gap-8 text-xs font-medium md:flex" aria-label="Navigasi utama">
          {nav.map((item) => <a key={item.id} href={`#${item.id}`} className="studio-nav-link" data-cursor-label={item.text}>{item.text}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="studio" className="hidden md:inline-flex magnetic" data-magnetic data-cursor-label="Start" onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav studio-mobile-nav" aria-label="Navigasi seluler">
        {nav.map((item) => <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>{item.text}</a>)}
        <Button variant="studio" onClick={() => { setMenuOpen(false); consult(); }}>Start a project <ArrowUpRight /></Button>
      </nav>}
    </header>

    <main className="studio-page">
      <section className="studio-hero">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-grain" />
        <div className="container-site studio-hero-inner">
          <div className="studio-kicker hero-reveal hero-reveal-1"><span className="live-dot" /> Independent digital studio · Indonesia</div>
          <h1 className="hero-reveal hero-reveal-2">We build <span>digital experiences</span> people remember.</h1>
          <p className="hero-reveal hero-reveal-3">Alvin Studio membantu bisnis membangun website, digital product, dan custom system dengan visual yang kuat dan pengalaman yang terasa premium.</p>
          <div className="hero-actions hero-reveal hero-reveal-4">
            <Button variant="studio" className="magnetic" data-magnetic onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
            <Button variant="studioOutline" asChild><a href="#work">Explore our work <ArrowDown /></a></Button>
          </div>
          <div className="hero-meta hero-reveal hero-reveal-5"><span>Strategy</span><i /><span>Design</span><i /><span>Development</span><i /><span>Experience</span></div>
        </div>
        <div className="hero-scroll-note"><span>Scroll to explore</span><ArrowDown size={13} /></div>
      </section>

      <div className="studio-marquee" aria-hidden="true"><div>STRATEGY <i>✦</i> DESIGN <i>✦</i> DEVELOPMENT <i>✦</i> EXPERIENCE <i>✦</i> STRATEGY <i>✦</i> DESIGN <i>✦</i></div></div>

      <section className="studio-intro" data-reveal="up">
        <div className="container-site studio-intro-grid">
          <p className="studio-index">[ 01 ]</p>
          <div><p className="studio-eyebrow">Alvin Studio</p><h2>Bukan sekadar website.<br /><span>Kami membangun cara brand kamu hadir secara digital.</span></h2></div>
          <p className="studio-intro-copy">Dari visual identity sampai interface yang siap dipakai, setiap detail dirancang supaya bisnis terlihat lebih meyakinkan, lebih mudah dipahami, dan siap berkembang.</p>
        </div>
      </section>

      <section className="studio-work section" id="work">
        <div className="container-site">
          <div className="studio-section-head" data-reveal="up"><div><p className="studio-eyebrow">Selected work</p><h2>Built with purpose.</h2></div><p>Beberapa contoh arah digital experience yang bisa kami bangun untuk bisnis dan brand.</p></div>
          <div className="studio-project-grid">
            {projects.map((project, index) => <article className="studio-project-card" key={project.number} data-reveal={index === 0 ? 'scale' : 'up'} style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}>
              <div className={project.className}>
                <span className="project-number">{project.number}</span>
                {project.number === '02' ? <div className="project-dashboard-wrap"><DashboardPreview /></div> : <div className="project-shape"><span>{project.number === '01' ? 'YOUR BRAND' : 'MAKE IT MATTER.'}</span></div>}
                <span className="project-hover-label">View project <ArrowUpRight size={15} /></span>
                <span className="project-arrow"><ArrowUpRight size={19} /></span>
              </div>
              <div className="project-copy"><div><span>{project.type}</span><h3>{project.title}</h3></div><p>{project.description}</p></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="studio-services section" id="services">
        <div className="container-site">
          <div className="studio-section-head" data-reveal="up"><div><p className="studio-eyebrow">What we do</p><h2>One studio.<br />Three ways to build.</h2></div><p>Kami menjaga proses tetap simpel, tapi hasil akhirnya tetap punya karakter.</p></div>
          <div className="studio-service-list">
            {services.map((item, index) => { const Icon = item.icon; return <article className="studio-service-row" key={item.number} data-reveal="left" style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties} onClick={() => consult(item.title)}><span className="service-number">{item.number}</span><span className="service-icon"><Icon size={22} /></span><h3>{item.title}</h3><p>{item.text}</p><ArrowUpRight className="service-arrow" /></article>; })}
          </div>
        </div>
      </section>

      <section className="studio-process section" id="process">
        <div className="container-site">
          <div className="studio-process-head" data-reveal="up"><p className="studio-eyebrow">How we work</p><h2>Clear process.<br /><span>Better output.</span></h2></div>
          <div className="process-grid">{processCopy.map((copy, index) => <div className="process-item" key={copy} data-reveal="up" style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}><span>0{index + 1}</span><h3>{['Discover', 'Direction', 'Design', 'Build', 'Launch'][index]}</h3><p>{copy}</p></div>)}</div>
        </div>
      </section>

      <section className="studio-cta" id="contact" data-reveal="scale">
        <div className="container-site studio-cta-inner"><div><p className="studio-eyebrow">Have a project in mind?</p><h2>Let's make something<br /><span>worth remembering.</span></h2></div><Button variant="studioLight" className="magnetic" data-magnetic onClick={() => consult()}>Start a project <ArrowUpRight /></Button></div>
      </section>
    </main>

    <footer className="footer studio-footer">
      <div className="container-site">
        <div className="studio-footer-top"><div><a href="#" aria-label="Alvin Studio beranda"><Brand /></a><p>Digital experiences. Real business impact.</p></div><div className="studio-footer-links">{nav.map((item) => <a key={item.id} href={`#${item.id}`}>{item.text}</a>)}</div></div>
        <div className="footer-bottom"><span>© 2026 Alvin Studio. All rights reserved.</span><span>Built with intention.</span></div>
      </div>
    </footer>

    <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
      <DialogContent><DialogHeader><DialogTitle>Start a project</DialogTitle><DialogDescription>Diskusikan {service} bersama Alvin Studio.</DialogDescription></DialogHeader>
        <div className="contact-options"><MessageCircle className="mb-3 text-primary" size={24} /><p className="text-sm font-semibold">Topik project siap dibagikan.</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Kanal kontak belum dikonfigurasi. Salin pesan ini untuk dipakai saat menghubungi Alvin Studio.</p></div>
        <Button variant="studio" onClick={async () => { try { await navigator.clipboard.writeText(`Halo Alvin Studio, saya ingin membahas ${service}.`); setCopied(true); } catch { setCopied(false); } }}>{copied ? <><CheckCircle2 />Topik tersalin</> : <>Salin topik <ArrowRight /></>}</Button>
      </DialogContent>
    </Dialog>
  </>;
}
