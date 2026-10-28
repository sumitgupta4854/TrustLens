import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import {
  User,
  AnalysisResult,
  Boundary,
  SavedAnalysis,
  MultiConversationReport,
  MultiConversationOverviewRequest,
  UserMessagesAnalysisResponse,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// We store the access token in memory (never in localStorage for security)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send HTTP-only refresh cookie
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercept 401 errors and attempt token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function processFailedQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            (originalRequest as any).headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;
        setAccessToken(newToken);
        processFailedQueue(null, newToken);
        if (originalRequest.headers) {
          (originalRequest as any).headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processFailedQueue(refreshError, null);
        setAccessToken(null);
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ——— Auth API ———
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; user: User; accessToken: string; message?: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; user: User; accessToken: string }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  logoutAll: () => api.post('/auth/logout-all'),

  getMe: () => api.get<{ success: boolean; user: User }>('/auth/me'),

  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),

  resendVerification: (email: string) => api.post('/auth/resend-verification', { email }),

  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// ——— User Profile API ———
export const userApi = {
  getProfile: () => api.get<{ success: boolean; user: User }>('/users/me'),

  updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) =>
    api.patch<{ success: boolean; user: User; message: string }>('/users/me', data),

  deleteAccount: (confirmPassword: string) =>
    api.delete('/users/me', { data: { confirmPassword } }),
};

// ——— Boundaries API ———
export const boundaryApi = {
  list: (active?: boolean) =>
    api.get<{ success: boolean; boundaries: Boundary[] }>('/boundaries', {
      params: active !== undefined ? { active: String(active) } : {},
    }),

  create: (data: Omit<Boundary, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<{ success: boolean; boundary: Boundary }>('/boundaries', data),

  update: (id: string, data: Partial<Omit<Boundary, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.patch<{ success: boolean; boundary: Boundary }>(`/boundaries/${id}`, data),

  delete: (id: string) => api.delete(`/boundaries/${id}`),
};

// ——— Analysis API ———
export const analysisApi = {
  analyze: (
    conversationText: string,
    options: {
      situationDescription?: string;
      analysisType?: string;
      anonymize?: boolean;
      saveHistoryConsent?: boolean;
    } = {}
  ) =>
    api.post<{
      success: boolean;
      analysis: AnalysisResult;
      savedAnalysisId: string | null;
      privacyNotice: string;
    }>('/analyze', {
      conversationText,
      situationDescription: options.situationDescription,
      analysisType: options.analysisType,
      anonymize: options.anonymize,
      saveHistoryConsent: options.saveHistoryConsent,
    }),

  listHistory: () =>
    api.get<{ success: boolean; analyses: SavedAnalysis[] }>('/analyses'),

  getById: (id: string) =>
    api.get<{ success: boolean; analysis: SavedAnalysis }>(`/analyses/${id}`),

  deleteById: (id: string) => api.delete(`/analyses/${id}`),

  getOverview: (params: MultiConversationOverviewRequest = {}) =>
    api.post<{ success: boolean; report: MultiConversationReport }>('/analyze/overview', params),
};

// ——— AI Safety Chat API ———
export const aiChatApi = {
  sendMessage: (
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    messageId?: string
  ) =>
    api.post<{
      success: boolean;
      response: string;
      engine: 'ai_llm' | 'pattern_rules_fallback';
      privacyNotice: string;
    }>('/ai/chat', { message, history, messageId }),

  analyzeMessages: (params: {
    messages: Array<{
      id?: string;
      messageId?: string;
      role: string;
      content: string;
      timestamp?: string;
    }>;
    alreadyAnalyzedIds?: string[];
    forceReanalyze?: boolean;
    page?: number;
    limit?: number;
  }) =>
    api.post<UserMessagesAnalysisResponse>('/ai/chat/analyze-messages', params),

  getStoredMessages: (page = 1, limit = 50) =>
    api.get<{
      success: boolean;
      messages: Array<{
        id: string;
        messageId: string;
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
        analyzed?: boolean;
        analysis?: any;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/ai/chat/messages', { params: { page, limit } }),

  reanalyzeAll: () =>
    api.post<{ success: boolean; message: string }>('/ai/chat/reanalyze'),
};

// ——— Health API ———
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
