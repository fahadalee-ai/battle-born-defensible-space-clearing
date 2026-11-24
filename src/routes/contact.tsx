import { createFileRoute } from "@tanstack/react-router";
import { ContactScreen } from "@/screens/profile";

export const Route = createFileRoute("/contact")({
  component: ContactScreen,
});
