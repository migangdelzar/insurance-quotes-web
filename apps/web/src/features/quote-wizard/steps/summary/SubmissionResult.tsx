import { Alert, Button, Stack } from '@mui/material';
import { testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import type { SubmissionState } from '@features/quote-wizard/context/wizardReducer';

type Props = {
  submission: SubmissionState;
  error: unknown;
  onRetry: () => void;
};

export function SubmissionResult({ submission, error, onRetry }: Props) {
  const { t } = useTranslation();

  if (submission === 'succeeded') {
    return (
      <Alert severity="success" data-testid={testIds.wizard.summary.success}>
        {t('wizard.summary.success')}
      </Alert>
    );
  }
  if (submission === 'checking') {
    return (
      <Alert severity="info" data-testid={testIds.wizard.summary.checking}>
        {t('wizard.summary.checking')}
      </Alert>
    );
  }
  if (submission === 'failed') {
    return (
      <Stack spacing={1}>
        <Alert severity="error" data-testid={testIds.wizard.summary.failure}>
          {t('wizard.summary.failure')}
        </Alert>
        {error ? <ApiErrorAlert error={error} /> : null}
        <Button
          variant="outlined"
          onClick={onRetry}
          data-testid={testIds.common.retry}
        >
          {t('common.retry')}
        </Button>
      </Stack>
    );
  }
  return null;
}
