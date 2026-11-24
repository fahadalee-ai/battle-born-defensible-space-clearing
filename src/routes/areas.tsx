import { createFileRoute } from "@tanstack/react-router";
import { AreasScreen } from "@/screens/profile";

export const Route = createFileRoute("/areas")({
  component: AreasScreen,
});
