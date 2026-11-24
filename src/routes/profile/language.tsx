import { createFileRoute } from "@tanstack/react-router";
import { LanguageScreen } from "@/screens/profile";

export const Route = createFileRoute("/profile/language")({
  component: LanguageScreen,
});
