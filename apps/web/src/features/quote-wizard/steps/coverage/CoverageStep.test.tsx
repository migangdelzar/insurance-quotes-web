import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('waits for a new coverage choice to persist before immediate Next navigation', async () => {
    let resolveUpdate: (quote: Awaited<ReturnType<typeof quoteApi.updateCoverage>>) => void;
    vi.mocked(quoteApi.updateCoverage).mockImplementation(
      () => new Promise((resolve) => { resolveUpdate = resolve; })
    );
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
    expect(screen.queryByTestId('summary')).not.toBeInTheDocument();

    await act(async () => {
      resolveUpdate!({
        id: 'quote-1',
        status: 'DRAFT',
        monthlyPremium: 450,
      });
    });
    await waitFor(() =>
      expect(screen.getByTestId('summary')).toBeInTheDocument()
    );
  });

  it('keeps the user on coverage and shows the mutation error when immediate Next persistence fails', async () => {
    vi.mocked(quoteApi.updateCoverage).mockRejectedValue(new Error('Coverage update failed'));
    renderStep();

    await waitFor(() =>
      expect(screen.getByTestId(tid('wizard.coverage.standard'))).toBeEnabled()
    );
    fireEvent.click(screen.getByTestId(tid('wizard.coverage.standard')));
    fireEvent.click(screen.getByTestId(tid('common.next')));

    await waitFor(() => expect(quoteApi.updateCoverage).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByTestId(tid('common.apiError'))).toBeVisible()
    );
    expect(screen.queryByTestId('summary')).not.toBeInTheDocument();
  });
});
