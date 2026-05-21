# Patternmode Canonical UI Library Design

## Reference Materials
- Existing package patterns from `materia`, `stow`, `aston`, `designround_`, `midday`, and `lavista`
- Existing component package examples in `materia/packages/ui`, `stow/packages/ui`
- Existing styling package examples in `materia/packages/tailwind-config`, `stow/packages/tailwind-config`
- Existing `patternmode` repo structure and planning docs in `docs/plans/`

## Problem Statement

Across active projects in `/Users/danielhowells/Sites`, the same UI system is being rebuilt repeatedly under different package names. The repeated pattern is consistent:

- a `packages/ui` package
- a `packages/tailwind-config` package
- shadcn/Radix-style primitives
- small project-specific styling adjustments

The repetition is productive in the short term but expensive over time. The same primitives, variants, and token systems drift across projects, and new work starts by recreating the same baseline rather than extending a single upstream.

The goal is to create one canonical source of truth for active projects that preserves the strictness and API discipline of `materia` without inheriting Materia's specific product aesthetic. The library should feel like the default UI language across Daniel's projects, while still allowing minor project-level stylistic adjustments without forking components.

## House Style

`patternmode` needs an explicit visual identity, not just a structural lineage.

The house style should be defined before migration begins and used as the review standard for shared components and theme work.

Core characteristics:

- neutral, confident, product-oriented visual language
- restrained but intentional typography
- tight API discipline with equally tight visual discipline
- subtle rather than ornamental motion
- small aesthetic shifts across projects without changing the core family resemblance

Default visual guardrails:

- typography should feel deliberate and modern, not generic shadcn default
- radius and shadow should be opinionated and consistent across the system
- density should support information-rich product UI without feeling cramped
- motion should reinforce clarity and responsiveness rather than decoration
- the system should remain recognizably `patternmode` even when a project changes accent color, spacing feel, or typography pairings slightly

This is the standard for deciding whether a component or theme preset belongs upstream.

## Success Criteria

- `patternmode` becomes the upstream source of truth for active projects.
- New projects stop creating local `packages/ui` and `packages/tailwind-config` copies.
- Small visual shifts happen through tokens, variants, and wrappers rather than component forks.
- Storybook becomes the visual contract and component inventory for the system.
- Shared component APIs remain tightly typed and intentionally narrow.

## Scope

In scope:

- canonical monorepo structure for `patternmode`
- shared UI package
- shared Tailwind/token package
- theme preset strategy
- Storybook as a first-class app
- migration approach for active aligned projects

Out of scope:

- migrating every historical repo in `/Users/danielhowells/Sites`
- preserving the current `patternmode` app structure
- building domain-specific product compositions into the shared package by default
- designing a generic public design system optimized for unknown external teams

## Approach

Create a new canonical monorepo in `~/Sites/patternmode` and promote it from playground status to upstream UI system. Use `materia` as the structural reference for strictness, exports, and typing. Use `stow` and other aligned projects as the closer aesthetic reference for the default tone. Keep shadcn and Radix as the primitive baseline.

The architecture should separate three concerns:

1. shared components
2. shared styling and tokens
3. controlled theme variation

This keeps one implementation of the component layer while allowing small aesthetic differences to be expressed through token presets instead of cloned files.

## Proposed Repository Structure

```text
patternmode/
  apps/
    storybook/
    playground/
  packages/
    ui/
    tailwind-config/
    typescript-config/
```

Optional later addition:

```text
  packages/
    themes/
```

The default recommendation is to start without a separate `themes` package and export theme entrypoints from `@patternmode/tailwind-config`. Add a dedicated themes package only if the theme surface becomes large enough to justify it.

## Package Responsibilities

### `@patternmode/ui`

Owns:

- typed primitives built on shadcn/Radix
- shared reusable components
- variant definitions
- component anatomy helpers where useful
- shared hooks and utilities required by components

Does not own:

- app-specific workflows
- product-specific data-driven components
- business-logic-aware compositions
- project-specific layout shells

The package should use explicit exports and stable entrypoints, following the general structure already proven in `materia` and `stow`.

At launch, `@patternmode/ui` should not include compositions. The first release should focus on primitives and reusable building blocks only. Compositions can be considered later only after recurring patterns are proven across multiple consuming projects.

### `@patternmode/tailwind-config`

