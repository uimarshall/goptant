"use client";

import { useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: string | null;
  summary: string | null;
}

interface ArticleListProps {
  initialArticles: Article[];
  pageSize: number;
}

export function ArticleList({ initialArticles, pageSize }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length === pageSize);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Get the ID of the last article (cursor)
      const lastArticle = articles[articles.length - 1];
      const cursor = lastArticle?.id;

      // Fetch next page
      const response = await fetch(
        `/api/articles?cursor=${cursor}&pageSize=${pageSize}`,
      );
      const newArticles: Article[] = await response.json();

      // If we got fewer articles than pageSize, we've reached the end
      if (newArticles.length < pageSize) {
        setHasMore(false);
      }

      // Append new articles to existing ones
      setArticles((prev) => [...prev, ...newArticles]);
    } catch (error) {
      console.error("Failed to load more articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {articles.map(({ title, id, createdAt, content, summary, author }) => (
          <BlogCard
            title={title}
            author={author || "Unknown"}
            date={createdAt}
            summary={summary ?? "No summary available"}
            // summary={content.substring(0, 200)}
            href={`/blog/${id}`}
            key={id}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={loadMore} disabled={isLoading} variant="outline">
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          No more articles to load
        </p>
      )}
    </div>
  );
}
