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

// ── Vocabulary endpoints ──────────────────────────────────────────

export const vocabularyApi = {
  getTopics: () => apiRequest<unknown[]>('/v1/vocabulary/topics'),
  getTopicCards: (topicId: string) => apiRequest<{ topic: unknown; cards: unknown[] }>(`/v1/vocabulary/topics/${topicId}`),
  reviewCard: (cardId: string, quality: number) =>
    apiRequest<unknown>(`/v1/vocabulary/cards/${cardId}/review`, {
      method: 'POST',
      body:   JSON.stringify({ quality }),
    }),
  getDueCards: () => apiRequest<unknown[]>('/v1/vocabulary/due'),
  getNotebooks: () => apiRequest<unknown[]>('/v1/vocabulary/notebooks'),
  createNotebook: (title: string, description?: string) =>
    apiRequest<unknown>('/v1/vocabulary/notebooks', {
      method: 'POST',
      body:   JSON.stringify({ title, description }),
    }),
  addCardToNotebook: (notebookId: string, cardId: string) =>
    apiRequest<unknown>(`/v1/vocabulary/notebooks/${notebookId}/cards`, {
      method: 'POST',
      body:   JSON.stringify({ cardId }),
    }),
};

// ── Grammar endpoints ─────────────────────────────────────────────

export const grammarApi = {
  getTopics: () => apiRequest<unknown[]>('/v1/grammar/topics'),
  getTopicDetail: (topicId: string) => apiRequest<unknown>(`/v1/grammar/topics/${topicId}`),
  submitAnswer: (cardId: string, answer: string) =>
    apiRequest<unknown>(`/v1/grammar/cards/${cardId}/submit`, {
      method: 'POST',
      body:   JSON.stringify({ answer }),
    }),
};

// ── Test Bank endpoints ───────────────────────────────────────────

export const testApi = {
  getTests: (mode?: string) => apiRequest<unknown[]>(`/v1/tests${mode ? `?mode=${mode}` : ''}`),
  getHistory: () => apiRequest<unknown[]>('/v1/tests/history'),
  getTestForTaking: (testId: string) => apiRequest<unknown>(`/v1/tests/${testId}`),
  submitAttempt: (testId: string, answers: Record<string, string>, timeSpentSeconds: number) =>
    apiRequest<unknown>(`/v1/tests/${testId}/submit`, {
      method: 'POST',
      body:   JSON.stringify({ answers, timeSpentSeconds }),
    }),
};

// ── Skills Practice endpoints ─────────────────────────────────────

export const skillsApi = {
  getOverview: () => apiRequest<{ parts: unknown[] }>('/v1/skills/overview'),
  getItemsByPart: (part: string) => apiRequest<{ part: string; count: number; items: unknown[] }>(`/v1/skills/parts/${part}`),
  getItemDetail: (itemId: string) => apiRequest<unknown>(`/v1/skills/items/${itemId}`),
  submitAnswer: (itemId: string, answers: Record<number, string>) =>
    apiRequest<{
      itemId: string;
      part: string;
      totalQuestions: number;
      correctCount: number;
      accuracy: number;
      autoSavedToMistakeNotebook: boolean;
      feedback: {
        questionNumber: number;
        chosenAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation: string;
      }[];
    }>(`/v1/skills/items/${itemId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
};

// ── Speaking & Writing endpoints ──────────────────────────────────

export const speakingWritingApi = {
  getSpeakingPrompts: () => apiRequest<unknown[]>('/v1/speaking-writing/speaking/prompts'),
  getSpeakingPromptById: (id: string) => apiRequest<unknown>(`/v1/speaking-writing/speaking/prompts/${id}`),
  evaluateSpeaking: (body: { promptId: string; speechText: string; durationSeconds?: number }) =>
    apiRequest<{
      promptId: string;
      promptTitle: string;
      speechText: string;
      wordCount: number;
      estimatedWpm: number;
      scaledScore: number;
      proficiencyLevel: number;
      pronunciationScore: number;
      fluencyScore: number;
      intonationScore: number;
      matchedKeywords: number;
      totalKeywords: number;
      feedback: string[];
      sampleTranscript: string;
    }>('/v1/speaking-writing/speaking/evaluate', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getWritingPrompts: () => apiRequest<unknown[]>('/v1/speaking-writing/writing/prompts'),
  getWritingPromptById: (id: string) => apiRequest<unknown>(`/v1/speaking-writing/writing/prompts/${id}`),
  evaluateWriting: (body: { promptId: string; text: string }) =>
    apiRequest<{
      promptId: string;
      promptTitle: string;
      wordCount: number;
      minWords: number;
      scaledScore: number;
      writingLevel: number;
      rubrics: {
        grammar: number;
        vocabulary: number;
        organization: number;
        relevance: number;
      };
      suggestions: string[];
      sampleAnswer: string;
    }>('/v1/speaking-writing/writing/evaluate', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// ── Social & Couple Mode endpoints ────────────────────────────────

export const socialApi = {
  getFriends: () =>
    apiRequest<{
      friends: {
        friendshipId: string;
        userId: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
        currentStreak: number;
        totalXp: number;
        lastStudiedAt?: string;
        targetScore: number;
      }[];
      pendingRequests: {
        friendshipId: string;
        requesterId: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
        createdAt: string;
      }[];
    }>('/v1/social/friends'),

  sendFriendRequest: (targetIdentifier: string) =>
    apiRequest<{ message: string; friendshipId: string }>('/v1/social/friends/request', {
      method: 'POST',
      body: JSON.stringify({ targetIdentifier }),
    }),

  acceptFriendRequest: (friendshipId: string) =>
    apiRequest<{ message: string }> (`/v1/social/friends/${friendshipId}/accept`, {
      method: 'POST',
    }),

  getCoupleDashboard: () =>
    apiRequest<{
      hasPartner: boolean;
      userA: {
        id: string;
        role: string;
        colorHex: string;
        name: string;
        avatarUrl?: string;
        streak: number;
        targetScore: number;
        minutesToday: number;
        isStudyingNow: boolean;
        lastStudiedAt?: string;
      };
      userB: {
        id: string;
        role: string;
        colorHex: string;
        name: string;
        avatarUrl?: string;
        streak: number;
        targetScore: number;
        minutesToday: number;
        isStudyingNow: boolean;
        lastStudiedAt?: string;
      };
      sharedGoal: {
        sharedStreak: number;
        weeklyWordsLearned: number;
        weeklyWordsTarget: number;
        percent: number;
      };
      habitWeek: {
        day: string;
        userACompleted: boolean;
        userBCompleted: boolean;
        togetherCompleted: boolean;
      }[];
    }>('/v1/social/couple-dashboard'),

  sendStudyPulse: (minutes?: number) =>
    apiRequest<{ success: boolean; message: string }>('/v1/social/study-pulse', {
      method: 'POST',
      body: JSON.stringify({ minutes: minutes || 15 }),
    }),

  getLeaderboard: () =>
    apiRequest<{
      rank: number;
      displayName: string;
      totalXp: number;
      currentStreak: number;
      targetScore: number;
    }[]>('/v1/social/leaderboard'),
};



