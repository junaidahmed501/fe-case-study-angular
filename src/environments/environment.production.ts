const API_BASE = 'api';

export const environment = {
  production: true,
  tokenStorageKey: 'authToken',
  apiUrl: API_BASE,
  apiEndpoints: {
    auth: `${API_BASE}/login`,
    users: `${API_BASE}/users`,
  }
};
