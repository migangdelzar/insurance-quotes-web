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
});
