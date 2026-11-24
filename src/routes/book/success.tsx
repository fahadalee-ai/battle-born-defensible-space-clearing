import { createFileRoute } from "@tanstack/react-router";
import { BookingSuccessScreen } from "@/screens/book";

export const Route = createFileRoute("/book/success")({
  component: BookingSuccessScreen,
});
