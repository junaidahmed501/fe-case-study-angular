const API_BASE = 'http://localhost:3000/api';

export const environment = {
  production: false,
  tokenStorageKey: 'authToken',
  apiBaseUrl: API_BASE,
  // todo: consider using a more structured approach for endpoints and move them out of the environment file
  // only keep the base URL here

  endpoints: {
    auth: {
      login: 'auth/login',
    },
    users: {
      base: 'users',
      detail: (id: string) => `users/${id}`,
    }
  }
};
