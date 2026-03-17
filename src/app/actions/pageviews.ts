'use server';

import redis from '@/cache';

const keyFor = (id: number | string) => `pageviews:article:${id}`;

export async function incrementPageview(articleId: number) {
  const articleKey = keyFor(articleId);
  const newVal = await redis.incr(articleKey);
  return +newVal;
}

// "incr" both increments the existing number and it returns the current value. So if the key doesn't exist, it will create it with a value of 1 and return 1. If it already exists, it will increment the value by 1 and return the new value.
