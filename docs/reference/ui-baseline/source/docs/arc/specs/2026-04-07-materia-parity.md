# Materia Parity Plan

**Goal:** Bring patternmode's `@patternmode/ui` to feature parity with materia's system-level primitives, making it a canonical, shadcn-convention starting block for new apps.

**Non-goal:** Domain-specific components (ColorPicker, RadialColorPicker, DataGrid, TagSelector, EditorialCard). Those are materia-specific compositions. Patternmode should provide the primitives that make building those easy.

---

## Phase 1: Core Systems

These are foundational — everything else depends on them.

### 1.1 Extended Size System

**Current:** `sm | base | lg`
**Target:** `2xs | xs | sm | base | lg | xl | 2xl | 3xl`

Files to create/modify:
- `packages/ui/src/lib/size.ts` — extend `COMPONENT_SIZES` array and `ComponentSize` type

Update all components that use `ComponentSize` to support the extended range (button, input, select, etc.). Existing `sm | base | lg` consumers remain backwards-compatible since those values still exist.

### 1.2 Breakpoint System

Create `packages/ui/src/lib/breakpoint.ts`:
- `BREAKPOINT_VALUES` constant with pixel values: 2xs(320), xs(480), sm(640), md(768), lg(1024), xl(1280), 2xl(1536), 3xl(1920)
- `Breakpoint` type = keyof typeof BREAKPOINT_VALUES | "base"
- `BREAKPOINTS` ordered array (smallest to largest, excluding base)
- `Viewport` type = "mobile" | "tablet" | "desktop"

### 1.3 Responsive Value System

Create `packages/ui/src/lib/responsive.ts`:
- `ResponsiveValue<T>` type — `T | (Partial<Record<Breakpoint, T>> & { base?: T })`
- `ResponsiveMode` type — `"screen" | "container"`
- `SCREEN_PREFIX` and `CONTAINER_PREFIX` maps
- `isResponsiveValue()` type guard
- `getBreakpointPrefix()` helper
- `getResponsiveClasses()` — converts `ResponsiveValue<T>` + class map → Tailwind classes with breakpoint prefixes
- `pushResponsiveClasses()` — convenience mutating variant

Create `packages/ui/src/lib/responsive-classes.ts`:
- Pre-defined class maps for all layout utilities
- `GAP_CLASS`, `GAP_X_CLASS`, `GAP_Y_CLASS` (none through 3xl)
- `DIRECTION_CLASS` (row, column, row-reverse, column-reverse)
- `JUSTIFY_CLASS` (flex-start, center, flex-end, space-between, space-around, space-evenly)
- `ALIGN_CLASS` (stretch, flex-start, center, flex-end, baseline)
- `WRAP_CLASS` (wrap, nowrap, wrap-reverse)
- `GRID_COLS_CLASS` (1-12)
- `COL_SPAN_CLASS` (1-12 + auto + full)
- `COL_START_CLASS` (1-13 + auto)
- `WIDTH_CLASS`, `HEIGHT_CLASS` (ComponentSize → Tailwind)
- `PADDING_X_CLASS`, `PADDING_Y_CLASS` (ComponentSize → Tailwind)
- `MAX_WIDTH_CLASS` (ComponentSize → Tailwind)
- `ORDER_CLASS` (1-12 + first/last/none)

Supporting type files:
- `packages/ui/src/lib/direction.ts` — `FlexDirection` type
- `packages/ui/src/lib/alignment.ts` — `FlexAlign` type
- `packages/ui/src/lib/justify.ts` — `FlexJustify` type
- `packages/ui/src/lib/wrap.ts` — `FlexWrap` type

### 1.4 Upgrade Layout Components to Responsive

Upgrade `Flex` to accept `ResponsiveValue<>` for all layout props:
```tsx
interface FlexProps {
  direction?: ResponsiveValue<FlexDirection>;
  justify?: ResponsiveValue<FlexJustify>;
  align?: ResponsiveValue<FlexAlign>;
  wrap?: ResponsiveValue<FlexWrap>;
  gap?: ResponsiveValue<GapSize>;
  responsiveMode?: "screen" | "container";
}
```

