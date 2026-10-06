import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Bot, CheckCircle2, Code2, Layers3, Menu, MessageCircle, QrCode, Store, Workflow, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardPreview } from './dashboard-preview';
import { TVStaticBackground } from './TVStaticBackground';

const solutions = [
  { number: '01', icon: QrCode, title: 'POS + QR Ordering', product: 'Cafe Flow', text: 'Sistem POS dan QR Ordering untuk coffee shop dan restaurant — transaksi, order, inventory, dan operasional dalam satu alur.', tags: ['POS Kasir Digital', 'QR Ordering', 'Inventory', 'Business Report'] },
  { number: '02', icon: Layers3, title: 'Website & Digital Presence', product: 'Digital Presence', text: 'Company profile, landing page, dan business website yang membangun kepercayaan sebelum calon customer berbicara dengan bisnis.', tags: ['Company Profile', 'Landing Page', 'Business Website'] },
  { number: '03', icon: Code2, title: 'Custom Software', product: 'Business Systems', text: 'Dashboard internal, business system, workflow automation, dan aplikasi custom yang mengikuti cara bisnis benar-benar bekerja.', tags: ['Dashboard', 'Custom App', 'Workflow'] },
  { number: '04', icon: Workflow, title: 'Business Automation', product: 'Less Manual Work', text: 'Mengurangi pekerjaan manual dengan alur digital yang lebih rapi, terukur, dan mudah dikembangkan.', tags: ['Automation', 'Integration', 'Operations'] },
];

const caseStudies = [
  { number: '01', category: 'Business System / SaaS Product', title: 'Cafe Flow', problem: 'Restaurant membutuhkan sistem operasional yang lebih efisien.', solution: 'POS, QR Ordering, Inventory, dan Dashboard dalam satu sistem.', visual: 'cafe' },
  { number: '02', category: 'AI Productivity Application', title: 'Alvin AI Assistant', problem: 'Informasi dan pekerjaan digital tersebar di banyak tempat.', solution: 'AI assistant yang menjadi layer produktivitas di dalam aplikasi.', visual: 'ai' },
  { number: '03', category: 'Custom Software Development', title: 'Custom Digital Solution', problem: 'Workflow bisnis membutuhkan tools yang tidak tersedia di software umum.', solution: 'Software custom yang dibangun mengikuti proses dan kebutuhan bisnis.', visual: 'custom' },
];

const process = [
  ['01', 'Discover', 'Memahami bisnis, masalah, user, dan outcome yang ingin dicapai.'],
  ['02', 'Direction', 'Menentukan product direction, scope, dan prioritas sebelum build dimulai.'],
  ['03', 'Design', 'Menerjemahkan strategi menjadi interface yang jelas, premium, dan usable.'],
  ['04', 'Build', 'Membangun software yang responsive, maintainable, dan siap dipakai.'],
  ['05', 'Launch', 'Testing, refinement, deployment, lalu iterasi berdasarkan kebutuhan nyata.'],
];

const careerOpenings = [
  ['01', 'Frontend Engineer', 'Build polished, responsive interfaces and digital products with React, TypeScript, and modern frontend tooling.'],
  ['02', 'Full-Stack Engineer', 'Work across product architecture, backend systems, APIs, databases, and integrations for real business workflows.'],
  ['03', 'Product Designer', 'Shape product direction, UX, and visual systems for software that feels simple, useful, and premium.'],
  ['04', 'Marketing & Growth', 'Build Alvin Studio\'s presence, campaigns, content, partnerships, and growth strategy to bring the right businesses and opportunities to the studio.'],
];

