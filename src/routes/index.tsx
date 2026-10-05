import { createFileRoute } from "@tanstack/react-router";
import { StudioHome } from "@/components/studio/studio-home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alvin Studio — Digital Solutions untuk Bisnis" },
      {
        name: "description",
        content:
          "Alvin Studio membangun website profesional, POS, QR Ordering, dan sistem custom untuk cafe, restoran, UMKM, dan retail.",
      },
    ],
  }),
  component: StudioHome,
});
