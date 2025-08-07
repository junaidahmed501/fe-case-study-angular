/**
 * API endpoint paths
 * These are relative paths that will be appended to the base API URL from the environment
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login'
  },
  USERS: {
    BASE: 'users',
    DETAIL: (id: string): string => `users/${id}`
  }
};

