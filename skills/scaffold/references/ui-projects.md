# UI Projects

For new UI-based projects, `patternmode` is the default upstream.

That is the key decision in this scaffold.

## What `patternmode` Owns

Today, `patternmode` already defines the shape of the shared UI system:

- `@patternmode/ui` for primitives and shared compositions
- `@patternmode/tailwind-config` for tokens and shared CSS entrypoint
- `@patternmode/motion` for shared motion constants and helpers
- `@patternmode/transition` for transition primitives
- `apps/storybook` as the visual contract
- `apps/playground` and `apps/web` as integration and system surfaces

## Default Rule

If a new project has a UI, do not start by inventing a fresh component system.

Start from `patternmode` and only diverge when one of these is true:

- the product has a domain-specific component that does not belong upstream
- the project needs an app-local composition over shared primitives
- the visual language needs new tokens or wrappers but not new primitive behavior

## What to Reuse vs What to Own

Reuse from `patternmode`:

- primitive controls
- base form fields
- common overlays and menus
- shared motion timing and transition patterns
- token structure
- Storybook conventions

Own locally in the project:

- page-level compositions
- brand-specific token values
- domain-specific compound components
- app-specific wrappers around shared primitives

## What Not to Do

- do not copy-paste shared components into app code as a default workflow
- do not fork primitives just to tweak spacing or visual tone
- do not let every UI repo invent its own Tailwind token naming
- do not treat shadcn output as the final design system

The structural upstream is `patternmode`. The aesthetic layer remains project-specific.

## Baseline UI Stack

For a new UI repo, prefer:

- Next.js App Router
- React 19
- Tailwind CSS 4
- Radix primitives
- `motion`
- `lucide-react`
- Storybook for reusable exported components

## Overlay Standard

Use different primitives for different overlay jobs.

For a simple drawer or mobile bottom sheet:

- use the shared drawer component from the repo UI package
- that drawer can stay `vaul`-backed under the hood

For stacked sheets, panel drills, or multi-layer modal flows:

- prefer `@howells/stacksheet`
- do not try to stretch a plain `vaul` drawer into a stacked workflow

This distinction already shows up in your ecosystem:

- `vaul` wrappers recur inside shared UI packages
- `@howells/stacksheet` is the stronger abstraction when the interface needs real stack orchestration

## Storybook Rule

If the repo exports user-facing reusable UI, Storybook is required.

That does not mean every app needs a huge Storybook surface. It means shared UI should have a visible contract and a place for visual regression checks.

## Patternmode in Flight

`patternmode` is still evolving, so treat it as an upstream under active construction:

- prefer contributing missing generic primitives back into `patternmode`
- keep local wrappers thin while the upstream settles
- avoid freezing a local fork unless the upstream cannot absorb the need

This keeps the in-flight system moving toward a real canonical source instead of immediately fragmenting again.

## Migration Rule for Existing Projects

When moving an older UI repo toward the new standard:

1. adopt `patternmode` tokens and shared CSS entrypoint first
2. migrate obvious primitives second
3. migrate shared compositions only after the primitive contract is stable
4. keep page-level product code local

Do not attempt a one-shot visual rewrite just to claim alignment.
