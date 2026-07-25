import { Alert, Button, Stack } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import type { SubmissionState } from '@features/quote-wizard/context/wizardReducer';

type Props = {
  submission: SubmissionState;
  error: unknown;
  onRetry: () => void;
  onViewQuotes: () => void;
  onStartNewQuote: () => void;
};

export function SubmissionResult({
  submission,
  error,
  onRetry,
  onViewQuotes,
  onStartNewQuote,
}: Props) {
  const { t } = useTranslation();

  if (submission === 'succeeded') {
    return (
      <Stack spacing={2}>
        <Alert severity="success" data-testid={tid('wizard.summary.success')}>
          {t('wizard.summary.success')}
        </Alert>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ '& > *': { width: { xs: '100%', sm: 'auto' } } }}
        >
          <Button
            variant="outlined"
            onClick={onViewQuotes}
            data-testid={tid('wizard.summary.allQuotes')}
          >
            {t('wizard.summary.allQuotes')}
          </Button>
          <Button
            variant="contained"
            onClick={onStartNewQuote}
            data-testid={tid('wizard.summary.newQuote')}
          >
            {t('wizard.summary.newQuote')}
          </Button>
        </Stack>
      </Stack>
    );
  }
  if (submission === 'checking') {
    return (
      <Alert severity="info" data-testid={tid('wizard.summary.checking')}>
        {t('wizard.summary.checking')}
      </Alert>
    );
  }
  if (submission === 'failed') {
    return (
      <Stack spacing={1}>
        <Alert severity="error" data-testid={tid('wizard.summary.failure')}>
          {t('wizard.summary.failure')}
        </Alert>
        {error ? <ApiErrorAlert error={error} /> : null}
        <Button
          variant="outlined"
          onClick={onRetry}
          data-testid={tid('common.retry')}
        >
          {t('common.retry')}
        </Button>
      </Stack>
    );
  }
  return null;
}
