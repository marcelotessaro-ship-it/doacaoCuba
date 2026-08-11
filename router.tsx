import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VisitorPanelPage } from './pages/VisitorPanelPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/registrar', element: <RegisterPage /> },
  {
    path: '/painel',
    element: (
      <ProtectedRoute>
        <VisitorPanelPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminPanelPage />
      </AdminRoute>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
]);
