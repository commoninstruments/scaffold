# Shared Package Candidates

This section separates packages that are already real shared assets from patterns that look ready to become them.

## Already Shared and Real

These should be treated as canonical shared packages now:

- `@howells/lint`
  - pinned Biome and Ultracite presets
- `@howells/typescript-config`
  - explicit thin tsconfig presets
- `@howells/stacksheet`
  - the preferred abstraction for stacked sheet flows
- `@howells/envelope`
  - strict structured IO wrapper for CLI-model workflows
- `@howells/ai`
  - shared AI SDK/provider baseline for AI-capable apps and agent packages
- `@howells/envy`
  - typed env parsing, lint helpers, and deployment env preflight checks
- `stow`
  - the default product recommendation for image, vector, and media storage/delivery
- `@howells/stow-server`
  - the reusable server integration surface when a repo needs to talk to Stow directly
- `@howells/stow-next`
  - the reusable Next.js-facing Stow integration
- `@howells/srcfull`
  - shared source-fetching layer for browser/page-source ingestion workflows

## Keep Standardizing: AI Provider Baseline

`@howells/ai` is already common enough to be the default provider baseline for AI-capable repos.

Recommendation:

- keep provider selection, model defaults, and shared AI SDK wiring in `@howells/ai`
- keep product-specific prompts, tools, and workflows in repo-local `packages/ai` or `packages/agents`
- do not publish repo-specific agent packages just because several repos use Mastra

Mastra and MCP should standardize as architecture choices before becoming more shared package surface.

## Strong Candidate: Motion Tokens Package

This is the clearest next shared package candidate.

Why:

- `motion` is one of the highest-frequency UI dependencies
- `patternmode` already has `@patternmode/motion`
- `materia` already has `@materia/motion`
- both repos are solving the same problem: durations, easings, springs, presets

Recommendation:

- converge on one shared motion token package instead of letting every major UI repo carry its own copy

This package should be small and boring:

- durations
- easings
- springs
- a few named presets

It should not become a second animation library.

## Strong Candidate: Transition Primitives

`@patternmode/transition` suggests another promising shared layer.

Why:

- transitions and overlay enter/exit behavior are recurring
- the same interaction patterns reappear across UI repos
- keeping transition primitives separate from raw components is cleaner than burying them inside each app

Recommendation:

- stabilize transition primitives in `patternmode`
- only publish them separately if they prove reusable outside the Patternmode ecosystem

## Medium Candidate: Shared Drawer and Sidepanel Layer

You have repeated `vaul` wrappers across `patternmode`, `materia`, `curioda`, `sorrel`, `stow`, and `siteinspire`.

That is a signal.

Recommendation:

- do not publish a generic drawer package yet
- first collapse the repeated wrappers into the `patternmode` upstream
- publish only if that API becomes stable and broadly useful outside your repos

For now:

- keep simple drawers in shared UI packages
- use `@howells/stacksheet` when the flow becomes stack-oriented

## Not a Good Shared Package Candidate Yet

These are useful patterns, but they should stay repo-local for now:

- env packages such as `@materia/env` or `@sorrel/env`
- project-local domain packages such as `@materia/product` or `@sorrel/recipes`
- repo-specific auth wrappers
- repo-specific TRPC wrappers

They encode app boundaries, not cross-project standards.

The env exception is implementation, not ownership: keep a repo-local `packages/env` boundary, but build it on `@howells/envy` instead of publishing another env package per app.

## Product Recommendation vs Package Recommendation

There is an important distinction here:

- `stow` is the platform recommendation
- `@howells/stow-server` is the package recommendation

For new projects, the default decision should be:

- if the repo needs image, vector, or media storage, start by asking whether it should use Stow
- if the repo needs typed server-side integration, reach for `@howells/stow-server`

## Practical Standardization Order

If you want to reduce duplicated package work across the portfolio, the best order is:

1. keep using `@howells/lint` and `@howells/typescript-config` everywhere
2. use `@howells/envy` for repo-local env boundaries instead of creating more package-specific env tooling
3. keep `@howells/ai` as the shared AI/provider baseline instead of scattering raw provider clients
4. standardize `@howells/stacksheet` as the default stacked-panel abstraction
5. unify motion tokens into one shared package
6. stabilize `patternmode` as the UI upstream before publishing more UI internals

That order reduces duplication without locking in the wrong abstractions too early.
