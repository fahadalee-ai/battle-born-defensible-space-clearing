import { createFileRoute } from "@tanstack/react-router";
import { ArticleScreen } from "@/screens/resources";

export const Route = createFileRoute("/guide/$slug")({
  component: function Screen() {
    const { slug } = Route.useParams();
    return <ArticleScreen slug={slug} />;
  },
});
