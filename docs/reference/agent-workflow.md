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
- `/arc:build` for small-to-medium implementation
- `/arc:implement` for larger planned work
- `/arc:design` for UI design direction
- `/arc:review` before merging meaningful changes
- `/arc:document` when the repo needs real docs, not a throwaway README
- `/arc:tidy` to clean up stale plans after completion

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

- centralize env access
- separate server-only and client-safe variables
- keep `.env.example` in sync
- scope Turbo task env lists to the tasks that need them
