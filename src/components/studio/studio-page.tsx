import { ArrowUpRight, Code2, Globe, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./studio-home";

const nav = [
  { text: "Work", href: "/work" },
  { text: "Services", href: "/services" },
  { text: "Process", href: "/process" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "Contact", href: "/contact" },
];

const projects = [
  { n: "01", type: "Business Website", title: "Digital Presence", text: "Company profile yang terasa premium, cepat, dan fokus membangun kepercayaan." },
  { n: "02", type: "Business System", title: "Operations OS", text: "Interface operasional yang menyatukan data, workflow, dan aktivitas bisnis." },
  { n: "03", type: "Custom Experience", title: "Brand Experience", text: "Landing page dan digital experience yang mengikuti karakter brand." },
];

const services = [
  { n: "01", icon: Globe, title: "Website & Company Profile", text: "Website modern yang membuat bisnis terlihat profesional sejak first impression." },
  { n: "02", icon: Layers3, title: "Digital Product", text: "Landing page, portal, dan interface produk yang dirancang untuk pengalaman pengguna." },
  { n: "03", icon: Code2, title: "Custom System", text: "Sistem digital yang mengikuti workflow bisnis, bukan memaksa bisnis mengikuti template." },
];

const steps = [
  ["01", "Discover", "Understand the business, audience, and goal."],
  ["02", "Direction", "Define the visual and digital direction."],
  ["03", "Design", "Turn the direction into a clear interface."],
  ["04", "Build", "Build responsive, polished, production-ready work."],
  ["05", "Launch", "Review, refine, and launch with confidence."],
];

export function StudioPage({ page, eyebrow, title, intro }: { page: "work" | "services" | "process" | "portfolio" | "contact"; eyebrow: string; title: string; intro: string }) {
  const isWork = page === "work";
  const isServices = page === "services";
  const isProcess = page === "process";
  const isPortfolio = page === "portfolio";

  return (
    <main className="studio-page studio-subpage">
      <header className="site-header studio-header site-header-scrolled">
        <div className="container-site flex h-full items-center justify-between">
          <a href="/" aria-label="Alvin Studio beranda"><Brand /></a>
          <nav className="hidden items-center gap-7 text-xs font-medium md:flex" aria-label="Navigasi utama">
            {nav.map((item) => <a key={item.href} href={item.href} className={item.href === "/" + page ? "studio-nav-link text-primary" : "studio-nav-link"}>{item.text}</a>)}
          </nav>
          <Button variant="studio" asChild className="hidden md:inline-flex"><a href="/contact">Start a project <ArrowUpRight /></a></Button>
        </div>
      </header>

      <section className="studio-page-hero">
        <div className="container-site">
          <p className="studio-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>

      {isWork && <section className="studio-work section"><div className="container-site"><div className="studio-project-grid">
        {projects.map((p) => <article className="studio-project-card" key={p.n}><div className={"project-visual " + (p.n === "01" ? "project-visual-web" : p.n === "02" ? "project-visual-system" : "project-visual-brand")}><span className="project-number">{p.n}</span><div className="project-shape"><span>{p.n === "01" ? "YOUR BRAND" : p.n === "02" ? "OPERATIONS OS" : "MAKE IT MATTER."}</span></div><span className="project-arrow"><ArrowUpRight size={19} /></span></div><div className="project-copy"><div><span>{p.type}</span><h3>{p.title}</h3></div><p>{p.text}</p></div></article>)}
      </div></div></section>}

      {isServices && <section className="studio-services section"><div className="container-site"><div className="studio-service-list">
        {services.map((s) => { const Icon = s.icon; return <article className="studio-service-row" key={s.n}><span className="service-number">{s.n}</span><span className="service-icon"><Icon size={22} /></span><h3>{s.title}</h3><p>{s.text}</p><ArrowUpRight className="service-arrow" /></article>; })}
      </div></div></section>}

      {isProcess && <section className="studio-process section"><div className="container-site"><div className="process-grid">{steps.map(([n, name, text]) => <div className="process-item" key={n}><span>{n}</span><h3>{name}</h3><p>{text}</p></div>)}</div></div></section>}

      {isPortfolio && <section className="studio-work section"><div className="container-site"><div className="studio-section-head"><div><p className="studio-eyebrow">Portfolio</p><h2>Selected digital directions.</h2></div><p>Portfolio Alvin Studio berisi contoh konsep dan project yang menunjukkan bagaimana kami menggabungkan strategy, design, dan development.</p></div><div className="studio-project-grid">{projects.map((p) => <article className="studio-project-card" key={p.n}><div className={"project-visual " + (p.n === "01" ? "project-visual-web" : p.n === "02" ? "project-visual-system" : "project-visual-brand")}><span className="project-number">{p.n}</span><div className="project-shape"><span>{p.title.toUpperCase()}</span></div></div><div className="project-copy"><div><span>{p.type}</span><h3>{p.title}</h3></div><p>{p.text}</p></div></article>)}</div></div></section>}

      {page === "contact" && <section className="studio-cta section" style={{ marginTop: 0 }}><div className="container-site studio-cta-inner"><div><p className="studio-eyebrow">Have a project in mind?</p><h2>Let's make something<br /><span>worth remembering.</span></h2><p className="mt-5 max-w-xl text-sm text-muted-foreground">Ceritakan kebutuhan bisnis kamu. Alvin Studio akan membantu menentukan arah website, digital product, atau custom system yang paling masuk akal.</p></div><Button variant="studioLight" asChild className="magnetic"><a href="mailto:hello@alvinstudio.id">Email Alvin Studio <ArrowUpRight /></a></Button></div></section>}

      <footer className="footer studio-footer"><div className="container-site"><div className="studio-footer-top"><div><a href="/"><Brand /></a><p>Digital experiences. Real business impact.</p></div><div className="studio-footer-links">{nav.map((item) => <a key={item.href} href={item.href}>{item.text}</a>)}</div></div><div className="footer-bottom"><span>© 2026 Alvin Studio. All rights reserved.</span><span>Built with intention.</span></div></div></footer>
    </main>
  );
}
