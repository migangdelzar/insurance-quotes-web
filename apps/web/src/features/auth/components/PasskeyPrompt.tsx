import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';

export function PasskeyPrompt() {
  const { t } = useTranslation();
  const { completeMfa } = useAuth();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const verifyPasskey = async () => {
    setError(false);
    setPending(true);
    try {
      await completeMfa();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography
        component="h3"
        variant="h6"
        data-testid={tid('auth.mfa.title')}
      >
        {t('auth.mfa.title')}
      </Typography>
      <Typography data-testid={tid('auth.mfa.prompt')}>
        {t('auth.mfa.prompt')}
      </Typography>
      {error && (
        <Alert severity="error" data-testid={tid('auth.mfa.passkeyError')}>
          {t('auth.mfa.passkeyError')}
        </Alert>
      )}
      <Button
        variant="contained"
        onClick={() => void verifyPasskey()}
        disabled={pending}
        data-testid={tid('auth.login.passwordless')}
      >
        {t('auth.login.passwordless')}
      </Button>
    </Stack>
  );
}
