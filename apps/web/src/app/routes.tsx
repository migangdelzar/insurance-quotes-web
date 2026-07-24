import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { App } from '@app/App';
import { AuthProvider, useAuth } from '@features/auth/context/AuthProvider';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { QuoteWizardProvider } from '@features/quote-wizard/context/QuoteWizardProvider';
import { PersonalInfoStep } from '@features/quote-wizard/steps/personal/PersonalInfoStep';
import { CoverageStep } from '@features/quote-wizard/steps/coverage/CoverageStep';
import { SummaryStep } from '@features/quote-wizard/steps/summary/SummaryStep';

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
        children: [
          {
            element: (
              <QuoteWizardProvider>
                <Outlet />
              </QuoteWizardProvider>
            ),
            children: [
              { path: 'quote/personal', element: <PersonalInfoStep /> },
              { path: 'quote/coverage', element: <CoverageStep /> },
              { path: 'quote/summary', element: <SummaryStep /> },
            ],
          },
          { index: true, element: <Navigate to="/quotes" replace /> },
        ],
      },
    ],
  },
]);
