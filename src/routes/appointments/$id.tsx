import { createFileRoute } from "@tanstack/react-router";
import { AppointmentDetailScreen } from "@/screens/appointments";

export const Route = createFileRoute("/appointments/$id")({
  component: function Screen() {
    const { id } = Route.useParams();
    return <AppointmentDetailScreen id={id} />;
  },
});
