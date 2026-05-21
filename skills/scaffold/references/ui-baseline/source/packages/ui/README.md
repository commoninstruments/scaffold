# @patternmode/ui

Shared React component library for Patternmode.

## Principles

- Components live here, not in apps.
- Public entrypoints stay small and stable.
- Implementation lives behind barrel files when a component grows beyond a single file.
- Shared support code belongs in `src/lib` and `src/utils`, not scattered across components.
- Storybook should review package-owned stories, not just app-local demos.

## Structure

```text
src/
  components/
    button.tsx
    button/
      button-root.tsx
      button-variants.ts
      button.stories.tsx
  lib/
    size.ts
    variant.ts
  utils/
    cn.ts
    focus-input.ts
    focus-ring.ts
  stories/
    design-tokens.stories.tsx
```

## Scope

Patternmode should track PatternMode’s general approach:

- broad primitive coverage for shared UI foundations
- package-level stories for review and regression confidence
- utility and type layers that keep components consistent

Patternmode should still remain distinct in visual language. PatternMode is the structural reference, not the aesthetic template.
