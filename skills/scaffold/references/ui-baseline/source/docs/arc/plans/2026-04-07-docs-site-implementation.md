# Docs Site Implementation Plan

> **For Arc:** Use /arc:implement to execute this plan. Subagents should report DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, or BLOCKED.

**Design:** `docs/arc/specs/2026-04-07-docs-site-design.md`
**Goal:** Build a Fumadocs-powered documentation site that serves as patternmode's public front door, dogfooding the design system.
**Stack:** Next.js 16 + Fumadocs + React 19 + pnpm + vitest

---

## File Structure

```
apps/web/
├── app/
│   ├── (home)/page.tsx              # Landing page
│   ├── (docs)/[[...slug]]/
│   │   ├── layout.tsx               # DocsLayout
│   │   └── page.tsx                 # MDX renderer
│   ├── layout.tsx                   # RootProvider + fonts
│   └── global.css                   # Imports @patternmode/tailwind-config
├── content/
│   ├── docs/
│   │   ├── meta.json
│   │   ├── index.mdx
│   │   ├── installation.mdx
│   │   ├── tokens.mdx
│   │   ├── responsive.mdx
│   │   └── motion.mdx
│   ├── components/
│   │   ├── meta.json
│   │   ├── button.mdx
│   │   ├── input.mdx
│   │   ├── card.mdx
│   │   ├── dialog.mdx
│   │   ├── select.mdx
│   │   ├── flex.mdx
│   │   ├── heading.mdx
│   │   ├── badge.mdx
│   │   ├── tabs.mdx
│   │   └── alert.mdx
│   ├── patterns/
│   │   ├── meta.json
│   │   └── transition.mdx
│   └── ecosystem/
│       ├── meta.json
│       ├── colorscope.mdx
│       └── stacksheet.mdx
├── examples/
│   ├── button.tsx
│   ├── button-loading.tsx
│   ├── button-icons.tsx
│   ├── input.tsx
│   ├── input-states.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   ├── flex.tsx
│   ├── flex-responsive.tsx
│   ├── heading.tsx
│   ├── badge.tsx
│   ├── tabs.tsx
│   ├── alert.tsx
│   ├── transition.tsx
│   ├── transition-presets.tsx
│   └── transition-dismissible.tsx
├── components/
│   ├── preview/
│   │   ├── index.tsx                # Async RSC — reads examples, renders tabs
│   │   ├── code.tsx                 # Syntax-highlighted code tab
│   │   └── render.tsx               # Centered preview wrapper
│   ├── prop-table.tsx               # Extracts props from TypeScript/JSDoc
│   └── installer.tsx                # pnpm add command UI
├── lib/
│   ├── source.ts                    # Fumadocs loader
│   ├── layout.config.tsx            # Sidebar nav + header
│   ├── fonts.ts                     # Inter + Ivar Display + Geist Mono
│   └── examples.ts                  # Static example registry (path → dynamic import)
├── source.config.ts                 # Fumadocs source config
├── next.config.mjs                  # Next.js + Fumadocs MDX
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

---

## Tasks

<task id="1" depends="" type="auto">
  <name>Scaffold apps/web with Fumadocs + Next.js 16</name>
  <files>
    <create>apps/web/package.json</create>
    <create>apps/web/tsconfig.json</create>
    <create>apps/web/next.config.mjs</create>
    <create>apps/web/postcss.config.mjs</create>
    <create>apps/web/source.config.ts</create>
    <create>apps/web/app/layout.tsx</create>
    <create>apps/web/app/global.css</create>
    <create>apps/web/lib/source.ts</create>
    <create>apps/web/lib/fonts.ts</create>
    <modify>packages/tailwind-config/shared-styles.css</modify>
  </files>
  <read_first>
    apps/playground/package.json
    apps/playground/tsconfig.json
    packages/tailwind-config/shared-styles.css
    apps/storybook/src/storybook.css
  </read_first>
  <action>
    Create the Next.js 16 app with Fumadocs integration.

    package.json deps:
    - next: 16.1.1
    - react, react-dom: 19.2.3
    - fumadocs-core: ^16.7.10
    - fumadocs-ui: ^16.7.10
    - fumadocs-mdx: ^14.2.11
    - @patternmode/ui: workspace:*
    - @patternmode/tailwind-config: workspace:*
    - @patternmode/motion: workspace:*
    - @patternmode/transition: workspace:*

    devDeps:
    - @howells/typescript-config: ^0.1.0
    - @types/react, @types/react-dom, @types/node
    - typescript: ^5.9.3

    Scripts:
    - dev: "next dev --port 32000"
    - build: "next build"
    - lint: "howells-biome check . --write --unsafe"
    - typecheck: "tsc --noEmit"

    next.config.mjs: Use createMDX from fumadocs-mdx/next, wrap the config.
    Add outputFileTracingIncludes: { '/': ['./examples/**/*.tsx'] } so example files are available at runtime for fs.readFile in the Preview component.
    source.config.ts: defineDocs({ dir: 'content' })
    tsconfig.json: extends @howells/typescript-config/nextjs, paths for @/* and @patternmode/* entries (e.g., "@patternmode/ui/*": ["../../packages/ui/src/*"])
    postcss.config.mjs: @tailwindcss/postcss (copy from playground)
    global.css: @import "@patternmode/tailwind-config" + @font-face for Inter/Ivar Display/Geist Mono
    layout.tsx: RootProvider from fumadocs-ui/provider, Inter font, html lang="en"
    lib/source.ts: Fumadocs loader with source from source.config.ts
    lib/fonts.ts: Inter (variable), Geist Mono (variable), Ivar Display (local if available)

    shared-styles.css: Add Tailwind v4 source directives for the web app:
    @source "../../apps/web/src/**/*.{ts,tsx}"; @source "../../apps/web/app/**/*.{ts,tsx}"; @source "../../apps/web/components/**/*.{ts,tsx}";

    Copy Ivar Display font files from apps/playground/src/app/fonts/ to apps/web/app/fonts/ so the local @font-face declarations resolve correctly.
  </action>
  <test_code>
    // No unit test — verify via build
  </test_code>
  <verify>
    pnpm install succeeds
    pnpm --filter @patternmode/web typecheck passes
    pnpm --filter @patternmode/web build succeeds (or dev starts)
  </verify>
  <done>apps/web scaffolded, Fumadocs configured, builds without errors</done>
  <commit>feat(web): scaffold docs site with Fumadocs + Next.js 16</commit>
</task>

<task id="2" depends="1" type="auto">
  <name>Create docs layout and navigation structure</name>
  <files>
    <create>apps/web/app/(docs)/[[...slug]]/layout.tsx</create>
    <create>apps/web/app/(docs)/[[...slug]]/page.tsx</create>
    <create>apps/web/lib/layout.config.tsx</create>
    <create>apps/web/content/docs/meta.json</create>
    <create>apps/web/content/docs/index.mdx</create>
    <create>apps/web/content/components/meta.json</create>
    <create>apps/web/content/patterns/meta.json</create>
    <create>apps/web/content/ecosystem/meta.json</create>
  </files>
  <read_first>
    apps/web/lib/source.ts
    apps/web/app/layout.tsx
  </read_first>
  <action>
    Create the Fumadocs routing and navigation.

    layout.tsx: DocsLayout from fumadocs-ui/layouts/docs with sidebar tabs:
    - { title: "Getting Started", url: "/docs" }
    - { title: "UI", url: "/components" }
    - { title: "Patterns", url: "/patterns" }
    - { title: "Ecosystem", url: "/ecosystem" }

    page.tsx: Async RSC that loads MDX page via source.getPage(params.slug).
    Uses DocsPage, DocsTitle, DocsDescription, DocsBody from fumadocs-ui/page.
    Passes custom MDX components (Preview, PropTable, Installer — stubs for now).

    layout.config.tsx: Base nav options with links (GitHub, npm).

    meta.json files define sidebar navigation per section:
    - docs: Overview, Installation, Design Tokens, Responsive System, Motion Tokens
    - components: categorized (Layout, Controls, Data Display, Feedback, Overlay, Navigation, Form, Utility)
    - patterns: Transition
    - ecosystem: colorscope, stacksheet

    content/docs/index.mdx: Simple "Welcome to PatternMode" intro page with frontmatter.
  </action>
  <test_code>
    // No unit test — verify via dev server
  </test_code>
  <verify>
    pnpm --filter @patternmode/web dev starts on port 32000
    Navigating to localhost:32000/docs shows the intro page
    Sidebar shows all four sections with correct navigation
  </verify>
  <done>Docs layout renders, sidebar navigation works, all four sections visible</done>
  <commit>feat(web): add docs layout with four-section navigation</commit>
</task>

<task id="3" depends="2" type="auto">
  <name>Build the Preview component (async RSC)</name>
  <files>
    <create>apps/web/components/preview/index.tsx</create>
    <create>apps/web/components/preview/code.tsx</create>
    <create>apps/web/components/preview/render.tsx</create>
    <create>apps/web/lib/examples.ts</create>
    <create>apps/web/examples/button.tsx</create>
  </files>
  <read_first>
    apps/web/app/(docs)/[[...slug]]/page.tsx
  </read_first>
  <action>
    Build the live preview system with a static example registry.

    lib/examples.ts: Static registry mapping path strings to lazy imports:
    ```ts
    export const examples: Record<string, () => Promise<{ default: React.ComponentType }>> = {
      "button": () => import("../examples/button"),
      "button-loading": () => import("../examples/button-loading"),
      "button-icons": () => import("../examples/button-icons"),
      // ... one entry per example file
    };
    ```
    This avoids dynamic import paths (which bundlers cannot statically analyze) and gives
    a single manifest of all available examples.

    Preview (index.tsx): Async RSC that:
    1. Looks up the example in the registry for rendering the live component
    2. Reads the example source file from examples/{path}.tsx via fs.readFile (code tab only)
    3. Transforms import paths for display (@patternmode/ui/* → clean paths)
    4. Renders three tabs: Preview (live component), Code (syntax highlighted), Source (raw)

    Uses fumadocs-ui Tabs for the tab UI.
    Uses fumadocs-ui/components/codeblock for syntax highlighting.

    PreviewCode (code.tsx): Renders syntax-highlighted code using fumadocs codeblock.
    PreviewRender (render.tsx): Centered flex container for component preview.

    Create one example file (examples/button.tsx) as proof:
    ```tsx
    "use client";
    import { Button } from "@patternmode/ui/components/button";
    export default function ButtonExample() {
      return <Button>Click me</Button>;
    }
    ```

    Wire Preview into the page.tsx MDX components map.
  </action>
  <test_code>
    // No unit test — async RSC with fs reads is best verified via dev server
  </test_code>
  <verify>
    Create a test MDX page content/components/button.mdx with `<Preview path="button" />`
    Dev server shows the button preview with three tabs (Preview, Code, Source)
    Preview tab renders a live Button component
    Code tab shows the example source with syntax highlighting
  </verify>
  <done>Preview component renders live examples with code tabs</done>
  <commit>feat(web): add Preview component with live examples and code tabs</commit>
</task>

<task id="4" depends="2" type="auto">
  <name>Build the PropTable component (JSDoc extraction)</name>
  <files>
    <create>apps/web/components/prop-table.tsx</create>
  </files>
  <read_first>
    packages/ui/src/components/button/button-root.tsx
    packages/ui/src/components/input/input-root.tsx
  </read_first>
  <action>
    Build a PropTable component using fumadocs-typescript for real TypeScript compiler analysis.

    Add fumadocs-typescript to apps/web/package.json dependencies.

    The codebase uses VariantProps, Omit, ResponsiveValue<T> and other complex derived types
    that require actual TypeScript compiler resolution — regex parsing is insufficient.

    Use AutoTypeTable or TypeTable from fumadocs-typescript unconditionally.
    No regex fallback — the TypeScript compiler approach is the only path.

    The PropTable should render:
    | Prop | Type | Default | Description |
    with description pulled from JSDoc comments on the interface properties.

    Usage in MDX:
    ```mdx
    <PropTable component="ButtonProps" source="packages/ui/src/components/button/button-root.tsx" />
    ```

    Add PropTable to the MDX components map in page.tsx.
  </action>
  <test_code>
    // No unit test — RSC with file parsing
  </test_code>
  <verify>
    PropTable renders a table for ButtonProps showing: asChild, dot, dotPlacement, icon, loading, loadingLabel, suffixIcon
    Each prop shows its type and JSDoc description
    pnpm --filter @patternmode/web typecheck passes
  </verify>
  <done>PropTable extracts and renders props from TypeScript interfaces</done>
  <commit>feat(web): add PropTable component for JSDoc-driven documentation</commit>
</task>

<task id="5" depends="2" type="auto">
  <name>Build the Installer component</name>
  <files>
    <create>apps/web/components/installer.tsx</create>
  </files>
  <read_first>
    apps/web/app/(docs)/[[...slug]]/page.tsx
  </read_first>
  <action>
    Build a simple installation command UI component.

    Shows a code block with the pnpm add command. Uses fumadocs-ui codeblock styling.

    Props:
    - package: string (e.g., "@patternmode/ui")
    - path?: string (e.g., "components/button" — for import path display)

    Renders:
    ```
    pnpm add @patternmode/ui
    ```

    And optionally an import example:
    ```tsx
    import { Button } from "@patternmode/ui/components/button";
    ```

    Add to MDX components map in page.tsx.
  </action>
  <test_code>
    // Simple presentational component
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    Installer renders in MDX pages with correct package name
  </verify>
  <done>Installer component renders installation and import commands</done>
  <commit>feat(web): add Installer component for package installation UI</commit>
</task>

<task id="6" depends="3,4,5" type="auto">
  <name>Write Getting Started content pages</name>
  <files>
    <create>apps/web/content/docs/installation.mdx</create>
    <create>apps/web/content/docs/tokens.mdx</create>
    <create>apps/web/content/docs/responsive.mdx</create>
    <create>apps/web/content/docs/motion.mdx</create>
    <create>apps/web/examples/flex-responsive.tsx</create>
    <create>apps/web/examples/heading.tsx</create>
  </files>
  <read_first>
    packages/tailwind-config/shared-styles.css
    packages/ui/src/lib/responsive.ts
    packages/ui/src/lib/breakpoint.ts
    packages/motion/src/index.ts
  </read_first>
  <action>
    Write the five Getting Started pages. Each is a thin MDX shell — editorial content + Preview/PropTable references.

    index.mdx: Already created in task 2. Add more substance — what patternmode is, three layers (UI/Patterns/Ecosystem).

    installation.mdx: How to add packages, font setup, Tailwind config import.

    tokens.mdx: Document the oklch color system, radius tokens, shadow elevation system, typography scale. Use code blocks showing the CSS variables. No Preview needed — just formatted token tables.

    responsive.mdx: Document ResponsiveValue<T> type, breakpoints, usage with Flex/Grid/Heading/Text. Include Preview for flex-responsive example showing direction={{ base: "column", md: "row" }}.

    motion.mdx: Document @patternmode/motion — springs, easings, durations, presets. Show the named values.

    Create examples/flex-responsive.tsx and examples/heading.tsx for live demos.
  </action>
  <test_code>
    // Content pages — verified via navigation
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    All five Getting Started pages render without errors
    Responsive page shows live flex-responsive example
    Token page shows the color/shadow/radius documentation
  </verify>
  <done>Getting Started section complete with 5 pages</done>
  <commit>feat(web): add Getting Started documentation pages</commit>
</task>

<task id="7" depends="3,4,5" type="auto">
  <name>Write component pages batch 1 — Button, Input, Card, Dialog, Select</name>
  <files>
    <create>apps/web/content/components/button.mdx</create>
    <create>apps/web/content/components/input.mdx</create>
    <create>apps/web/content/components/card.mdx</create>
    <create>apps/web/content/components/dialog.mdx</create>
    <create>apps/web/content/components/select.mdx</create>
    <create>apps/web/examples/button-loading.tsx</create>
    <create>apps/web/examples/button-icons.tsx</create>
    <create>apps/web/examples/input.tsx</create>
    <create>apps/web/examples/input-states.tsx</create>
    <create>apps/web/examples/card.tsx</create>
    <create>apps/web/examples/dialog.tsx</create>
    <create>apps/web/examples/select.tsx</create>
  </files>
  <read_first>
    packages/ui/src/components/button/button-root.tsx
    packages/ui/src/components/input/input-root.tsx
    packages/ui/src/components/card/card-root.tsx
    packages/ui/src/components/dialog/dialog-root.tsx
    packages/ui/src/components/select/select-root.tsx
  </read_first>
  <action>
    Write 5 component documentation pages. Each follows the template:

    ```mdx
    ---
    title: Button
    description: Interactive button with loading, icon, and dot indicator support.
    ---

    <Installer package="@patternmode/ui" path="components/button" />

    <Preview path="button" />

    ## Loading State

    <Preview path="button-loading" />

    ## With Icons

    <Preview path="button-icons" />

    ## Props

    <PropTable component="ButtonProps" source="packages/ui/src/components/button/button-root.tsx" />
    ```

    Create example files for each. Examples are "use client" components that import from @patternmode/ui and render the component with representative props.

    Components with multiple examples:
    - Button: base, loading, icons
    - Input: base, states (focused, disabled, error)
    - Card: full composition
    - Dialog: interactive demo
    - Select: with options
  </action>
  <test_code>
    // Content pages — verified via navigation
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    All 5 component pages render without errors
    Each Preview shows a live component
    PropTable renders for button and input pages
  </verify>
  <done>5 component documentation pages (Button, Input, Card, Dialog, Select) with live previews and prop tables</done>
  <commit>feat(web): add component docs for Button, Input, Card, Dialog, Select</commit>
</task>

<task id="7b" depends="7" type="auto">
  <name>Write component pages batch 2 — Flex, Heading, Badge, Tabs, Alert</name>
  <files>
    <create>apps/web/content/components/flex.mdx</create>
    <create>apps/web/content/components/heading.mdx</create>
    <create>apps/web/content/components/badge.mdx</create>
    <create>apps/web/content/components/tabs.mdx</create>
    <create>apps/web/content/components/alert.mdx</create>
    <create>apps/web/examples/flex.tsx</create>
    <create>apps/web/examples/badge.tsx</create>
    <create>apps/web/examples/tabs.tsx</create>
    <create>apps/web/examples/alert.tsx</create>
  </files>
  <read_first>
    packages/ui/src/components/flex/flex-root.tsx
    packages/ui/src/components/heading/heading-root.tsx
    packages/ui/src/components/badge/badge-root.tsx
    packages/ui/src/components/tabs/tabs-root.tsx
    packages/ui/src/components/alert/alert-root.tsx
  </read_first>
  <action>
    Write 5 more component documentation pages following the same template as task 7.

    Components with their examples:
    - Flex: basic + responsive (reuses flex-responsive from task 6)
    - Heading: sizes (reuses heading from task 6)
    - Badge: variants
    - Tabs: basic
    - Alert: variants
  </action>
  <test_code>
    // Content pages — verified via navigation
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    All 5 component pages render without errors
    Sidebar shows all 10 components under UI section
  </verify>
  <done>5 component documentation pages (Flex, Heading, Badge, Tabs, Alert) with live previews and prop tables</done>
  <commit>feat(web): add component docs for Flex, Heading, Badge, Tabs, Alert</commit>
</task>

<task id="8" depends="3,4,5" type="auto">
  <name>Write Transition pattern page</name>
  <files>
    <create>apps/web/content/patterns/transition.mdx</create>
    <create>apps/web/examples/transition.tsx</create>
    <create>apps/web/examples/transition-presets.tsx</create>
    <create>apps/web/examples/transition-dismissible.tsx</create>
  </files>
  <read_first>
    packages/transition/src/index.ts
    packages/transition/src/transition-root.tsx
    packages/transition/src/transition-content.tsx
    packages/transition/src/presets.ts
  </read_first>
  <action>
    Write the Transition pattern documentation page.

    Include:
    - Attribution: "Inspired by Cambio by Raphael Salaja"
    - Installation: @patternmode/transition
    - Live demo: shared element transition with drag dismissal
    - Motion presets: snappy, smooth, bouncy, reduced
    - Drag dismissal configuration
    - API: PropTable for TransitionRootProps, TransitionContentProps

    Example should be a clickable card that morphs into a dialog with drag-to-dismiss.
  </action>
  <test_code>
    // Content page
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    Transition page renders under Patterns section
    Live demo shows shared element transition
    API section shows prop tables
  </verify>
  <done>Transition pattern page with live demo and API docs</done>
  <commit>feat(web): add Transition pattern documentation page</commit>
</task>

<task id="9" depends="2" type="auto">
  <name>Write Ecosystem pages (colorscope, stacksheet)</name>
  <files>
    <create>apps/web/content/ecosystem/colorscope.mdx</create>
    <create>apps/web/content/ecosystem/stacksheet.mdx</create>
  </files>
  <read_first>
    apps/web/content/ecosystem/meta.json
  </read_first>
  <action>
    Write two ecosystem recommendation pages. These are editorial — no Preview components, just documentation.

    colorscope.mdx:
    - What it is: Color science library for extraction, math, naming, schemes
    - Installation: pnpm add colorscope
    - Integration: How to use with patternmode avatars (getColorFromName), theme generation
    - Link to npm/GitHub

    stacksheet.mdx:
    - What it is: Typed animated sheet stack system with Apple-style depth
    - Installation: (link to repo)
    - When to use: Multiple stacked modals/sheets with depth-aware animations
    - Link to repo
  </action>
  <test_code>
    // Content pages
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    Both ecosystem pages render under Ecosystem section
    Links and installation commands are correct
  </verify>
  <done>Ecosystem section with colorscope and stacksheet pages</done>
  <commit>feat(web): add ecosystem recommendation pages</commit>
</task>

<task id="10" depends="6,7,7b" type="auto">
  <name>Build the landing page</name>
  <files>
    <create>apps/web/app/(home)/page.tsx</create>
    <create>apps/web/app/(home)/layout.tsx</create>
  </files>
  <read_first>
    apps/web/app/layout.tsx
    packages/ui/src/components/button/button-root.tsx
    packages/ui/src/components/card/card-root.tsx
    packages/ui/src/components/heading/heading-root.tsx
    packages/ui/src/components/text/text-root.tsx
    packages/ui/src/components/flex/flex-root.tsx
    packages/ui/src/components/badge/badge-root.tsx
  </read_first>
  <action>
    Build the landing page, dogfooding @patternmode/ui components.

    Aesthetic direction:
    - Tone: refined, confident, minimal. Not playful, not corporate.
    - Memorable: the component showcase grid — live components as visual proof
    - Typography: Ivar Display for headings, Inter for body
    - Color: oklch neutral palette with accent blue highlights
    - Motion: hover lift on cards, smooth transitions

    Sections:
    1. Hero: "PatternMode" heading (Ivar Display), one-line description, two CTAs (Get Started, GitHub)
    2. Component grid: 6-8 live component cards (Button, Input, Card, Badge, Slider, Select) rendered as real components
    3. Features: 3 cards — UI Library, Interaction Patterns, Curated Ecosystem
    4. Links: Getting Started, Storybook, GitHub

    Use @patternmode/ui components for ALL layout and UI. This page proves the library works.

    The layout.tsx for (home) should NOT use the DocsLayout — it's a standalone page.
  </action>
  <test_code>
    // Landing page — visual verification
  </test_code>
  <verify>
    pnpm --filter @patternmode/web typecheck
    pnpm --filter @patternmode/web build
    Landing page renders at localhost:32000/
    All patternmode components render correctly
    Navigation to /docs works from the landing page
  </verify>
  <done>Landing page built with dogfooded components</done>
  <commit>feat(web): add landing page with component showcase</commit>
</task>

<task id="11" depends="10" type="auto">
  <name>Add simple theme customizer to landing page</name>
  <files>
    <create>apps/web/components/theme-customizer.tsx</create>
  </files>
  <read_first>
    apps/web/app/(home)/page.tsx
    packages/tailwind-config/shared-styles.css
  </read_first>
  <action>
    Build a simple theme customizer that lets visitors tweak the accent color and border radius on the landing page.

    Implementation:
    - Client component with useState for accent hue and radius scale
    - Applies CSS variables via style attribute on a wrapper div:
      --color-accent: oklch(0.588 0.158 [hue])
      --radius-md: [value]rem
    - Simple slider controls for hue (0-360) and radius (0.25-1rem)
    - Changes are live — the component showcase grid updates immediately

    Keep it minimal. Two sliders, immediate visual feedback. No persistence, no theme export.

    Add to the landing page below the hero section.
  </action>
  <test_code>
    // Interactive component — visual verification
  </test_code>
  <verify>
    Theme customizer renders on landing page
    Moving the hue slider changes the accent color of all components
    Moving the radius slider changes border radii
    Components update in real time
  </verify>
  <done>Theme customizer with accent color and radius controls</done>
  <commit>feat(web): add theme customizer to landing page</commit>
</task>

<task id="12" depends="7,7b" type="auto">
  <name>Add JSDoc annotations to key component interfaces</name>
  <files>
    <modify>packages/ui/src/components/button/button-root.tsx</modify>
    <modify>packages/ui/src/components/input/input-root.tsx</modify>
    <modify>packages/ui/src/components/card/card-root.tsx</modify>
    <modify>packages/ui/src/components/dialog/dialog-root.tsx</modify>
    <modify>packages/ui/src/components/select/select-root.tsx</modify>
    <modify>packages/ui/src/components/flex/flex-root.tsx</modify>
    <modify>packages/ui/src/components/heading/heading-root.tsx</modify>
    <modify>packages/ui/src/components/badge/badge-root.tsx</modify>
    <modify>packages/ui/src/components/tabs/tabs-root.tsx</modify>
    <modify>packages/ui/src/components/alert/alert-root.tsx</modify>
    <modify>packages/transition/src/transition-root.tsx</modify>
    <modify>packages/transition/src/transition-content.tsx</modify>
  </files>
  <read_first>
    packages/ui/src/components/button/button-root.tsx
    packages/ui/src/components/input/input-root.tsx
    packages/transition/src/transition-root.tsx
  </read_first>
  <action>
    Add JSDoc comments to all exported interface properties that don't already have them.

    ButtonProps already has JSDoc (dot, icon, loading, etc.) — verify and complete if needed.

    For each interface, every property should have a /** description */ comment. These are the single source of truth for PropTable.

    Example:
    ```tsx
    export interface FlexProps extends ComponentPropsWithoutRef<"div"> {
      /** Alignment of items along the cross axis. Accepts responsive objects. */
      align?: ResponsiveValue<FlexAlign>;
      /** Flex direction. Accepts responsive objects like { base: "column", md: "row" }. */
      direction?: ResponsiveValue<FlexDirection>;
      /** Gap between children. Accepts responsive objects. */
      gap?: ResponsiveValue<GapSize>;
    }
    ```

    Focus on the 10 component pages + 2 transition components. Don't annotate every component — just the ones with documentation pages.
  </action>
  <test_code>
    // Documentation quality — no test needed
  </test_code>
  <verify>
    pnpm turbo typecheck
    pnpm --filter @patternmode/web build
    Each documented interface has JSDoc on all public properties
    PropTable component can extract descriptions from the annotated interfaces
  </verify>
  <done>Key component interfaces annotated with JSDoc for PropTable extraction</done>
  <commit>docs: add JSDoc annotations to key component interfaces</commit>
</task>

<task id="13" depends="1,2,3,4,5,6,7,7b,8,9,10,11,12" type="checkpoint:verify">
  <name>Verify complete docs site</name>
  <action>
    Start the dev server and verify the complete docs site:

    1. Landing page at localhost:32000/ — renders with component showcase and theme customizer
    2. Getting Started at /docs — 5 pages with correct navigation
    3. UI section at /components — 10 component pages with live previews and prop tables
    4. Patterns section at /patterns — Transition page with demo
    5. Ecosystem section at /ecosystem — colorscope and stacksheet pages
    6. Search works (Fumadocs built-in)
    7. Sidebar navigation has all sections and categories
    8. All Previews render live components
    9. PropTable extracts from JSDoc correctly

    Build succeeds: pnpm --filter @patternmode/web build
    Typecheck: pnpm turbo typecheck — all packages pass
  </action>
  <verify>
    pnpm turbo typecheck
    pnpm --filter @patternmode/web build
    curl -s -o /dev/null -w "%{http_code}" http://localhost:32000/ returns 200
    curl -s -o /dev/null -w "%{http_code}" http://localhost:32000/docs returns 200
    curl -s -o /dev/null -w "%{http_code}" http://localhost:32000/components/button returns 200
    curl -s -o /dev/null -w "%{http_code}" http://localhost:32000/patterns/transition returns 200
    curl -s -o /dev/null -w "%{http_code}" http://localhost:32000/ecosystem/colorscope returns 200
  </verify>
  <done>Complete docs site verified — typecheck passes, build succeeds, all routes return 200</done>
  <commit>feat(web): docs site complete</commit>
</task>
