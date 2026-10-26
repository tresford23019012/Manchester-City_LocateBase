import type { ReactNode } from 'react';
import ThemeToggle from '../../shared/components/ThemeToggle';
import { APP_NAME } from '../../shared/config/app';
import heroImage from '../../assets/login-hero.jpeg';
import './auth.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="auth-logo">{APP_NAME}</div>

        <div className="auth-copy">
          <p className="auth-eyebrow">Hospitality, beautifully managed</p>
          <h1>Make every stay feel effortless.</h1>
          <p className="auth-sub">
            Manage guesthouses, performance and your team from one calm workspace.
          </p>
        </div>

        <img className="auth-hero" src={heroImage} alt="Guesthouse" />
      </aside>

      <main className="auth-main">
        <div className="auth-toggle">
          <ThemeToggle />
        </div>
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}