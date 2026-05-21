import type {
  DragSpringConfig,
  MotionPreset,
  MotionPresetName,
  MotionVariants,
} from "./types";

/**
 * Motion presets — each bundles transition timing AND drag physics
 * so "snappy" feels snappy everywhere: open, close, and drag.
 */
export const PRESETS: Record<MotionPresetName, MotionPreset> = {
  snappy: {
    transition: { ease: [0.19, 1, 0.22, 1], duration: 0.24 },
    drag: { stiffness: 600, damping: 40, restDelta: 0.01 },
  },
  smooth: {
    transition: { ease: [0.42, 0, 0.58, 1], duration: 0.3 },
    drag: { stiffness: 350, damping: 25, restDelta: 0.01 },
  },
  bouncy: {
    transition: {
      type: "spring",
      stiffness: 1200,
      damping: 80,
      mass: 4,
    },
    drag: { stiffness: 400, damping: 30, restDelta: 0.01 },
  },
  reduced: {
    transition: { ease: "linear", duration: 0.01 },
    drag: { stiffness: 1000, damping: 50, restDelta: 0.1 },
  },
};

type ComponentType = "trigger" | "content" | "backdrop";

/**
 * Three-level motion resolution:
 * 1. Component-level override (highest)
 * 2. Per-component variant from Root
 * 3. Global preset from Root (lowest)
 *
 * If `prefers-reduced-motion` is active, always returns "reduced".
 */
export function resolvePreset(
  componentType: ComponentType,
  componentMotion: MotionPresetName | undefined,
  globalPreset: MotionPresetName,
  variants: MotionVariants | undefined,
  reduceMotion: boolean,
): MotionPreset {
  if (reduceMotion) {
    return PRESETS.reduced;
  }

  // 1. Component-level override
  if (componentMotion) {
    return PRESETS[componentMotion];
  }

  // 2. Per-component variant
  if (variants?.[componentType]) {
    return PRESETS[variants[componentType]];
  }

  // 3. Global preset
  return PRESETS[globalPreset];
}

/** Extract the drag spring config from a preset */
export function getDragSpring(preset: MotionPreset): DragSpringConfig {
  return preset.drag;
}
