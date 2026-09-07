/**
 * API client for TOEIC Master backend.
 *
 * Handles:
 * - Base URL from NEXT_PUBLIC_API_URL env
 * - credentials: 'include' on ALL requests (for HttpOnly cookie)
 * - Authorization: Bearer <accessToken> header injection
 * - Automatic token refresh on 401 responses (silent retry)
 * - Standard error shape from API envelope
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ── Lazy import of auth store (avoids circular deps) ────────────────
function getAccessToken(): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('../stores/auth.store') as typeof import('../stores/auth.store');
    return useAuthStore.getState().accessToken;
  } catch {
    return null;
  }
}

function setAuth(user: unknown, accessToken: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('../stores/auth.store') as typeof import('../stores/auth.store');
    useAuthStore.getState().setAuth(user as never, accessToken);
  } catch { /* */ }
}

function clearAuth() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('../stores/auth.store') as typeof import('../stores/auth.store');
    useAuthStore.getState().clearAuth();
  } catch { /* */ }
}

// ── Core fetch wrapper ────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/v1/auth/refresh`, {
        method:      'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        clearAuth();
        return false;
      }

      const json = await res.json() as { success: boolean; data: { accessToken: string; user?: unknown } };
      if (json.success && json.data.accessToken) {
        setAuth(json.data.user ?? {}, json.data.accessToken);
        return true;
      }
      clearAuth();
      return false;
    } catch {
      clearAuth();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export type ApiResult<T> =
  | { success: true;  data: T }
  | { success: false; error: { code: string; message: string } };

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const makeRequest = () =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',   // always include cookies
      headers,
    });

  let response = await makeRequest();

  // Silent refresh on 401
  if (response.status === 401 && accessToken) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Update Authorization header with new token
      const newToken = getAccessToken();
      if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
      response = await makeRequest();
    }
  }

  const json = await response.json() as Record<string, unknown>;

  if (!response.ok || json['success'] === false) {
    const errorData = (json['error'] as { code?: string; message?: string }) ?? {};
    return {
      success: false,
      error: {
        code:    errorData.code    ?? String(response.status),
        message: errorData.message ?? 'Something went wrong',
      },
    };
  }

  return { success: true, data: json['data'] as T };
}

// ── Auth endpoints ────────────────────────────────────────────────

export const authApi = {
  register: (body: { email: string; username: string; password: string; displayName: string }) =>
    apiRequest<{ accessToken: string; user: unknown }>('/v1/auth/register', {
      method: 'POST',
      body:   JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiRequest<{ accessToken: string; user: unknown }>('/v1/auth/login', {
      method: 'POST',
      body:   JSON.stringify(body),
    }),

  logout: () =>
    apiRequest<{ message: string }>('/v1/auth/logout', { method: 'POST' }),

  me: () => apiRequest<unknown>('/v1/auth/me'),
};

// ── Placement endpoints ───────────────────────────────────────────

export const placementApi = {
  getQuestions: () => apiRequest<unknown[]>('/v1/placement/questions'),
  submit:       (answers: Record<string, string>) =>
    apiRequest<unknown>('/v1/placement/submit', {
      method: 'POST',
      body:   JSON.stringify({ answers }),
    }),
  getResult: () => apiRequest<unknown>('/v1/placement/result'),
};

// ── Roadmap endpoints ─────────────────────────────────────────────

export const roadmapApi = {
  generate: (body: {
    targetBand:       string;
    targetScore:      number;
    dailyGoalMinutes: number;
    studyDeadline?:   string;
    currentBand?:     string;
    placementTestResultId?: string;
  }) =>
    apiRequest<unknown>('/v1/roadmap/generate', {
      method: 'POST',
      body:   JSON.stringify(body),
    }),

  getMyRoadmap: () => apiRequest<unknown>('/v1/roadmap/me'),

  getNodes: (week?: number) =>
    apiRequest<unknown[]>(`/v1/roadmap/me/nodes${week ? `?week=${week}` : ''}`),

  checkIn: (weekNumber: number, feedback: 'too_easy' | 'just_right' | 'too_hard') =>
    apiRequest<unknown>('/v1/roadmap/check-in', {
      method: 'POST',
      body:   JSON.stringify({ weekNumber, feedback }),
    }),
};

// ── User endpoints ────────────────────────────────────────────────

export const userApi = {
  me:            () => apiRequest<unknown>('/v1/users/me'),
  updateProfile: (body: Record<string, unknown>) =>
    apiRequest<unknown>('/v1/users/me/profile', {
      method: 'PATCH',
      body:   JSON.stringify(body),
    }),
};
