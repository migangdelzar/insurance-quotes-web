import { Alert } from '@mui/material';
import { errorMessageKey, testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { ApiRequestError } from '@shared/api/ApiRequestError';

export function ApiErrorAlert({ error }: { error: unknown }) {
  const { t } = useTranslation();
  const code = error instanceof ApiRequestError ? error.code : 'NETWORK';
  const traceId = error instanceof ApiRequestError ? error.traceId : undefined;

  return (
    <Alert
      severity="error"
      sx={{ mb: 2 }}
      data-testid={testIds.common.apiError}
    >
      {t(errorMessageKey(code))}
      {traceId ? t('common.reference', { traceId }) : null}
    </Alert>
  );
}
