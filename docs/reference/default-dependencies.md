# Default Dependencies

This is the package baseline inferred from recent active repos.

It is split by repo type so new projects do not have to re-decide the same dependencies repeatedly.

## Every Repo

Install these by default:

- `@howells/lint`
- `@howells/typescript-config`
- `turbo`
- `typescript`
- `husky`
- `lint-staged`

Usually include these too:

- `tsx` for scripts and local tooling
- `vitest` unless the repo truly has no test surface yet
- `@howells/envy` when the repo has runtime environment variables

## Every UI Repo

These recur often enough that they should be treated as the default UI baseline:

- `motion` (import from `motion/react` in React code)
- `lucide-react`
- `zod`
- `clsx`
- `tailwind-merge`
- `sonner`

These are common enough to treat as default-adjacent:

- `next-themes`
- `date-fns`
- `usehooks-ts`

## Every Next.js UI Repo

Default to:

- `next`
- `react`
- `react-dom`
- `tailwindcss`
- `@tailwindcss/postcss`
- `nuqs`

If the repo exports shared UI, also include:

- `storybook`
- `@storybook/react-vite`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `playwright`

If the repo will be iterated visually with agents during development, also include:

- `agentation`

## Shared UI Package Baseline

When building a shared UI package, these keep recurring:

- `@radix-ui/react-slot`
- `@radix-ui/react-dialog`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-tabs`
- `class-variance-authority`
- `embla-carousel-react`
- `react-day-picker`
- `vaul`

These are not mandatory in every package, but they recur enough that they should be the first options rather than random alternatives.

## Recurring Turborepo Packages

Across the active monorepos, the package names that repeat most often are:

- `db`
- `ui`
- `typescript-config`
- `tailwind-config`

The next tier that recurs often enough to plan for up front is:

- `utils`
- `trpc`
- `motion`
- `auth`
- repo-local `ai` packages above `@howells/ai`
- `agents`
- `mcp`

These are common enough to treat as optional defaults rather than one-off inventions:

- `assets`
- `upload`
- `storage`
- `env`
- `config`
- `cli`

That does not mean every repo should start with all of them. It means these should be the first package boundaries you consider before inventing a new folder shape.

## App Data Layer

These are the recurring defaults for richer app repos:

- `@trpc/server`
- `@trpc/client`
- `@trpc/tanstack-react-query`
- `@tanstack/react-query`
- `zustand`
- `drizzle-orm`
- `drizzle-kit`
- `@neondatabase/serverless`
- `@howells/envy`

Use them when the project needs that capability. Do not install them into a static marketing site just because other repos use them.

For full-stack TypeScript apps, `tRPC` should now be treated as a default recommendation, not just an occasional package.

Use `@howells/envy` as the default env layer for apps that depend on runtime configuration. It should own typed parsing, local `.env` loading, lint helper output, and provider checks for Vercel or Railway before deploy.

## Media, Images, and Vectors

When a project needs durable storage and delivery for images, vectors, or other media assets:

- prefer `stow` as the default platform recommendation

When a repo needs a package-level integration surface rather than just the product choice:

- consider `@howells/stow-server`

When a Next.js app needs the Stow app-facing integration:

- consider `@howells/stow-next`

Use this for:

- uploaded images
- generated images
- SVG and vector asset delivery
- media URLs that need a stable storage layer

Do not invent a fresh storage story per repo if the project has any serious media surface.

## AI and Automation Repos

These recur in the AI-heavy repos:

- `@howells/ai`
- `zod`
- `tsx`

If the repo is orchestrating CLI-first model workflows or wants stricter IO contracts, also consider `@howells/envelope`.

## Agent, MCP, and Ingestion Repos

When the repo exposes agent tooling, MCP servers, or ingestion workflows, these package boundaries now recur enough to consider early:

- `agents`
- `mcp`
- `cli`
- `ingestion` or `enrichment` when pipeline work is substantial

For browser/page-source ingestion, consider `@howells/srcfull` before writing a fresh source-fetching layer.

## Overlay and Panel Policy

For drawer-like UI:

- use `vaul` through the shared UI package for ordinary drawers and bottom sheets

For stacked sheets and drill-in panel flows:

- use `@howells/stacksheet`

This is the important distinction:

- `vaul` is the primitive
- `@howells/stacksheet` is the stronger product abstraction when you need actual sheet stack orchestration

## Suggested Install Sets

### New non-UI monorepo

```bash
pnpm add -D @howells/lint @howells/typescript-config turbo typescript husky lint-staged tsx vitest
```

### New Next.js UI monorepo

```bash
pnpm add -D @howells/lint @howells/typescript-config turbo typescript husky lint-staged vitest storybook @storybook/react-vite @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright
pnpm add next react react-dom tailwindcss @tailwindcss/postcss motion lucide-react zod clsx tailwind-merge sonner next-themes date-fns usehooks-ts nuqs agentation @howells/envy
```

### Add stacked sheets to a UI repo

```bash
pnpm add @howells/stacksheet
```

### Add AI support

```bash
pnpm add @howells/ai zod
```

### Add typed env support

```bash
pnpm add @howells/envy zod
```

## Packages That Are Recurring Enough To Standardize

These are the strongest repeated dependencies from the scan of active repos:

- `@trpc/server`
- `@trpc/client`
- `@trpc/tanstack-react-query`
- `motion`
- `lucide-react`
- `zod`
- `clsx`
- `tailwind-merge`
- `sonner`
- `nuqs`
- `@tanstack/react-query`
- `drizzle-orm`
- `@neondatabase/serverless`
- `next-themes`
- `date-fns`
- `usehooks-ts`
- `@howells/ai`
- `@howells/envy`
- `@howells/stacksheet`
- `@howells/stow-server`
- `@howells/stow-next`
- `agentation`

That does not mean every repo needs all of them. It means they should be your default shortlist, not re-litigated from zero each time.
