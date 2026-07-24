import { describe, expect, it } from 'vitest';
import { initialWizardState, wizardReducer } from './wizardReducer';

const personal = { name: 'Jane', email: 'j@e.com', age: 34, zipCode: '06600' };

describe('wizardReducer', () => {
  it('stores personal data and quote id after submission', () => {
    const state = wizardReducer(initialWizardState, {
      type: 'PERSONAL_SUBMITTED',
      personal,
      quoteId: 'q1',
    });

    expect(state.quoteId).toBe('q1');
    expect(state.personal).toEqual(personal);
  });

  it('resets draft state when personal data changes', () => {
    let state = wizardReducer(initialWizardState, {
      type: 'PERSONAL_SUBMITTED',
      personal,
      quoteId: 'q1',
    });
    state = wizardReducer(state, {
      type: 'PREMIUM_UPDATED',
      premium: '100.00',
    });
    state = wizardReducer(state, {
      type: 'PERSONAL_EDITED',
      personal: { ...personal, age: 70 },
    });

    expect(state.quoteId).toBeNull();
    expect(state.premium).toBeNull();
    expect(state.coverage.coverageType).toBeNull();
  });

  it('keeps draft state when personal data is unchanged', () => {
    let state = wizardReducer(initialWizardState, {
      type: 'PERSONAL_SUBMITTED',
      personal,
      quoteId: 'q1',
    });
    state = wizardReducer(state, {
      type: 'PREMIUM_UPDATED',
      premium: '100.00',
    });
    state = wizardReducer(state, {
      type: 'PERSONAL_EDITED',
      personal: { ...personal },
    });

    expect(state.quoteId).toBe('q1');
    expect(state.premium).toBe('100.00');
  });

  it('stores the server premium value verbatim', () => {
    const state = wizardReducer(initialWizardState, {
      type: 'PREMIUM_UPDATED',
      premium: '327.60',
    });

    expect(state.premium).toBe('327.60');
  });
});
