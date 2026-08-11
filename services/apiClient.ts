import axios, { AxiosError } from 'axios';
import type { ApiErrorEnvelope } from '../utils/types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('doacaocuba_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[]> | null;

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> | null = null) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const HUMAN_MESSAGES: Record<number, string> = {
  0: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  401: 'Sua sessão expirou. Faça login novamente.',
  403: 'Você não tem permissão para acessar este recurso.',
  404: 'Recurso não encontrado.',
  429: 'Muitas requisições. Tente novamente em instantes.',
  500: 'Ocorreu um erro inesperado em nosso servidor. Tente novamente em instantes.',
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorEnvelope>) => {
    const status = error.response?.status ?? 0;
    const backendMessage = error.response?.data?.message;
    const message = backendMessage ?? HUMAN_MESSAGES[status] ?? HUMAN_MESSAGES[500];
    const fieldErrors = error.response?.data?.errors ?? null;

    if (status === 401) {
      localStorage.removeItem('doacaocuba_token');
      localStorage.removeItem('doacaocuba_user');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login?sessao_expirada=1');
      }
    }

    return Promise.reject(new ApiError(message, status, fieldErrors));
  },
);
