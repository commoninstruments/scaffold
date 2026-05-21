/**
 * Scale tokens for interactive feedback.
 *
 * These values define transform scale multipliers for interaction states.
 * Use with Tailwind arbitrary values: `active:scale-[0.97]`
 *
 * Scale personalities:
 * - press: Subtle shrink on click/tap (0.97)
 * - pressDeep: More pronounced press feedback (0.95)
 * - hover: Slight lift on hover (1.02)
 * - hoverLift: More pronounced hover lift (1.05)
 */
export const scales = {
  press: 0.97,
  pressDeep: 0.95,
  hover: 1.02,
  hoverLift: 1.05,
} as const;

export type Scale = keyof typeof scales;
