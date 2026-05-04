# Launch Checklist

Use this when starting a new repo or standardizing an existing one.

## Baseline

- `packageManager` pinned to `pnpm@10.33.2`
- Node engine pinned to `>=20.19`
- `turbo` pinned to `2.9.8`
- `typescript` pinned to `6.0.3`
- `@howells/lint` installed
- `@howells/typescript-config` installed
- workspace layout uses `apps/*` and `packages/*`

## Config

- root `package.json` uses the standard script contract
- `pnpm-workspace.yaml` is present
- `turbo.json` is present and small
- `biome.json` extends house presets
- `tsconfig.json` uses explicit leaf presets
- `components.json` exists for UI repos
- `.husky/pre-commit` is installed
- `AGENTS.md` exists and is concise

## UI Projects

- `patternmode` is the upstream assumption
- shared primitives live in a package, not in the app
- Storybook exists for exported reusable UI
- local wrappers are preferred over primitive forks
- brand expression is handled through tokens and compositions, not component duplication
- `motion`, `lucide-react`, `zod`, `clsx`, `tailwind-merge`, and `sonner` are installed when the repo is UI-first
- `@howells/stacksheet` is used for stacked sheet workflows instead of overextending a basic drawer

## Verification

- `pnpm install` succeeds cleanly
- `pnpm lint` succeeds
- `pnpm typecheck` succeeds
- `pnpm build` succeeds
- `pnpm test` succeeds or is intentionally not present yet
- hooks run without surprising side effects

## Guardrails

- cache is disabled by default in Turbo tasks
- task-level env is scoped narrowly
- there is no generic local lint wrapper drifting away from `@howells/lint`
- there is no generic local tsconfig base hiding runtime assumptions
- there is no duplicate component system growing beside `patternmode` in a new UI repo
- there is no second local motion/transition mini-framework appearing without a strong reason
