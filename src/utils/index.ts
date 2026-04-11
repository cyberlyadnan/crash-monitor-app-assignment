/**
 * Shared pure helpers (formatting, guards, small transforms).
 * Keep side effects out of this module.
 */

export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Expected value to be defined');
  }
}
