import { CssBaseline, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { SubmissionResult } from './SubmissionResult';

const renderSucceeded = () => {
  const onViewQuotes = vi.fn();
  const onStartNewQuote = vi.fn();

  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SubmissionResult
          submission="succeeded"
          error={null}
          onRetry={vi.fn()}
          onViewQuotes={onViewQuotes}
          onStartNewQuote={onStartNewQuote}
        />
      </ThemeProvider>
    </I18nextProvider>
  );

  return { onViewQuotes, onStartNewQuote };
};

describe('SubmissionResult', () => {
  it('offers a return to quotes action after a successful submission', () => {
    const { onViewQuotes } = renderSucceeded();

    fireEvent.click(screen.getByTestId(tid('wizard.summary.allQuotes')));

    expect(onViewQuotes).toHaveBeenCalledOnce();
  });

  it('offers a reset-and-start-new-quote action after a successful submission', () => {
    const { onStartNewQuote } = renderSucceeded();

    fireEvent.click(screen.getByTestId(tid('wizard.summary.newQuote')));

    expect(onStartNewQuote).toHaveBeenCalledOnce();
  });

  it('keeps retry visible after an insurer submission failure', () => {
    const onRetry = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SubmissionResult
            submission="failed"
            error={null}
            onRetry={onRetry}
            onViewQuotes={vi.fn()}
            onStartNewQuote={vi.fn()}
          />
        </ThemeProvider>
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId(tid('common.retry')));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('keeps the summary heading in place while checking a timed-out submission', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SubmissionResult
            submission="checking"
            error={null}
            onRetry={vi.fn()}
            onViewQuotes={vi.fn()}
            onStartNewQuote={vi.fn()}
          />
        </ThemeProvider>
      </I18nextProvider>
    );

    expect(
      screen.getByRole('status', { name: /confirming submission status/i })
    ).toHaveAttribute('data-testid', tid('wizard.summary.checking'));
  });
});
