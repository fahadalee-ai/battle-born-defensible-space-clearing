import { createFileRoute } from "@tanstack/react-router";
import { PropertyScreen } from "@/screens/profile";

export const Route = createFileRoute("/profile/property/$id")({
  component: function Screen() {
    const { id } = Route.useParams();
    return <PropertyScreen id={id} />;
  },
});
