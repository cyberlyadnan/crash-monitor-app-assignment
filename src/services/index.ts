/**
 * API clients, background tasks, and external integrations live here.
 * Import configuration from constants or env — avoid hardcoding secrets.
 */

export { createHttpClient } from './http';
export { initSentry, PLACEHOLDER_SENTRY_DSN, Sentry } from './sentry';
