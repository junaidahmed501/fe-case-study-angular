const API_BASE = 'http://localhost:3000/api';

export const environment = {
  production: true,
  tokenStorageKey: 'authToken',
  apiBaseUrl: API_BASE,
  endpoints: {
    auth: {
      login: 'auth/login',
    },
    users: {
      get: '',
      detail: (id: string) => `users/${id}`,
    }
  }
};
