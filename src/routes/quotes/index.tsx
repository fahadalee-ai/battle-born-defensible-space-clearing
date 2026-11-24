import { createFileRoute } from "@tanstack/react-router";
import { QuotesScreen } from "@/screens/appointments";

export const Route = createFileRoute("/quotes/")({
  component: QuotesScreen,
});
