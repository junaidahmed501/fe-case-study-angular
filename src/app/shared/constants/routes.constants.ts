/**
 * Application-wide route constants
 * Simple flat structure for easier maintenance
 */
export const APP_ROUTES = {
  // Auth routes
  AUTH: '/auth',
  LOGIN: '/auth/login',

  // User routes
  USERS: '/users',
  USER_CREATE: '/users/create',

  // Helper method for dynamic routes
  getUserEdit: (id: string) => `/users/${id}`
};
