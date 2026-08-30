import { createFileRoute } from "@tanstack/react-router";
import { WakeApp } from "@/components/ripple/wake-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <WakeApp />;
}
