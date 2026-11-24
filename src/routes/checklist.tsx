import { createFileRoute } from "@tanstack/react-router";
import { ChecklistScreen } from "@/screens/resources";

export const Route = createFileRoute("/checklist")({
  component: ChecklistScreen,
});
