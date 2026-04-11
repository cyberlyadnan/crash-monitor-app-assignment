/**
 * Placeholders for native crash reporting / repro hooks — wire up in a later iteration.
 */
export function triggerSyncCrashPlaceholder(): void {
  console.warn('[crashHandlers] triggerSyncCrashPlaceholder — not implemented');
}

export function triggerAsyncCrashPlaceholder(): Promise<void> {
  console.warn('[crashHandlers] triggerAsyncCrashPlaceholder — not implemented');
  return Promise.resolve();
}
