import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { App } from '@app/App';
import { AuthProvider, useAuth } from '@features/auth/context/AuthProvider';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { QuoteWizardProvider } from '@features/quote-wizard/context/QuoteWizardProvider';
import {
  RequireCoverage,
  RequireQuote,
} from '@features/quote-wizard/context/stepGuards';
import { PersonalInfoStep } from '@features/quote-wizard/steps/personal/PersonalInfoStep';
import { CoverageStep } from '@features/quote-wizard/steps/coverage/CoverageStep';
import { SummaryStep } from '@features/quote-wizard/steps/summary/SummaryStep';
import { QuotesListPage } from '@pages/QuotesListPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { AccountPage } from '@pages/AccountPage';

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

function WizardShell() {
  return (
    <QuoteWizardProvider>
      <Outlet />
    </QuoteWizardProvider>
  );
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
          { index: true, element: <Navigate to="/quotes" replace /> },
          { path: 'quotes', element: <QuotesListPage /> },
          { path: 'quotes/history', element: <QuotesListPage /> },
          { path: 'account', element: <AccountPage /> },
          {
            element: <WizardShell />,
            children: [
              { path: 'quote/personal', element: <PersonalInfoStep /> },
              {
                element: <RequireQuote />,
                children: [
                  { path: 'quote/coverage', element: <CoverageStep /> },
                  {
                    element: <RequireCoverage />,
                    children: [
                      { path: 'quote/summary', element: <SummaryStep /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
