import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import type * as ReactRouter from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { QuoteView } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { listQuotes } from '@features/quote-wizard/api/quoteApi';
import { QuotesListPage } from './QuotesListPage';

vi.mock('@features/quote-wizard/api/quoteApi', () => ({
  listQuotes: vi.fn(),
}));

const navigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return { ...actual, useNavigate: () => navigate };
});

const mockedListQuotes = vi.mocked(listQuotes);

function renderPage(view: 'overview' | 'history' = 'overview') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/quotes']}>
            <QuotesListPage view={view} />
          </MemoryRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('QuotesListPage', () => {
  beforeEach(async () => {
    navigate.mockReset();
    mockedListQuotes.mockReset();
    await i18n.changeLanguage('en-US');
  });

  it('renders an actionable empty state in the dashboard hierarchy', async () => {
    mockedListQuotes.mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId(tid('quotesList.empty'))).toBeVisible();
    });

    expect(
      screen.getByRole('heading', { level: 1, name: /my quotes/i })
    ).toBeVisible();
    expect(screen.getByTestId(tid('quotesList.title'))).toBeVisible();
    expect(screen.getByTestId(tid('quotesList.empty'))).toHaveAttribute(
      'data-widget-tone',
      'charcoal'
    );
    expect(screen.getByTestId(tid('quotesList.startQuote'))).toBeVisible();
  });

  it('renders readable status, localized premium, and summary data', async () => {
    const quotes: QuoteView[] = [
      {
        id: 'q-1',
        name: 'Jane Roe',
        coverageType: 'PREMIUM',
        status: 'SUBMITTED',
        monthlyPremium: 129.5,
      },
      {
        id: 'q-2',
        name: 'Alex Roe',
        coverageType: 'STANDARD',
        status: 'DRAFT',
        monthlyPremium: 80,
      },
    ];
    mockedListQuotes.mockResolvedValue(quotes);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Jane Roe')).toBeVisible();
    });

    expect(screen.getByText('Submitted', { exact: true })).toBeVisible();
    expect(screen.getByText(/\$129\.50/)).toBeVisible();
    expect(screen.getByText(/2 quotes/i)).toBeVisible();
    expect(screen.getByText(/1 submitted/i)).toBeVisible();
  });

  it('shows the overview action and concise metrics on the Home destination', async () => {
    mockedListQuotes.mockResolvedValue([
      {
        id: 'q-1',
        name: 'Jane Roe',
        coverageType: 'PREMIUM',
        status: 'SUBMITTED',
        monthlyPremium: 129.5,
      },
    ]);

    renderPage('overview');

    await waitFor(() => {
      expect(screen.getByText('Quote summary')).toBeVisible();
    });

    expect(
      screen.getByRole('button', { name: /start a quote/i })
    ).toBeVisible();
    expect(screen.getByText('Portfolio')).toBeVisible();
  });

  it('shows quote history as a focused list on the Quotes destination', async () => {
    mockedListQuotes.mockResolvedValue([
      {
        id: 'q-1',
        name: 'Jane Roe',
        coverageType: 'PREMIUM',
        status: 'SUBMITTED',
        monthlyPremium: 129.5,
      },
    ]);

    renderPage('history');

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /your quote history/i })
      ).toBeVisible();
    });

    expect(screen.queryByText('Portfolio')).not.toBeInTheDocument();
    expect(screen.queryByText('Quote summary')).not.toBeInTheDocument();
  });

  it('announces loading with a named status region', () => {
    mockedListQuotes.mockReturnValue(new Promise(() => {}));

    renderPage('history');

    expect(
      screen.getByRole('status', { name: /loading quotes/i })
    ).toBeVisible();
    expect(
      screen.getByRole('status', { name: /loading quotes/i })
    ).toHaveAttribute('data-widget-tone', 'loading');
  });

  it('keeps the API error state actionable with a retry control', async () => {
    mockedListQuotes.mockRejectedValue(new Error('network failure'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId(tid('common.apiError'))).toBeVisible();
    });

    expect(screen.getByTestId(tid('common.apiError'))).toHaveAttribute(
      'data-widget-tone',
      'critical'
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeVisible();
  });

  it('formats the premium with the active locale', async () => {
    await i18n.changeLanguage('es-MX');
    mockedListQuotes.mockResolvedValue([
      {
        id: 'q-1',
        name: 'Jane Roe',
        status: 'SUBMITTED',
        monthlyPremium: 129.5,
      },
    ]);

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText(/USD\s*129\.50/)).toHaveLength(2);
    });
  });

  it('navigates to the personal quote step from the primary action', async () => {
    const user = userEvent.setup();
    mockedListQuotes.mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId(tid('quotesList.empty'))).toBeVisible();
    });
    await user.click(screen.getByRole('button', { name: /start a quote/i }));

    expect(navigate).toHaveBeenCalledWith('/quote/personal');
  });
});
