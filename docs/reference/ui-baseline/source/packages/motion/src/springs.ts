/**
 * Spring configuration tokens inspired by iOS animation feel.
 *
 * Physics-based springs use stiffness, damping, and mass.
 * These provide natural, velocity-aware animations.
 *
 * Spring personalities:
 * - soft: Very gentle, slow settle — loaders, radial pickers
 * - subtle: Barely noticeable bounce, professional
 * - natural: Balanced, default choice
 * - playful: Character with bounce
 * - bouncy: Visible bounce, energetic — popovers, hints
 * - snappy: Quick, responsive for interactions
 * - stiff: Very quick, controlled — panels, drawers
 * - swift: Instant, zero overshoot — dropdowns, popovers
 */
export const springs = {
  soft: { type: "spring", stiffness: 120, damping: 18, mass: 1 },
  subtle: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
  natural: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  playful: { type: "spring", stiffness: 170, damping: 15, mass: 1 },
  bouncy: { type: "spring", stiffness: 260, damping: 12, mass: 1 },
  snappy: { type: "spring", stiffness: 400, damping: 28, mass: 0.8 },
  stiff: { type: "spring", stiffness: 500, damping: 30, mass: 1 },
  swift: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
} as const;

export type SpringType = keyof typeof springs;
