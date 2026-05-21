# PatternMode: Project Vision & Structure

## What PatternMode Is

PatternMode is three things:

1. **A UI library** — Radix-based, shadcn-convention component library with hand-tuned oklch design tokens, responsive value system, and motion tokens. The starting block for new apps.

2. **A curated set of composited packages** — Purpose-built packages inspired by excellent open-source work. Each solves a specific interaction pattern (shared element transitions, drag-to-dismiss, etc.) and is built on Radix + Motion with full TypeScript. Attributed, not forked.

3. **A canonical monorepo template** — The tooling, conventions, and structure itself is the product. When you start a new app, you clone/extend patternmode and get: Turborepo, biome, @howells/* configs, storybook, playground, and a coherent package architecture.

---

## Current State (2026-04-07)

### Packages

| Package | Purpose | Status |
|---------|---------|--------|
| `@patternmode/ui` | 54-component design system | Mature — Phases 1-6 complete |
| `@patternmode/motion` | Animation tokens (springs, easings, durations, presets) | Complete |
| `@patternmode/transition` | Shared element transitions + drag dismissal (inspired by Cambio) | Complete |
| `@patternmode/tailwind-config` | Design tokens, CSS variables, Tailwind v4 config | Complete |

### Apps

| App | Purpose | Status |
|-----|---------|--------|
| `playground` | Next.js 16 integration sandbox | Working |
| `storybook` | Component documentation (54 stories, VariantGrid pattern) | Working |

### Tooling

- Turborepo orchestration
- `@howells/lint` (biome + ultracite)
- `@howells/typescript-config` (total-typescript/tsconfig)
- Husky + lint-staged pre-commit

---

## Package Architecture Principles

### Naming: `@patternmode/<purpose>`

Every package name describes what it DOES, not what it IS:
- `ui` — UI primitives
- `motion` — motion tokens
- `transition` — shared element transitions
- NOT `cambio-clone` or `dialog-animations`

### Package Categories

**Foundation** (required by most apps):
- `ui` — components
- `tailwind-config` — design tokens
- `motion` — animation tokens

**Composition** (add as needed):
- `transition` — shared element transitions
- Future: `drawer`, `toast`, `carousel`, etc.

**Utility** (standalone):
- Future: `color` (deterministic color utilities — currently in ui/lib)
- Future: `hooks` (currently in ui/hooks — could graduate)

### When to create a new package vs. add to `ui`

**New package when:**
- It has its own npm dependencies beyond what ui uses
- It's a distinct interaction pattern (not just a styled component)
- A consumer might want it WITHOUT the full ui package
- It's inspired by a specific external project and has its own attribution

**Add to `ui` when:**
- It's a standard shadcn-style component (Radix primitive + CVA + Tailwind)
- It only depends on what ui already depends on
- It's consumed via the `@patternmode/ui/components/*` export pattern

---

## Component Conventions

### File Structure (per component)

```
packages/ui/src/components/button/
├── button-root.tsx        # Main component
├── button-variants.ts     # CVA definitions + exported types
├── button-root.test.tsx   # Vitest tests
└── button.stories.tsx     # Storybook (Base + VariantGrid)
```

Barrel export at `components/button.tsx`.

### Story Convention

Every component story has:
1. `Base` — controllable via args panel
2. `VariantMatrix` or `SizeStateMatrix` — VariantGrid utility, controls disabled
3. Optional: `WithIcons`, `Patterns`, etc. for key use cases

Interactive overlays (dialog, sheet, popover) skip VariantGrid — they need live interaction.

### Responsive Value Convention

Layout/size props accept `ResponsiveValue<T>`:
```tsx
<Flex direction={{ base: "column", md: "row" }} gap={{ base: "xs", lg: "base" }} />
```

Uses `getResponsiveClasses()` utility — zero-cost for static values.

### Design Token Convention

- Colors: oklch with consistent hue angles (264 for neutrals, 241 for accent)
- Shadows: Semantic elevation tokens (card-rest, flyout, modal, etc.)
- Radii: Token-based, not hardcoded values
- Typography: CSS custom properties with tracking/line-height pairs
- Motion: Named presets from `@patternmode/motion`

---

## Roadmap

### Near-term (in progress)

**Materia parity completion:**
- [x] Phase 1: Extended size system + responsive values
- [x] Phase 2: Hooks (useBreakpoint, useMobile, useMeasure, etc.)
- [x] Phase 3: Motion token package
- [x] Phase 4: Utilities (has-error-input, color.ts, compose-refs)
- [x] Phase 5: Button power features (loading, icons, dot)
- [x] Phase 6: Skeleton shimmer, field error enhancement
- [ ] Phase 7: Integration components (sonner toast, drawer/vaul, carousel/embla)

### Composition packages (inspired-by series)

- [x] `@patternmode/transition` — shared element transitions (inspired by Cambio)
- [ ] Drawer package — mobile bottom sheet with snap points (inspired by vaul)
- [ ] Toast package — opinionated notification system (inspired by sonner)
- [ ] Command package — command palette with keyboard nav (cmdk is already in ui, but could graduate)

### Future apps

- `docs` — Documentation site (Fumadocs or custom) showcasing all packages
- `showcase` — Live demo app showing packages working together

---

## Monorepo Structure (target)

```
patternmode/
├── apps/
│   ├── playground/         # Next.js integration sandbox
│   ├── storybook/          # Component documentation
│   └── docs/               # Documentation site (future)
├── packages/
│   ├── ui/                 # Core component library (shadcn-convention)
│   ├── tailwind-config/    # Design tokens + Tailwind v4 config
│   ├── motion/             # Animation tokens
│   └── transition/         # Shared element transitions
├── docs/
│   └── arc/                # Specs, plans, progress
├── CLAUDE.md               # Project context for AI
├── AGENTS.md               # Agent routing context
└── turbo.json              # Build orchestration
```

### Export Patterns

```tsx
// UI components — wildcard exports
import { Button } from "@patternmode/ui/components/button";
import { cn } from "@patternmode/ui/utils/cn";
import { useBreakpoint } from "@patternmode/ui/hooks/use-breakpoint";

// Motion tokens — barrel export
import { springs, durations, presets } from "@patternmode/motion";

// Composition packages — compound component
import { Transition } from "@patternmode/transition";

// Design tokens — CSS import
import "@patternmode/tailwind-config";
```

---

## Quality Standards

- Typecheck, lint, and test must pass before any commit
- Every component has a colocated `.stories.tsx`
- Interactive components have vitest coverage
- Design tokens use oklch (not hex, not Tailwind palette aliases)
- Shadows use semantic elevation tokens
- Animations use named presets from `@patternmode/motion`
- Attribution on all inspired-by packages

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-07 | oklch color system instead of zinc aliases | Perceptual uniformity, self-contained, no Tailwind palette dependency |
| 2026-04-07 | @howells/lint + @howells/typescript-config | Published packages > local workspace packages for shared tooling |
| 2026-04-07 | Responsive values via class maps, not runtime JS | Zero-cost for static values, Tailwind static analysis compatible |
| 2026-04-07 | Separate @patternmode/motion package | Animation tokens are framework-agnostic data, not React-specific |
| 2026-04-07 | @patternmode/transition as first "inspired-by" package | Validates the composition package pattern, Radix-native |
| 2026-04-07 | VariantGrid for storybook | Comprehensive visual coverage in minimal code |
| 2026-04-07 | Local size types for 3-size components | Don't force 8-value ComponentSize on components that only need 3 |
