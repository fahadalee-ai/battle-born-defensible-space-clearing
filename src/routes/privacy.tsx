import { createFileRoute } from "@tanstack/react-router";
import { PrivacyScreen } from "@/screens/resources";

export const Route = createFileRoute("/privacy")({
  component: PrivacyScreen,
});
