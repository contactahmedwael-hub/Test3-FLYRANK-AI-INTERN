import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Minimal typed shape we expose to the rest of the app, instead of the
 * full Firebase `User` object (which carries a lot we don't need — tokens,
 * provider data, etc.).
 */
export interface AuthUser {
  uid: string;
  email: string | null;
}

function toAuthUser(user: User): AuthUser {
  return { uid: user.uid, email: user.email };
}

/**
 * Firebase Auth errors arrive as { code: "auth/...", message: "..." }.
 * The default `message` is written for developers, not end users
 * ("Firebase: Error (auth/wrong-password).") — this maps known codes to
 * something a user can actually act on.
 */
function toReadableMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** Registers a new account with email/password. */
export async function registerUser(email: string, password: string): Promise<AuthUser> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throw new Error(toReadableMessage(error));
  }
}

/** Signs in an existing account with email/password. */
export async function loginUser(email: string, password: string): Promise<AuthUser> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throw new Error(toReadableMessage(error));
  }
}

/** Signs the current user out. */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(toReadableMessage(error));
  }
}

/**
 * Wraps onAuthStateChanged with our typed AuthUser shape.
 * Returns the unsubscribe function, as onAuthStateChanged does.
 */
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? toAuthUser(firebaseUser) : null);
  });
}
