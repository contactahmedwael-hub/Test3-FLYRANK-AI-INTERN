import { useState, type FormEvent } from 'react';
import * as AuthModel from './AuthModel';

export type AuthMode = 'login' | 'register';

export function useAuthViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await AuthModel.login(email, password);
      } else {
        await AuthModel.register(email, password);
      }
      setPassword('');
    } catch (err) {
      // AuthModel/authService already convert Firebase errors into
      // readable messages, so err.message is safe to show directly.
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError(null);
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  };
}
