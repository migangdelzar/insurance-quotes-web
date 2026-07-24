import type { components } from './generated/schema';

export type { paths, components } from './generated/schema';

type Schemas = components['schemas'];

export type QuoteView = Schemas['QuoteView'];
export type CoverageType = NonNullable<QuoteView['coverageType']>;
export type HealthCondition = NonNullable<QuoteView['conditions']>[number];
export type QuoteStatus = NonNullable<QuoteView['status']>;
export type CreateQuoteRequest = Schemas['CreateQuoteRequest'];
export type UpdateCoverageRequest = Schemas['UpdateCoverageRequest'];
export type LoginResponse = Schemas['LoginResponse'];
export type TokenPairResponse = Schemas['TokenPairResponse'];
export type WebAuthnChallengeResponse = Schemas['WebAuthnChallengeResponse'];

export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: Record<string, string>;
};

export const COVERAGE_TYPES: readonly CoverageType[] = [
  'BASIC',
  'STANDARD',
  'PREMIUM',
];

export const HEALTH_CONDITIONS: readonly HealthCondition[] = [
  'DIABETES',
  'HEART_DISEASE',
  'HYPERTENSION',
  'CANCER_HISTORY',
  'OTHER',
];
