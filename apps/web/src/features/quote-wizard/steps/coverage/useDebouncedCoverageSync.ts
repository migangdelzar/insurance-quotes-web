import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { UpdateCoverageRequest } from '@clara/api-contract';
import { updateCoverage } from '@features/quote-wizard/api/quoteApi';
import type { CoverageData, WizardAction, WizardState } from '@features/quote-wizard/context/wizardReducer';
import type { Dispatch } from 'react';

const DEBOUNCE_MS = 400;

function toRequest(coverage: CoverageData, includeHealth: boolean): UpdateCoverageRequest {
  const base: UpdateCoverageRequest = { coverageType: coverage.coverageType ?? 'BASIC' };
  if (!includeHealth) return base;
  return {
    ...base,
    hasPreexistingConditions: coverage.hasPreexistingConditions ?? undefined,
    conditions: coverage.conditions.length ? coverage.conditions : undefined,
    takesPrescriptionMedication: coverage.takesPrescriptionMedication ?? undefined,
    usesTobacco: coverage.usesTobacco ?? undefined,
    needsSpouseCoverage: coverage.needsSpouseCoverage ?? undefined,
  };
}

export function useDebouncedCoverageSync(state: WizardState, dispatch: Dispatch<WizardAction>) {
  const mutation = useMutation({
    mutationFn: (body: UpdateCoverageRequest) => updateCoverage(state.quoteId ?? '', body),
    onSuccess: (quote) => {
      if (quote.monthlyPremium !== undefined && quote.monthlyPremium !== null) {
        dispatch({ type: 'PREMIUM_UPDATED', premium: String(quote.monthlyPremium) });
      }
    },
  });
  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;
  const { coverage, quoteId, personal } = state;

  useEffect(() => {
    if (!quoteId || !coverage.coverageType) return;
    const timer = setTimeout(() => mutateRef.current(toRequest(coverage, (personal?.age ?? 0) > 65)), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [coverage, personal, quoteId]);

  return { updating: mutation.isPending, error: mutation.error };
}
