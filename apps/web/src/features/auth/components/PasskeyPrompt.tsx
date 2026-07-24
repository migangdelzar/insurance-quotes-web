import { Button, Stack, Typography } from '@mui/material';
import { testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';

export function PasskeyPrompt() {
  const { t } = useTranslation();
  const { completeMfa } = useAuth();

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h6" data-testid={testIds.auth.mfa.title}>
        {t('auth.mfa.title')}
      </Typography>
      <Typography data-testid={testIds.auth.mfa.prompt}>
        {t('auth.mfa.prompt')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => void completeMfa()}
        data-testid={testIds.auth.login.passwordless}
      >
        {t('auth.login.passwordless')}
      </Button>
    </Stack>
  );
}
