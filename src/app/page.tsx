import { ArticleList } from "@/components/ArticleList";
import { getArticles } from "@/lib/data/articles";

const PAGE_SIZE = 5;

export default async function Home() {
  const articles = await getArticles(undefined, PAGE_SIZE);

  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10">
        <ArticleList initialArticles={articles} pageSize={PAGE_SIZE} />
      </main>
    </div>
  );
}