Upgrade `Grid` to accept responsive columns:
```tsx
interface GridProps {
  columns?: ResponsiveValue<number>;
  gap?: ResponsiveValue<GapSize>;
}
```

Upgrade `Container` to accept responsive padding:
```tsx
interface ContainerProps {
  px?: ResponsiveValue<ComponentSize>;
  py?: ResponsiveValue<ComponentSize>;
}
```

Upgrade `Heading` and `Text` to accept responsive size:
```tsx
<Heading size={{ base: "sm", md: "lg" }}>Title</Heading>
<Text size={{ base: "sm", lg: "base" }}>Body</Text>
```

Export new lib files from `package.json` exports map.

---

## Phase 2: Hooks

Create `packages/ui/src/hooks/` directory with:

### 2.1 useBreakpoint
Uses `useMediaQuery` from `usehooks-ts`. Returns true when viewport >= breakpoint.
Dependency: add `usehooks-ts` to `packages/ui`.

### 2.2 useIsMobile
Returns true when viewport < 1024px. SSR-safe (defaults to false).

### 2.3 useViewport
Returns `"mobile" | "tablet" | "desktop"` based on viewport width.
- mobile: < 768px
- tablet: 768-1023px
- desktop: >= 1024px

### 2.4 useDebouncedValue
Generic debounce hook for reactive values.

### 2.5 useInlineEdit
State machine for inline editing with keyboard shortcuts (Escape to cancel, Enter to save, Cmd+Enter for multiline).

Export all hooks from `packages/ui/package.json` exports: `"./hooks/*": "./src/hooks/*.ts"` (already configured).

---

## Phase 3: Motion Token Package

Create `packages/motion/` as a new workspace package.

### 3.1 Package setup
- `package.json` with `@patternmode/motion` name
- `tsconfig.json` extending `@patternmode/typescript-config`
- `biome.json` for linting
- Export map: `"./": "./src/index.ts"`

### 3.2 Token files
- `src/springs.ts` — 8 named springs (soft, subtle, natural, playful, bouncy, snappy, stiff, swift) with stiffness/damping/mass
- `src/durations.ts` — Named durations in seconds (instant, quick, normal, moderate, slow) + `durationMs` in milliseconds
- `src/easings.ts` — Named cubic-bezier tuples (smooth, customIn, customOut, customExpand, customGentle) + `easingsCSS` string variants
- `src/scales.ts` — Scale multipliers for interaction feedback (press, pressDeep, hover, hoverLift)
- `src/presets.ts` — Semantic combinations (dialogOpen/Close, hoverLift/Settle, slideIn/Out, fadeIn/Out, shake) + `shakeKeyframes`
- `src/index.ts` — barrel export

### 3.3 Integration
- Add `@patternmode/motion` as dependency of `@patternmode/ui`
- Re-export from `packages/ui/src/lib/motion.ts`
- Available for direct consumption by apps too

---

## Phase 4: Utilities & Conventions

### 4.1 has-error-input Utility
Create `packages/ui/src/utils/has-error-input.ts`:
- Array of classes responding to `aria-invalid` and `data-[error=true]`
- Includes dark mode variants
- Apply to Input, Textarea, Select trigger, and any input-like component

### 4.2 Deterministic Color Utilities
Create `packages/ui/src/lib/color.ts`:
- `DETERMINISTIC_COLORS` — 90-color palette
- `customHash(value)` — polynomial rolling hash
- `getColorFromName(string)` — maps any string to a stable color
- `getRandomColor()` — random palette color
- `getReadableTextColor(bgHex)` — returns "#000000" or "#FFFFFF"
- `getInitials(name)` — avatar initials extraction

