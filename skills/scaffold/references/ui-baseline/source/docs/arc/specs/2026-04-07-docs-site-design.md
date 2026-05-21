# PatternMode Docs Site Design

## Problem Statement

PatternMode has a mature component library (54 components), animation tokens, and composition packages — but no public-facing way to explore, document, or discover them. The playground is a dev sandbox, storybook is for internal QA. Neither serves as a front door.

The docs site is that front door. It also dogfoods the design system — the site itself demonstrates the quality of patternmode's components and tokens. It's a portfolio piece.

## Key Constraint: Single Source of Truth

Documentation is driven from JSDoc in component source files. Prop tables, descriptions, and type information are extracted at build time — never duplicated in MDX. MDX files contain only what can't live in code: usage guidance, live examples, and editorial content.

## Approach

**New app:** `apps/web` — Fumadocs-powered Next.js 16 site.

**Stack:**
- Next.js 16 + Fumadocs (fumadocs-core, fumadocs-ui, fumadocs-mdx)
- `@patternmode/ui` for all site UI (dogfooding)
- `@patternmode/tailwind-config` for design tokens
- Component previews via async RSC + example files
- Prop tables extracted from TypeScript/JSDoc via `fumadocs-typescript` or custom extraction

## Navigation Structure

```
Getting Started
├── Introduction
├── Installation
├── Design Tokens (colors, radii, shadows, typography)
├── Responsive System
└── Motion Tokens

UI (54 components)
├── ── Layout ──
├── Flex
├── Grid
├── Stack
├── Container
├── Center
├── ── Controls ──
├── Button
├── Input
├── Textarea
├── Select
├── Checkbox
├── Radio
├── Switch
├── Slider
├── Toggle
├── ── Data Display ──
├── Badge
├── Avatar
├── Card
├── Table
├── Description List
├── Kbd
├── Skeleton
├── Spinner
├── Progress
├── ── Feedback ──
├── Alert
├── Banner
├── Empty
├── ── Overlay ──
├── Dialog
├── Alert Dialog
├── Sheet
├── Popover
├── Tooltip
├── Hover Card
├── Dropdown Menu
├── Command
├── Combobox
├── ── Navigation ──
├── Tabs
├── Accordion
├── Breadcrumb
├── Pagination
├── ── Form ──
├── Field
├── Checkbox Field
├── Label
├── Input Group
├── Native Select
├── ── Utility ──
├── Separator
├── Scroll Area
├── Collapsible
├── Toggle Group
├── Button Group
└── Group

Patterns
├── Transition (shared element + drag dismiss)
└── [future compositions]

Ecosystem
├── colorscope (color science)
├── stacksheet (sheet stacking)
└── [future recommendations]
```

## Content Architecture

### Directory Structure

```
apps/web/
├── app/
│   ├── (home)/              # Landing page
│   │   └── page.tsx
│   ├── (docs)/              # Documentation pages
│   │   └── [[...slug]]/     # Fumadocs catch-all route
│   │       ├── layout.tsx   # DocsLayout
│   │       └── page.tsx     # MDX renderer with custom components
│   ├── layout.tsx           # Root layout (RootProvider)
│   └── global.css           # Imports @patternmode/tailwind-config
├── content/
│   ├── docs/                # Getting Started pages
│   │   ├── meta.json        # Sidebar navigation
│   │   ├── index.mdx
│   │   ├── installation.mdx
│   │   ├── tokens.mdx
│   │   ├── responsive.mdx
│   │   └── motion.mdx
│   ├── components/          # UI component pages
│   │   ├── meta.json        # Categorized navigation
│   │   ├── button.mdx
│   │   ├── input.mdx
│   │   └── ... (one per component)
│   ├── patterns/            # Composition packages
│   │   ├── meta.json
│   │   └── transition.mdx
│   └── ecosystem/           # External recommendations
│       ├── meta.json
│       ├── colorscope.mdx
│       └── stacksheet.mdx
├── examples/                # Live preview source files
│   ├── button.tsx
│   ├── button-loading.tsx
│   ├── button-icons.tsx
│   ├── input.tsx
│   ├── transition.tsx
│   └── ... (one per Preview reference)
├── components/              # Custom MDX components
│   ├── preview/             # Live preview system (async RSC)
│   │   ├── index.tsx
│   │   ├── code.tsx
│   │   └── render.tsx
│   ├── prop-table.tsx       # Auto-generated from TypeScript/JSDoc
│   └── installer.tsx        # Installation command UI
├── lib/
│   ├── source.ts            # Fumadocs loader
│   ├── layout.config.tsx    # Navigation and layout
│   ├── props-extractor.ts   # TypeScript → prop table extraction
│   └── fonts.ts
├── source.config.ts         # Fumadocs source config
├── next.config.mjs
└── package.json
```