const faqs = [
  ['Apakah Alvin Studio hanya membuat website?', 'Tidak. Alvin Studio membangun website, digital product, dan custom system sesuai kebutuhan bisnis.'],
  ['Apakah bisa membuat sistem untuk bisnis F&B?', 'Ya. Salah satu produk Alvin Studio adalah Cafe Flow, sistem POS dan QR Ordering untuk coffee shop dan restaurant.'],
  ['Apakah project harus sudah punya desain?', 'Tidak. Kami bisa membantu dari discovery, product direction, UX, visual design, sampai development.'],
  ['Apakah bisa mengembangkan sistem yang sudah ada?', 'Bisa. Kami dapat melanjutkan, merapikan, atau mengembangkan existing product selama struktur teknisnya memungkinkan.'],
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
    const observer = reduce ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((el) => observer?.observe(el));

    const magnetic = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    const handlers = new Map<HTMLElement, (event: PointerEvent) => void>();
    magnetic.forEach((el) => {
      const move = (event: PointerEvent) => {
        if (window.matchMedia('(pointer: coarse)').matches || reduce) return;
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        el.style.setProperty('--mag-x', x + 'px');
        el.style.setProperty('--mag-y', y + 'px');
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
      observer?.disconnect();
      magnetic.forEach((el) => {
        const handler = handlers.get(el);
        if (handler) el.removeEventListener('pointermove', handler);
      });
    };
  }, []);

  const nav = [
    { text: 'About', href: '#about' },
    { text: 'Solutions', href: '#solutions' },
    { text: 'Work', href: '#work' },
    { text: 'Process', href: '#process' },
    { text: 'Career', href: '#career' },
    { text: 'Contact', href: '#contact' },
  ];

  return <div className="studio-page relative">
    <TVStaticBackground />
    <div className="studio-content-layer relative z-10">
    <header className={'site-header studio-header fixed top-0 left-0 right-0 w-full z-50 ' + (isScrolled ? 'site-header-scrolled' : '')}>
      <div className="container-site flex h-full items-center justify-between">
        <a href="/" aria-label="Alvin Studio beranda"><Brand /></a>
        <nav className="hidden items-center gap-6 text-xs font-medium lg:flex" aria-label="Navigasi utama">
          {nav.map((item) => <a key={item.href} href={item.href} className="studio-nav-link">{item.text}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="studio" className="hidden md:inline-flex magnetic" data-magnetic onClick={() => consult()}>Start a project <ArrowUpRight /></Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav studio-mobile-nav" aria-label="Navigasi seluler">
        {nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.text}</a>)}
        <Button variant="studio" onClick={() => { setMenuOpen(false); consult(); }}>Discuss your idea <ArrowUpRight /></Button>
      </nav>}
    </header>

    <main className="studio-page">
      <section className="studio-hero">
        <div className="studio-hero-video" aria-hidden="true">
          <video className="studio-hero-video-media absolute inset-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline preload="metadata" poster="https://images.pexels.com/videos/5473804/pictures/preview-0.jpg">
            <source src="https://www.pexels.com/download/video/5473804/" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0B1519]/25 mix-blend-multiply z-10 pointer-events-none" />
        </div>
        <div className="hero-grain" aria-hidden="true" />
        <div className="container-site studio-hero-inner">
          <div className="studio-hero-copy relative z-20">
            <div className="studio-kicker hero-reveal hero-reveal-1"><span className="live-dot" /> Independent digital studio · Indonesia</div>
            <div className="studio-hero-asymmetric">
              <div className="studio-hero-title-col">
                <h1 className="hero-reveal hero-reveal-2">We build <span className="text-[#B8D8E8] [text-shadow:0_0_18px_rgba(184,216,232,0.18)]">digital products</span> for businesses ready to grow.</h1>
              </div>
              <div className="studio-hero-detail-col">
                <p className="hero-reveal hero-reveal-3">Alvin Studio adalah digital studio dan technology partner untuk membangun website, software, custom system, dan automation yang membantu bisnis bekerja lebih efektif dan berkembang lebih siap.</p>
                <a className="studio-hero-pill hero-reveal hero-reveal-4" href="#about">GET TO KNOW US <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <div className="hero-meta hero-reveal hero-reveal-5"><span>Strategy</span><i /><span>Product</span><i /><span>Design</span><i /><span>Technology</span></div>
          </div>
        </div>
        <div className="hero-scroll-note"><span>Scroll to explore</span><ArrowDown size={13} /></div>
      </section>

      <div className="studio-marquee" aria-hidden="true"><div className="studio-marquee-track"><span>PRODUCT STRATEGY <i>✦</i> DESIGN <i>✦</i> SOFTWARE <i>✦</i> AUTOMATION <i>✦</i> TECHNOLOGY</span><span>PRODUCT STRATEGY <i>✦</i> DESIGN <i>✦</i> SOFTWARE <i>✦</i> AUTOMATION <i>✦</i> TECHNOLOGY</span></div></div>

      <section className="studio-intro studio-home-section" id="about" data-reveal="up">
        <div className="container-site studio-intro-grid">
          <p className="studio-index">[ 01 ]</p>
          <div><p className="studio-eyebrow">About Alvin Studio</p><h2>Technology should make <span>business simpler.</span></h2></div>
          <div className="studio-intro-copy"><p>Kami membantu bisnis mengubah ide, proses manual, dan kebutuhan operasional menjadi solusi digital yang benar-benar bisa digunakan.</p><p>Mulai dari digital presence sampai software dan business system, kami menggabungkan strategy, design, dan engineering dalam satu proses.</p></div>
        </div>
        <div className="container-site studio-about-grid">
          <div><span>VISION</span><strong>Menjadi technology partner yang membantu bisnis Indonesia tumbuh dengan software yang tepat.</strong></div>
          <div><span>MISSION</span><strong>Membangun digital product yang useful, scalable, dan punya dampak nyata terhadap cara bisnis bekerja.</strong></div>
          <div><span>WHY US</span><strong>One team from idea to launch — strategy, design, development, dan iteration tanpa handoff yang rumit.</strong></div>
        </div>
      </section>

      <section className="studio-solutions section" id="solutions">
        <div className="container-site">
          <div className="studio-section-head" data-reveal="up"><div><p className="studio-eyebrow">Solutions</p><h2>Technology built around <span>your business.</span></h2></div><p>Bukan paket template. Kami memilih solusi berdasarkan masalah yang ingin diselesaikan dan cara bisnis bekerja.</p></div>
          <div className="studio-solution-list">
            {solutions.map((item, index) => { const Icon = item.icon; return <article className="studio-solution-card group cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(165,243,252,0.06)] hover:border-slate-700/40 active:scale-[1.02] active:duration-150 bg-slate-900/40 border-slate-800/60" key={item.number} data-reveal="up" style={{ '--reveal-delay': (index * 70) + 'ms' } as CSSProperties} onClick={() => consult(item.title)}>
              <div className="solution-card-top"><span className="solution-number">{item.number}</span><Icon size={21} /></div>
              <div className="solution-card-body"><p className="solution-product">{item.product}</p><h3>{item.title}</h3><p>{item.text}</p>{index === 0 && <div className="solution-product-visual"><div><span>CAFE FLOW</span><b>Business overview</b></div><strong>Rp 48.6M</strong><small>Revenue · +18.4%</small><div className="solution-spark"><i/><i/><i/><i/><i/><i/></div></div>}{index === 1 && <div className="solution-product-visual solution-product-presence"><span>DIGITAL PRESENCE</span><b>Brand · Content · Conversion</b><small>Designed to make businesses look ready for the next stage.</small></div>}{index === 2 && <div className="solution-product-visual solution-product-system"><span>BUSINESS OS</span><b>Dashboard · Workflow · Data</b><small>One system around the way your team actually works.</small></div>}{index === 3 && <div className="solution-product-visual solution-product-auto"><span>AUTOMATION</span><b>Connect · Automate · Scale</b><small>Less repetitive work. More time for the business.</small></div>}<div className="solution-tags">{item.tags.map(tag => <span key={tag}>✓ {tag}</span>)}</div></div>
              <ArrowUpRight className="solution-arrow" />
            </article>; })}
          </div>
        </div>
      </section>

      <section className="studio-work section" id="work">
        <div className="container-site">
          <div className="studio-section-head" data-reveal="up"><div><p className="studio-eyebrow">Selected work</p><h2>Case studies, not just <span>screenshots.</span></h2></div><p>Setiap project dimulai dari problem bisnis, lalu diterjemahkan menjadi product dan system yang lebih terukur.</p></div>
          <div className="studio-case-grid">
            {caseStudies.map((project, index) => <article className="studio-case-card group cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(165,243,252,0.06)] hover:border-slate-700/40 active:scale-[1.02] active:duration-150 bg-slate-900/40 border-slate-800/60" key={project.number} data-reveal={index === 0 ? 'scale' : 'up'} style={{ '--reveal-delay': (index * 90) + 'ms' } as CSSProperties}>
              <div className={'case-visual case-visual-' + project.visual}><span className="case-number">{project.number}</span>{project.visual === 'cafe' && <DashboardPreview />}{project.visual === 'ai' && <div className="case-ai-ui"><Bot size={20}/><span>Alvin AI Assistant</span><small>Ready to help · 24/7</small><div className="case-ai-line" /><div className="case-ai-line short" /></div>}{project.visual === 'custom' && <div className="case-custom-ui"><Store size={18}/><span>Business OS</span><b>Operations</b><i/><i/><i/></div>}</div>
              <div className="case-content"><div><span>{project.category}</span><h3>{project.title}</h3></div><div className="case-detail"><p><b>Problem</b>{project.problem}</p><p><b>Solution</b>{project.solution}</p></div><a href="#contact">Discuss a similar project <ArrowUpRight size={15} /></a></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="studio-stack-section section">
        <div className="container-site studio-stack-grid">
          <div data-reveal="left"><p className="studio-eyebrow">Technology stack</p><h2>Built for <span>today.</span><br/>Ready for what's next.</h2><p>Kami memilih teknologi berdasarkan kebutuhan product, bukan sekadar mengikuti tren.</p></div>
          <div className="stack-cloud" data-reveal="up">{['React', 'TypeScript', 'TanStack', 'Tailwind', 'Node.js', 'Supabase', 'Cloudflare', 'AI / LLM'].map((item, i) => <span key={item} style={{ '--stack-i': i } as CSSProperties}>{item}</span>)}</div>
        </div>
      </section>

      <section className="studio-process section" id="process">
        <div className="container-site">
          <div className="studio-process-head" data-reveal="up"><p className="studio-eyebrow">How we work</p><h2>From business problem<br/><span>to working product.</span></h2></div>
          <div className="process-grid">{process.map(([number, title, text]) => <div className="process-item" key={number} data-reveal="up"><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
        </div>
      </section>

      <section className="studio-career section" id="career">
        <div className="container-site">
          <div className="career-panel" data-reveal="scale">
            <div><p className="studio-eyebrow">Career / Open positions</p><h2>Build what<br/><span>comes next.</span></h2><p>Alvin Studio sedang berkembang menjadi technology company. Saat kami membuka posisi, detail role dan cara apply akan tersedia di sini.</p></div>
            <div className="career-status"><span className="live-dot" /> Hiring / Growing<div>Open to builders, problem solvers, and ambitious people who want to build real products.</div></div>
          </div>
          <div className="career-openings" data-reveal="up"><div className="career-openings-head"><span>Open positions</span><small>01 — 04</small></div>
            {careerOpenings.map(([number, title, text]) => <details className="career-opening" key={number}><summary><span className="career-opening-number">{number}</span><span className="career-opening-title">{title}</span><span className="career-opening-apply">View role <ArrowUpRight size={15}/></span></summary><div className="career-opening-body"><p>{text}</p><Button variant="studioOutline" onClick={() => consult('Career — ' + title)}>Discuss this role <ArrowUpRight /></Button></div></details>)}
          </div>
        </div>
      </section>

      <section className="studio-faq section">
        <div className="container-site studio-faq-grid"><div data-reveal="left"><p className="studio-eyebrow">FAQ</p><h2>Questions before<br/><span>we build.</span></h2></div><div>{faqs.map(([q, a]) => <details key={q} data-reveal="up"><summary>{q}<ArrowDown size={15}/></summary><p>{a}</p></details>)}</div></div>
      </section>

      <section className="studio-cta" id="contact" data-reveal="scale">
        <div className="container-site studio-cta-inner"><div><p className="studio-eyebrow">Start with the problem.</p><h2>Have an idea,<br/><span>system, or problem to solve?</span></h2><p>Tell us what your business needs. We will help shape the right digital solution.</p></div><Button variant="studio" className="magnetic" data-magnetic onClick={() => consult()}>Discuss your idea <ArrowUpRight /></Button></div>
      </section>
    </main>

    <footer className="footer studio-footer"><div className="container-site"><div className="studio-footer-top"><div><a href="/" aria-label="Alvin Studio beranda"><Brand /></a><p>Digital products. Business systems. Technology solutions.</p></div><div className="studio-footer-links">{nav.map(item => <a key={item.href} href={item.href}>{item.text}</a>)}</div></div><div className="footer-bottom"><span>© 2026 Alvin Studio. All rights reserved.</span><span>Built with intention.</span></div></div></footer>

    <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}><DialogContent><DialogHeader><DialogTitle>Discuss your idea</DialogTitle><DialogDescription>Diskusikan {service} bersama Alvin Studio.</DialogDescription></DialogHeader><div className="contact-options"><MessageCircle className="mb-3 text-primary" size={24}/><p className="text-sm font-semibold text-slate-50">Tell us what you are building.</p><p className="mt-2 text-xs leading-relaxed text-slate-300/80">Kirim konteks singkat tentang bisnis, masalah yang ingin diselesaikan, atau product yang ingin dibangun.</p></div><Button variant="studio" onClick={async () => { try { await navigator.clipboard.writeText('Halo Alvin Studio, saya ingin mendiskusikan ' + service + ' untuk bisnis saya.'); setCopied(true); } catch { setCopied(false); } }}>{copied ? <><CheckCircle2/>Message copied</> : <>Copy message <ArrowRight/></>}</Button></DialogContent></Dialog>
  </div>
  </div>
}
