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

## Every UI Repo

These recur often enough that they should be treated as the default UI baseline:

- `motion`
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

If the repo exports shared UI, also include:

- `storybook`
- `@storybook/react-vite`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `playwright`

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

## App Data Layer

These are the recurring defaults for richer app repos:

- `@tanstack/react-query`
- `zustand`
- `drizzle-orm`
- `drizzle-kit`
- `@neondatabase/serverless`
- `dotenv`
- `dotenv-cli`

Use them when the project needs that capability. Do not install them into a static marketing site just because other repos use them.

## AI and Automation Repos

These recur in the AI-heavy repos:

- `ai`
- `@openrouter/ai-sdk-provider`
- `zod`
- `tsx`

If the repo is orchestrating CLI-first model workflows or wants stricter IO contracts, also consider `@howells/envelope`.

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
pnpm add next react react-dom tailwindcss @tailwindcss/postcss motion lucide-react zod clsx tailwind-merge sonner next-themes date-fns usehooks-ts
```

### Add stacked sheets to a UI repo

```bash
pnpm add @howells/stacksheet
```

## Packages That Are Recurring Enough To Standardize

These are the strongest repeated dependencies from the scan of active repos:

- `motion`
- `lucide-react`
- `zod`
- `clsx`
- `tailwind-merge`
- `sonner`
- `@tanstack/react-query`
- `next-themes`
- `date-fns`
- `usehooks-ts`

That does not mean every repo needs all of them. It means they should be your default shortlist, not re-litigated from zero each time.
