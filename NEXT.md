# Comprehensive Next.js 16 Tutorial

> Based on the official [Next.js documentation](https://nextjs.org/docs) (v16.1.6).  
> All examples are grounded in this project — **Goptant**, a full-stack blog platform built with the App Router, Drizzle ORM, Stack Auth, and Tailwind CSS.

---

## Table of Contents

1. [What is Next.js?](#1-what-is-nextjs)
2. [Installation & Project Structure](#2-installation--project-structure)
3. [App Router vs Pages Router](#3-app-router-vs-pages-router)
4. [File-System Routing](#4-file-system-routing)
5. [Pages & Layouts](#5-pages--layouts)
6. [Special Files](#6-special-files)
7. [Server Components & Client Components](#7-server-components--client-components)
8. [Data Fetching](#8-data-fetching)
9. [Server Actions (`use server`)](#9-server-actions-use-server)
10. [Route Handlers (API Routes)](#10-route-handlers-api-routes)
11. [Caching, Revalidation & `use cache`](#11-caching-revalidation--use-cache)
12. [Dynamic Routes & `generateStaticParams`](#12-dynamic-routes--generatestaticparams)
13. [Route Groups](#13-route-groups)
14. [Parallel Routes & Intercepting Routes](#14-parallel-routes--intercepting-routes)
15. [Error Handling](#15-error-handling)
16. [Loading UI & Streaming (Suspense)](#16-loading-ui--streaming-suspense)
17. [Metadata & SEO](#17-metadata--seo)
18. [Image Optimization](#18-image-optimization)
19. [Font Optimization](#19-font-optimization)
20. [CSS & Styling](#20-css--styling)
21. [Middleware](#21-middleware)
22. [Environment Variables](#22-environment-variables)
23. [Authentication Patterns](#23-authentication-patterns)
24. [Deploying Next.js](#24-deploying-nextjs)
25. [Next.js 16 New Features](#25-nextjs-16-new-features)

---

## 1. What is Next.js?

> 🟢 **Beginner start here** — This section explains the big picture before diving into code.

### Plain English: What problem does Next.js solve?

Imagine you are building a website using plain React. React is excellent at building interactive user interfaces, but on its own it gives you a blank browser page and says "you figure out the rest." You still need to answer questions like:

- How do users navigate from `/home` to `/about`? (routing)
- Where does data come from? (data fetching)
- How do search engines find my site? (SEO / metadata)
- How do I make it fast to load? (performance / caching)
- How do I connect to a database securely without exposing secrets? (backend)

Next.js answers **all of these questions for you** with sensible defaults, so you can focus on writing your app instead of wiring together a dozen libraries.

> **Analogy:** React is like buying individual ingredients. Next.js is the full meal kit — it comes with the ingredients, the recipe, and the cooking instructions all in one box.

### What Next.js is NOT

- It is **not** a replacement for React — it is built _on top of_ React. You still write React components.
- It is **not** a database — you still bring your own (this project uses PostgreSQL via Drizzle ORM).
- It is **not** only for static sites — it can be fully dynamic, fully static, or anything in between.

Next.js is a **React framework for building full-stack web applications**. It provides:

- **File-based routing** — no manual router configuration. The folder/file names become your URLs automatically.
- **React Server Components** — render components on the server for speed and security.
- **Built-in optimizations** — images, fonts, scripts, and more are handled for you.
- **Multiple rendering strategies** — Static Generation (SSG), Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and full dynamic rendering — often mixed in the same project.
- **Turbopack** — the Rust-based bundler (default in dev from Next.js 15+, fully stable in 16).

Next.js automatically configures Webpack/Turbopack, TypeScript, ESLint, and Babel/SWC so you can focus on building.

### Rendering Strategies — a plain-English glossary

These terms appear constantly, so understand them upfront:

| Term                                      | What it means                                                                     | Real-world analogy                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **SSG** (Static Site Generation)          | HTML is generated **once at build time**, served instantly to everyone            | Printing a brochure — identical copy for everyone, extremely fast to hand out           |
| **SSR** (Server-Side Rendering)           | HTML is generated fresh **on the server per request**                             | A restaurant making your meal to order — personalised, but takes a moment               |
| **ISR** (Incremental Static Regeneration) | Static HTML, but **regenerated automatically** in the background after a set time | A newspaper that reprints itself every hour while still handing out the current edition |
| **CSR** (Client-Side Rendering)           | The browser downloads JavaScript and **renders the page itself**                  | A flat-pack kit the customer assembles at home — no prep from the shop                  |

> 💡 Next.js lets you **mix strategies per page** — your home page can be static (SSG), your blog post can be ISR, and your user dashboard can be dynamic (SSR). You do not have to pick one for the whole app.

---

## 2. Installation & Project Structure

> 🟢 **Beginner note:** You need [Node.js](https://nodejs.org) (v18 or newer) installed first. Run `node -v` in your terminal to check. If you do not have it, download it from nodejs.org and the `npm`/`npx` commands below will work automatically.

### Creating a project

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
```

What each flag means:

| Flag           | What it does                                        | Beginner advice                                                                          |
| -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--typescript` | Adds TypeScript for type-safe code                  | Strongly recommended — it catches bugs before they run and gives you better autocomplete |
| `--tailwind`   | Installs Tailwind CSS (utility-first styling)       | Great for beginners — add classes like `"text-red-500 font-bold"` directly in JSX        |
| `--eslint`     | Adds a code linter that highlights common mistakes  | Always include this                                                                      |
| `--app`        | Uses the **App Router** (the modern routing system) | Always use `--app` for new projects in 2025+                                             |

After running the command, open your project with:

```bash
cd my-app
npm run dev   # starts the development server on http://localhost:3000
```

> 💡 Every time you save a file, the browser updates **instantly** thanks to Hot Module Replacement (HMR) — you do not need to manually refresh the page.

### This project's key structure

```
src/
  app/                    ← App Router root
    layout.tsx            ← Root layout (wraps every page)
    page.tsx              ← Home page  /
    loading.tsx           ← Loading skeleton for the home route
    not-found.tsx         ← Custom 404 page
    globals.css           ← Global styles
    actions/
      articles.ts         ← Server Actions (use server)
      upload.ts           ← Server Action for file upload
    api/
      articles/
        route.ts          ← Route Handler  GET /api/articles
    blog/
      [id]/
        page.tsx          ← Dynamic route  /blog/:id
      edit/
        [id]/
          page.tsx        ← /blog/edit/:id
        new/
          page.tsx        ← /blog/edit/new
    handler/
      [...stack]/
        page.tsx          ← Catch-all for Stack Auth
  components/             ← Shared UI components
  db/                     ← Drizzle ORM (schema, queries)
  lib/                    ← Utility functions & data access layer
  stack/                  ← Stack Auth helpers (server & client)
```

### `next.config.ts`

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true, // Persistent Turbopack cache between dev restarts
  },
};

export default nextConfig;
```

---

## 3. App Router vs Pages Router

> 🟢 **Beginner note:** Next.js has two different systems for routing. If you are learning Next.js today, **always use the App Router** — it is the modern, recommended approach. The Pages Router is the older system that still exists for backward compatibility.

Think of it this way:

- **Pages Router** = the original Next.js way (2016–2023). You will still see it in older tutorials and existing codebases. Files live in a `pages/` folder and data fetching uses special functions like `getServerSideProps`.
- **App Router** = the modern way (introduced in Next.js 13, mature from v15+). Files live in an `app/` folder. You just write `async/await` directly in your components.

> ⚠️ **Common beginner mistake:** Many YouTube tutorials and blog posts still use the Pages Router (`getServerSideProps`, `pages/api/`, `_app.tsx`). These concepts do **not** apply to the App Router. If a tutorial looks different from what you see here, it is almost certainly using the old Pages Router system. Look for the `app/` folder vs the `pages/` folder to tell them apart.

| Feature                | App Router (`/app`)                  | Pages Router (`/pages`)                 |
| ---------------------- | ------------------------------------ | --------------------------------------- |
| React version          | React 19 (stable)                    | Project's installed React               |
| Default component type | **Server Component**                 | Client Component                        |
| Data fetching          | `async/await` directly in components | `getServerSideProps` / `getStaticProps` |
| Layouts                | Nested, persistent `layout.tsx`      | `_app.tsx`                              |
| Streaming              | Built-in with Suspense               | Limited                                 |
| Server Actions         | ✅                                   | ❌                                      |
| `use cache` directive  | ✅ (v15+)                            | ❌                                      |

**This project uses the App Router exclusively.**

---

## 4. File-System Routing

> 🟢 **Beginner note:** In traditional web development or plain React, you configure routes manually in code, e.g. `<Route path="/blog" component={BlogPage} />`. Next.js eliminates all of that — **your folder structure IS your router**. No configuration needed.
> Nextjs now uses what we call file based routing. In this case, you create a folder(This is the url path), inside the folder, Is where you create a file which must be named `page.tsx` file, this will define the content of the page, when that url is visited.
>
> **NOTE:** the page.tsx is opinionated, if you don't name it page.tsx, the route will not work.
> Secondly, it must be an `export default` function.
>
> e.g🧮

```tsx
// src/app/page.tsx

const PAGE_SIZE = 5;

// ✅ Async Server Component — fetch data directly, no useEffect needed
export default async function Home() {
  const articles = await getArticles(undefined, PAGE_SIZE);

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <ArticleList initialArticles={articles} pageSize={PAGE_SIZE} />
    </main>
  );
}
```

## `export default` vs Other Exports

### Named Export

```ts
// You give it an explicit name, and the importer MUST use that exact name
export function getArticles() { ... }
export const PAGE_SIZE = 5;

// Importing — name must match exactly (or use an alias)
import { getArticles, PAGE_SIZE } from '@/lib/data/articles';
import { getArticles as fetchArticles } from '@/lib/data/articles'; // alias
```

### Default Export

```ts
// Only ONE default export per file is allowed
export default function Home() { ... }

// Importing — you can name it ANYTHING you want
import Home from './page';
import MyPage from './page';       // also valid — name is up to you
import WhateverIWant from './page'; // also valid
```

---

### Key Differences

|                       | Named Export                 | Default Export             |
| --------------------- | ---------------------------- | -------------------------- |
| **Quantity per file** | Multiple allowed             | Only **one** allowed       |
| **Import syntax**     | `{ curly braces }` required  | No curly braces            |
| **Import name**       | Must match the exported name | Can be any name you choose |
| **Discoverability**   | Better (IDE autocomplete)    | Worse (any name is valid)  |

---

### Why Next.js requires `export default` for pages

Next.js needs to know _exactly_ which function is **the page** in a `page.tsx` file. Since a file can have many named exports, it uses the `export default` convention as the unambiguous signal:

```tsx
// src/app/page.tsx
const PAGE_SIZE = 5;                  // ← named export (helper constant)
export { PAGE_SIZE };

export default async function Home() { // ← Next.js uses THIS as the page
  ...
}
```

Next.js internally does something like:

```ts
import PageComponent from './app/page'; // grabs the default — no guessing needed
```

> ⚠️ **Common mistake:** Forgetting `default` in your `page.tsx` will result in a blank page or an error, because Next.js cannot find which export to render.

### The core idea

Think of the `app/` folder like a filing cabinet:

- Each **folder** = one segment of the URL path
- A **`page.tsx`** file inside a folder = the visible content at that URL
- No `page.tsx` in a folder? That URL does not exist (shows nothing publicly)

For example, to create the URL `/blog/edit/new`, you simply create: `app/blog/edit/new/page.tsx`. That's it.

Next.js maps the **folder structure** inside `app/` to URL paths.

| File path                         | URL              | What it renders                   |
| --------------------------------- | ---------------- | --------------------------------- |
| `app/page.tsx`                    | `/`              | Home page                         |
| `app/blog/page.tsx`               | `/blog`          | Blog article list                 |
| `app/blog/[id]/page.tsx`          | `/blog/123`      | One specific article              |
| `app/blog/edit/[id]/page.tsx`     | `/blog/edit/123` | Edit form for article 123         |
| `app/handler/[...stack]/page.tsx` | `/handler/a/b/c` | Any nested path under `/handler/` |

### Rules explained for beginners

- **A folder creates a route segment** — adding an `about/` folder adds `/about` to the URL.
- **Only folders with `page.tsx` are publicly accessible** — you can have utility/helper folders that do not create any URL.
- **`[param]`** (square brackets) = "this part of the URL can be anything" — `[id]` matches `/blog/1`, `/blog/hello`, `/blog/anything`. The value (`1`, `hello`) is available inside the page as `params.id`.
- **`[...param]`** = catch-all — matches one or more segments. `[...stack]` in `app/handler/[...stack]/` matches `/handler/sign-in`, `/handler/sign-up/step/2`, etc.
- **`[[...param]]`** = optional catch-all — also matches `/handler` itself (zero segments).
- **`(group)`** = route group — a folder in parentheses organises code without adding anything to the URL (see [§13](#13-route-groups)).
- **`@slot`** = named slot for parallel routes (see [§14](#14-parallel-routes--intercepting-routes)).

> 💡 **Mental model:** If you can navigate to a URL in your browser, there must be a `page.tsx` at the matching folder path. If you visit `/blog/edit/42` and get a 404, the file `app/blog/edit/[id]/page.tsx` is missing.

> ⚠️ **Common mistake:** Creating a folder but forgetting to add `page.tsx` inside it. The folder exists in your file system but the URL returns 404.

---

## 5. Pages & Layouts

> 🟢 **Beginner note:** Think of a **page** as the unique content for a specific URL, and a **layout** as the shared frame around it (like a picture frame). The frame stays the same while you swap the picture inside.
> So the `layout.tsx` file has the `{children}` props which serves as the placeholder for the routes content. So whenever you visit a route, the `children prop` is swapped for the route to be injected inside. So the route you visits are the properties of the layout.tsx file.

### Page

A **page** is the unique UI for a route. It must `default export` a React component. Every distinct URL needs its own `page.tsx`.

```tsx
// src/app/page.tsx
import { ArticleList } from '@/components/ArticleList';
import { getArticles } from '@/lib/data/articles';

const PAGE_SIZE = 5;

// ✅ Async Server Component — fetch data directly, no useEffect needed
export default async function Home() {
  const articles = await getArticles(undefined, PAGE_SIZE);

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <ArticleList initialArticles={articles} pageSize={PAGE_SIZE} />
    </main>
  );
}
```

### Root Layout

Every Next.js App Router project must have a **root layout** at `app/layout.tsx`. It:

- Must include `<html>` and `<body>` tags — it is the outermost HTML shell of your app.
- Wraps **every single page** in the app — it is always rendered regardless of which URL the user visits.
- **Persists across navigation** — it does NOT remount when the user clicks a link. This means anything in the layout (like a Navbar) stays alive and does not flicker or lose state.

> **Analogy:** The root layout is like the walls and roof of a building. Every room (page) exists inside the building. When you move between rooms, the building itself does not collapse and rebuild — only the room content changes.

```tsx
// src/app/layout.tsx
import { StackProvider, StackTheme } from '@stackframe/stack';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { stackClientApp } from '../stack/client';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Static metadata export
export const metadata: Metadata = {
  title: 'Goptant',
  description: 'A blog platform built with Next.js 16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Navbar />
            {children} {/* Page content is injected here */}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
```

### Nested Layout

Add a `layout.tsx` in any route folder to scope UI to that route tree. Nested layouts wrap only the pages inside their folder — not the entire app.

> 💡 **When to use a nested layout:** Any time a group of routes share a common UI element that is NOT shared by the rest of the app — e.g. a sidebar only on `/dashboard` routes, or a blog header only on `/blog` routes.

```tsx
// src/app/blog/layout.tsx  (scoped to /blog and its children)
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="blog-container">
      <aside>Blog Sidebar</aside>
      <main>{children}</main>
    </section>
  );
}
```

### Dynamic Params in Pages (Next.js 15+)

In Next.js 15+, `params` and `searchParams` are **Promises** that must be `await`ed before you can read their values.

> 🟢 **Beginner explanation:** In older Next.js versions, `params` was a plain object you could read directly like `params.id`. In v15+, it became asynchronous (a Promise) to allow better server-side parallelism. You must add `await` in front of it or TypeScript will warn you.

```tsx
// src/app/blog/[id]/page.tsx
interface ViewArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params; // ← must await params
  const article = await getArticleById(+id);
  // ...
}
```

### Route Props Helpers (TypeScript)

Next.js generates global `PageProps` and `LayoutProps` helpers during `next dev` / `next build`:

```tsx
// No import needed — globally available
export default async function Page(props: PageProps<'/blog/[id]'>) {
  const { id } = await props.params;
}
```

---

## 6. Special Files

> 🟢 **Beginner note:** Next.js reserves certain filenames inside route folders. When you create a file with one of these exact names, Next.js automatically wires it up to do something specific. You do not need to import or register them anywhere — the filename alone is enough.

Think of them as "magic file names" that Next.js recognises.

These reserved filenames activate specific Next.js behaviors when placed inside a route folder:

| File                 | Purpose                                 | Project example                          |
| -------------------- | --------------------------------------- | ---------------------------------------- |
| `page.tsx`           | Page UI for the route                   | `app/page.tsx`, `app/blog/[id]/page.tsx` |
| `layout.tsx`         | Shared, persistent UI wrapper           | `app/layout.tsx`                         |
| `loading.tsx`        | Instant loading skeleton (Suspense)     | `app/loading.tsx`                        |
| `error.tsx`          | Error boundary UI                       | —                                        |
| `not-found.tsx`      | 404 UI                                  | `app/not-found.tsx`                      |
| `route.ts`           | API route handler                       | `app/api/articles/route.ts`              |
| `template.tsx`       | Like layout but remounts on nav         | —                                        |
| `default.tsx`        | Fallback for unmatched parallel routes  | —                                        |
| `middleware.ts`      | Edge middleware (at project root)       | —                                        |
| `instrumentation.ts` | OpenTelemetry / observability setup     | —                                        |
| `forbidden.tsx`      | Custom 403 page (`forbidden()` call)    | —                                        |
| `unauthorized.tsx`   | Custom 401 page (`unauthorized()` call) | —                                        |

---

## 7. Server Components & Client Components

> 🟢 **Beginner note:** This is the single most important concept to understand in the App Router, and also the most confusing at first. Take your time here.

### The big picture: two worlds

In a Next.js App Router app, there are **two environments** where your code can run:

1. **The Server** — a computer in a data centre. It has access to your database, environment secrets, and the filesystem. The user never sees it directly.
2. **The Browser** — the user's own device. It runs JavaScript, handles clicks, shows animations, and manages state.

Next.js lets you write components that run in either world — or both.

> **Analogy:** Think of a restaurant. The **kitchen (server)** prepares the food — it has all the ingredients and sharp knives that the customer should not touch. The **dining room (browser)** is where the customer sits, interacts, and enjoys the meal. You would not put customer chairs in the kitchen, and you would not give customers access to the walk-in freezer.

### Server Components (default)

All components in the App Router are **Server Components** by default. They:

- Run **only on the server** — the code is never sent to the browser (zero JavaScript bundle cost).
- Can directly `await` database queries, read files, and access secret environment variables.
- Cannot use browser APIs (`window`, `document`), React state hooks (`useState`, `useEffect`), or event handlers (because there is no browser to handle events).
- Produce HTML that is sent to the browser — fast first load, great for SEO.

```tsx
// Server Component — no directive needed
// src/app/blog/[id]/page.tsx
import { getArticleById } from '@/lib/data/articles';
import { stackServerApp } from '@/stack/server';

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(+id); // ✅ Direct DB access
  const user = await stackServerApp.getUser(); // ✅ Server-only auth check
  // ...
}
```

### Client Components (`"use client"`)

Add `"use client"` at the **very top** of a file (before any imports) to make it a Client Component. They:

- Are **pre-rendered on the server** to produce the initial HTML (so the user sees content immediately), then **"hydrated"** in the browser (where React attaches event listeners and makes things interactive).
- Can use all React hooks: `useState`, `useEffect`, `useRouter`, `useRef`, etc.
- Can attach event handlers (`onClick`, `onChange`, etc.).
- Cannot directly call server-only APIs, access the filesystem, or use secret environment variables.

> 🟢 **Beginner tip:** You do NOT need to add `"use client"` to most components. Only add it when you actually need interactivity (state, events, hooks). A component that just renders HTML from props should stay as a Server Component.

```tsx
// src/components/ArticleList.tsx
"use client";

import { useState } from "react";

export function ArticleList({ initialArticles, pageSize }) {
  const [articles, setArticles] = useState(initialArticles);

  const loadMore = async () => {
    const res = await fetch(`/api/articles?cursor=${articles.at(-1)?.id}`);
    const next = await res.json();
    setArticles(prev => [...prev, ...next]);
  };

  return (/* ... */);
}
```

```tsx
// src/components/BlogEditor.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createArticle } from '@/app/actions/articles'; // ✅ Call Server Actions from Client

export default function WikiEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  // ...
}
```

### Composition Pattern

The recommended pattern is to keep **data fetching in Server Components** and pass data down as props to Client Components:

```
app/page.tsx (Server Component)
  └── fetches articles from DB          ← safe, server-only
      └── <ArticleList initialArticles={...} />  ← Client Component receives data as plain props
```

> **Rule of thumb**: Push `"use client"` as **deep** as possible in the component tree. The more Server Components you have, the less JavaScript ships to the browser, and the faster your site loads.

### Quick decision guide

| Question                                                             | Answer           |
| -------------------------------------------------------------------- | ---------------- |
| Does it use `useState` or `useEffect`?                               | `"use client"`   |
| Does it handle button clicks, form input, etc.?                      | `"use client"`   |
| Does it fetch data from a database or API?                           | Server Component |
| Does it need secret env vars (API keys, DB passwords)?               | Server Component |
| Does it only render HTML from props with no interactivity?           | Server Component |
| Does it use a third-party library that uses browser APIs internally? | `"use client"`   |

> ⚠️ **Common mistake:** Adding `"use client"` to every component "just to be safe." This defeats the purpose of the App Router. Only add it when you have a specific reason (hooks, events, browser APIs).

---

## 8. Data Fetching

> 🟢 **Beginner note:** In a plain React app, you fetch data inside `useEffect` after the component mounts in the browser. This means the user first sees an empty page, then a spinner, then the data — a poor experience. Next.js Server Components let you fetch data **before** the page even reaches the browser, so the user always sees real content immediately.

### Fetching in Server Components (recommended)

Because Server Components are `async` functions, you can use `await` directly inside them — just like any other async Node.js code. No `useEffect`, no loading states, no empty renders.

```tsx
// Fetch directly with async/await — no useEffect, no useState needed
export default async function BlogPage() {
  const articles = await db.select().from(articlesTable);
  return <ArticleList initialArticles={articles} />;
}
```

> 💡 **Why is this better than `useEffect`?** With `useEffect` the browser first renders an empty component, then runs the effect to fetch data, then re-renders with data — causing a visible flash of empty content. With a Server Component, the data is fetched on the server and the browser receives the fully populated HTML the first time. No flash, faster perceived load.

### Parallel Data Fetching

Avoid request waterfalls by starting fetches simultaneously with `Promise.all`:

> 🟢 **What is a "waterfall"?**
>
> When you `await` fetches one after another, each one must finish before the next starts:
>
> ```
> const user = await getUser();        // waits 200ms
> const articles = await getArticles(); // then waits another 200ms
> // Total: 400ms — wasteful!
> ```
>
> `Promise.all` starts ALL fetches at the same time and waits for all of them together:
>
> ```
> // All three run simultaneously, total time = slowest one (~200ms)
> const [user, articles, stats] = await Promise.all([...]);
> ```

```tsx
export default async function DashboardPage() {
  const [user, articles, stats] = await Promise.all([
    stackServerApp.getUser(),
    getArticles(),
    getStats(),
  ]);
  // ...
}
```

### Fetching in Client Components

Use the browser `fetch` API inside event handlers or `useEffect`. In this project, `ArticleList` fetches the next page of articles via the `/api/articles` Route Handler:

```tsx
const loadMore = async () => {
  const response = await fetch(
    `/api/articles?cursor=${lastId}&pageSize=${pageSize}`,
  );
  const newArticles = await response.json();
  setArticles((prev) => [...prev, ...newArticles]);
};
```

### Extended `fetch` Options

Next.js extends the native `fetch` API with extra caching options. This is unique to Next.js — the standard browser `fetch` does not have these options.

> 🟢 **Beginner tip:** If you are calling `fetch()` inside a Server Component, you should think about whether the response should be cached. For most data that changes frequently, use `cache: 'no-store'`. For data that rarely changes, use `force-cache` or a `revalidate` time.

```ts
// Static (SSG): cache the response forever until the next build
fetch(url, { cache: 'force-cache' });

// Dynamic (SSR): never cache — always fetch fresh on every request
fetch(url, { cache: 'no-store' });

// ISR: serve cached response, but refresh it in the background every 60 seconds
fetch(url, { next: { revalidate: 60 } });

// Tag-based: cache until you manually invalidate it using revalidateTag('articles')
fetch(url, { next: { tags: ['articles'] } });
```

---

## 9. Server Actions (`use server`)

> 🟢 **Beginner note:** Before Server Actions existed, whenever you wanted a button or form to save data to a database, you had to:
>
> 1. Create an API endpoint (e.g. `POST /api/articles`)
> 2. Write `fetch('/api/articles', { method: 'POST', body: ... })` in the browser
> 3. Validate the data, check auth, etc. in the API handler
>
> Server Actions collapse all of that into a **single function** you call directly from your component. The function runs on the server — you import it in a Client Component, call it like a normal async function, and Next.js handles all the network communication for you automatically.

> **Analogy:** Instead of passing a note (HTTP request) to a waiter (API endpoint) who goes to the kitchen (server) for you, you have a direct intercom to the kitchen. You press the button and say what you want — the kitchen hears it and acts.

**Server Actions** are async functions that run exclusively on the server. They can be called directly from Client Components or `<form>` `action` props — no API endpoint needed.

### Defining a Server Action

```ts
// src/app/actions/articles.ts
'use server'; // ← marks the whole file as server-only

import { redirect } from 'next/navigation';
import db from '@/db/index';
import { articles } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function createArticle(data: CreateArticleInput) {
  // Auth check runs on server — user token never exposed to client
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('❌ Unauthorized');

  const [{ id }] = await db
    .insert(articles)
    .values({
      title: data.title,
      content: data.content,
      authorId: user.id,
      slug: `${Date.now()}`,
      published: true,
    })
    .returning({ id: articles.id });

  redirect(`/blog/${id}`);
}
```

### Calling a Server Action from a Client Component

```tsx
// src/components/BlogEditor.tsx
'use client';

import { createArticle } from '@/app/actions/articles';

export default function WikiEditor() {
  const handleSubmit = async () => {
    await createArticle({ title, content, authorId: userId });
    // Next.js automatically revalidates the page after redirect
  };
  // ...
}
```

### Using Server Actions with `<form>`

One of the most powerful features: you can pass a Server Action directly to a `<form>`'s `action` prop. This means the form works **even without JavaScript** (progressive enhancement), because the browser's built-in form submission mechanism handles it.

> 🟢 **Beginner explanation:** When `action` is a Server Action, the form submits directly to the server, the action runs, and the server redirects the user. This is exactly how HTML forms worked in the 1990s — but now with modern server logic. It is great for accessibility and resilience.
> async function createAction(formData: FormData) {

    'use server'; // inline server action
    const title = formData.get('title') as string;
    await createArticle({ title, content: '' });

}

return (

<form action={createAction}>
<input name="title" />
<button type="submit">Create</button>
</form>
);
}

````

### `use server` vs `use client` directive placement

| Placement                             | Effect                                         |
| ------------------------------------- | ---------------------------------------------- |
| Top of a **file**                     | Every export in the file is a Server Action    |
| Inside a **function**                 | Only that function is a Server Action (inline) |
| Top of a **file** with `"use client"` | Makes the whole module a Client Component      |

---

## 10. Route Handlers (API Routes)

> 🟢 **Beginner note:** Sometimes you need a traditional API endpoint — a URL that returns JSON data which other apps, services, or Client Components can call. Route Handlers are Next.js's way of building those endpoints. They replace the old `pages/api/` folder from the Pages Router.

> **When do you need a Route Handler?**
> - You're building a **public API** that other apps will consume
> - A **webhook** from a payment provider (Stripe, PayPal) needs to POST to your app
> - A Client Component needs to **load more data** by calling `fetch('/api/something')`
> - An OAuth authentication flow needs a callback URL
>
> For everything else (form submissions, button clicks that save data), use **Server Actions** instead — they are simpler.

Route Handlers live in `app/**/route.ts` files and replace the `pages/api/` convention.

```ts
// src/app/api/articles/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/data/articles';

// GET /api/articles?cursor=5&pageSize=5
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get('cursor');
  const pageSize = searchParams.get('pageSize');

  const articles = await getArticles(
    cursor ? Number(cursor) : undefined,
    pageSize ? Number(pageSize) : 5,
  );

  return NextResponse.json(articles);
}

// You can export POST, PUT, PATCH, DELETE, HEAD, OPTIONS in the same file
export async function POST(request: NextRequest) {
  const body = await request.json();
  // create article...
  return NextResponse.json({ id: newId }, { status: 201 });
}
````

### When to use Route Handlers vs Server Actions

| Use case                                               | Recommended       |
| ------------------------------------------------------ | ----------------- |
| Mutating data from a form / button                     | **Server Action** |
| Building a public REST/GraphQL API                     | **Route Handler** |
| Reading data consumed by Client Component with `fetch` | **Route Handler** |
| Webhooks / third-party callbacks                       | **Route Handler** |
| Authentication callbacks (OAuth)                       | **Route Handler** |

---

## 11. Caching, Revalidation & `use cache`

> 🟢 **Beginner note:** Caching is one of the harder topics in Next.js, but it is also one of the most important for performance. Here is the core idea:
>
> **Without caching:** Every time a user visits `/blog`, your server queries the database, builds the HTML, and sends it. If 1,000 users visit in a minute, that's 1,000 database queries.
>
> **With caching:** The first user triggers a database query and the result is saved (cached). The next 999 users get the saved result instantly — no database queries needed.
>
> The trade-off: cached data can become **stale** (out of date). Next.js gives you tools to control exactly when and how the cache is refreshed.

Next.js has a multi-layered caching system.

### The Four Cache Layers

Next.js has four separate caches that work together. You don't need to understand all of them immediately, but knowing they exist helps when debugging "why isn't my data updating?".

| Cache                   | What it stores                                                 | Beginner explanation                                                                |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Request Memoization** | Deduplicates identical `fetch()` calls in a single render pass | If two components on the same page both call `getArticle(1)`, it only runs once     |
| **Data Cache**          | Persisted `fetch()` responses across requests/deployments      | Like a fridge — stores results and serves them again without going back to the shop |
| **Full Route Cache**    | Rendered HTML + RSC Payload of static pages                    | The entire pre-built page saved to disk at build time                               |
| **Router Cache**        | Client-side cache of RSC Payloads for visited routes           | The browser "remembers" pages you have already visited for instant back-navigation  |

### `use cache` Directive (Next.js 15+, stable in 16)

The `"use cache"` directive is placed at the top of a function or file and tells Next.js to **cache its result**. The next time the same function is called with the same arguments, the cached result is returned immediately without re-running the function.

> 🟢 **Beginner tip:** Think of `"use cache"` like a sticky note on a function that says "remember your answer." The next person who asks the same question gets the answer from the note instead of re-doing all the work.

The `"use cache"` directive caches a **component**, a **function**, or an entire **page**:

```tsx
// Cache an entire page
'use cache';
export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticleList articles={articles} />;
}
```

```tsx
// Cache a data-fetching function
import { unstable_cache as cache } from 'next/cache';

export const getCachedArticles = cache(
  async () => db.select().from(articles),
  ['articles-list'],
  { revalidate: 3600, tags: ['articles'] },
);
```

### `cacheLife` — Controlling Duration

```ts
import { cacheLife } from 'next/cache';

export async function getArticles() {
  'use cache';
  cacheLife('hours'); // preset: seconds | minutes | hours | days | weeks | max
  return db.select().from(articles);
}
```

### `cacheTag` — Tag-Based Invalidation

Tags let you **invalidate** (clear) a specific cached result by name, from anywhere in your server code — for example, after a user submits a form that updates data.

> 🟢 **Beginner explanation:** Imagine every cached result has a label (tag). When you call `revalidateTag('articles')`, Next.js throws away everything with that label. The next request re-fetches fresh data. This is like throwing out all the "articles" sticky notes so new ones are written next time.

```ts
import { cacheTag } from 'next/cache';

export async function getArticleById(id: number) {
  'use cache';
  cacheTag(`article-${id}`);
  return db.select().from(articles).where(eq(articles.id, id));
}
```

### Revalidating Cache

```ts
// src/app/actions/articles.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateArticle(id: string, data: UpdateArticleInput) {
  'use server';
  await db.update(articles).set(data).where(eq(articles.id, +id));

  revalidatePath(`/blog/${id}`); // Invalidate a specific page
  revalidateTag('articles'); // Invalidate by tag (all cached data with this tag)
}
```

### ISR (Incremental Static Regeneration)

ISR is a middle ground between fully static (SSG) and fully dynamic (SSR). Pages are served as static HTML (fast!) but automatically regenerated in the background after a specified number of seconds.

> 🟢 **When to use ISR:** Perfect for content that changes occasionally — blog posts, product listings, news articles. The page is lightning fast to serve, but stays reasonably fresh.

```tsx
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function BlogPage() {
  const articles = await getArticles(); // cached & refreshed every 60s
  return <ArticleList articles={articles} />;
}
```

---

## 12. Dynamic Routes & `generateStaticParams`

> 🟢 **Beginner note:** A "dynamic route" is a route that matches many different URLs using a single file. Instead of creating `app/blog/1/page.tsx`, `app/blog/2/page.tsx`, `app/blog/3/page.tsx`... you create one file: `app/blog/[id]/page.tsx`, and it handles all of them. The `[id]` part is a **placeholder** that gets filled in with the actual value from the URL.

### Dynamic Segments

Wrap folder names in `[brackets]` to capture URL parameters:

```
app/blog/[id]/page.tsx   →   /blog/1, /blog/42, /blog/hello
```

```tsx
// src/app/blog/[id]/page.tsx
export default async function ViewArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(+id);

  if (!article) notFound(); // triggers not-found.tsx

  return <WikiArticleViewer article={article} />;
}
```

### `generateStaticParams` — Pre-render Dynamic Routes at Build Time

By default, dynamic routes like `/blog/[id]` are rendered dynamically on the server per request. `generateStaticParams` lets you tell Next.js: "I know all the possible values of `[id]` ahead of time — pre-build all of them as static HTML."

> 🟢 **Beginner explanation:** Think of it like baking cookies before the party instead of one-by-one as guests arrive. If you know your blog has articles with IDs 1, 2, and 3, `generateStaticParams` returns `[{id: '1'}, {id: '2'}, {id: '3'}]`, and Next.js bakes all three pages at build time. When a visitor arrives, their "cookie" is already ready.
> const allArticles = await db.select({ id: articles.id }).from(articles);
> return allArticles.map((a) => ({ id: String(a.id) }));
> }

```

At build time Next.js calls `generateStaticParams`, renders every returned `{id}` as a static HTML file, and serves it from the edge — no database hit at request time.

### Catch-All Segments

```

app/handler/[...stack]/page.tsx → /handler/a, /handler/a/b/c

```

Used in this project for Stack Auth's built-in UI pages (`/handler/sign-in`, `/handler/sign-up`, etc.).

---

## 13. Route Groups

> 🟢 **Beginner note:** As your project grows, you might want to organise route files into logical groups without adding extra URL segments. For example, you might want your auth pages and your dashboard pages to have different layouts, but `/login` and `/dashboard` should not have any extra prefix in the URL. Route groups solve this.

Wrapping a folder name in `(parentheses)` creates a **route group** — it organises files without affecting the URL.

```

app/
(marketing)/
about/page.tsx → /about
pricing/page.tsx → /pricing
(dashboard)/
layout.tsx ← layout only for dashboard routes
settings/page.tsx → /settings
profile/page.tsx → /profile

```

**Use cases:**

- Apply a layout to a subset of routes without adding a URL segment.
- Split large apps into logical sections (marketing vs dashboard).
- Co-locate related routes.

---

## 14. Parallel Routes & Intercepting Routes

> 🟢 **Beginner note:** These are advanced patterns. If you are just starting out, you will not need them immediately. Come back to this section when you are building complex UIs like dashboards with multiple independent panels, or Instagram/Twitter-style modal overlays.

### Parallel Routes (`@slot`)

Parallel routes render **multiple independent pages simultaneously** in the same layout. Instead of one `{children}` slot, you have several named slots, each with their own loading, error, and page files.

> Parallel routes render multiple pages simultaneously in the **same layout** using named slots:

```

app/
layout.tsx
@analytics/
page.tsx
@team/
page.tsx
page.tsx

````

```tsx
// app/layout.tsx
export default function Layout({ children, analytics, team }) {
  return (
    <>
      {children}
      {analytics} {/* Renders @analytics/page.tsx */}
      {team} {/* Renders @team/page.tsx */}
    </>
  );
}
````

**Use cases:** dashboards with multiple independent panels, side-by-side modals.

### Intercepting Routes (`(.)`, `(..)`)

Intercepting routes allow you to "hijack" a navigation so that instead of going to the full page, you show the content in a **modal/overlay** while keeping the current page visible in the background.

> 🟢 **Beginner analogy:** Think of Instagram. When you're scrolling your feed and click a photo, it opens in a modal overlay — the URL changes to `/p/ABC123`, but the feed is still visible behind. If you directly visit `/p/ABC123`, you see the full standalone photo page. This is intercepting routes: same URL, two different presentations depending on how you got there.

```
app/
  feed/
    page.tsx
  photo/
    [id]/
      page.tsx          ← Full photo page (direct URL visit)
  (.)photo/
    [id]/
      page.tsx          ← Intercepted: show as modal when navigating from /feed
```

**Use cases:** Instagram-style photo modals, login modals that deep-link.

---

## 15. Error Handling

> 🟢 **Beginner note:** In regular React, unhandled errors in a component crash the entire page and show a blank white screen. Next.js uses **Error Boundaries** to catch errors in a specific route and show a friendly fallback UI instead of crashing the whole app. Think of it as a safety net — if one room in the building catches fire, you close the door and contain it; you do not burn down the whole building.

### `error.tsx` — Route-Level Error Boundary

Create an `error.tsx` file in any route folder to catch errors thrown by `page.tsx` or any component it renders. It must be a **Client Component** because it receives props and handles a `reset` callback.

> ⚠️ **Common mistake:** Forgetting `"use client"` on your `error.tsx`. Next.js requires error boundaries to be Client Components because they need to handle the `reset()` function call (which re-renders the route to try again).

export default function ArticleError({
error,
reset,
}: {
error: Error;
reset: () => void;
}) {
return (

<div>
<h2>Something went wrong loading this article</h2>
<p>{error.message}</p>
<button onClick={reset}>Try again</button>
</div>
);
}

```

### `not-found.tsx` — 404 Page

When a user visits a URL that does not correspond to real data (e.g. `/blog/99999` for a deleted article), you should show a proper "Not Found" page rather than crashing or showing an empty state. The `notFound()` function triggers your `not-found.tsx` file.

> 🟢 **Beginner tip:** Always call `notFound()` when a database query returns `null` or `undefined` for a dynamic route. This is far better UX than showing a blank or broken page.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Page not found</p>
    </div>
  );
}
```

Trigger it from a Server Component:

```ts
import { notFound } from 'next/navigation';
if (!article) notFound(); // renders not-found.tsx
```

### `forbidden.tsx` & `unauthorized.tsx` (Next.js 15+)

```ts
import { forbidden, unauthorized } from 'next/navigation';

if (!user) unauthorized(); // renders unauthorized.tsx (401)
if (!canEdit) forbidden(); // renders forbidden.tsx (403)
```

Enable in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  experimental: { authInterrupts: true },
};
```

### `unstable_rethrow`

> 🟢 **Beginner note:** This is a subtle but important gotcha. Functions like `redirect()` and `notFound()` work by **throwing a special error** internally. If you wrap your code in a `try/catch`, your `catch` block intercepts that internal error before Next.js can see it — and nothing happens. `unstable_rethrow` fixes this by re-throwing any Next.js-internal errors while letting you handle your own errors normally.

Some Next.js internal errors (like `redirect()`, `notFound()`) throw special exceptions. Use `unstable_rethrow` in try/catch blocks so Next.js can handle them correctly:

```ts
import { unstable_rethrow } from 'next/navigation';

try {
  await doSomething();
} catch (err) {
  unstable_rethrow(err); // re-throws Next.js internal errors
  // handle your own errors here
}
```

---

## 16. Loading UI & Streaming (Suspense)

> 🟢 **Beginner note:** When a Server Component `await`s data, the server has to wait before it can send any HTML to the browser. During that wait, the user stares at a blank screen. **Streaming** solves this by sending HTML to the browser in chunks — the shell of the page arrives immediately, and slower data-dependent parts are "streamed in" as they finish.

> **Analogy:** Instead of waiting for an entire restaurant order to be cooked before bringing anything out, the waiter brings your drinks immediately, then your starter, then the main course as each one finishes. You always have something in front of you.

### `loading.tsx` — Instant Loading Skeletons

Create a `loading.tsx` file in any route folder and Next.js automatically wraps that route in a `<Suspense>` boundary. The `loading.tsx` content is shown **immediately** while the page's async Server Component fetches its data in the background.
return (

<div className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
{Array.from({ length: 3 }).map((\_, i) => (
<div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
))}
</div>
);
}

````

Next.js wraps the page in a `<Suspense>` boundary automatically. While the async Server Component is rendering, `loading.tsx` is shown instantly.

### Manual Suspense Boundaries

For fine-grained streaming within a single page, you can wrap individual slower components in `<Suspense>` with their own fallback. This means fast parts of the page appear immediately while slow parts stream in later.

> 🟢 **Beginner tip:** Without `<Suspense>`, the entire page waits for the slowest data fetch. With `<Suspense>`, the page structure arrives immediately and each section pops in as its data becomes ready. This dramatically improves **perceived performance** — the page feels fast even if some data takes time.

```tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats /> {/* Slow: streams in separately */}
      </Suspense>
      <Suspense fallback={<ArticlesSkeleton />}>
        <RecentArticles />
      </Suspense>
    </div>
  );
}
````

### `after()` — Work After Response

Sometimes you want to do extra work (logging, analytics, sending emails) after a Server Action or Route Handler finishes — but you do not want that work to slow down the response to the user. `after()` schedules a function to run **after the response has been sent**.

> 🟢 **Beginner analogy:** It is like asking a waiter to tell the chef "the customer loved the food" — but only _after_ the customer has already left the restaurant. The customer is not kept waiting for that feedback loop.

```ts
import { after } from 'next/server';

export async function updateArticle(id: string, data) {
  'use server';
  await db.update(articles).set(data).where(eq(articles.id, +id));
  after(() => logAnalytics('article_updated', { id })); // non-blocking
}
```

---

## 17. Metadata & SEO

> 🟢 **Beginner note:** "Metadata" is information about your page that lives in the HTML `<head>` tag — things like the page title, description, and social media preview images. Users do not see it directly, but:
>
> - **Search engines** (Google) use it to index and rank your pages.
> - **Social media platforms** (Twitter, LinkedIn) use it to generate preview cards when someone shares a link.
> - **Browsers** use it for the tab title.
>
> In plain HTML this would be `<title>`, `<meta name="description">`, `<meta property="og:image">`, etc. Next.js lets you define all of this in TypeScript with full autocomplete, and it handles the HTML generation for you.

### Static Metadata

Export a `metadata` constant from any `layout.tsx` or `page.tsx`. It applies to that route and all its children (unless overridden).

export const metadata: Metadata = {
title: 'Goptant Blog',
description: 'Articles and tutorials',
openGraph: {
title: 'Goptant Blog',
images: ['/og-image.png'],
},
};

```

### Dynamic Metadata with `generateMetadata`

For dynamic routes where the metadata depends on the page's data (e.g. the title of a specific blog post), export a `generateMetadata` async function. It runs on the server before rendering and can fetch data just like the page itself.

> 🟢 **Beginner tip:** Next.js is smart enough to **deduplicate** data fetches. If both `generateMetadata` and your `page.tsx` call `getArticleById(id)`, the database query only runs once — the result is memoized and shared between them.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(+id);

  return {
    title: article?.title ?? 'Article Not Found',
    description: article?.content.slice(0, 160),
    openGraph: {
      images: article?.imageUrl ? [article.imageUrl] : [],
    },
  };
}
```

### Metadata Files

Place these files in `app/` or any route folder for automatic metadata:

| File                       | Purpose                     |
| -------------------------- | --------------------------- |
| `icon.png` / `favicon.ico` | Browser tab icon            |
| `opengraph-image.png`      | OG image for social sharing |
| `twitter-image.png`        | Twitter card image          |
| `robots.txt`               | Search engine crawl rules   |
| `sitemap.xml`              | Site map for SEO            |
| `manifest.json`            | PWA manifest                |

### Dynamic OG Images with `ImageResponse`

```tsx
// app/blog/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default async function OGImage({ params }: { params: { id: string } }) {
  const article = await getArticleById(+params.id);
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        background: '#000',
        color: '#fff',
        padding: 40,
      }}
    >
      <h1>{article?.title}</h1>
    </div>,
    { width: 1200, height: 630 },
  );
}
```

---

## 18. Image Optimization

> 🟢 **Beginner note:** A common mistake when building websites is using a plain HTML `<img>` tag for all images. This causes problems:
>
> - Large images slow down page load.
> - Images with no explicit size cause **layout shift** (the page "jumps" as images load).
> - Modern browsers support faster formats (WebP, AVIF) that old `<img>` tags don't use automatically.
>
> Next.js's `<Image>` component solves all of these automatically. **Always use `<Image>` from `next/image` instead of `<img>` in a Next.js project.**

Next.js `<Image>` automatically:

- Resizes images to the correct size for each device (no giant 4K images on a mobile screen).
- Converts to modern formats (WebP, AVIF) for smaller file sizes automatically.
- Lazy-loads images below the fold (only loads images when they are about to scroll into view).
- **Prevents Cumulative Layout Shift (CLS)** by reserving the exact space the image will occupy — the page never "jumps".

```tsx
import Image from "next/image";

// Local image (size inferred automatically)
import articleBanner from "@/public/banner.jpg";
<Image src={articleBanner} alt="Banner" />

// Remote image
<Image
  src={article.imageUrl}
  alt={article.title}
  width={800}
  height={400}
  priority          // LCP image: preloaded, not lazy
  className="rounded-lg"
/>
```

### Configuring Remote Images

> ⚠️ **Common beginner error:** Using a remote URL in `<Image>` and getting the error "hostname is not configured under images in your next.config.js". Next.js requires you to explicitly whitelist remote image domains for security. Add your image host to `remotePatterns`:

      { protocol: 'https', hostname: 'your-storage.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],

},
};

````

---

## 19. Font Optimization

> 🟢 **Beginner note:** When browsers download fonts from Google Fonts at runtime, users experience a "Flash of Unstyled Text" (FOUT) — the text appears in a fallback font first, then jumps to the custom font when it loads. This is jarring.
>
> `next/font` eliminates this by **downloading the font files at build time** and self-hosting them alongside your app. No Google Fonts request at runtime = no FOUT, no privacy concerns, and the font loads from your own fast CDN.

`next/font` downloads fonts at build time, self-hosts them, and eliminates layout shift with zero network requests to Google at runtime.

```tsx
// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",   // CSS variable
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Apply CSS variable to body
<body className={`${geistSans.variable} ${geistMono.variable}`}>
````

```css
/* globals.css */
body {
  font-family: var(--font-geist-sans);
}
code {
  font-family: var(--font-geist-mono);
}
```

---

## 20. CSS & Styling

> 🟢 **Beginner note:** Next.js supports several styling approaches and you can mix them in the same project. The most common choice for new projects is **Tailwind CSS**, which is what this project uses.

### Global CSS

Import once in `app/layout.tsx` — this CSS applies to the entire application:

```tsx
import './globals.css';
```

### Tailwind CSS

Tailwind is a **utility-first** CSS framework. Instead of writing CSS in separate files, you add small pre-defined class names directly to your JSX. Each class does one specific thing (`text-red-500` makes text red, `font-bold` makes it bold, `mt-4` adds margin-top).

> 🟢 **Beginner tip:** Tailwind's classes follow a consistent naming pattern. `p-4` = padding 4 units, `px-4` = padding on x-axis, `py-4` = padding on y-axis, `pt-4` = padding top only. Once you learn the pattern, you can guess most class names.

Already configured with `postcss.config.mjs`. Used throughout this project:

```tsx
<div className="max-w-2xl mx-auto mt-10 flex flex-col gap-6 px-4">
```

### CSS Modules

CSS Modules scope CSS to a single component, preventing class name conflicts. The filename must end in `.module.css`.

> 🟢 **When to use CSS Modules vs Tailwind:** Use Tailwind for most styling. Use CSS Modules when you have complex, component-specific styles that would be too verbose in Tailwind utility classes.

// app/blog/page.tsx
import styles from "./page.module.css";

<div className={styles.container}>
```

### `cn()` Utility (clsx + tailwind-merge)

When using Tailwind, you often need to conditionally apply classes or merge classes from different sources (e.g. a `className` prop passed by a parent). This is where the `cn()` helper shines.

> 🟢 **Beginner explanation:**
>
> - **`clsx`** lets you write conditional classes: `clsx("base", isActive && "active", isError && "error")`
> - **`tailwind-merge`** resolves Tailwind conflicts: if you have both `p-2` and `p-4`, it keeps only `p-4` instead of both (which would cause unexpected behaviour).
> - **`cn()`** combines both.

This project uses a `cn` utility in `src/lib/utils.ts` to conditionally merge Tailwind classes:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
<button className={cn("px-4 py-2 rounded", isActive && "bg-blue-500", className)}>
```

---

## 21. Middleware

> 🟢 **Beginner note:** Middleware is code that runs **before every request reaches your page or API route**. It runs at the "Edge" — meaning as close to the user as possible, even before the actual server handles the request. This makes it incredibly fast for things like:
>
> - Checking if a user is logged in and redirecting them to the login page
> - Redirecting old URLs to new ones
> - Adding custom HTTP headers
> - A/B testing (showing different versions of a page to different users)
>
> **Important:** Middleware runs on _every_ matching request, so keep it fast and lightweight. Do not put heavy database queries in middleware.

Middleware runs **at the Edge** before every request, making it ideal for auth guards, redirects, A/B testing, and i18n.

```ts
// middleware.ts  (project root, next to package.json)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isProtected = request.nextUrl.pathname.startsWith('/blog/edit');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/handler/sign-in', request.url));
  }
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/blog/edit/:path*', '/dashboard/:path*'],
};
```

### Middleware with Stack Auth

Stack Auth ships its own middleware helper:

```ts
// middleware.ts
import { stackServerApp } from '@/stack/server';

export const middleware = stackServerApp.middleware;
export const config = { matcher: ['/((?!_next|static|favicon.ico).*)'] };
```

---

## 22. Environment Variables

> 🟢 **Beginner note:** An "environment variable" is a piece of configuration that lives **outside your code** — in a file (`.env`) or in your hosting platform's settings panel. Common examples: database connection strings, API keys, secret tokens.
>
> Why outside your code? Because:
>
> 1. **Security** — you should never commit secrets like database passwords or API keys to Git (where they could be seen publicly).
> 2. **Flexibility** — your development database URL and production database URL are different. Environment variables let you switch without changing code.
>
> **Rule of thumb:** Any value that would change between environments (dev/staging/production), or any value that is secret, should be an environment variable.

### `.env` Files

Next.js automatically loads environment variable files. They are read in this priority order (higher overwrites lower):

```
.env                  # Loaded in ALL environments — base defaults
.env.local            # Overrides for local dev (ALWAYS git-ignored — put secrets here)
.env.development      # Development-only overrides
.env.production       # Production-only overrides
```

> ⚠️ **Critical beginner mistake:** Adding `.env.local` to your Git repository. This exposes your database passwords, API keys, and other secrets to anyone who can see your code. Always verify that `.env.local` is listed in your `.gitignore` file (`create-next-app` adds it automatically).

### Server vs Client Variables

> 🟢 **Critical rule:** Any environment variable accessed in a Client Component is **bundled into your JavaScript and sent to every user's browser**. Never put secrets in a variable that does not start with `NEXT_PUBLIC_`.
>
> - Variables **without** `NEXT_PUBLIC_` prefix → server-only (database URLs, API secret keys, etc.)
> - Variables **with** `NEXT_PUBLIC_` prefix → visible to the browser (safe for public IDs, publishable keys)

# Server-only (never sent to the browser)

DATABASE_URL=postgresql://...
STACK_SECRET_SERVER_KEY=...

# Exposed to the browser (prefix NEXT*PUBLIC*)

NEXT*PUBLIC_STACK_PROJECT_ID=abc123
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pk*...

````

```ts
// Server Component or Server Action — all env vars available
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Client Component — only NEXT_PUBLIC_* available
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
````

---

## 23. Authentication Patterns

> 🟢 **Beginner note:** "Authentication" means verifying **who** a user is (login/logout). "Authorization" means verifying **what** they are allowed to do (can this user edit this article?). These are two separate concerns.
>
> Next.js does not have built-in authentication — you integrate an auth provider. This project uses **Stack Auth**, which handles sign-up, sign-in, session management, and provides helpers for both Server Components and Client Components.
>
> Other popular auth options for Next.js:
>
> - [NextAuth.js / Auth.js](https://authjs.dev) — open-source, many providers
> - [Clerk](https://clerk.com) — hosted, easy to set up
> - [Supabase Auth](https://supabase.com/auth) — if you use Supabase for your database

This project uses **Stack Auth** for authentication. Here is how the App Router integrates with it.

### Server-side Auth Check

In a Server Component, you can check if a user is logged in by calling `stackServerApp.getUser()`. This reads the session from the HTTP cookie — no client-side JavaScript needed.

> 🟢 **Beginner tip:** Always do auth checks in **Server Components or Server Actions** when possible. The user's session token lives in a cookie that the server can read. Doing auth on the server is safer and faster than doing it on the client.
> export const stackServerApp = new StackServerApp({
> tokenStore: 'nextjs-cookie',
> });

````

```tsx
// Server Component — get current user server-side
const user = await stackServerApp.getUser();
if (!user) redirect('/handler/sign-in');
````

### Client-side Auth

```tsx
// src/stack/client.tsx
'use client';
import { StackClientApp } from '@stackframe/stack';
export const stackClientApp = new StackClientApp({
  tokenStore: 'cookie',
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
});
```

```tsx
// Provider in root layout
<StackProvider app={stackClientApp}>
  <StackTheme>{children}</StackTheme>
</StackProvider>
```

### Protecting Routes with Authorization

```ts
// src/db/authz.ts — checks article ownership
export async function authorizeUserToEditArticle(
  userId: string,
  articleId: number,
) {
  const [article] = await db
    .select({ authorId: articles.authorId })
    .from(articles)
    .where(eq(articles.id, articleId));
  return article?.authorId === userId;
}
```

```tsx
// src/app/blog/[id]/page.tsx
const user = await stackServerApp.getUser();
const canEdit = user ? await authorizeUserToEditArticle(user.id, +id) : false;
```

### User Sync Pattern

When using a third-party auth provider (like Stack Auth), the auth provider stores user information in their own system. If your app's database also needs to store user-related data (e.g. articles with an `authorId`), you need to **sync users** into your own database the first time they sign in.

> 🟢 **Beginner explanation:** Think of it like a new employee joining a company (Stack Auth creates the account), but you also need to add them to the office directory / employee database (your `usersSync` table). The `ensureUserExists` function checks if they are already in your directory; if not, it adds them.

```ts
// src/db/sync-user.ts
export async function ensureUserExists(user: StackUser) {
  await db
    .insert(usersSync)
    .values({ id: user.id, name: user.displayName, email: user.primaryEmail })
    .onConflictDoNothing();
}
```

---

## 24. Deploying Next.js

> 🟢 **Beginner note:** "Deploying" means taking your app from your local machine and putting it on a server so the whole world can access it. Next.js apps can be deployed in several ways depending on your needs and budget.

### Vercel (recommended for beginners)

Vercel is the company that created Next.js, so their platform has the deepest integration. It is the **easiest and fastest way to deploy a Next.js app**, especially for beginners.

Steps:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and connect your GitHub account
3. Import your repository — Vercel auto-detects Next.js
4. Add your environment variables in the Vercel dashboard
5. Deploy — your site is live at `https://your-project.vercel.app`

Every `git push` triggers an automatic deployment. Pull requests get their own preview URLs.

```bash
# Or deploy directly from the terminal:
npx vercel
```

Vercel auto-configures:

- Edge Functions for Middleware
- Serverless Functions for Route Handlers and Server Actions
- CDN for static assets
- ISR with automatic purging

### Self-Hosting with Node.js

If you prefer to manage your own server (e.g. on a VPS like DigitalOcean, AWS EC2, or a Linux machine), you can run Next.js as a standard Node.js server.

```bash
npm run build   # builds the production-optimised app
npm start       # starts the Node.js server on port 3000
```

> 🟢 **Beginner tip:** You still need to set your environment variables on the server. On Linux, you can use a `.env.production` file or set them as system environment variables with `export KEY=value`.

### Docker

Docker packages your app and all its dependencies into a portable container that can run identically on any machine or cloud provider. The multi-stage Dockerfile below produces a minimal image using Next.js's `standalone` output mode.

> 🟢 **Beginner explanation of the two-stage build:**
>
> - **Stage 1 (`builder`):** Installs all dependencies (including dev tools) and compiles the app.
> - **Stage 2 (`runner`):** Copies only the compiled output — no dev dependencies, no source code, no test files. This results in a much smaller final image that is faster to deploy and more secure.
>   WORKDIR /app
>   COPY package\*.json ./
>   RUN npm ci
>   COPY . .
>   RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

````

Enable `output: "standalone"` in `next.config.ts` for minimal Docker images:

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
};
````

### Static Export

For apps that have **no server-side logic at all** (no Server Actions, no Route Handlers, no dynamic SSR), you can export the entire app as plain HTML/CSS/JS files. These can be hosted anywhere — GitHub Pages, S3, Netlify, Cloudflare Pages — for free.

> ⚠️ **Limitation:** Static export cannot use Server Actions, Route Handlers, cookies, headers, or any server-side features. It is only suitable for fully static content (like a marketing site or documentation).

```ts
const nextConfig: NextConfig = {
  output: 'export',
};
```

---

## 25. Next.js 16 New Features

> 🟢 **Beginner note:** This section covers what is new in Next.js 16 specifically. If you are learning Next.js for the first time, understanding the core concepts (sections 1–24) matters more than the version-specific additions. Come back here once you are comfortable with the basics.

Next.js 16 (v16.1.6 at time of writing) ships these major additions on top of v15:

### Turbopack Stable

Turbopack is the new bundler that replaces Webpack in Next.js. It is written in Rust (a very fast systems programming language) instead of JavaScript, which is why it is dramatically faster.

> 🟢 **Beginner note:** As a beginner you do not need to configure Turbopack — it is the default. You will notice it most during development: the dev server starts faster and file changes appear in the browser almost instantly.

Turbopack is now **fully stable** and the default bundler for both `next dev` and `next build`. It delivers:

- Up to **76% faster** local server startup.
- Up to **96% faster** code updates (HMR).
- Filesystem cache persisted across restarts (`turbopackFileSystemCacheForDev`).

Enable the FS cache (used in this project):

```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};
```

### `use cache` Directive — Stable

The `"use cache"` directive (experimental in v15) is **stable in v16**. Cache granularity at the function, component, or page level replaces the confusing cascade of `cache: "force-cache"` / `revalidate` options.

```tsx
async function getArticle(id: number) {
  'use cache';
  cacheLife('hours');
  cacheTag(`article-${id}`);
  return db.select().from(articles).where(eq(articles.id, id));
}
```

### React 19 — Stable

The App Router now runs on **React 19 stable**. React 19 adds several new hooks and patterns that make common patterns simpler. Key additions:

> 🟢 **Beginner explanations of React 19 hooks:**
>
> - **`useOptimistic()`** — Update the UI immediately _before_ a Server Action confirms success. For example, clicking a "Like" button instantly shows +1 even before the database is updated. If the server call fails, the UI reverts. This makes apps feel instant.
> - **`useFormStatus()`** — A hook for form input/button components that tells them whether a parent form is currently submitting. Use it to disable a submit button while a Server Action is in progress, preventing double-submissions.
> - **`useActionState()`** — Manages the state/result of a Server Action in a Client Component. Gives you the action's return value, a pending state, and a dispatch function — all in one hook.
> - **`ref` as a prop** — You no longer need `React.forwardRef` to pass a `ref` to a custom component. Just accept `ref` as a regular prop.

- `use()` hook for reading promises and context.
- `useOptimistic()` for optimistic UI updates.
- `useFormStatus()` for pending states in forms.
- `useActionState()` (formerly `useFormState`) for Server Action responses.
- `ref` as a prop (no more `forwardRef`).

```tsx
'use client';
import { useOptimistic, useActionState } from 'react';

function LikeButton({ articleId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, _newLike) => state + 1,
  );

  return (
    <form
      action={async () => {
        addOptimisticLike(null); // update UI instantly
        await likeArticle(articleId); // server action
      }}
    >
      <button type="submit">❤️ {optimisticLikes}</button>
    </form>
  );
}
```

### `forbidden()` / `unauthorized()` — Stable

Auth-related redirect helpers are stable and produce 403/401 HTTP responses with custom UI:

> 🟢 **Beginner note:** There's an important difference between _redirecting_ and _returning an error status_. A redirect sends the browser to a new URL (HTTP 302). `forbidden()` and `unauthorized()` instead return proper **HTTP 403** and **HTTP 401** status codes respectively. This matters because:
>
> - Search engine crawlers won't index protected pages (they see 403, not a public redirect page)
> - API clients get the correct status code, not a redirect to a login page
> - Browsers and security tools understand the semantics correctly
>
> To use these, you must enable `authInterrupts: true` in your `next.config.ts`. You can then create `forbidden.tsx` and `unauthorized.tsx` special files (similar to `not-found.tsx`) to customize what the user sees.

```ts
import { forbidden, unauthorized } from 'next/navigation';
```

### `useLinkStatus` Hook

Know when a `<Link>`-driven navigation is in flight — useful for loading indicators:

> 🟢 **Beginner note:** Before this hook, if you wanted to show a spinner _inside a navigation link itself_ while the destination page was loading, you had to manage complex external state. `useLinkStatus()` gives you a `pending` boolean that is `true` while Next.js is fetching the next page after a `<Link>` click. This lets you add a small loading indicator directly inside your nav item — no extra `useState` or context needed.

```tsx
'use client';
import { useLinkStatus } from 'next/link';

function NavLink({ href, children }) {
  const { pending } = useLinkStatus();
  return <Link href={href}>{pending ? <Spinner /> : children}</Link>;
}
```

### `viewTransition` Support

Enable browser-native View Transitions API for smooth page transitions:

> 🟢 **Beginner note:** Normally, Next.js navigations are instant — the old page disappears and the new page appears with no animation. The **View Transitions API** is a browser-native feature that lets you add smooth crossfades, slides, or custom animations between page states with minimal code.
>
> Think of it like the transition effect in a PowerPoint presentation — instead of a hard cut between slides, you get a smooth visual change.
>
> ⚠️ This is still `experimental`. It works in modern Chromium-based browsers (Chrome, Edge) but may not work in Safari or Firefox yet. Use with caution in production and always test across browsers.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: { viewTransition: true },
};
```

```tsx
import { unstable_ViewTransition as ViewTransition } from 'react';

<ViewTransition>
  <ArticleCard />
</ViewTransition>;
```

### `proxy.js` File Convention

A new `proxy.js` file convention allows you to proxy requests to other services without writing a full Route Handler:

> 🟢 **Beginner note:** A "proxy" here means your Next.js server acts as a middleman between your frontend and an external API. Instead of calling `https://external-api.example.com` directly from the browser (which can cause **CORS errors** because the external API may not allow browser requests from your domain), you forward the request through your own server.
>
> **Why use a proxy?**
>
> - Avoids CORS issues — the request comes from your server, not the browser
> - Hides third-party API keys from the client
> - Lets you add authentication or rate limiting in one place
>
> This is sometimes called a **BFF (Backend for Frontend)** pattern. Before `proxy.js`, you had to write a full Route Handler (`route.ts`) to manually forward every request. Now it's just a config export.

```ts
// app/api/external/proxy.ts
export { default } from 'next/proxy';
export const config = { target: 'https://external-api.example.com' };
```

---

## Quick Reference: Component Decision Tree

```
Does the component need:
  ├── useState / useEffect / browser events?  →  "use client"
  ├── Access to cookies / headers?            →  Server Component (or middleware)
  ├── Direct DB access / secrets?             →  Server Component
  ├── Third-party library with side effects?  →  "use client"
  └── Only rendering / layout?                →  Server Component (default, no directive)
```

## Quick Reference: Data Strategy

```
Do you need to:
  ├── Read data in a page?            →  async Server Component + direct DB query
  ├── Mutate data from a button?      →  Server Action ("use server")
  ├── Build a public API endpoint?    →  Route Handler (route.ts)
  ├── Infinite scroll / client fetch? →  fetch() to a Route Handler
  └── Cache & revalidate data?        →  "use cache" + cacheTag + revalidateTag
```

---

## References

- [Next.js Official Docs](https://nextjs.org/docs) — v16.1.6
- [App Router Getting Started](https://nextjs.org/docs/app/getting-started)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Stack Auth Docs](https://docs.stack-auth.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Turbopack Docs](https://nextjs.org/docs/app/api-reference/turbopack)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
