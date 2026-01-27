import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/app.routes';
import AdminRoutes from './routes/admin.routes';

/**
 * Root router – wires app and admin route trees.
 * App routes handle / and public paths; admin routes handle /admin and below.
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
