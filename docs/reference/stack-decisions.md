# Stack Decisions

These are the current default decisions inferred from your most recently active projects and shared config repos.

## Core Versions

Pin these unless there is a deliberate repo-specific reason not to:

| Tool | Baseline |
|------|----------|
| `pnpm` | `11.1.1` |
| `turbo` | `2.9.12` |
| `typescript` | `6.0.3` |
| `husky` | `9.1.7` |
| `lint-staged` | `17.0.4` |
| `@howells/lint` | `0.1.6` |
| `@howells/typescript-config` | `0.1.2` |
| `@howells/envy` | `0.3.5` |
| Node | `24.x` LTS for new repos |

## Package Manager

- Use `pnpm`.
- Pin `packageManager` in the root `package.json`.
- Prefer one lockfile at the repo root.
- Use Node 24 LTS for development, CI, apps, and services.
- Default workspace layout is:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Node Version Policy

Use Node 24 LTS as the Howells stack baseline.

Defaults:

- app and service repos: `"node": ">=24.15.0 <25"`
- CI: Node `24.x`
- local version files: pin the latest Node 24 LTS patch
- published packages: keep runtime support at `>=22.22.1` when the package does not need Node 24 APIs, but build and test on Node 24

Do not start new work on Node 20. It is end-of-life. Do not standardize on Node 26 until it reaches LTS.

## Turborepo

Use Turbo as an orchestrator, not as a place to hide complexity.

- Keep `turbo.json` small.
- Keep cache disabled by default.
- Keep `globalDependencies` limited to `.env` files.
- Scope environment variables at the task level, not globally.
- Put package-specific exceptions in leaf packages when needed.
- Avoid deprecated `turbo run --parallel`; let persistent `dev` tasks run through task config.

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
- keep the Biome schema URL aligned to the Biome version pinned by `@howells/lint`

For env access, use `@howells/envy` lint helpers with Oxlint or ESLint when a repo needs to enforce "no direct `process.env`" more strongly than Biome can on its own.

## Environment Variables

Use `@howells/envy` for repos with runtime configuration.

Default approach:

- put the schema in `packages/env`
- parse explicitly by default
- expose separate server and client env modules
- allow direct `process.env` only inside the env boundary
- run local env checks in `pnpm check`
- run Vercel or Railway env checks before deploy

Do not keep hand-written dotenv loading, ad hoc `process.env` reads, or provider env setup scripts once Envy can own that surface.

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
- `motion` for animation, imported from `motion/react` in React code
- Storybook for reusable exported components
- `patternmode` as the upstream for shared UI packages

This does not mean every product should look the same. It means structural decisions should be shared while brand and product expression stay local.

## Client Data Fetching

Use `@tanstack/react-query` for all client-side data fetching. No raw `fetch` in components.

Rules:

- Create a `lib/api.ts` with typed hooks (`usePersonas`, `useEvaluation`, etc.) wrapping `useQuery` and `useMutation`
- Create a `lib/query-provider.tsx` client component with `QueryClientProvider`
- Server Components fetch data directly from the database or internal packages — React Query is only for client components
- Mutations should invalidate related query keys on success
- SSE streams and one-shot fire-and-forget fetches are the only exceptions to using React Query

Pattern:

```ts
// lib/api.ts
export function usePersonas() {
  return useQuery({
    queryKey: ["personas"],
    queryFn: () => apiFetch<Persona[]>("/api/personas"),
  });
}

export function useUpdatePersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiFetch(`/api/personas/${id}`, { method: "PUT", ... }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["personas"] });
      qc.invalidateQueries({ queryKey: ["personas", id] });
    },
  });
}
```

This replaces `useEffect` + `useState` + `fetch` patterns. React Query handles loading states, error states, caching, and cache invalidation.

## Dependency Standard

The active repos are not just converging on config. They are also converging on a real dependency baseline.

The packages that recur most often in UI work are:

- `motion`
- `lucide-react`
- `zod`
- `clsx`
- `tailwind-merge`
- `sonner`
- `nuqs`
- `next-themes`
- `date-fns`
- `@tanstack/react-query`
- `usehooks-ts`
- `@radix-ui/react-slot`
- `@radix-ui/react-dialog`
- `@howells/envy`

For agent-heavy visual product work, there is also a repeated development tool:

- `agentation`

The repeated package names across your Turborepos are also clear enough to treat as default boundaries, not accidental patterns:

- first tier: `db`, `ui`, `typescript-config`, `tailwind-config`
- second tier: `utils`, `trpc`, `motion`, `auth`, `agents`, `mcp`, repo-local `ai` packages above `@howells/ai`
- optional but frequent: `assets`, `upload`, `storage`, `env`, `config`

The detailed policy lives in [Default Dependencies](./default-dependencies.md).

For media-heavy projects, there is also a platform-level default:

- prefer `stow` for image, vector, and general media storage/delivery

There is also a recurring architecture baseline for full-stack apps:

- `tRPC` for typed API boundaries
- React Query for server state
- Drizzle plus Neon for persistence

The detailed guidance lives in [Architecture Defaults](./architecture-defaults.md).

## Documentation

If the repo needs a docs site:

- prefer Fumadocs for Next.js-based docs experiences
- otherwise keep docs as plain Markdown until the repo actually needs a full docs UI

Do not install a docs framework out of habit.
