/**
 * Shared helpers. Prefer pure utilities; crash helpers are isolated in `crashUtils` and re-exported for convenience.
 */

export { crashApp, crashAsync } from './crashUtils';

export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Expected value to be defined');
  }
}
