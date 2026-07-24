import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { App } from '@app/App';
import { AuthProvider, useAuth } from '@features/auth/context/AuthProvider';
import { LoginPage } from '@features/auth/pages/LoginPage';

function Providers() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Providers />,
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [{ index: true, element: <Navigate to="/quotes" replace /> }],
      },
    ],
  },
]);
