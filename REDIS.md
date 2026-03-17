## What is Redis?

> NOTE: Generally speaking, don't do cache something until it's proven to be a problem. Premature optimization kills startups.

Redis can do a bunch of other stuff like increment, scan, etc. but in essence it's all just a store of values that you access with keys.

Generally speaking, it's great for caching and anything you want to access frequently at low latency. Redis's throughput is unbelievably fast, orders of magnitude faster than any SQL or NoSQL database, but you trade off features and frequently some of the guarantees like replication and such.

## What is the primary purpose of using a key-value store like Redis in front of a database?

To cache results and reduce load on the database. Instead of running expensive SQL queries every time a page loads, results can be cached in Redis which is better suited to handle high traffic volumes. This is particularly useful for expensive queries with joins or data that doesn't change frequently.

## What is the key difference between Memcached and Redis in terms of data persistence?

Memcached only lives in memory and doesn't write anything to disk, meaning all data is lost when the node shuts down. Redis, on the other hand, flushes data to disk, so if Redis goes down and needs to be brought back up, the data is still available. This makes Memcached extremely fast but without persistence, while Redis offers a balance of speed and data durability.

## What is Valkey and how does it relate to Redis?

Valkey is essentially a re-implementation of Redis that emerged when Redis put restrictive terms on how people could use it. The open source community responded by creating Valkey as a more open source alternative. Valkey and Redis are approximately 99% the same, with the main difference being that Valkey is more open source while Redis is backed by a full company.

<https://valkey.io/>

## How does server-side caching with Redis differ from client-side caching with tools like React Query?

Server-side caching with Redis is primarily used to save server load and reduce expensive operations on databases or services. Client-side caching with tools like React Query is primarily used to reduce latency by avoiding round trips to the server, making data immediately available to the user. While both reduce API hits, they serve different primary purposes: Redis focuses on reducing server/database load, while React Query focuses on improving user experience through faster data access.

## What are common use cases for storing data in Redis instead of a traditional database?

Redis is ideal for: 1) Caching expensive query results to avoid repeatedly hitting the database with the same queries, 2) Storing intermediary results from expensive computations or machine learning pipelines, and 3) Tracking non-critical data like page views where data loss wouldn't be catastrophic. Redis is particularly useful for data that is accessed frequently but doesn't require the full durability guarantees of a traditional database.

## What is the "thundering herd" problem in the context of caching?

The thundering herd problem occurs when a cache is evicted or expires, and a large number of users simultaneously hit the backend database or service before the cache can be repopulated. This can overwhelm the database and cause system failures. The solution is to never evict the cache completely, but instead override it by updating the cached values, ensuring there's always something in the cache to serve users.

## In Redis, what is the purpose of using colons in cache key names like articles:all or articles:1234?

Colons are used to create namespacing in Redis keys, allowing you to imply hierarchy and organize related data. For example, articles:all might represent all articles, while articles:1234 could represent a specific article with ID 1234. This naming convention helps maintain a structured and organized cache system.

## What code would you use to set a cache entry in Redis with a 60-second expiration time for all articles?

const response = await getArticlesFromDatabase();
await redis.set('articles:all', response, 60);
The third parameter (60) specifies the time-to-live (TTL) in seconds before the cache expires.

## Why is it recommended to evict or delete a cache entry when creating a new database record?

When a new record is created, the cached data becomes stale and doesn't reflect the latest state. By evicting the cache (e.g., using redis.del('articles:all')), the next user request will miss the cache and fetch fresh data from the database, which then gets cached again. This ensures users see their changes immediately, preventing frustration from seeing outdated information after performing an action.

## What are the key considerations when determining how long to cache data?

Key considerations include: how often the data changes, how critical it is for the data to be up-to-date, and what level of staleness is acceptable to users. For example, if data being a minute or several minutes out of date is acceptable, a 60-second cache expiration might be appropriate. The decision should be based on specific scaling problems and understanding of your application's requirements, not premature optimization.

## In Redis, what does the increment operation do when called on a key that doesn't exist versus one that does exist?

When called on a key that doesn't exist, the increment operation creates a new key with the value 1. When called on a key that does exist, it increments the current value (e.g., from 1 to 2, 2 to 3, etc.). The operation also returns the new incremented value.

## What does TTL stand for in Redis and what is its purpose?

TTL stands for "time to live". It indicates when a cached item will be evicted from the cache. For example, a TTL of 50 seconds means the item will be removed from the cache after 50 seconds.

## What eviction strategy does Redis commonly use when the cache reaches its size limit?

Redis commonly uses a "least recently updated" (or least recently used) eviction strategy. When the cache reaches its size limit (e.g., 2 gigabytes), items that haven't been read or updated for the longest time are the first to be evicted when new data needs to be cached.

## Why is Redis considered suitable for storing page view counts, even though the data could be lost?

Redis is suitable for page view counts because this data is not highly critical and some loss is acceptable. If the Redis cache is evicted or crashes, the impact is minimal. Additionally, the counts can be periodically saved to a more permanent storage like S3 or a database as a backup strategy.

## What is the key advantage of using a remote cache like Redis when scaling web servers horizontally?

When scaling from one server to multiple servers (e.g., from 1 to 3, 5, or 15 servers), a remote cache like Redis ensures all servers access the same cached data. Unlike in-memory caches that are local to each server, Redis provides a centralized cache that all stateless servers can coordinate with, ensuring consistent data across the entire system.

## Why is Redis typically used alongside a traditional database rather than as the sole database?

Redis data is meant to be ephemeral and can be evicted, making it unsuitable as the sole source of truth.

## Why does the unary plus operator (+) work for type coercion in JavaScript when converting a string ID from a URL to a number?

The unary plus operator performs type coercion by converting the string value to a number. For example, if an ID comes from a URL as the string "3", using +ID converts it to the number 3. This is necessary because URL parameters are always strings, but database queries often require numeric types.

## What are two alternative methods to the unary plus operator for converting a string to a number in JavaScript?

Two alternatives are: 1) Using the Number constructor: new Number(ID), and 2) Using parseInt: parseInt(ID). Both methods explicitly convert a string value to a number type.

## Why is caching at the edge often not beneficial for typical application architectures?

Why is caching at the edge often not beneficial for typical application architectures?

Click to reveal answer
Edge caching typically doesn't benefit most applications because the API server still needs to make requests to the cache at the edge, potentially adding more time and distance to the request cycle. It would only be beneficial if the entire application is architected to serve complete API responses directly from the edge, bypassing the API server entirely. Most applications don't follow this architecture pattern.

## What should be cached at the edge to effectively reduce latency, rather than caching intermediate database query results?

To effectively use edge caching, you should cache the final API responses rather than intermediate database query results. This way, requests can be served directly from the nearest edge location without requiring additional round trips to the API server or database, reducing latency by approximately 100-600 milliseconds.

## What is the main architectural requirement for using edge functions or edge caching effectively with services like Cloudflare Workers or Vercel Edge Functions?

To use edge functions effectively, the application must be specifically architected and optimized for that use case. The system needs to be designed so that complete responses can be served from edge locations without requiring additional round trips to centralized API servers or databases, which is not how most applications are typically structured.