### 4.3 compose-refs Utility
Create `packages/ui/src/lib/compose-refs.ts`:
- `useComposedRefs(...refs)` — merges multiple refs (callback + object)
- React 19 compatible

### 4.4 WithTestId Convention
Create a `WithTestId<T>` utility type in `packages/ui/src/lib/types.ts`:
```tsx
type WithTestId<T> = T & { testId?: string };
```
Add `data-testid={testId}` to core components (Button, Input, Select, Dialog, etc.).

---

## Phase 5: Button Power Features

### 5.1 Loading State
Add to Button:
- `loading?: boolean` prop
- `loadingLabel?: string` — optional text while loading
- Spinner component (AnimatePresence for smooth transition)
- Auto-disables when loading

### 5.2 Icon Support
Add to Button:
- `icon?: React.ReactNode` — leading icon
- `suffixIcon?: React.ReactNode` — trailing icon
- Smart animation: only animate when icon changes (track via useRef)
- Auto-size icons based on button size

### 5.3 Dot Indicator
Add to Button:
- `dot?: string` — CSS color value
- `dotPlacement?: "start" | "end"`
- Proportional sizing to button size

### 5.4 Icon-Only Detection
- Auto-detect when children contains only an icon
- Dev-mode warning when icon-only button lacks `aria-label`
- Icon-specific size variants: `icon-2xs` through `icon-3xl`

### 5.5 Appearance Axis
Add second styling axis alongside `variant`:
- `appearance?: "solid" | "outline" | "ghost" | "dashed" | "transparent"`
- Compound variants for variant+appearance combinations
- Existing `variant` values remain backwards-compatible

---

## Phase 6: Component Enhancements

### 6.1 Tabs Animated Indicator
- Add `motion/react` dependency
- Use `layoutId` for shared element transitions
- Support pill, line, underline, segmented variants
- Instance IDs for multiple tab groups

### 6.2 Skeleton Shimmer
- Add `animate-shimmer` animation to shared-styles.css
- Gradient sweep effect
- Variant support (default/light)

### 6.3 Field Error Enhancement
- Accept `errors` array with `{ message? }` objects
- Deduplicate messages
- `aria-live="polite"` and `role="alert"`

### 6.4 Data Attributes Convention
Standardize across all interactive components:
- `data-focused={focused || undefined}`
- `data-hovered={hovered || undefined}`
- `data-pressed={pressed || undefined}`
- `data-error={hasError || undefined}`

---

## Phase 7: Integration Components (one-at-a-time, as needed)

These are not part of "parity" but are high-value additions. Each can be added independently:

1. **Sonner Toast** — `sonner` wrapper with opinionated dark pill styling
2. **Drawer** — `vaul` wrapper with mobile bottom sheet behavior
3. **Carousel** — `embla-carousel-react` wrapper with context API
4. **OTP Input** — `input-otp` wrapper with animated caret
5. **Phone Input** — `react-phone-number-input` wrapper
6. **Avatar Group** — overlap control, surplus "+N", selection mode
7. **Progress Circle** — SVG circular progress with stroke dash animation

---

## Dependencies to Add

| Package | Phase | Purpose |
|---------|-------|---------|
| `usehooks-ts` | 2 | useMediaQuery for breakpoint hooks |
| `motion` | 3, 5, 6 | Animation library (springs, AnimatePresence) |

---

## Estimated Scope

| Phase | Files | Complexity |
|-------|-------|-----------|
| 1. Core Systems | ~12 new, ~8 modified | High (foundational) |
| 2. Hooks | 5 new, 1 modified | Low |
| 3. Motion Package | ~8 new | Low (data, no logic) |
| 4. Utilities | 4 new, ~6 modified | Low-Medium |
| 5. Button | 2 modified | Medium-High |
| 6. Enhancements | ~5 modified | Medium |
| 7. Integrations | 1-2 per component | Per-project |

**Phases 1-4 are the structural backbone. Phase 5-6 add polish. Phase 7 is on-demand.**