### JSDoc-Driven Prop Tables

Component props are documented once — in the source TypeScript:

```tsx
// packages/ui/src/components/button/button-root.tsx
export interface ButtonProps {
  /** Whether to render as a child component via Radix Slot */
  asChild?: boolean;
  /** CSS color for a status dot indicator */
  dot?: string;
  /** Leading icon element */
  icon?: ReactNode;
  /** Whether the button is in a loading state */
  loading?: boolean;
}
```

The `<PropTable />` MDX component extracts these at build time:

```mdx
---
title: Button
description: Interactive button with loading, icon, and dot indicator support.
---

## Installation

<Installer package="@patternmode/ui" import="Button" path="components/button" />

## Examples

<Preview path="button" />
<Preview path="button-loading" />
<Preview path="button-icons" />

## Props

<PropTable component="Button" source="packages/ui/src/components/button/button-root.tsx" />
```

The `<PropTable />` component uses TypeScript's compiler API or `fumadocs-typescript` to:
1. Parse the interface from the source file
2. Extract property names, types, defaults, and JSDoc descriptions
3. Render a table — no manual documentation needed

### Component Page Template

Every component MDX file follows this minimal structure:

```mdx
---
title: [ComponentName]
description: [One-line from JSDoc on the component]
icon: [LucideIconName]
---

<Installer package="@patternmode/ui" path="components/[name]" />

<Preview path="[name]" />

## Variants

<Preview path="[name]-variants" />

## Props

<PropTable component="[ComponentName]" source="packages/ui/src/components/[name]/[name]-root.tsx" />
```

That's it. The MDX is a thin shell. The substance comes from:
- JSDoc in source → prop tables
- Example files → live previews
- Component source → code tab

### Pattern Page Template

```mdx
---
title: Transition
description: Shared element transitions with physics-based drag dismissal.
icon: Sparkles
---

> Inspired by [Cambio](https://github.com/raphaelsalaja/cambio) by Raphael Salaja.

<Installer package="@patternmode/transition" />

<Preview path="transition" />

## Motion Presets

<Preview path="transition-presets" />

## Drag Dismissal

<Preview path="transition-dismissible" />

## API

<PropTable component="TransitionRoot" source="packages/transition/src/transition-root.tsx" />
<PropTable component="TransitionContent" source="packages/transition/src/transition-content.tsx" />
```

### Ecosystem Page Template

```mdx
---
title: colorscope
description: Color science library — extraction, math, naming, and schemes.
icon: Palette
---

## What it is

[Editorial description of the package and why patternmode recommends it]

## Installation

\`\`\`bash
pnpm add colorscope
\`\`\`

## Integration with PatternMode

[How to use it alongside @patternmode/ui — e.g., avatar colors, theme generation]
```

## Landing Page

The home page (`apps/web/app/(home)/page.tsx`) is a showcase — built entirely with patternmode components as a dogfooding exercise. Key sections:

- Hero with the patternmode identity
- Component grid showing key primitives
- Live interaction demos (transition, button states, responsive layout)
- Links to Getting Started, UI, Patterns, Ecosystem

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Fumadocs over custom | Proven MDX system, handles routing/search/sidebar. Kibo validates this choice |
| JSDoc-driven prop tables | Single source of truth. Change the interface, docs update automatically |
| Example files in apps/web/examples/ | Build-time RSC rendering. Examples are real components, not code strings |
| Dogfood @patternmode/ui | The site IS the proof. If it looks gorgeous, the library works |
| Ecosystem as a section, not a package | External links with integration guides. No wrapping or re-publishing |

## Resolved Questions

| Question | Decision |
|----------|----------|
| Storybook alongside docs? | Keep both — storybook for internal dev/QA, docs site for public-facing |
| Search from day one? | Yes — Fumadocs built-in search, minimal setup |
| Theme customizer? | Include a simple color/radius switcher on the landing page — portfolio value |
