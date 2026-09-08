import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthChanges,
  type AuthUser,
} from '../../services/authService';

export type { AuthUser };
export { subscribeToAuthChanges };

export async function register(email: string, password: string): Promise<AuthUser> {
  return registerUser(email, password);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  return loginUser(email, password);
}

export async function logout(): Promise<void> {
  return logoutUser();
}
