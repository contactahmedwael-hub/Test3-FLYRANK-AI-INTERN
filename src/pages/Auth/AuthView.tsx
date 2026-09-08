import { useAuthViewModel } from './useAuthViewModel';

export function AuthView() {
  const { email, setEmail, password, setPassword, mode, loading, error, handleSubmit, toggleMode } =
    useAuthViewModel();

  const isLogin = mode === 'login';

  return (
    <div className="auth-view">
      <h2 className="page-heading">{isLogin ? 'Log In' : 'Create Account'}</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
        />

        {error && (
          <p className="status-message status-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
        </button>
      </form>

      <button type="button" className="auth-toggle" onClick={toggleMode}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
      </button>
    </div>
  );
}
