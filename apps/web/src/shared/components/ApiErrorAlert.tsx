import { Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { errorMessageKey, tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { ApiRequestError } from '@shared/api/ApiRequestError';

export function ApiErrorAlert({ error }: { error: unknown }) {
  const { t } = useTranslation();
  const code = error instanceof ApiRequestError ? error.code : 'NETWORK';
  const traceId = error instanceof ApiRequestError ? error.traceId : undefined;

  return (
    <Alert
      severity="error"
      data-testid={tid('common.apiError')}
      data-widget-tone="critical"
      data-widget-boundary="outlined"
      sx={(theme) => ({
        mb: 2,
        alignItems: 'flex-start',
        border: '1px solid',
        borderColor: alpha(theme.palette.error.main, 0.38),
        backgroundColor: alpha(theme.palette.error.main, 0.06),
        '& .MuiAlert-icon': {
          alignItems: 'center',
          fontSize: 24,
        },
      })}
    >
      {t(errorMessageKey(code))}
      {traceId ? t('common.reference', { traceId }) : null}
    </Alert>
  );
}
