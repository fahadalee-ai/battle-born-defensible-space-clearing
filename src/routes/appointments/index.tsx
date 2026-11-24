import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsScreen } from "@/screens/appointments";

export const Route = createFileRoute("/appointments/")({
  component: AppointmentsScreen,
});
