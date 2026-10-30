import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import AdminLayout from './AdminLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import RequestsPage from '../pages/Requests/RequestsPage';
import RequestDetailPage from '../pages/Requests/RequestDetailPage';
import UsersPage from '../pages/Users/UsersPage';
import NewAdminPage from '../pages/Admins/NewAdminPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Everything inside the shell. Task 67 will add the login guard here. */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new-admin" element={<NewAdminPage />} />
      </Route>
    </Routes>
  );
}