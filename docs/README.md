# New Project Docs

This docs set is the canonical starting point for a new project in `/Users/danielhowells/Sites`.

It is not a generic starter guide. It reflects the conventions that are already converging across your recently active repos:

- `patternmode` for shared UI, tokens, motion, and Storybook
- `arc` for agent workflows and project discipline
- `@howells/lint` for Biome presets and pinned lint tooling
- `@howells/typescript-config` for thin, explicit tsconfig presets
- `turbo-config` for conservative Turborepo defaults

## Assumptions

- Audience: developers
- Default repo shape: `pnpm` monorepo
- Default UI stack: Next.js App Router, React 19, Tailwind 4, Radix, Storybook
- Default linting and formatting: Biome via `@howells/lint`
- Default task runner: Turborepo with cache disabled until a repo proves it is deterministic

## Sections

- [Getting Started](./getting-started.md)
- [Stack Decisions](./reference/stack-decisions.md)
- [Default Dependencies](./reference/default-dependencies.md)
- [Config Snippets](./reference/config-snippets.md)
- [UI Projects](./reference/ui-projects.md)
- [Shared Package Candidates](./reference/shared-package-candidates.md)
- [Agent Workflow](./reference/agent-workflow.md)
- [Launch Checklist](./reference/launch-checklist.md)

## What This Standard Optimizes For

- Low config drift across active repos
- Fast project setup without re-deciding toolchain basics
- Correctness over cleverness
- Shared UI primitives without flattening project identity
- Clear agent workflows so Arc and Codex remain assets instead of entropy generators
