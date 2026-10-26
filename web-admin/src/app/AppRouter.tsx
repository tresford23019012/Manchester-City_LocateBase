import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
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
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/admin/requests" element={<RequestsPage />} />
      <Route path="/admin/requests/:id" element={<RequestDetailPage />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/users/new-admin" element={<NewAdminPage />} />
    </Routes>
  );
}