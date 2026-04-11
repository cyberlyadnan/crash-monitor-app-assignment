import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

/**
 * Replace with your project DSN from Sentry (Settings → Client Keys).
 * Prefer `EXPO_PUBLIC_SENTRY_DSN` in `.env` / EAS env for real builds.
 */
export const PLACEHOLDER_SENTRY_DSN =
  'https://00000000000000000000000000000000@o000000.ingest.sentry.io/0000000';

function resolveDsn(): string {
  return process.env.EXPO_PUBLIC_SENTRY_DSN ?? PLACEHOLDER_SENTRY_DSN;
}

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

let initialized = false;

/**
 * Idempotent SDK setup. Called automatically when this module is imported.
 * Override options in one place as the app grows (integrations, replays, navigation tracing).
 */
export function initSentry(): void {
  if (initialized) {
    return;
  }
  initialized = true;

  const expoGo = isExpoGo();

  Sentry.init({
    dsn: resolveDsn(),
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
    enableAutoSessionTracking: true,
    /**
     * Expo Go + New Architecture: leave performance tracing off so we do not register
     * tracing integrations that assume a full native Sentry client (see terminal: bridge type mismatches).
     * EAS / dev builds use `appOwnership !== 'expo'` and get normal sampling below.
     */
    ...(expoGo
      ? {
          enableAutoPerformanceTracing: false,
          enableAppStartTracking: false,
          enableStallTracking: false,
        }
      : {
          tracesSampleRate: __DEV__ ? 1.0 : 0.2,
        }),
  });
}

initSentry();

export { Sentry };
