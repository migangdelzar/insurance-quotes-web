import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import * as quoteApi from '@features/quote-wizard/api/quoteApi';
import { QuoteWizardProvider } from '@features/quote-wizard/context/QuoteWizardProvider';
import { PersonalInfoStep } from './PersonalInfoStep';

vi.mock('../../api/quoteApi');

function renderStep() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <QuoteWizardProvider>
            <PersonalInfoStep />
          </QuoteWizardProvider>
        </QueryClientProvider>
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('PersonalInfoStep', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows validation errors and blocks next on invalid data', async () => {
    renderStep();

    await userEvent.click(screen.getByTestId(tid('common.next')));

    await waitFor(() => {
      expect(
        screen.getByText(i18n.t('wizard.personal.nameRequired'))
      ).toBeInTheDocument();
    });
    expect(quoteApi.createQuote).not.toHaveBeenCalled();
  });

  it('valid data creates a draft quote', async () => {
    vi.mocked(quoteApi.createQuote).mockResolvedValue({
      id: 'q1',
      status: 'DRAFT',
    });
    renderStep();

    await userEvent.type(
      screen.getByTestId(tid('wizard.personal.name')),
      'Jane Roe'
    );
    await userEvent.type(
      screen.getByTestId(tid('wizard.personal.email')),
      'jane@example.com'
    );
    await userEvent.type(screen.getByTestId(tid('wizard.personal.age')), '34');
    await userEvent.type(
      screen.getByTestId(tid('wizard.personal.zipCode')),
      '06600'
    );
    await userEvent.click(screen.getByTestId(tid('common.next')));

    await waitFor(() => {
      expect(quoteApi.createQuote).toHaveBeenCalledWith({
        name: 'Jane Roe',
        email: 'jane@example.com',
        age: 34,
        zipCode: '06600',
      });
    });
  });
});
