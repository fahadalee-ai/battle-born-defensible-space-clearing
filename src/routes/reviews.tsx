import { createFileRoute } from "@tanstack/react-router";
import { ReviewsScreen } from "@/screens/appointments";

export const Route = createFileRoute("/reviews")({
  component: ReviewsScreen,
});
