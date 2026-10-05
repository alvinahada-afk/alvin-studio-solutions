import { createFileRoute } from "@tanstack/react-router";
import { StudioHomeLive } from '@/components/studio/studio-home-live';

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Alvin Studio — Website, POS & Digital Solutions untuk Bisnis' },
    { name: 'description', content: 'Alvin Studio membangun website profesional, Cafe Flow POS, QR Ordering, dan sistem custom untuk cafe, restoran, UMKM, dan retail.' },
  ] }),
  component: StudioHomeLive,
});