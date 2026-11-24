import { createFileRoute } from "@tanstack/react-router";
import { GuideScreen } from "@/screens/resources";

export const Route = createFileRoute("/guide/")({
  component: GuideScreen,
});
