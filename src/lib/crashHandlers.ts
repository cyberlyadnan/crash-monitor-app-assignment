import * as Sentry from '@sentry/react-native';

export function sendDiagnosticLog(message: string): void {
  Sentry.addBreadcrumb({
    category: 'diagnostics',
    message,
    level: 'info',
  });
  Sentry.captureMessage(message, 'info');
}

export function triggerSyncCrash(): never {
  const error = new Error('Manual sync crash from CrashSyncScreen');
  Sentry.captureException(error);
  throw error;
}

export async function triggerAsyncCrash(): Promise<never> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const error = new Error('Manual async crash from CrashAsyncScreen');
  Sentry.captureException(error);
  throw error;
}
