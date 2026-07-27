import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WizardState } from '@features/quote-wizard/context/wizardReducer';
import * as quoteApi from '@features/quote-wizard/api/quoteApi';
import { useDebouncedCoverageSync } from './useDebouncedCoverageSync';

vi.mock('@features/quote-wizard/api/quoteApi');

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}

const seniorCoverageState: WizardState = {
  quoteId: 'quote-1',
  personal: { name: 'Ana', email: 'ana@example.com', age: 70, zipCode: '06600' },
  coverage: {
    coverageType: 'PREMIUM',
    hasPreexistingConditions: true,
    conditions: ['DIABETES', 'HYPERTENSION'],
    takesPrescriptionMedication: true,
    usesTobacco: false,
    needsSpouseCoverage: false,
  },
  premium: null,
  submission: 'idle',
};

describe('useDebouncedCoverageSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => vi.useRealTimers());

  it('flushes the pending senior-health coverage update without waiting for the debounce', async () => {
    vi.mocked(quoteApi.updateCoverage).mockResolvedValue({
      id: 'quote-1',
      status: 'DRAFT',
      monthlyPremium: 450,
    });
    const dispatch = vi.fn();
    const { result } = renderHook(
      () => useDebouncedCoverageSync(seniorCoverageState, dispatch),
      { wrapper }
    );

    await act(async () => {
      await result.current.flush();
    });

    expect(quoteApi.updateCoverage).toHaveBeenCalledWith('quote-1', {
      coverageType: 'PREMIUM',
      hasPreexistingConditions: true,
      conditions: ['DIABETES', 'HYPERTENSION'],
      takesPrescriptionMedication: true,
      usesTobacco: false,
      needsSpouseCoverage: false,
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(quoteApi.updateCoverage).toHaveBeenCalledTimes(1);
  });
});
