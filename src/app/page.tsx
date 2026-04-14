import { getPublishedArticles } from "@/lib/knowledge";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const articles = await getPublishedArticles();
  return <HomeClient articles={articles.slice(0, 3)} />;
}
