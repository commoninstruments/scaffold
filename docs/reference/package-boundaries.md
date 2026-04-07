# Package Boundaries

These are the package boundaries that keep recurring across your serious monorepos.

The goal is not maximal modularity. The goal is to stop app code from swallowing shared infrastructure and then becoming impossible to reuse or reason about.

## Default Boundaries for a Full-Stack App

For a real product app, this is the clean default:

```text
apps/
  web/
packages/
  db/
  trpc/
  ui/
  env/
  motion/
```

Add more only when the product clearly needs them.

## `packages/db`

Put these here:

- Drizzle schema
- Drizzle client
- migrations
- db helpers
- database-specific query utilities

Do not scatter raw DB access across multiple app folders.

## `packages/trpc`

Put these here:

- router definitions
- procedure helpers
- shared API types
- React Query integration helpers for `tRPC`

If the repo uses `tRPC`, this package should be the boundary between app UI and server procedures.

## `packages/ui`

Put these here:

- reusable primitives
- reusable compositions
- shared hooks tied to UI behavior
- shared styles and UI utilities

Do not put page-specific product UI here just because it uses shared components.

## `packages/env`

Put these here:

- env schema
- server/client env parsing
- typed env exports

Do not read `process.env` throughout the codebase.

## `packages/motion`

Put these here:

- durations
- easings
- springs
- motion presets

This boundary now recurs enough that it should be deliberate, not accidental.

## Add These Only When Needed

### `packages/auth`

Use when:

- auth logic is non-trivial
- multiple apps or packages depend on auth behavior

Do not extract this too early in a small repo.

### `packages/upload` or `packages/storage`

Use when:

- the repo has serious upload or media behavior
- `stow` integration is not isolated to one small feature

### `packages/ai`

Use when:

- AI models, prompts, adapters, or orchestration logic are shared
- more than one surface depends on the same model logic

### `packages/core`

Use when:

- the repo has substantial shared non-UI business logic

Do not create `core` as a junk drawer.

## What Should Stay in `apps/web`

Keep these app-local:

- routes
- page compositions
- app-specific loaders/actions
- product-specific UI assembly
- local feature folders that are not reused anywhere else

The app should assemble shared infrastructure, not own it.

## What Not to Extract

Do not create packages for:

- one tiny helper
- one feature used once
- speculative future reuse
- vague categories like `shared`, `common`, or `utils` without a real boundary

If a package does not express a real dependency boundary, it is probably cargo-cult modularity.

## Good Signs a Boundary Is Real

- multiple apps depend on it
- changing it should not require editing route files directly
- it has a coherent reason to exist
- it reduces duplication without hiding behavior

## Bad Signs a Boundary Is Fake

- everything imports everything
- package names are generic and meaningless
- moving code into the package did not reduce coupling
- the package exists only because monorepos are fashionable

## Strong Defaults

If you do nothing else right, get these boundaries right first:

1. `db`
2. `trpc`
3. `ui`
4. `env`
5. `motion`

That is where the portfolio already shows a durable pattern.
