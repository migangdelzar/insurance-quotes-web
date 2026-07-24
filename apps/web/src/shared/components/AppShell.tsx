import type { ReactNode } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import type { Locale } from '@clara/app-i18n';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useAuth } from '@features/auth/context/AuthProvider';
import { BrandMark } from './BrandMark';

type AppShellProps = {
  children: ReactNode;
};

const locales: readonly Locale[] = ['en-US', 'es-MX'];

export function AppShell({ children }: AppShellProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const activeLocale = (i18n.resolvedLanguage ?? i18n.language) as Locale;
  const secureMessageKey = isAuthenticated
    ? 'layout.secureSessionAuthenticated'
    : location.pathname.startsWith('/login')
      ? 'layout.secureSessionAnonymous'
      : 'layout.secureSessionDefault';

  const changeLanguage = (locale: Locale) => {
    if (activeLocale !== locale) {
      void i18n.changeLanguage(locale);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      <a
        href={`#${tid('layout.main')}`}
        data-testid={tid('common.skipToContent')}
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 8,
          zIndex: 1300,
        }}
        onFocus={(event) => {
          event.currentTarget.style.left = '8px';
        }}
        onBlur={(event) => {
          event.currentTarget.style.left = '-10000px';
        }}
      >
        {t('common.skipToContent')}
      </a>

      <Box
        component="header"
        sx={(theme) => ({
          backgroundColor: theme.palette.charcoal.main,
          color: theme.palette.charcoal.contrastText,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <BrandMark
              productLabel={t('common.appName')}
              sx={{
                '& .MuiTypography-root': {
                  color: 'inherit',
                },
              }}
            />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              <Box
                sx={(theme) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.875,
                  borderRadius: 999,
                  backgroundColor: theme.palette.gold.main,
                  color: theme.palette.gold.contrastText,
                })}
              >
                <Box
                  aria-hidden="true"
                  sx={(theme) => ({
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.main,
                  })}
                />
                <Typography component="span" variant="body2" fontWeight={600}>
                  {t(secureMessageKey)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  component="span"
                  variant="body2"
                  color="inherit"
                  sx={{ opacity: 0.84 }}
                >
                  {t('layout.languageLabel')}
                </Typography>
                <ButtonGroup
                  variant="outlined"
                  aria-label={t('layout.languageLabel')}
                  sx={{
                    '& .MuiButton-root': {
                      borderColor: 'rgba(244, 240, 232, 0.28)',
                      color: 'inherit',
                    },
                  }}
                >
                  {locales.map((locale) => {
                    const isActive = activeLocale === locale;

                    return (
                      <Button
                        key={locale}
                        type="button"
                        aria-pressed={isActive}
                        variant={isActive ? 'contained' : 'outlined'}
                        color={isActive ? 'secondary' : 'inherit'}
                        onClick={() => changeLanguage(locale)}
                      >
                        {t(`layout.languages.${locale}`)}
                      </Button>
                    );
                  })}
                </ButtonGroup>
              </Stack>

              {isAuthenticated ? (
                <Button
                  type="button"
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    void logout();
                  }}
                >
                  {t('layout.signOut')}
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container
        component="main"
        id={tid('layout.main')}
        data-testid={tid('layout.main')}
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
          minWidth: 0,
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3 } }}>
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Link href="#footer-support" underline="hover" color="inherit">
                {t('layout.footer.support')}
              </Link>
              <Link href="#footer-privacy" underline="hover" color="inherit">
                {t('layout.footer.privacySecurity')}
              </Link>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {t('layout.footer.trustStatement')}
            </Typography>
            <Typography
              id="footer-support"
              variant="body2"
              color="text.secondary"
            >
              {t('layout.footer.supportContact')}
            </Typography>
            <Typography
              id="footer-privacy"
              variant="body2"
              color="text.secondary"
            >
              {t('layout.footer.privacySummary')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('layout.footer.buildLabel', {
                label: import.meta.env.MODE,
              })}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
