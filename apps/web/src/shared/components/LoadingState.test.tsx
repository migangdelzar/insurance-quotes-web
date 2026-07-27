import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { theme } from '@shared/theme/theme';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders loading content with stable status semantics', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingState label="Loading quotes" />
      </ThemeProvider>
    );

    expect(
      screen.getByRole('status', { name: /loading quotes/i })
    ).toBeVisible();
  });
});
