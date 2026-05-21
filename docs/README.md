# New Project Docs

This docs set is the canonical starting point for a new Howells project.

It is not a generic starter guide. It reflects the conventions that are already converging across your recently active repos:

- the bundled UI baseline for shared UI, tokens, motion, and Storybook
- `arc` for agent workflows and project discipline
- `@howells/lint` for Biome presets and pinned lint tooling
- `@howells/typescript-config` for thin, explicit tsconfig presets
- `@howells/envy` for typed env parsing and deployment env checks
- `@howells/ai`, Mastra, and MCP packages for AI-capable product and agent work
- `turbo-config` for conservative Turborepo defaults

## Evidence Basis

The current scaffold has been tuned against the direct package inventory generated on `2026-05-17` from projects touched since `2026-01-17`:

- 118 touched top-level project directories under `~/Sites`
- 102 projects with dependency manifests
- 595 direct manifests after excluding generated/runtime paths and Composer `vendor`
- 2,105 unique direct dependency packages

Use that inventory as the signal for TypeScript, UI, database, AI, and tooling defaults. Ignore PHP/Craft when deriving new-project defaults unless the new project is explicitly a Craft maintenance project.

## Assumptions

- Audience: developers
- Default repo shape: `pnpm` monorepo, usually with `apps/*` and `packages/*`
- Default UI stack: Next.js App Router, React 19, Tailwind 4, Radix, Storybook
- Default linting and formatting: Biome via `@howells/lint`
- Default task runner: Turborepo with cache disabled until a repo proves it is deterministic
- Default data stack for product apps: Drizzle, Neon, `tRPC`, and React Query
- Default AI-capable shape: shared provider baseline through `@howells/ai`, product orchestration through repo-local `ai` or `agents`, and MCP in its own package when exposed

## Sections

- [Getting Started](./getting-started.md)
- [Stack Decisions](./reference/stack-decisions.md)
- [Observed Package Baseline](./reference/observed-package-baseline.md)
- [Architecture Defaults](./reference/architecture-defaults.md)
- [Repo Archetypes](./reference/repo-archetypes.md)
- [Package Boundaries](./reference/package-boundaries.md)
- [Deployment Defaults](./reference/deployment-defaults.md)
- [Default Dependencies](./reference/default-dependencies.md)
- [Config Snippets](./reference/config-snippets.md)
- [UI Projects](./reference/ui-projects.md)
- [Shared Package Candidates](./reference/shared-package-candidates.md)
- [Agent Workflow](./reference/agent-workflow.md)
- [Launch Checklist](./reference/launch-checklist.md)

## Codex Skill

The installable skill lives at `skills/scaffold`. It routes agents through these docs without loading every reference at once.

## What This Standard Optimizes For

- Low config drift across active repos
- Fast project setup without re-deciding toolchain basics
- Correctness over cleverness
- Shared UI primitives without flattening project identity
- Clear agent workflows so Arc and Codex remain assets instead of entropy generators
