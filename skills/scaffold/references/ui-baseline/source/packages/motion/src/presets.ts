import { durations } from "./durations";
import { easings } from "./easings";
import { springs } from "./springs";

/**
 * Semantic transition presets combining durations, easings, and springs.
 *
 * Use these for common patterns to ensure consistency across the app.
 * Composition-based: spread these into your transition prop.
 *
 * @example
 * ```tsx
 * <motion.div transition={presets.dialogOpen} />
 * ```
 */
export const presets = {
  dialogOpen: { duration: durations.normal, ease: easings.customOut },
  dialogClose: { duration: durations.quick, ease: easings.customIn },

  hoverLift: springs.snappy,
  hoverSettle: springs.natural,

  slideIn: { duration: durations.normal, ease: easings.customOut },
  slideOut: { duration: durations.quick, ease: easings.customIn },

  fadeIn: { duration: durations.quick, ease: easings.customOut },
  fadeOut: { duration: durations.quick, ease: easings.customIn },

  shake: { duration: durations.normal, ease: easings.customOut },
} as const;

/**
 * Shake animation keyframes for error feedback.
 * Apply to the `x` property with `animate` prop.
 *
 * @example
 * ```tsx
 * <motion.div
 *   animate={hasError ? { x: shakeKeyframes } : { x: 0 }}
 *   transition={presets.shake}
 * />
 * ```
 */
export const shakeKeyframes = [0, -6, 6, -4, 4, 0];

export type Preset = keyof typeof presets;
