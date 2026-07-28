import { Navigate, Outlet } from 'react-router';
import { useQuoteWizard } from './QuoteWizardProvider';

export function RequireQuote() {
  const { state } = useQuoteWizard();
  if (!state.quoteId) {
    return <Navigate to="/quote/personal" replace />;
  }
  return <Outlet />;
}

export function RequireCoverage() {
  const { state } = useQuoteWizard();
  if (!state.coverage.coverageType) {
    return <Navigate to="/quote/coverage" replace />;
  }
  return <Outlet />;
}
