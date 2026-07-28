import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Surface } from '@shared/components/Surface';
import { LoginForm } from '../components/LoginForm';
import { PasskeyEnrollDialog } from '../components/PasskeyEnrollDialog';
import { PasskeyPrompt } from '../components/PasskeyPrompt';
import { useAuth } from '../context/AuthProvider';

export function LoginPage() {
  const { t } = useTranslation();
  const { authenticationMethod, sessionState } = useAuth();
  const navigate = useNavigate();
  const [showEnroll, setShowEnroll] = useState(false);
  const [wasAnonymous, setWasAnonymous] = useState(true);

  useEffect(() => {
    if (sessionState === 'mfa-pending') {
      return;
    }
    if (sessionState !== 'authenticated') {
      return;
    }
    if (wasAnonymous && authenticationMethod === 'password') {
      setShowEnroll(true);
      setWasAnonymous(false);
      return;
    }
    if (!showEnroll) {
      void navigate('/quotes');
    }
  }, [authenticationMethod, navigate, sessionState, showEnroll, wasAnonymous]);

  const closeEnroll = () => {
    setShowEnroll(false);
    void navigate('/quotes');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 560,
        mx: 'auto',
      }}
    >
      <Surface
        component="section"
        aria-labelledby={tid('auth.login.title')}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 5 },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Stack spacing={3} sx={{ width: '100%' }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary" component="p">
              {t('auth.login.eyebrow')}
            </Typography>
            <Typography
              id={tid('auth.login.title')}
              component="h1"
              variant="h1"
              data-testid={tid('auth.login.title')}
            >
              {t('auth.login.title')}
            </Typography>
            <Typography
              id="auth-login-description"
              variant="body1"
              color="text.secondary"
            >
              {t('auth.login.description')}
            </Typography>
          </Stack>

          {sessionState === 'mfa-pending' ? (
            <PasskeyPrompt />
          ) : (
            <LoginForm
              labelledBy={tid('auth.login.title')}
              describedBy="auth-login-description"
            />
          )}
          <Typography variant="body2" color="text.secondary">
            {t('auth.login.securityNote')}
          </Typography>
        </Stack>
      </Surface>

      <PasskeyEnrollDialog open={showEnroll} onClose={closeEnroll} />
    </Box>
  );
}
