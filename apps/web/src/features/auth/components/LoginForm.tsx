import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';

export function LoginForm() {
  const { t } = useTranslation();
  const { login, loginWithPasskey } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    try {
      await login(username, password);
    } catch {
      setError(true);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <Stack spacing={2}>
        {error && (
          <Alert
            severity="error"
            data-testid={tid('auth.login.invalidCredentials')}
          >
            {t('auth.login.invalidCredentials')}
          </Alert>
        )}
        <TextField
          label={t('auth.login.username')}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          inputProps={{ 'data-testid': tid('auth.login.username') }}
          required
        />
        <TextField
          label={t('auth.login.password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          inputProps={{ 'data-testid': tid('auth.login.password') }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          data-testid={tid('auth.login.submit')}
        >
          {t('auth.login.submit')}
        </Button>
        <Button
          type="button"
          onClick={() => void loginWithPasskey()}
          data-testid={tid('auth.login.passwordless')}
        >
          {t('auth.login.passwordless')}
        </Button>
      </Stack>
    </form>
  );
}
