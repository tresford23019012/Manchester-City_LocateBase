import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { APP_NAME } from '../../shared/config/app';

// Temporary mock sign-in. Replaced by the API client (Task 65) and Firebase (Task 67).
async function mockLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 600));
  if (!email.includes('@') || password.length < 6) {
    throw new Error('Invalid email or password.');
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await mockLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h2>Welcome back!</h2>
      <p className="hint">Sign in to continue to {APP_NAME} Admin.</p>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="switch">Need access? Ask an existing administrator to create your account.</p>
    </AuthLayout>
  );
}