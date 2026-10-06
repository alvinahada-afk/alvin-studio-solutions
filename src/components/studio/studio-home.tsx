import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, Code2, Globe, Layers3, Menu, MessageCircle, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardPreview } from './dashboard-preview';

const projects = [
  {
    number: '01',
    type: 'Business Website',
    title: 'Digital Presence',
    description: 'Company profile yang terasa premium, cepat, dan fokus membangun kepercayaan.',
    className: 'project-visual project-visual-web',
  },
  {
    number: '02',
    type: 'Business System',
    title: 'Operations OS',
    description: 'Interface operasional yang menyatukan data, workflow, dan aktivitas bisnis.',
    className: 'project-visual project-visual-system',
  },
  {
    number: '03',
    type: 'Custom Experience',
    title: 'Brand Experience',
    description: 'Landing page dan digital experience yang dibuat mengikuti karakter brand.',
    className: 'project-visual project-visual-brand',
  },
];

const services = [
  { icon: Globe, number: '01', title: 'Website & Company Profile', text: 'Website modern yang membuat bisnis terlihat profesional sejak first impression.' },
  { icon: Layers3, number: '02', title: 'Digital Product', text: 'Landing page, portal, dan interface produk yang dirancang untuk pengalaman pengguna.' },
  { icon: Code2, number: '03', title: 'Custom System', text: 'Sistem digital yang mengikuti workflow bisnis, bukan memaksa bisnis mengikuti template.' },
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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { text: 'Work', id: 'work' },
    { text: 'Services', id: 'services' },
    { text: 'Process', id: 'process' },
    { text: 'Contact', id: 'contact' },
  ];

  return <>
    <header className={`site-header studio-header ${isScrolled ? 'site-header-scrolled' : ''}`}>
      <div className="container-site flex h-full items-center justify-between">
        <a href="#" aria-label="Alvin Studio beranda"><Brand /></a>
        <nav className="hidden items-center gap-8 text-xs font-medium md:flex" aria-label="Navigasi utama">
          {nav.map((item) => <a key={item.id} href={`#${item.id}`} className="studio-nav-link">{item.text}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="studio" className="hidden md:inline-flex" onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
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
        <div className="container-site studio-hero-inner">
          <div className="studio-kicker"><span className="live-dot" /> Independent digital studio · Indonesia</div>
          <h1>We build <span>digital experiences</span> people remember.</h1>
          <p>Alvin Studio membantu bisnis membangun website, digital product, dan custom system dengan visual yang kuat dan pengalaman yang terasa premium.</p>
          <div className="hero-actions">
            <Button variant="studio" onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
            <Button variant="studioOutline" asChild><a href="#work">Explore our work <ArrowDown /></a></Button>
          </div>
          <div className="hero-meta">
            <span>Strategy</span><i /> <span>Design</span><i /> <span>Development</span><i /> <span>Experience</span>
          </div>
        </div>
      </section>

      <section className="studio-intro">
        <div className="container-site studio-intro-grid">
          <p className="studio-index">[ 01 ]</p>
          <div>
            <p className="studio-eyebrow">Alvin Studio</p>
            <h2>Bukan sekadar website.<br /><span>Kami membangun cara brand kamu hadir secara digital.</span></h2>
          </div>
          <p className="studio-intro-copy">Dari visual identity sampai interface yang siap dipakai, setiap detail dirancang supaya bisnis terlihat lebih meyakinkan, lebih mudah dipahami, dan siap berkembang.</p>
        </div>
      </section>

      <section className="studio-work section" id="work">
        <div className="container-site">
          <div className="studio-section-head">
            <div><p className="studio-eyebrow">Selected work</p><h2>Built with purpose.</h2></div>
            <p>Beberapa contoh arah digital experience yang bisa kami bangun untuk bisnis dan brand.</p>
          </div>
          <div className="studio-project-grid">
            {projects.map((project) => <article className="studio-project-card" key={project.number}>
              <div className={project.className}>
                <span className="project-number">{project.number}</span>
                {project.number === '02' ? <div className="project-dashboard-wrap"><DashboardPreview /></div> : <div className="project-shape"><span>{project.number === '01' ? 'YOUR BRAND' : 'MAKE IT MATTER.'}</span></div>}
                <span className="project-arrow"><ArrowUpRight size={19} /></span>
              </div>
              <div className="project-copy"><div><span>{project.type}</span><h3>{project.title}</h3></div><p>{project.description}</p></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="studio-services section" id="services">
        <div className="container-site">
          <div className="studio-section-head">
            <div><p className="studio-eyebrow">What we do</p><h2>One studio.<br />Three ways to build.</h2></div>
            <p>Kami menjaga proses tetap simpel, tapi hasil akhirnya tetap punya karakter.</p>
          </div>
          <div className="studio-service-list">
            {services.map((item) => { const Icon = item.icon; return <article className="studio-service-row" key={item.number} onClick={() => consult(item.title)}>
              <span className="service-number">{item.number}</span><span className="service-icon"><Icon size={22} /></span><h3>{item.title}</h3><p>{item.text}</p><ArrowUpRight className="service-arrow" />
            </article>; })}
          </div>
        </div>
      </section>

      <section className="studio-process section" id="process">
        <div className="container-site">
          <div className="studio-process-head"><p className="studio-eyebrow">How we work</p><h2>Clear process.<br /><span>Better output.</span></h2></div>
          <div className="process-grid">
            {['Discover', 'Direction', 'Design', 'Build', 'Launch'].map((step, index) => <div className="process-item" key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{['Understand the business, audience, and goal.', 'Define the visual and digital direction.', 'Turn the direction into a clear interface.', 'Build responsive, polished, production-ready work.', 'Review, refine, and launch with confidence.'][index]}</p></div>)}
          </div>
        </div>
      </section>

      <section className="studio-cta" id="contact">
        <div className="container-site studio-cta-inner">
          <div><p className="studio-eyebrow">Have a project in mind?</p><h2>Let's make something<br /><span>worth remembering.</span></h2></div>
          <Button variant="studioLight" onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
        </div>
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
