import { createFileRoute } from "@tanstack/react-router";
import { VerifyScreen } from "@/screens/auth";

export const Route = createFileRoute("/verify")({
  component: VerifyScreen,
});
