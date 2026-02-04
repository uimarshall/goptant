> layout.tsx

The `layout.tsx` file defines a layout that is applied to every page in the application. It contains the HTML structure and wraps the children components that will be rendered on each page.

> What is the main advantage of Tailwind CSS in terms of maintainability compared to traditional CSS?

`Tailwind CSS` improves maintainability by coupling styles directly with components. When you delete a component, you inherently delete all the CSS that comes with it, preventing the accumulation of unmaintainable CSS code. This is achieved through atomic utility classes instead of separate CSS files.

> Why does Shad CN UI install components directly into your codebase rather than importing them from a third-party library?

`ShadCN UI` installs components directly into your codebase so that they are modifiable and trackable. This allows developers to customize the components as needed for their specific use case, rather than being locked into using unmodifiable components from an external library.

> What is the recommended use case for using Radix directly instead of Shad CN UI?

You should use `Radix` directly if you like all of the accessible, well-built components but don't like the default styling that comes with Shad CN UI. This allows you to apply your own custom design system on top of Radix's unstyled components.

`CVA` is a library used with Tailwind CSS that helps manage component variants. It allows you to define different variations of a component (like primary/secondary buttons) and combine them across multiple axes (like size: small/large). This makes it easy to create components with multiple variant options without having to create individual components for each combination.

Using `@apply` is considered an anti-pattern because it creates a hybrid approach where you're writing Tailwind classes in CSS files, which defeats many of Tailwind's benefits. This approach adds cognitive burden by requiring developers to manage styles across multiple contexts, and it can turn Tailwind from a net positive into a net negative by stripping away its maintainability advantages for large codebases.

`Design tokens` are a pattern for defining consistent design values like colors, spacing, fonts, and breakpoints that can be reused throughout an application. Tailwind CSS encourages their use through its theming system, where you define values once in the configuration and they automatically become available as utility classes across the entire framework, making the 'happy path' also the 'right path' for consistent design.

The `recommended approach` is to write Tailwind classes directly in your markup and avoid mixing in traditional CSS as much as possible. While Tailwind can be challenging to work with and debug, maintaining this consistency makes large codebases more maintainable. Mixing approaches by using features like @apply to write CSS files with Tailwind classes increases cognitive burden and reduces the framework's benefits.

`Authentication` is determining who you are or whether you're logged in or not.

`Authorization` is knowing who you are and determining whether you're allowed to access a specific resource or perform a specific action.

## What are the three ways to protect a route in Next.js with authentication systems like Stack Auth?

Client side protection (mainly for user experience convenience), server side protection (actual security enforcement), and middleware (for protecting entire directories or route groups, like an admin section).

## Why is server-side route protection more secure than client-side route protection?

Server-side code never gets shipped to the client bundle, so it cannot be decompiled or inspected by users. Client-side protection code is sent to the browser where users can potentially see all the code, URLs, and endpoints being used, making it only useful for UX but not actual security.

## In Stack Auth, what does the following code accomplish?

It checks if a user is currently logged in (authenticated). If no user is found, it automatically redirects them to the sign-in page. This provides server-side protection for routes that require authentication.

## Why must React server actions be protected with authentication checks even though they execute on the server?

Server actions must be protected because they are essentially API endpoints (RPC - Remote Procedure Call). Anyone who knows the URL can call them by inspecting the network panel to find the endpoint and how it invokes the function. The data is still coming from the frontend to the backend, so they need to be treated with the same level of security as normal API endpoints.

## What directive is used to define a React server action, and what security check should be implemented at the beginning of the function?

The 'use server' directive is used to define a React server action. At the beginning of the function, you should get the current user with `await stackServerApp.getUser()` and throw an unauthorized error if no user exists to ensure only authenticated users can execute the action.

## When creating an update article server action, why should the author ID be pulled from the authenticated user rather than accepted as input from the frontend?

The author ID should be pulled from the authenticated user object (user.ID) rather than from frontend input because you should not trust the frontend with this information. This ensures that users can only modify articles with their own valid author ID, preventing unauthorized modifications.

## In the CreateArticleInput type, what are the required properties and their types?

The CreateArticleInput type includes: title (string), content (string), authorId (string), and imageUrl (optional string, denoted with a question mark). All properties are required except imageUrl which may or may not be provided.

## What additional authorization check should be performed in update and delete server actions beyond verifying that a user is logged in?

Beyond verifying that a user is logged in, update and delete actions should verify that the user is authorized to perform the specific operation on that particular resource. Just because someone is authenticated doesn't mean they can edit or delete any article - they should only be able to modify articles they have permission to access.

## What type of API mechanism do React server actions implement under the hood?

RPC - Remote Procedure Call
