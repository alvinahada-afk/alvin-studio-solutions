import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/studio-page";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Alvin Studio — Work worth remembering." }] }),
  component: () => <StudioPage page="portfolio" eyebrow="Portfolio" title="Work worth remembering." intro="Explore our portfolio of digital directions, concepts, and experiences built for modern businesses." />,
});
