import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/studio-page";

export const Route = createFileRoute("/process")({
  head: () => ({ meta: [{ title: "Alvin Studio — Clear process. Better output." }] }),
  component: () => <StudioPage page="process" eyebrow="Process" title="Clear process. Better output." intro="A simple, collaborative process that keeps strategy, design, development, and launch moving in the same direction." />,
});
