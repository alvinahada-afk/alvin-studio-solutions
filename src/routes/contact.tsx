import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/studio-page";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Alvin Studio — Let's build something." }] }),
  component: () => <StudioPage page="contact" eyebrow="Contact" title="Let's build something." intro="Punya project, ide, atau bisnis yang ingin dibawa ke level digital yang lebih serius? Let's talk." />,
});
