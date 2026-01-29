import { Routes, Route } from 'react-router-dom';
import AdminDashboardScreen from '../components/admin/screens/AdminDashboardScreen';
import AdminUsersScreen from '../components/admin/screens/AdminUsersScreen';
import AdminSubscriptionsScreen from '../components/admin/screens/AdminSubscriptionsScreen';
import AdminRolesScreen from '../components/admin/screens/AdminRolesScreen';
import AdminClinicsScreen from '../components/admin/screens/AdminClinicsScreen';
import AdminLabsScreen from '../components/admin/screens/AdminLabsScreen';
import AdminLayout from '../components/admin/layout/AdminLayout';

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
        <Route path="clinics" element={<AdminClinicsScreen />} />
        <Route path="labs" element={<AdminLabsScreen />} />
      </Route>
    </Routes>
  );
}
