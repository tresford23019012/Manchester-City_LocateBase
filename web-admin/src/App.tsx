import ThemeToggle from './shared/components/ThemeToggle';

const swatches = ['primary', 'primary-dark', 'primary-tint', 'surface', 'sidebar', 'success', 'warning', 'danger'];

export default function App() {
  return (
    <div style={{ padding: 40 }}>
      <ThemeToggle />
      <h1>Theme test</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {swatches.map((name) => (
          <div key={name} style={{ textAlign: 'center', fontSize: 12 }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, border: '1px solid var(--border)', background: `var(--${name})` }} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}