> layout.tsx

The `layout.tsx` file defines a layout that is applied to every page in the application. It contains the HTML structure and wraps the children components that will be rendered on each page.

> What is the main advantage of Tailwind CSS in terms of maintainability compared to traditional CSS?

`Tailwind CSS` improves maintainability by coupling styles directly with components. When you delete a component, you inherently delete all the CSS that comes with it, preventing the accumulation of unmaintainable CSS code. This is achieved through atomic utility classes instead of separate CSS files.

> Why does Shad CN UI install components directly into your codebase rather than importing them from a third-party library?

`ShadCN UI` installs components directly into your codebase so that they are modifiable and trackable. This allows developers to customize the components as needed for their specific use case, rather than being locked into using unmodifiable components from an external library.

> What is the recommended use case for using Radix directly instead of Shad CN UI?

You should use `Radix` directly if you like all of the accessible, well-built components but don't like the default styling that comes with Shad CN UI. This allows you to apply your own custom design system on top of Radix's unstyled components.
