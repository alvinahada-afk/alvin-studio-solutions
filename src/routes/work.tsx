import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/studio-page";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [{ title: "Alvin Studio — Selected work" }] }),
  component: () => <StudioPage page="work" eyebrow="Work" title="Selected work" intro="Digital work built with purpose, from premium company profiles to business systems and custom brand experiences." />,
});
