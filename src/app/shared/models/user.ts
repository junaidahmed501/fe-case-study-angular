export interface User {
  id: string; // Changed to string to match backend expectations
  username: string;
  role: string;
  password?: string;
}
