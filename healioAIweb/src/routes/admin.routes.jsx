import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboardScreen from '../components/admin/screens/AdminDashboardScreen';
import AdminUsersScreen from '../components/admin/screens/AdminUsersScreen';
import AdminSubscriptionsScreen from '../components/admin/screens/AdminSubscriptionsScreen';
import AdminRolesScreen from '../components/admin/screens/AdminRolesScreen';

/**
 * Admin routing – handles all admin screen routes (/admin, /admin/*).
 * Layout: app bar + left drawer + user profile at corner; nested routes render in main area.
 */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardScreen />} />
        <Route path="users" element={<AdminUsersScreen />} />
        <Route path="subscriptions" element={<AdminSubscriptionsScreen />} />
        <Route path="roles" element={<AdminRolesScreen />} />
      </Route>
    </Routes>
  );
}
