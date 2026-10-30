import { NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../shared/config/app';
import './layout.css';

// Add more links here as other pages are built (Guesthouses, Settings, ...)
const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/requests', label: 'Requests', end: false },
  { to: '/admin/users', label: 'Users', end: true },
  { to: '/admin/users/new-admin', label: 'Add admin', end: false },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">{APP_NAME}</div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Mock user until real login (Task 67) provides the signed-in admin */}
      <div className="sidebar-user">
        <div className="avatar">AD</div>
        <div className="sidebar-user-text">
          <div className="sidebar-user-name">Admin</div>
          <div className="sidebar-user-role">Property admin</div>
        </div>
        <button className="logout-btn" onClick={() => navigate('/login')}>
          Log out
        </button>
      </div>
    </aside>
  );
}