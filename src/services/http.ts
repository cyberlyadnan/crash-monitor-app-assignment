import { APP_NAME } from '@/constants';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Client': APP_NAME,
};

export type HttpClientOptions = {
  baseUrl?: string;
  headers?: HeadersInit;
};

/**
 * Minimal fetch wrapper for REST calls. Extend with auth interceptors as needed.
 */
export function createHttpClient(options: HttpClientOptions = {}) {
  const baseUrl = options.baseUrl?.replace(/\/$/, '') ?? '';

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      ...init,
      headers: { ...defaultHeaders, ...options.headers, ...init?.headers },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
    }

    return (await response.json()) as T;
  }

  return { request };
}
