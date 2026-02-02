import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import AdminDashboardScreen from '../components/admin/screens/AdminDashboardScreen';
import AdminUsersScreen from '../components/admin/screens/AdminUsersScreen';
import AdminSubscriptionsScreen from '../components/admin/screens/AdminSubscriptionsScreen';
import AdminRolesScreen from '../components/admin/screens/AdminRolesScreen';
import AdminClinicsScreen from '../components/admin/screens/AdminClinicsScreen';
import AdminLabsScreen from '../components/admin/screens/AdminLabsScreen';
import AdminLogin from '../components/admin/screens/AdminLogin';
import AdminLayout from '../components/admin/layout/AdminLayout';

/**
 * Admin routing – handles all admin screen routes (/admin, /admin/*).
 * Layout: app bar + left drawer + user profile at corner; nested routes render in main area.
 */
export default function AdminRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      <Route 
        path="login" 
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />} 
      />

      <Route element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />}>
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
