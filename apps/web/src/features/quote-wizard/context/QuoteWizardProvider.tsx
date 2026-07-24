import { createContext, useContext, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { initialWizardState, wizardReducer } from './wizardReducer';
import type { WizardAction, WizardState } from './wizardReducer';

type WizardContextValue = {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function QuoteWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useQuoteWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useQuoteWizard must be used inside QuoteWizardProvider');
  }
  return context;
}
