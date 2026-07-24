import type { CoverageType, HealthCondition } from '@clara/api-contract';

export type PersonalData = {
  name: string;
  email: string;
  age: number;
  zipCode: string;
};

export type CoverageData = {
  coverageType: CoverageType | null;
  hasPreexistingConditions: boolean | null;
  conditions: HealthCondition[];
  takesPrescriptionMedication: boolean | null;
  usesTobacco: boolean | null;
  needsSpouseCoverage: boolean | null;
};

export type SubmissionState =
  'idle' | 'submitting' | 'succeeded' | 'failed' | 'checking';

export type WizardState = {
  personal: PersonalData | null;
  quoteId: string | null;
  coverage: CoverageData;
  premium: string | null;
  submission: SubmissionState;
};

export type WizardAction =
  | { type: 'PERSONAL_SUBMITTED'; personal: PersonalData; quoteId: string }
  | { type: 'PERSONAL_EDITED'; personal: PersonalData }
  | { type: 'COVERAGE_CHANGED'; coverage: CoverageData }
  | { type: 'PREMIUM_UPDATED'; premium: string }
  | { type: 'SUBMISSION_STATE'; value: SubmissionState }
  | { type: 'RESET' };

export const emptyCoverage: CoverageData = {
  coverageType: null,
  hasPreexistingConditions: null,
  conditions: [],
  takesPrescriptionMedication: null,
  usesTobacco: null,
  needsSpouseCoverage: null,
};

export const initialWizardState: WizardState = {
  personal: null,
  quoteId: null,
  coverage: emptyCoverage,
  premium: null,
  submission: 'idle',
};

const samePersonal = (a: PersonalData, b: PersonalData) =>
  a.name === b.name &&
  a.email === b.email &&
  a.age === b.age &&
  a.zipCode === b.zipCode;

export function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  if (action.type === 'PERSONAL_SUBMITTED') {
    return { ...state, personal: action.personal, quoteId: action.quoteId };
  }
  if (action.type === 'PERSONAL_EDITED') {
    if (state.personal && samePersonal(state.personal, action.personal)) {
      return state;
    }
    return { ...initialWizardState, personal: action.personal };
  }
  if (action.type === 'COVERAGE_CHANGED') {
    return { ...state, coverage: action.coverage };
  }
  if (action.type === 'PREMIUM_UPDATED') {
    return { ...state, premium: action.premium };
  }
  if (action.type === 'SUBMISSION_STATE') {
    return { ...state, submission: action.value };
  }
  return initialWizardState;
}
