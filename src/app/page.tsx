import { getPublishedArticles } from "@/lib/knowledge";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const articles = await getPublishedArticles(3);
  return <HomeClient articles={articles} />;
}
