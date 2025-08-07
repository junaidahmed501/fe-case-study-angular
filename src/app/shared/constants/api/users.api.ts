/**
 * Users API endpoints
 */
export const USERS_API = {
  BASE: 'users',
  CREATE: 'create',
  DETAIL: (id: string): string => `users/${id}`
};

