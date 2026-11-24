import { createFileRoute } from "@tanstack/react-router";
import { EditProfileScreen } from "@/screens/profile";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfileScreen,
});
