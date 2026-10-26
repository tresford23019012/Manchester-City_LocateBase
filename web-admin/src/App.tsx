import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DemoPortal from "./demo/DemoPortal";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import RequestsPage from "./pages/Requests/RequestsPage";
import RequestDetailPage from "./pages/Requests/RequestDetailPage";
import UsersPage from "./pages/Users/UsersPage";
import NewAdminPage from "./pages/Admins/NewAdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoPortal />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/requests" element={<RequestsPage />} />
        <Route path="/admin/requests/:id" element={<RequestDetailPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
<Route path="/admin/users/new-admin" element={<NewAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;