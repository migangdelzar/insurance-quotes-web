import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { QuoteSummaryView } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { QuoteSummaryDashboard } from './QuoteSummaryDashboard';

const summary: QuoteSummaryView = {
  totalQuotes: 12,
  draftQuotes: 4,
  submittedQuotes: 6,
  submissionFailedQuotes: 1,
  expiredQuotes: 1,
  pricedQuotes: 8,
  totalMonthlyPremium: 980,
  averageMonthlyPremium: 122.5,
  submissionRate: 85.71,
  statusDistribution: [
    { key: 'DRAFT', count: 4 },
    { key: 'SUBMITTED', count: 6 },
    { key: 'SUBMISSION_FAILED', count: 1 },
    { key: 'EXPIRED', count: 1 },
  ],
  coverageDistribution: [
    { key: 'BASIC', count: 3 },
    { key: 'STANDARD', count: 5 },
    { key: 'PREMIUM', count: 4 },
  ],
  trend: [
    { date: '2026-07-22', created: 2, submitted: 1, failed: 0 },
    { date: '2026-07-23', created: 3, submitted: 2, failed: 1 },
  ],
};

function renderDashboard(
  props: Partial<React.ComponentProps<typeof QuoteSummaryDashboard>> = {}
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QuoteSummaryDashboard summary={summary} {...props} />
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('QuoteSummaryDashboard', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('renders aggregate KPIs and accessible visual summaries', () => {
    renderDashboard();

    expect(screen.getByTestId(tid('quotesList.analytics'))).toBeVisible();
    expect(screen.getByText('Portfolio intelligence')).toBeVisible();
    expect(screen.getByText('12')).toBeVisible();
    expect(screen.getByText('$980.00')).toBeVisible();
    expect(
      screen.getByRole('img', { name: /status distribution/i })
    ).toBeVisible();
    expect(
      screen.getByRole('img', { name: /seven-day activity/i })
    ).toBeVisible();
  });

  it('renders an actionable error state', () => {
    const onRetry = vi.fn();

    renderDashboard({ summary: undefined, isError: true, onRetry });

    expect(screen.getByText(/temporarily unavailable/i)).toBeVisible();
    expect(
      screen.getByRole('button', { name: /retry analytics/i })
    ).toBeVisible();
  });
});
