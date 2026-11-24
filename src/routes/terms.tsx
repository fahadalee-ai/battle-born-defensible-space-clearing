import { createFileRoute } from "@tanstack/react-router";
import { TermsScreen } from "@/screens/resources";

export const Route = createFileRoute("/terms")({
  component: TermsScreen,
});
