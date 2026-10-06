import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/studio-page";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Alvin Studio — What we do" }] }),
  component: () => <StudioPage page="services" eyebrow="Services" title="What we do" intro="Three focused ways Alvin Studio helps businesses build a stronger digital presence." />,
});