Owns:

- global CSS entrypoints
- design tokens
- semantic colors
- typography scale
- spacing, radius, shadow, and motion tokens
- PostCSS export
- shared animation utilities
- theme preset entrypoints

Does not own:

- app-specific `@source` assumptions
- per-project content scanning paths beyond its own package sources
- product-specific token names

The current duplication in `materia` and `stow` shows that token systems should be centralized, but app scan paths should stay local to consumers.

For now, the design language should stay inside the Tailwind package rather than being split into a separate framework-agnostic tokens package. Tailwind is the long-term default styling runtime for this system, so the simplest boundary is to let `@patternmode/tailwind-config` own tokens and theme presets unless a real non-Tailwind consumer appears later.

### `apps/storybook`

Storybook is required, not optional. It is the visual contract for the library and should consume the packages exactly as downstream apps do.

Responsibilities:

- component inventory
- variant and API validation
- theme switching and theme regression review
- interaction coverage and screenshot confidence for shared UI

Every exported user-facing shared component should have a meaningful story before it is considered complete. Internal helpers, implementation-only pieces, and non-visual support exports do not need standalone stories unless they materially benefit from direct review.

### `apps/playground`

The playground app exists for rapid visual experimentation, integration checks, and trying ideas without polluting the library itself. It replaces the ad hoc role currently served by the existing `patternmode` app.

## Variation Model

Minor project-level variation should happen in five places only.

### 1. Token overrides

Use token changes for:

- palette
- accent treatment
- radius scale
- shadow depth
- density
- motion feel
- typography pairings and scale

### 2. Typed component variants

Use variants for stable axes such as:

- `size`
- `tone`
- `density`
- `surface`
- `loading`
- `destructive`

Variants should remain semantically meaningful and intentionally narrow.

### 3. Composition points and slots

Use slots or structured subcomponents when the variation is about layout or content regions rather than raw styling.

### 4. App-local wrappers

If a project needs a local opinion, wrap shared components locally. Example: create `ProjectButton` or `AssetCard` in the app rather than editing upstream `button.tsx`.

### 5. Eject to local ownership

If a consuming project reaches a point where tokens, variants, slots, and local wrappers no longer express the requirement cleanly, that project may eject a component or pattern from `patternmode` and take ownership locally.

Valid eject signals:

- the component now depends on product-specific data or workflow logic
- local wrappers are accumulating enough behavior that they are effectively a hidden fork
- the required visual direction breaks the `patternmode` house style
- the upstream API would become noticeably worse if it absorbed the customization

Ejecting should be treated as an intentional boundary decision, not a convenience shortcut. A project should exhaust tokens, variants, and wrappers first. Once ejected, the local implementation becomes product-owned and should stop pretending to be a shared primitive.

### Explicit anti-patterns

Do not normalize these as the primary customization path:

- copying a shared component into a consuming repo
- adding one-off boolean props for project quirks
- relying on arbitrary `className` overrides as the main API
- forking component implementations for aesthetic differences alone

## Typing and API Rules

The shared library should inherit Materia's strictness and sharpen it into explicit rules.

- Public APIs must be deliberately shaped, not incidental leaks of primitive internals.
- Variant props should be typed and shared through a consistent variant pattern.
- Composition patterns should be consistent across the package.
- Export style and naming conventions should be standardized once and reused everywhere.
- Shared APIs should be small, stable, and semantically named.
- If a customization request makes the public API noticeably messier, it likely belongs in a local wrapper instead.

Shared typing should create friction in the right place. If a change is difficult to express without introducing app-specific concerns into the shared component, the system should push that concern back into the consumer app.

## Theming Strategy

Start with a default theme that represents Daniel's house style.

Add one or two alternate presets only if they reflect real recurring project differences. These should still look like the same family, not different design systems.

The theme layer should support:

- default house style
- minor tonal shifts for project context
- consistent component implementation across themes

Theming should change tokens, not component markup.

For the first iteration, theme presets should remain inside `@patternmode/tailwind-config` rather than being split into a separate package. If that boundary becomes painful later, it can be extracted then with real usage pressure behind the change.

## Storybook Strategy

Storybook should be designed as operational tooling, not decorative documentation.

Every shared component should include:

- baseline story
- variant coverage
- edge state coverage where relevant
- theme previews for token-driven changes

