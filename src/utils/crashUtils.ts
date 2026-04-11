/**
 * Deliberate failure paths for validating Sentry wiring (events, source maps, release health).
 * Do not call from production code paths except a dedicated diagnostics surface.
 */

const SYNC_TAG = '[CrashMonitor:sync]';
const ASYNC_TAG = '[CrashMonitor:async]';

/**
 * Throws immediately. Surfaces as a JavaScript exception (captured by Sentry’s global handler).
 */
export function crashApp(): never {
  throw new Error(`${SYNC_TAG} crashApp — deliberate synchronous error`);
}

/**
 * Schedules a rejected promise with no handler → unhandled promise rejection (captured by Sentry).
 */
export function crashAsync(): void {
  void Promise.reject(new Error(`${ASYNC_TAG} crashAsync — deliberate unhandled rejection`));
}
