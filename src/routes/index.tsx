import { createFileRoute } from "@tanstack/react-router";
import { StudioHome } from '@/components/studio/studio-home';

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Alvin Studio — Website, POS & Digital Solutions untuk Bisnis' },
    { name: 'description', content: 'Alvin Studio membangun website profesional, Cafe Flow POS, QR Ordering, dan sistem custom untuk cafe, restoran, UMKM, dan retail. Website mulai Rp600K.' },
    { property: 'og:title', content: 'Alvin Studio — Digital Solutions untuk Bisnis yang Ingin Berkembang' },
    { property: 'og:description', content: 'Website profesional, POS, QR Ordering, dan sistem custom untuk membantu bisnis berjalan lebih efektif. Konsultasi gratis bersama Alvin Studio.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: StudioHome,
});
