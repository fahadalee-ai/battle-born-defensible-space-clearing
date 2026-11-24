import { createFileRoute } from "@tanstack/react-router";
import { QuoteRequestScreen } from "@/screens/appointments";

export const Route = createFileRoute("/quote")({
  component: QuoteRequestScreen,
});
