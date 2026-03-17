## HELPING COPILOT HELP YOU

Prompt Engineering is the practice of giving an AI model specific instructions to produce the results you want.

> Prompt crafting best practices must include the following:

1. Context.
2. Intent.
3. Clarity
4. Specificity.

## Prompt Crafting Best Practices with GitHub Copilot

Here's a detailed breakdown of each element and how it applies when working with Copilot:

---

### 1. 🗂️ Context

Context means giving Copilot enough **background information** to understand _where_ and _why_ the code exists. This involve opening tabs where the file are located. Files are read or rated based on closeness to the current tab opened in your text editor.

**Includes:**

- The tech stack you're using (e.g., _"In a Next.js 14 app using Drizzle ORM and PostgreSQL..."_)
- The file or component purpose (e.g., _"This is a server action that handles article creation..."_)
- Related code that Copilot should be aware of (open relevant files in the editor — Copilot reads them)
- Constraints like auth requirements, DB schemas, or API contracts

**Bad:** `"Write a function to get articles"`
**Good:** `"In this Next.js app using Drizzle ORM with a PostgreSQL database, write a server action to fetch all published articles for the current user, sorted by createdAt descending"`

---

### 2. 🎯 Intent

Intent describes **what you want to achieve** — the goal or outcome, not just the action.

**Includes:**

- The _why_ behind the request
- The expected behavior or end result
- The user story or business logic

**Bad:** `"Write a middleware"`
**Good:** `"I want to protect all /dashboard routes so that only authenticated users can access them — redirect unauthenticated users to /login"`

---

### 3. 💬 Clarity

Clarity means being **unambiguous** — removing any room for misinterpretation.

**Includes:**

- Using precise language (avoid vague words like _"fix it"_, _"make it better"_)
- Specifying inputs and outputs
- Calling out edge cases you care about
- Stating what you **don't** want

**Bad:** `"Make this component better"`
**Good:** `"Refactor the BlogEditor component to extract the tag input into its own TagInput component, keeping the same props interface"`

---

### 4. 🔬 Specificity

Specificity means being **detailed and exact** about requirements, constraints, and format.

**Includes:**

- Naming exact files, functions, types, or variables
- Specifying error handling behavior
- Defining return types, data shapes, or API contracts
- Mentioning performance or accessibility requirements

**Bad:** `"Add error handling"`
**Good:** `"Add try/catch to the `uploadImage`server action in upload.ts, return a typed`{ success: boolean; error?: string }` response, and log errors to the console"`

---

### 💡 Combined Example (All 4 Elements)

> _"[Context] In this Next.js 14 app using Stack Auth for authentication and Drizzle ORM with PostgreSQL, [Intent] I want to create a server action that creates a new blog article, [Clarity] the action should validate that the user is authenticated before inserting, [Specificity] insert into the `articles` table defined in `src/db/schema.ts`, accept `title: string`, `content: string`, and `tags: string[]` as parameters, and return `{ success: boolean; articleId?: string; error?: string }`"_

The more you combine all four elements, the less Copilot has to guess — and the more accurate and production-ready the output will be.
