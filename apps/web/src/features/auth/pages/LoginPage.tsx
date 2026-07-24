import { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
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
    <Paper
      sx={{ p: { xs: 2, sm: 3 }, maxWidth: 420, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h5"
        gutterBottom
        data-testid={tid('auth.login.title')}
      >
        {t('auth.login.title')}
      </Typography>
      {sessionState === 'mfa-pending' ? <PasskeyPrompt /> : <LoginForm />}
      <PasskeyEnrollDialog open={showEnroll} onClose={closeEnroll} />
    </Paper>
  );
}
