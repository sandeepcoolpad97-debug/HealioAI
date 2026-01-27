import { Routes, Route } from 'react-router-dom';
import AppScreen from '../components/app/screens/AppScreen';

/**
 * App routing – handles all app (public/landing) screen routes.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppScreen />} />
      {/* Add more app routes here, e.g. <Route path="/features" element={...} /> */}
    </Routes>
  );
}
