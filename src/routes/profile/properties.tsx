import { createFileRoute } from "@tanstack/react-router";
import { PropertiesScreen } from "@/screens/profile";

export const Route = createFileRoute("/profile/properties")({
  component: PropertiesScreen,
});
