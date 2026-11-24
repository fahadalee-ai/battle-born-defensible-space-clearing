import { createFileRoute } from "@tanstack/react-router";
import { ReviewScreen } from "@/screens/appointments";

export const Route = createFileRoute("/review")({
  component: ReviewScreen,
});
