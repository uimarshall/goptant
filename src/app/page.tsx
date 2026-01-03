// import Image from "next/image";

import { BlogCard } from "@/components/BlogCard";

export default function Home() {
  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        <BlogCard
          title="Complete Intro to React"
          author="Marshall Akpan"
          date="Sep 2025"
          summary="Learn React from the ground up with Brian Holt. Covers components, hooks, state, effects, and building modern UIs. Perfect for beginners and those wanting a solid foundation."
          href="/blog/1"
        />
        <BlogCard
          title="Rust for TypeScript Developers"
          author="Caleb Marshall"
          date="Sep 2025"
          summary="ThePrimeagen teaches Rust to JavaScript/TypeScript devs. Dive into Rust's memory safety, ownership, and concurrency with fun, practical examples."
          href="/blog/2"
        />
        <BlogCard
          title="API Design & Node.js"
          author="Solomon Greyson"
          date="Sep 2025"
          summary="Scott Moss covers building robust APIs with Node.js. Learn REST, authentication, testing, and best practices for scalable backend services."
          href="/blog/3"
        />
        <BlogCard
          title="CSS Grid & Flexbox"
          author="Wayne Champion"
          date="Sep 2025"
          summary="Steve Kinney demystifies CSS Grid and Flexbox. Master layout techniques for responsive, modern web apps with hands-on demos and clear explanations."
          href="/blog/4"
        />
      </main>
    </div>
  );
}
