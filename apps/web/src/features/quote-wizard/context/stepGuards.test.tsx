import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { QuoteWizardProvider } from './QuoteWizardProvider';
import { RequireQuote } from './stepGuards';

describe('step guards', () => {
  it('redirects to the personal step when no quote exists', () => {
    render(
      <MemoryRouter initialEntries={['/quote/coverage']}>
        <QuoteWizardProvider>
          <Routes>
            <Route path="/quote/personal" element={<div>personal-step</div>} />
            <Route element={<RequireQuote />}>
              <Route
                path="/quote/coverage"
                element={<div>coverage-step</div>}
              />
            </Route>
          </Routes>
        </QuoteWizardProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('personal-step')).toBeInTheDocument();
  });
});
