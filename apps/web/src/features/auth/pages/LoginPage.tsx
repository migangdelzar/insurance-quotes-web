import { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { PasskeyEnrollDialog } from '../components/PasskeyEnrollDialog';
import { PasskeyPrompt } from '../components/PasskeyPrompt';
import { useAuth } from '../context/AuthProvider';

export function LoginPage() {
  const { t } = useTranslation();
  const { sessionState } = useAuth();
  const navigate = useNavigate();
  const [showEnroll, setShowEnroll] = useState(false);
  const [wasAnonymous, setWasAnonymous] = useState(true);

  useEffect(() => {
    if (sessionState !== 'authenticated') {
      return;
    }
    if (wasAnonymous) {
      setShowEnroll(true);
      setWasAnonymous(false);
      return;
    }
    void navigate('/quotes');
  }, [navigate, sessionState, wasAnonymous]);

  const closeEnroll = () => {
    setShowEnroll(false);
    void navigate('/quotes');
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto' }}>
      <Typography
        variant="h5"
        gutterBottom
        data-testid={testIds.auth.login.title}
      >
        {t('auth.login.title')}
      </Typography>
      {sessionState === 'mfa-pending' ? <PasskeyPrompt /> : <LoginForm />}
      <PasskeyEnrollDialog open={showEnroll} onClose={closeEnroll} />
    </Paper>
  );
}
