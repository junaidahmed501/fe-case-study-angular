/**
 * Index file that re-exports all API endpoint modules
 * This allows importing from a single location:
 * import { AUTH_API, USERS_API } from '@shared/constants/api';
 */
export * from './auth.api';
export * from './users.api';

// Add new API modules exports here as the application grows
