# Getting Started

Use this sequence when creating a new repo.

These defaults are tuned for the TypeScript, UI, data, agent, and package work that dominates the recent direct manifest inventory. Do not let legacy PHP/Craft dependencies influence the default shape of a new repo.

## 1. Choose the repo shape

Default to a `pnpm` monorepo:

```text
apps/
packages/
docs/
```

Only add more top-level globs when the repo genuinely needs them.

Before creating files, choose the repo archetype from [Repo Archetypes](./reference/repo-archetypes.md). That decision should drive the package graph, deployment target, and dependency baseline.

## 2. Decide whether this is a UI project

If the project ships a UI:

- use `patternmode` as the upstream for shared UI
- default to Next.js App Router
- keep shared primitives in a package, not in the app
- include Storybook when the repo exports reusable UI

If the project is not UI-first:

- still use the same `pnpm`, TypeScript, Biome, Husky, and Turbo baseline
- prefer thinner workspace structure and fewer packages

If this is a full-stack product app rather than a simple UI shell:

- treat `tRPC`, React Query, Drizzle, and Neon as the default starting architecture
- split shared infra into packages instead of burying it in one app
- use `@howells/envy` for typed env parsing and deployment env checks when runtime env exists
- default package boundaries to `db`, `trpc`, `ui`, `typescript-config`, `tailwind-config`, `env`, and `motion`; add `auth`, repo-local `ai`, `agents`, `mcp`, `assets`, or `upload` only where the repo actually needs them

If the repo is AI-capable, agent-heavy, or ingestion-heavy:

- use `@howells/ai` as the provider baseline before adding raw provider SDKs
- add repo-local `ai`, `agents`, `mcp`, `cli`, `ingestion`, or `enrichment` packages based on real reuse boundaries
- use Mastra when the work is agent orchestration, memory, observability, or MCP-adjacent workflow, not for one-off model calls
- use `zod` for tool, model IO, and transport contracts

## 3. Create the baseline files first

Start with these files before writing app code:

- `package.json`
- `.node-version`
- `pnpm-workspace.yaml`
- `turbo.json`
- `biome.json`
- `tsconfig.json`
- `components.json` for UI repos
- `.husky/pre-commit`
- `AGENTS.md`

Use the snippets in [Config Snippets](./reference/config-snippets.md).

Also decide the first package boundaries up front using [Package Boundaries](./reference/package-boundaries.md). A lot of repo drift starts when app code absorbs infra that should have been extracted on day one.

## 4. Install the shared config packages

For the current house baseline:

- `@howells/lint`
- `@howells/typescript-config`
- `turbo`
- `typescript`
- `husky`
- `lint-staged`
- `tsx`
- `vitest`
- `@howells/envy` when the repo has runtime env

Do not start by hand-rolling repo-local lint or tsconfig wrappers.

## 5. Keep the scripts standard

At the root, keep these script names unless the repo has a real reason not to:

- `dev`
- `dev:all`
- `build`
- `lint`
- `format`
- `typecheck`
- `test`
- `check`
- `check:affected`
- `clean`
- `prepare`

The exact commands can vary by repo, but the script contract should stay stable.

## 6. Add the agent and rules layer deliberately

For repos that will use Codex and Arc heavily:

- add `AGENTS.md`
- for Next.js UI repos, add `agentation` and render it in development only
- add a local `.codex/config.toml` only when the repo benefits from project-specific MCP servers such as `agentation-mcp`
- add `.ruler/` or rules only if you want enforced local standards
- add `rules:apply` only when the repo really depends on that workflow

Do not cargo-cult the full `materia` rules system into every project.

## 7. Verify the baseline before feature work

Before real implementation begins, these should work:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

If those commands are already messy on day one, the repo standard is wrong.

## 8. Record intentional deviations

If you do not use the default stack, write down the reason early:

- why not Next.js for a UI app
- why not Drizzle and Neon for persistence
- why not `tRPC` for a TypeScript product API
- why not `@howells/ai` for AI provider plumbing
- why not `@howells/envy` for runtime env
- why not `patternmode` for shared UI primitives

The goal is not lockstep. The goal is to avoid re-deciding the same defaults in every repo.

## 9. Pick the deployment shape early

Do not leave hosting and runtime shape implicit.

Use [Deployment Defaults](./reference/deployment-defaults.md) to choose between:

- Vercel for Next.js apps, docs, and Storybook-like web surfaces
- Railway for worker-heavy or service-heavy systems
- Stow when the project has real media storage and delivery needs
