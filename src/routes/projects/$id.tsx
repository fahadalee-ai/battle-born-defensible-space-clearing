import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailScreen } from "@/screens/resources";

export const Route = createFileRoute("/projects/$id")({
  component: function Screen() {
    const { id } = Route.useParams();
    return <ProjectDetailScreen id={id} />;
  },
});
