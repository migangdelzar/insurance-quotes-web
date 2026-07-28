import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { Dispatch } from 'react';
import { ApiRequestError } from '@shared/api/ApiRequestError';
import { getQuote, submitQuote } from '@features/quote-wizard/api/quoteApi';
import type {
  WizardAction,
  WizardState,
} from '@features/quote-wizard/context/wizardReducer';

export function useSubmitQuote(
  state: WizardState,
  dispatch: Dispatch<WizardAction>
) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      if (!state.quoteId) {
        return Promise.reject(new Error('Cannot submit a quote without an id'));
      }
      return submitQuote(state.quoteId);
    },
    onMutate: () => dispatch({ type: 'SUBMISSION_STATE', value: 'submitting' }),
    onSuccess: () => {
      dispatch({ type: 'SUBMISSION_STATE', value: 'succeeded' });
      void queryClient.invalidateQueries({ queryKey: ['quotes'] });
      void queryClient.invalidateQueries({ queryKey: ['quote-summary'] });
    },
    onError: async (error) => {
      const isTimeout =
        error instanceof ApiRequestError && error.code === 'TIMEOUT';
      if (!isTimeout) {
        dispatch({ type: 'SUBMISSION_STATE', value: 'failed' });
        return;
      }
      dispatch({ type: 'SUBMISSION_STATE', value: 'checking' });
      const current = state.quoteId
        ? await getQuote(state.quoteId).catch(() => null)
        : null;
      dispatch({
        type: 'SUBMISSION_STATE',
        value: current?.status === 'SUBMITTED' ? 'succeeded' : 'failed',
      });
    },
  });

  return {
    submit: () => mutation.mutate(),
    submission: state.submission,
    error: mutation.error,
  };
}
