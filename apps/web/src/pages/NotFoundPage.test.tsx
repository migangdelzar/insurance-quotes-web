import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { NotFoundPage } from './NotFoundPage';

function renderPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={['/missing']}>
          <NotFoundPage />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('NotFoundPage', () => {
  it('renders a premium recovery state with a return link', async () => {
    await i18n.changeLanguage('en-US');
    renderPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' })
    ).toHaveAttribute('data-testid', tid('notFound.title'));
    expect(screen.getByText('404')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Go to quotes' })).toHaveAttribute(
      'href',
      '/quotes'
    );
  });
});
