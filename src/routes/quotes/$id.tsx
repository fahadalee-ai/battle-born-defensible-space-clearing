import { createFileRoute } from "@tanstack/react-router";
import { QuoteDetailScreen } from "@/screens/appointments";

export const Route = createFileRoute("/quotes/$id")({
  component: function Screen() {
    const { id } = Route.useParams();
    return <QuoteDetailScreen id={id} />;
  },
});
