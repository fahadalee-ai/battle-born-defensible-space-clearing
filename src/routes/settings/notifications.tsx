import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettingsScreen } from "@/screens/profile";

export const Route = createFileRoute("/settings/notifications")({
  component: NotificationSettingsScreen,
});
