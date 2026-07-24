import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandMark } from './BrandMark';
import { PageIntro } from './PageIntro';
import { StatusBadge } from './StatusBadge';
import { Surface } from './Surface';
import { theme } from '../theme/theme';

function renderWithTheme(node: ReactNode) {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {node}
    </ThemeProvider>
  );
}

describe('shared visual primitives', () => {
  it('defines the luxury fintech palette and motion/focus tokens', () => {
    expect(theme.palette.primary.main).toBe('#1b1d21');
    expect(theme.palette.primary.contrastText).toBe('#f8f4ec');
    expect(theme.palette.secondary.main).toBe('#c8a66a');
    expect(theme.palette.background.default).toBe('#f4f0e8');
    expect(theme.palette.background.paper).toBe('#fffdf8');
    expect(theme.palette.text.primary).toBe('#1b1d21');
    expect(theme.palette.text.secondary).toBe('#62656b');

    const baselineStyles = JSON.stringify(
      theme.components?.MuiCssBaseline?.styleOverrides ?? {}
    );

    expect(baselineStyles).toContain('prefers-reduced-motion: reduce');
    expect(baselineStyles).toContain('focus-visible');
  });

  it('renders a page intro with an accessible level-one heading', () => {
    renderWithTheme(
      <PageIntro
        eyebrow="YOUR PORTFOLIO"
        title="My quotes"
        description="Track every quote in one place."
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'My quotes' })
    ).toBeVisible();
    expect(screen.getByText('YOUR PORTFOLIO')).toBeVisible();
    expect(screen.getByText('Track every quote in one place.')).toBeVisible();
  });

  it('renders a surface without hiding its children', () => {
    renderWithTheme(
      <Surface tone="dark">
        <button type="button">Review quote</button>
      </Surface>
    );

    const button = screen.getByRole('button', { name: 'Review quote' });

    expect(button).toBeVisible();
    expect(button.closest('[data-tone="dark"]')).not.toBeNull();
  });

  it('keeps status meaning in text instead of color alone', () => {
    renderWithTheme(<StatusBadge status="SUBMITTED" label="Submitted" />);

    expect(screen.getByText('Submitted')).toHaveAttribute(
      'data-status',
      'SUBMITTED'
    );
  });

  it('renders the shared brand mark text treatment', () => {
    renderWithTheme(<BrandMark />);

    expect(screen.getByText('Clara')).toBeVisible();
  });
});
