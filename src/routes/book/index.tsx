import { createFileRoute } from "@tanstack/react-router";
import { BookScreen } from "@/screens/book";

export const Route = createFileRoute("/book/")({
  component: BookScreen,
});