The practical completeness bar is:

- user-facing exported components need at least one meaningful story
- stories should cover the important visual states and intended variant axes
- composed examples should be added where a component's value only becomes clear in context
- internal implementation details do not need performative stories

Where useful, Storybook should also become the easiest surface for:

- interaction tests
- visual regression review
- verifying that a change in `@patternmode/ui` does not break downstream assumptions

## Migration Plan

### Phase 1: Establish the upstream

- rebuild `patternmode` as a monorepo
- add `packages/ui`
- add `packages/tailwind-config`
- add `packages/typescript-config`
- add `apps/storybook`
- add `apps/playground`

### Phase 2: Seed from existing code

- extract the strict package/export shape from `materia`
- pull shared primitives from `materia/packages/ui`
- merge and normalize tokens from `materia` and `stow`
- remove Materia-specific and product-specific assumptions
- define the default house theme

### Phase 3: Establish library rules

- require stories for shared components
- document package boundary rules
- document variation rules
- document when something belongs in app-local wrappers instead of upstream

### Phase 4: Migrate active aligned consumers

Start with one pilot consumer before any broader rollout.

Recommended pilot:

- `stow`

Pilot success should prove:

- package boundaries are correct
- token and theme setup is workable in a real app
- migration friction is acceptable
- local wrappers do not become a hidden fork layer

Only after that should the plan expand to other active projects closest to the existing family:

- `stow`
- other active repos already using the `materia`/`stow` package pattern

Migration target:

- depend on `@patternmode/ui`
- depend on `@patternmode/tailwind-config`
- delete local copies of shared packages where practical

The migration phase should also include:

- a compatibility window for pilot consumers
- explicit deprecation guidance for replaced local packages
- a small amount of migration tooling or codemod support if import churn becomes significant
- explicit guidance on when to keep adapting upstream versus ejecting to local ownership

### Phase 5: Freeze legacy divergence

Do not migrate every historical repo immediately. Older repos can remain as-is until touched. The source of truth only needs to govern active work.

## What Belongs Upstream

Send to `patternmode` when a component or token:

- appears in multiple active projects
- represents a stable primitive or shared composition
- has a clean, semantically typed API
- fits the default family of visual language

Keep local when a component:

- knows too much about one product's data model
- requires business logic to be useful
- only exists for one screen or one app workflow
- introduces project-specific API noise into the shared package

## Risks

### Over-importing Materia

If `patternmode` is seeded by copying too much from `materia`, the new upstream will inherit product-specific baggage and become another rename rather than a true canonical library.

### Theme sprawl

If theme presets multiply too early, the token layer will become a substitute for multiple design systems. Keep the family tight.

### Shared-package pollution

If app-specific compositions are added too freely, the canonical library will lose trust and consumers will resume local forking.

### Adoption friction

If migration requires too much app-specific rewiring, consumers will keep using local `packages/ui`. The upstream needs to be cleaner than the local alternative.

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Use `patternmode` as the canonical upstream | It separates shared architecture from Materia's product aesthetic while preserving the ability to inherit Materia's strictness |
| Keep shadcn/Radix as the primitive baseline | This matches existing practice and avoids inventing a new primitive layer |
| Include Storybook as a first-class app | It becomes the inventory, regression surface, and visual contract for shared UI |
| Split shared UI from shared styling | This matches the strongest existing package pattern and keeps ownership clean |
| Prefer token/theme variation over component forks | This directly addresses the current duplication problem |
| Bias migration toward active aligned repos only | The source of truth should optimize active work, not historical cleanup |

## Open Questions

- Whether theme presets should live as separate exports inside `@patternmode/tailwind-config` or graduate into a dedicated `@patternmode/themes` package
- When, if ever, a `compositions` namespace should be introduced after repeated cross-project demand
- Whether Storybook visual regression should be added immediately or after the first consumer migration

## Review Updates

Changes made during `/arc:review`:

- made the `patternmode` house style explicit instead of leaving visual identity implied
- decided to keep tokens and theme presets inside `@patternmode/tailwind-config` for now
- narrowed the migration rollout to a single pilot consumer first
- softened Storybook completeness so the rule applies to exported user-facing components rather than every internal piece

## Next Step

Recommended next step: implement the new `patternmode` monorepo structure and begin extracting the first shared packages from `materia` and `stow`.
