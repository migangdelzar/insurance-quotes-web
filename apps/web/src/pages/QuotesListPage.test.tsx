import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import type * as ReactRouter from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  QuotePageView,
  QuoteSummaryView,
  QuoteView,
} from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import {
  getQuoteSummary,
  listQuotes,
} from '@features/quote-wizard/api/quoteApi';
import { QuotesListPage } from './QuotesListPage';

vi.mock('@features/quote-wizard/api/quoteApi', () => ({
  listQuotes: vi.fn(),
  getQuoteSummary: vi.fn(),
  defaultQuoteListQuery: {
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    direction: 'desc',
  },
}));

const navigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return { ...actual, useNavigate: () => navigate };
});

const mockedListQuotes = vi.mocked(listQuotes);
const mockedGetQuoteSummary = vi.mocked(getQuoteSummary);

function quotePage(
  content: QuoteView[],
  overrides: Partial<QuotePageView> = {}
): QuotePageView {
  return {
    content,
    page: 0,
    size: 20,
    totalElements: content.length,
    totalPages: content.length === 0 ? 0 : 1,
    hasNext: false,
    hasPrevious: false,
    ...overrides,
  };
}

function quoteSummary(
  overrides: Partial<QuoteSummaryView> = {}
): QuoteSummaryView {
  return {
    totalQuotes: 2,
    draftQuotes: 1,
    submittedQuotes: 1,
    submissionFailedQuotes: 0,
    expiredQuotes: 0,
    pricedQuotes: 2,
    totalMonthlyPremium: 209.5,
    averageMonthlyPremium: 104.75,
    submissionRate: 100,
    statusDistribution: [
      { key: 'DRAFT', count: 1 },
      { key: 'SUBMITTED', count: 1 },
      { key: 'SUBMISSION_FAILED', count: 0 },
      { key: 'EXPIRED', count: 0 },
    ],
    coverageDistribution: [
      { key: 'BASIC', count: 0 },
      { key: 'STANDARD', count: 1 },
      { key: 'PREMIUM', count: 1 },
    ],
    trend: [{ date: '2026-07-28', created: 2, submitted: 1, failed: 0 }],
    ...overrides,
  };
}

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
    mockedGetQuoteSummary.mockReset();
    mockedGetQuoteSummary.mockResolvedValue(quoteSummary());
    await i18n.changeLanguage('en-US');
  });

  it('renders an actionable empty state in the dashboard hierarchy', async () => {
    mockedListQuotes.mockResolvedValue(quotePage([]));

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
    mockedListQuotes.mockResolvedValue(quotePage(quotes));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Jane Roe')).toBeVisible();
    });

    expect(
      screen.getAllByText('Submitted', { exact: true }).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/\$129\.50/)).toBeVisible();
    expect(screen.getByText('Portfolio intelligence')).toBeVisible();
    expect(screen.getByText('$209.50')).toBeVisible();
  });

  it('shows the overview action and concise metrics on the Home destination', async () => {
    mockedListQuotes.mockResolvedValue(
      quotePage([
        {
          id: 'q-1',
          name: 'Jane Roe',
          coverageType: 'PREMIUM',
          status: 'SUBMITTED',
          monthlyPremium: 129.5,
        },
      ])
    );

    renderPage('overview');

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /start a quote/i })
      ).toBeVisible();
    });

    expect(
      screen.getByRole('button', { name: /start a quote/i })
    ).toBeVisible();
    expect(screen.getByText('Portfolio intelligence')).toBeVisible();
  });

  it('requests only the four latest quotes for the Home destination', async () => {
    mockedListQuotes.mockResolvedValue(
      quotePage(
        [
          {
            id: 'q-1',
            name: 'Latest quote',
            status: 'DRAFT',
            monthlyPremium: 80,
          },
        ],
        {
          size: 4,
        }
      )
    );

    renderPage('overview');

    await waitFor(() => expect(screen.getByText('Latest quote')).toBeVisible());

    expect(
      screen.getByRole('heading', { name: /latest quotes/i })
    ).toBeVisible();
    expect(mockedListQuotes).toHaveBeenCalledWith({
      page: 0,
      size: 4,
      sortBy: 'createdAt',
      direction: 'desc',
    });
    expect(
      screen.queryByTestId(tid('quotesList.pagination'))
    ).not.toBeInTheDocument();
  });

  it('shows quote history as a focused list on the Quotes destination', async () => {
    mockedListQuotes.mockResolvedValue(
      quotePage([
        {
          id: 'q-1',
          name: 'Jane Roe',
          coverageType: 'PREMIUM',
          status: 'SUBMITTED',
          monthlyPremium: 129.5,
        },
      ])
    );

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
    mockedListQuotes.mockResolvedValue(
      quotePage([
        {
          id: 'q-1',
          name: 'Jane Roe',
          status: 'SUBMITTED',
          monthlyPremium: 129.5,
        },
      ])
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText(/USD\s*129\.50/)).toHaveLength(1);
    });
  });

  it('navigates to the personal quote step from the primary action', async () => {
    const user = userEvent.setup();
    mockedListQuotes.mockResolvedValue(quotePage([]));

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId(tid('quotesList.empty'))).toBeVisible();
    });
    await user.click(screen.getByRole('button', { name: /start a quote/i }));

    expect(navigate).toHaveBeenCalledWith('/quote/personal');
  });

  it('requests the next page with server-side pagination controls', async () => {
    const user = userEvent.setup();
    const firstQuote: QuoteView = {
      id: 'q-1',
      name: 'Jane Roe',
      status: 'SUBMITTED',
      monthlyPremium: 129.5,
    };
    const secondQuote: QuoteView = {
      id: 'q-2',
      name: 'Alex Roe',
      status: 'DRAFT',
      monthlyPremium: 80,
    };
    mockedListQuotes
      .mockResolvedValueOnce(
        quotePage([firstQuote], {
          size: 5,
          totalElements: 6,
          totalPages: 2,
          hasNext: true,
        })
      )
      .mockResolvedValueOnce(
        quotePage([secondQuote], {
          page: 1,
          size: 5,
          totalElements: 6,
          totalPages: 2,
          hasPrevious: true,
        })
      );

    renderPage('history');
    await waitFor(() => expect(screen.getByText('Jane Roe')).toBeVisible());

    await user.click(screen.getByRole('button', { name: /go to next page/i }));

    await waitFor(() => expect(screen.getByText('Alex Roe')).toBeVisible());
    expect(mockedListQuotes).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1 })
    );
  });
});
