import { desc, eq, gt } from 'drizzle-orm';
import db from '@/db/index';
import { articles, usersSync } from '@/db/schema';
import redis from '@/cache';

export async function getArticles(cursor?: number, pageSize = 5) {
  const cached = await redis.get('articles:all');
  if (cached) {
    console.log('🎯 Get Articles Cache Hit!');
    return cached;
  }

  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: usersSync.name,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(cursor ? gt(articles.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(desc(articles.id));

  console.log('🙅‍♂️ Get Articles Cache Miss!');
  redis.set('articles:all', response, {
    ex: 60, // one minute
  });
  return response;
}

export async function getArticleById(id: number) {
  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: usersSync.name,
      imageUrl: articles.imageUrl,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id));
  return response[0] ? response[0] : null;
}
