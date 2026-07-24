import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tid } from '@clara/app-i18n';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { useFocusHeading } from '@shared/hooks/useFocusHeading';
import { createQuote } from '@features/quote-wizard/api/quoteApi';
import { useQuoteWizard } from '@features/quote-wizard/context/QuoteWizardProvider';
import { WizardProgress } from '@features/quote-wizard/components/WizardProgress';
import { personalSchema } from './personalSchema';
import type { PersonalFormValues } from './personalSchema';

export function PersonalInfoStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch } = useQuoteWizard();
  const headingRef = useFocusHeading<HTMLHeadingElement>();
  const form = useForm<PersonalFormValues>({
    resolver: yupResolver(personalSchema),
    defaultValues: state.personal ?? {
      name: '',
      email: '',
      age: undefined,
      zipCode: '',
    },
    mode: 'onBlur',
  });

  const creation = useMutation({
    mutationFn: (values: PersonalFormValues) => createQuote(values),
    onSuccess: (quote, personal) => {
      dispatch({
        type: 'PERSONAL_SUBMITTED',
        personal,
        quoteId: quote.id ?? '',
      });
      void navigate('/quote/coverage');
    },
  });

  const onNext = form.handleSubmit((values) => {
    dispatch({ type: 'PERSONAL_EDITED', personal: values });
    if (state.quoteId && state.personal && sameValues(state.personal, values)) {
      void navigate('/quote/coverage');
      return;
    }
    creation.mutate(values);
  });

  const errorKey = (field: keyof PersonalFormValues) =>
    form.formState.errors[field]?.message;

  return (
    <form onSubmit={onNext} noValidate>
      <WizardProgress activeStep={0} />
      <Typography
        component="h1"
        variant="h5"
        gutterBottom
        tabIndex={-1}
        ref={headingRef}
        data-testid={tid('wizard.personal.title')}
      >
        {t('wizard.personal.title')}
      </Typography>
      {creation.error ? <ApiErrorAlert error={creation.error} /> : null}
      <Stack spacing={2}>
        <TextField
          label={t('wizard.personal.name')}
          inputProps={{ 'data-testid': tid('wizard.personal.name') }}
          error={Boolean(errorKey('name'))}
          helperText={errorKey('name') ? t(errorKey('name') ?? '') : undefined}
          {...form.register('name')}
        />
        <TextField
          label={t('wizard.personal.email')}
          inputProps={{ 'data-testid': tid('wizard.personal.email') }}
          error={Boolean(errorKey('email'))}
          helperText={
            errorKey('email') ? t(errorKey('email') ?? '') : undefined
          }
          {...form.register('email')}
        />
        <TextField
          label={t('wizard.personal.age')}
          type="number"
          inputProps={{ 'data-testid': tid('wizard.personal.age') }}
          error={Boolean(errorKey('age'))}
          helperText={errorKey('age') ? t(errorKey('age') ?? '') : undefined}
          {...form.register('age', { valueAsNumber: true })}
        />
        <TextField
          label={t('wizard.personal.zipCode')}
          inputProps={{ 'data-testid': tid('wizard.personal.zipCode') }}
          error={Boolean(errorKey('zipCode'))}
          helperText={
            errorKey('zipCode') ? t(errorKey('zipCode') ?? '') : undefined
          }
          {...form.register('zipCode')}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={creation.isPending}
          data-testid={tid('common.next')}
        >
          {t('common.next')}
        </Button>
      </Stack>
    </form>
  );
}

function sameValues(a: PersonalFormValues, b: PersonalFormValues): boolean {
  return (
    a.name === b.name &&
    a.email === b.email &&
    a.age === b.age &&
    a.zipCode === b.zipCode
  );
}
