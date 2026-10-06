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
