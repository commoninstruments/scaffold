# Stack Decisions

These are the current default decisions inferred from your most recently active projects and shared config repos.

## Core Versions

Pin these unless there is a deliberate repo-specific reason not to:

| Tool | Baseline |
|------|----------|
| `pnpm` | `10.23.0` |
| `turbo` | `2.9.3` |
| `typescript` | `5.9.3` |
| `husky` | `9.1.7` |
| `lint-staged` | `16.x` |
| `@howells/lint` | `0.1.1` |
| `@howells/typescript-config` | `0.1.0` |
| Node | `>=20.19` for new repos |

## Package Manager

- Use `pnpm`.
- Pin `packageManager` in the root `package.json`.
- Prefer one lockfile at the repo root.
- Default workspace layout is:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Turborepo

Use Turbo as an orchestrator, not as a place to hide complexity.

- Keep `turbo.json` small.
- Keep cache disabled by default.
- Keep `globalDependencies` limited to `.env` files.
- Scope environment variables at the task level, not globally.
- Put package-specific exceptions in leaf packages when needed.

The recent pattern across `patternmode`, `materia`, `sorrel`, `scenes`, and `colorscope` is clear: hidden stale-cache failures cost more than slower local runs.

## TypeScript

Use `@howells/typescript-config` and select the leaf preset explicitly:

- Next.js app: `@howells/typescript-config/nextjs`
- Bundler DOM app: `@howells/typescript-config/bundler-dom-app`
- React library: `@howells/typescript-config/react-library`
- Non-DOM app: `@howells/typescript-config/bundler-no-dom-app`
- Non-DOM package: `@howells/typescript-config/bundler-no-dom-library-monorepo` or `tsc-no-dom-library`

Rules:

- do not reintroduce a vague `base.json`
- keep shared presets thin
- keep local `paths` and `baseUrl` in the consumer repo only

## Linting and Formatting

Use Biome as the single source of truth via `@howells/lint`.

Default preset selection:

- non-React or server repo: `@howells/lint/biome/core`
- React package: `@howells/lint/biome/react`
- Next.js app: `@howells/lint/biome/next`

Rules:

- avoid repo-local lint wrappers unless the repo has a genuinely unique constraint
- prefer inline suppressions over broad config weakening
- keep format and lint behavior consistent across repos

## Husky and Git Hooks

Use Husky for lightweight quality gates.

Default approach:

- `prepare`: `husky`
- `pre-commit`: run `lint-staged`, then repo-wide `lint` and `typecheck`
- `pre-push`: only when the repo needs a heavier gate such as `test` or stricter validation

Across recent repos, the stable baseline is small hooks plus standard root scripts.

## UI Stack

For new UI repos:

- Next.js App Router
- React 19
- Tailwind CSS 4
- Radix primitives
- `motion` for animation
- Storybook for reusable exported components
- `patternmode` as the upstream for shared UI packages

This does not mean every product should look the same. It means structural decisions should be shared while brand and product expression stay local.

## Dependency Standard

The active repos are not just converging on config. They are also converging on a real dependency baseline.

The packages that recur most often in UI work are:

- `motion`
- `lucide-react`
- `zod`
- `clsx`
- `tailwind-merge`
- `sonner`
- `next-themes`
- `date-fns`
- `@tanstack/react-query`
- `usehooks-ts`
- `@radix-ui/react-slot`
- `@radix-ui/react-dialog`

The detailed policy lives in [Default Dependencies](./default-dependencies.md).

## Documentation

If the repo needs a docs site:

- prefer Fumadocs for Next.js-based docs experiences
- otherwise keep docs as plain Markdown until the repo actually needs a full docs UI

Do not install a docs framework out of habit.
