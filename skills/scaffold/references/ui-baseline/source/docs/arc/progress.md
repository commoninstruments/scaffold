## 2026-04-06 01:45 — /arc:ideate
**Task:** Define a canonical UI library strategy for `patternmode`, centered on making it the source of truth for active projects.
**Outcome:** Complete
**Files:** docs/arc/specs/2026-04-06-patternmode-canonical-ui-library-design.md
**Decisions:**
- Approach: Rebuild `patternmode` as the canonical upstream monorepo for shared UI, styling, and Storybook.
- Component strictness should follow the `materia` model, but the default visual language should be neutral and closer to aligned projects like `stow`.
- Minor variation should happen through tokens, typed variants, slots, and app-local wrappers rather than component forks.
**Next:** /arc:implement

---

## 2026-04-06 01:52 — /arc:review
**Task:** Review the `patternmode` canonical UI library design.
**Outcome:** Complete
**Files:** docs/arc/specs/2026-04-06-patternmode-canonical-ui-library-design.md
**Decisions:**
- Added explicit `patternmode` house-style guardrails so the system does not collapse into generic shadcn aesthetics.
- Kept tokens and theme presets inside `@patternmode/tailwind-config` for now rather than abstracting early.
- Narrowed migration to a single pilot consumer first and softened the Storybook completeness rule to exported user-facing components.
**Next:** /arc:implement

---
