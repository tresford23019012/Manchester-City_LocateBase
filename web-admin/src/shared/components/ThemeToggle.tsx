import { useTheme } from '../theme/useTheme';

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        fontSize: '1.1rem',
        cursor: 'pointer',
      }}
    >
      {mode === 'light' ? '☾' : '☀'}
    </button>
  );
}