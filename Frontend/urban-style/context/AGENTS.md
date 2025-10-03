
# Project Rules

This document outlines the detected rules, conventions, and patterns of the UrbanStyle project.

## Project Structure & Technologies

- **Frameworks**: The project is built with [Astro](https://astro.build/), which allows for server-rendered components and also integrates with [React](https://react.dev/) for client-side interactivity.
- **Language**: [TypeScript](https://www.typescriptlang.org/) is used across the project, with strict type checking enabled.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) is used for styling, with a global stylesheet located at `src/styles/global.css`.
- **API**: The project communicates with a backend API, as seen in the `astro.config.mjs` proxy configuration.
- **State Management**: [Nanostores](https://github.com/nanostores/nanostores) is used for state management.
- **Linting**: [ESLint](https://eslint.org/) is configured to enforce code quality, with specific rules for Astro.
- **Formatting**: [Prettier](https://prettier.io/) is used for code formatting, with a defined configuration in `.prettierrc`.

## Code Conventions & Patterns

- **Component-Based Architecture**: The project is structured around components, with a clear separation of concerns between UI components, layouts, and pages.
- **Adapters**: Adapters are used to transform data from the API into a format that the application can use. You can find them in the `src/adapter` directory.
- **Services**: Services are used to encapsulate business logic and interact with the API. You can find them in the `src/service` directory.
- **State Management**: State is managed using Nanostores, with dedicated stores for different parts of the application. You can find them in the `src/state` directory.
- **Interfaces**: TypeScript interfaces are used to define the shape of data structures. You can find them in the `src/interface` directory.
- **Routing**: Astro's file-based routing is used to define the application's pages. You can find them in the `src/pages` directory.
- **Error Handling**: The project has a custom exception for handling API responses. You can find it in the `src/exceptions` directory.

## Code Style

### Formatting

The `.prettierrc` file defines the following formatting rules:

- `printWidth`: 100
- `semi`: false
- `singleQuote`: true
- `trailingComma`: "all"
- `useTabs`: true
- `tabWidth`: 2

### Linting

The `eslint.config.js` file defines the following linting rules:

- `comma-dangle`: ["error", "always-multiline"]
