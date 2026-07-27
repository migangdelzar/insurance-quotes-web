import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import * as quoteApi from '@features/quote-wizard/api/quoteApi';
import { QuoteWizardProvider, useQuoteWizard } from '@features/quote-wizard/context/QuoteWizardProvider';
import { theme } from '@shared/theme/theme';
import { CoverageStep } from './CoverageStep';

vi.mock('../../api/quoteApi');

function SeededCoverageStep() {
  const { dispatch } = useQuoteWizard();

  useEffect(() => {
    dispatch({
      type: 'PERSONAL_SUBMITTED',
      quoteId: 'quote-1',
      personal: { name: 'Ana', email: 'ana@example.com', age: 70, zipCode: '06600' },
    });
  }, [dispatch]);

  return <CoverageStep />;
}

function renderStep() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <QuoteWizardProvider>
            <MemoryRouter initialEntries={['/quote/coverage']}>
              <Routes>
                <Route path="/quote/coverage" element={<SeededCoverageStep />} />
                <Route path="/quote/summary" element={<div data-testid="summary" />} />
              </Routes>
            </MemoryRouter>
          </QuoteWizardProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('CoverageStep', () => {
  beforeEach(() => vi.clearAllMocks());

  it('persists a new coverage choice before immediate Next navigation unmounts the step', async () => {
    vi.mocked(quoteApi.updateCoverage).mockResolvedValue({
      id: 'quote-1',
      status: 'DRAFT',
      monthlyPremium: 450,
    });
    renderStep();

    await waitFor(() =>
      expect(screen.getByTestId(tid('wizard.coverage.premium'))).toBeEnabled()
    );
    fireEvent.click(screen.getByTestId(tid('wizard.coverage.premium')));
    fireEvent.click(screen.getByTestId(tid('common.next')));

    await waitFor(() =>
      expect(quoteApi.updateCoverage).toHaveBeenCalledWith('quote-1', expect.objectContaining({
        coverageType: 'PREMIUM',
      }))
    );
    await waitFor(() =>
      expect(screen.getByTestId('summary')).toBeInTheDocument()
    );
  });
});
