import { useCallback, useEffect, useRef } from 'react';
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
  const mutateAsyncRef = useRef(mutation.mutateAsync);
  mutateAsyncRef.current = mutation.mutateAsync;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRequestRef = useRef<UpdateCoverageRequest | null>(null);
  const inFlightRef = useRef<Promise<unknown> | null>(null);
  const { coverage, quoteId, personal } = state;

  const synchronize = useCallback((request: UpdateCoverageRequest) => {
    const sync = mutateAsyncRef.current(request);
    inFlightRef.current = sync;
    void sync.then(
      () => {
        if (inFlightRef.current === sync) inFlightRef.current = null;
      },
      () => {
        if (inFlightRef.current === sync) inFlightRef.current = null;
      }
    );
    return sync;
  }, []);

  useEffect(() => {
    if (!quoteId || !coverage.coverageType) return;
    pendingRequestRef.current = toRequest(coverage, (personal?.age ?? 0) > 65);
    const timer = setTimeout(() => {
      timerRef.current = null;
      const request = pendingRequestRef.current;
      pendingRequestRef.current = null;
      if (request) void synchronize(request).catch(() => undefined);
    }, DEBOUNCE_MS);
    timerRef.current = timer;

    return () => {
      clearTimeout(timer);
      if (timerRef.current === timer) timerRef.current = null;
    };
  }, [coverage, personal, quoteId, synchronize]);

  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const pendingRequest = pendingRequestRef.current;
    pendingRequestRef.current = null;
    if (pendingRequest) {
      await synchronize(pendingRequest);
      return;
    }

    await inFlightRef.current;
  }, [synchronize]);

  return { updating: mutation.isPending, error: mutation.error, flush };
}
