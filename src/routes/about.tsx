import { createFileRoute } from "@tanstack/react-router";
import { AboutScreen } from "@/screens/profile";

export const Route = createFileRoute("/about")({
  component: AboutScreen,
});
