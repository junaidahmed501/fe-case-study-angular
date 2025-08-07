/**
 * Core User entity interface representing users in the system
 */
export interface User {
  id: string;
  username: string;
  role: string;
  password?: string;
}

/**
 * Interface for creating a new user - no ID required, but password is mandatory
 */
export interface CreateUserDto {
  username: string;
  role: string;
  password: string;
}

/**
 * Interface for updating an existing user - all fields optional except ID
 */
export interface UpdateUserDto {
  id: string;
  username?: string;
  role?: string;
  password?: string;
}
