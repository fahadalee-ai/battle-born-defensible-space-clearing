import { createFileRoute } from "@tanstack/react-router";
import { ProjectsScreen } from "@/screens/resources";

export const Route = createFileRoute("/projects/")({
  component: ProjectsScreen,
});
