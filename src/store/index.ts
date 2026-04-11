/**
 * Centralized client-side state (context, Zustand, Redux, etc.).
 * Add slices/stores here and export typed hooks from dedicated files.
 */

export type AppState = {
  /** Extend when you introduce global state. */
  version: number;
};

export const initialAppState: AppState = {
  version: 1,
};
