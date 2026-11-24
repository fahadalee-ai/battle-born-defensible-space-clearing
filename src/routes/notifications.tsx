import { createFileRoute } from "@tanstack/react-router";
import { NotificationsScreen } from "@/screens/profile";

export const Route = createFileRoute("/notifications")({
  component: NotificationsScreen,
});
