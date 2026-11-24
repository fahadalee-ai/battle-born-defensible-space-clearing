import { createFileRoute } from "@tanstack/react-router";
import { AudienceScreen } from "@/screens/services";

export const Route = createFileRoute("/serve/$type")({
  component: function Screen() {
    const { type } = Route.useParams();
    return <AudienceScreen id={type} />;
  },
});
