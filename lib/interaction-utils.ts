/**
 * User interaction utilities for haptic feedback and keyboard support
 */

/**
 * Trigger haptic feedback on supported devices (mobile/tablet)
 */
export function triggerHapticFeedback(pattern: 'light' | 'medium' | 'heavy' = 'medium') {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    const durations = {
      light: 10,
      medium: 20,
      heavy: 50,
    };
    try {
      navigator.vibrate(durations[pattern]);
    } catch (error) {
      // Silently fail if haptic feedback is not supported
    }
  }
}

/**
 * Get keyboard modifier info
 */
export function getKeyboardModifiers(event: KeyboardEvent) {
  return {
    shift: event.shiftKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    meta: event.metaKey,
  };
}

/**
 * Check if a key press is for a specific action
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
} as const;

/**
 * Enhance button with keyboard support
 */
export function isKeyboardActivation(event: KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE;
}

/**
 * Get accessible role for button based on type
 */
export function getButtonRole(variant: string): string | undefined {
  return variant === 'toggle' ? 'switch' : undefined;
}
