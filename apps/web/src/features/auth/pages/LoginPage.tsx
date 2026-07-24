import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '@shared/components/BrandMark';
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
        maxWidth: 1120,
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'minmax(0, 1fr) minmax(360px, 0.78fr)',
        },
        gap: { xs: 2, sm: 3, lg: 4 },
        alignItems: 'stretch',
      }}
    >
      <Surface
        component="aside"
        tone="dark"
        aria-labelledby="auth-brand-heading"
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 5 },
          minHeight: { md: 560 },
          display: 'flex',
        }}
      >
        <Stack
          spacing={{ xs: 4, md: 7 }}
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Stack spacing={{ xs: 3, md: 5 }}>
            <BrandMark
              productLabel={t('common.appName')}
              sx={{
                '& .MuiTypography-root': { color: 'inherit' },
                color: 'inherit',
              }}
            />
            <Stack spacing={1.5}>
              <Typography
                variant="overline"
                color="secondary.main"
                component="p"
              >
                {t('auth.login.eyebrow')}
              </Typography>
              <Typography
                id="auth-brand-heading"
                component="h1"
                variant="h1"
                sx={{ maxWidth: 620 }}
              >
                {t('auth.login.brandHeadline')}
              </Typography>
              <Typography
                variant="body1"
                color="inherit"
                sx={{ opacity: 0.78, maxWidth: 560 }}
              >
                {t('auth.login.brandDescription')}
              </Typography>
            </Stack>
          </Stack>

          <Box component="section" aria-labelledby="auth-trust-heading">
            <Typography
              id="auth-trust-heading"
              component="p"
              variant="h4"
              color="inherit"
              sx={{ mb: 2 }}
            >
              {t('auth.login.trustTitle')}
            </Typography>
            <Stack
              component="ul"
              spacing={2}
              sx={{ p: 0, m: 0, listStyle: 'none' }}
            >
              {(['guided', 'secure', 'private'] as const).map((item) => (
                <Stack
                  component="li"
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  key={item}
                >
                  <Box
                    aria-hidden="true"
                    sx={(theme) => ({
                      mt: '0.55rem',
                      width: 7,
                      height: 7,
                      flexShrink: 0,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.secondary.main,
                    })}
                  />
                  <Typography
                    component="span"
                    variant="body2"
                    color="inherit"
                    sx={{ opacity: 0.78 }}
                  >
                    {t(`auth.login.trust.${item}`)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Surface>

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
              component="h2"
              variant="h2"
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
