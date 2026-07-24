import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@shared/api/ApiRequestError';
import { initialWizardState } from '@features/quote-wizard/context/wizardReducer';
import * as quoteApi from '@features/quote-wizard/api/quoteApi';
import { useSubmitQuote } from './useSubmitQuote';

vi.mock('@features/quote-wizard/api/quoteApi');

const state = { ...initialWizardState, quoteId: 'q1' };

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

describe('useSubmitQuote', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reaches succeeded after a successful submission', async () => {
    vi.mocked(quoteApi.submitQuote).mockResolvedValue({
      id: 'q1',
      status: 'SUBMITTED',
    });
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSubmitQuote(state, dispatch), {
      wrapper,
    });

    act(() => result.current.submit());

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SUBMISSION_STATE',
        value: 'succeeded',
      })
    );
  });

  it('reaches failed after insurer unavailability', async () => {
    vi.mocked(quoteApi.submitQuote).mockRejectedValue(
      new ApiRequestError(502, 'INSURER_UNAVAILABLE', 'down')
    );
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSubmitQuote(state, dispatch), {
      wrapper,
    });

    act(() => result.current.submit());

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SUBMISSION_STATE',
        value: 'failed',
      })
    );
  });

  it('re-checks a timed out submission before deciding', async () => {
    vi.mocked(quoteApi.submitQuote).mockRejectedValue(
      new ApiRequestError(0, 'TIMEOUT', 'timeout')
    );
    vi.mocked(quoteApi.getQuote).mockResolvedValue({
      id: 'q1',
      status: 'SUBMITTED',
    });
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSubmitQuote(state, dispatch), {
      wrapper,
    });

    act(() => result.current.submit());

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SUBMISSION_STATE',
        value: 'checking',
      })
    );
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SUBMISSION_STATE',
        value: 'succeeded',
      })
    );
    expect(quoteApi.getQuote).toHaveBeenCalledWith('q1');
  });
});
