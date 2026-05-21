# Agent Workflow

This is the baseline for repos that will be worked on with Codex and Arc.

## AGENTS.md

Every repo should have a small `AGENTS.md`.

It should cover:

- communication expectations
- editing constraints
- search preferences
- repo-specific rules that are easy for an agent to violate

Keep it short and direct. The best `AGENTS.md` files change behavior without becoming documentation sludge.

## Arc

Use Arc as the higher-level workflow layer when a task needs structure rather than raw code generation.

Recommended Arc workflows:

- `/arc:ideate` for feature design
- `/arc:implement` for scoped implementation, from small edits through larger planned work
- `/arc:design` for UI design direction
- `/arc:review` before merging meaningful changes
- `/arc:document` when the repo needs real docs, not a throwaway README
- `/arc:tidy` to clean up stale plans after completion

## Agentation

For Next.js UI repos that will be iterated visually with agents:

- add `agentation`
- render `<Agentation />` only in development
- add a local `.codex/config.toml` entry for `agentation-mcp` when the repo wants annotation syncing inside the project

This is now recurring often enough in active product repos that it should be treated as a standard option, not a one-off experiment.

## AI, Mastra, and MCP

For AI-capable repos, keep the agent surface explicit:

- use `@howells/ai` before raw provider SDKs in app code
- use repo-local `packages/ai` for product-specific model and provider composition
- use `packages/agents` when prompts, evaluators, tools, or agent definitions are shared
- use Mastra when the repo needs real agent orchestration, memory, workflow state, or observability
- use `packages/mcp` or `packages/mcp-server` for MCP contracts and transports
- validate model IO and tool schemas with `zod`

Do not hide reusable agent or MCP contracts inside a route handler. That makes them harder to test, harder to expose to Codex or Arc, and harder to reuse from CLIs.

When implementing Mastra code, verify the current API before writing against it. Prefer installed package docs under `node_modules/@mastra/*/dist/docs` when packages are present, and keep the TypeScript target/module setup on ES2022-compatible settings.

## Rules and `.ruler`

Do not install a full rules system into every repo by default.

Use `.ruler` when:

- the repo has multiple agents touching it frequently
- consistency is degrading
- there are project-specific conventions that should be enforced

Do not use `.ruler` when the repo is still exploring its basic shape.

## Root Scripts That Agents Should Expect

Agents should be able to rely on these commands:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm format`
- `pnpm typecheck`
- `pnpm test`
- `pnpm check`

If a repo chooses different names, it is increasing friction for no real gain.

## Git Hooks

Use hooks to stop obvious breakage, not to turn local commits into CI.

Default:

- `pre-commit`: `lint-staged`, `lint`, `typecheck`

Optional:

- `pre-push`: `lint`, `typecheck`, `test`

Rules:

- never auto-commit from repo automation
- keep hook output readable
- if hooks become slow enough that developers bypass them, the hooks are wrong

## Code Review Stance

Agent-driven review should prioritize:

- regressions
- behavior changes
- missing validation
- test gaps
- config drift

It should not default to taste-based nitpicks.

## Documentation and Progress

When using Arc-style workflows, keep documentation and progress lightweight but real:

- plans go in `docs/` when the repo benefits from them
- progress logs should capture decisions, not every keystroke
- docs should describe the current system, not preserve outdated migration stories forever

## Environment Discipline

Agents should not read `process.env` ad hoc throughout the codebase.

For repos that need typed env handling:

- use `@howells/envy`
- centralize env access
- separate server-only and client-safe variables
- keep `.env.example` in sync
- check provider env before deployment
- scope Turbo task env lists to the tasks that need them

Agents should prefer `envy check local` and provider checks over hand-written shell pipelines. Secrets should never be pushed with `echo`; use Envy helpers or provider CLIs that preserve exact values.
