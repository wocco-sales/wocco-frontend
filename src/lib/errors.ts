import { isAxiosError } from 'axios';

export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    if (err.response?.status === 401) {
      return 'Session expired or invalid. Sign out and sign in again, then retry.';
    }
    if (err.response?.status === 403) {
      const forbidden = err.response?.data?.message;
      if (typeof forbidden === 'string') return forbidden;
      return 'Insufficient permissions for this action.';
    }
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && message.length > 0) {
      return message.filter((m) => typeof m === 'string').join(', ') || fallback;
    }
  }
  return fallback;
}
