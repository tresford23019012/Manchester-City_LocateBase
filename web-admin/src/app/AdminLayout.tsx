import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from '../shared/components/ThemeToggle';
import './layout.css';

export default function AdminLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="content">
        <header className="topbar">
          <ThemeToggle />
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}