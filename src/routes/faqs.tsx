import { createFileRoute } from "@tanstack/react-router";
import { FaqScreen } from "@/screens/resources";

export const Route = createFileRoute("/faqs")({
  component: FaqScreen,
});
