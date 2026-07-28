import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { setApplicationLocale } from '@app/i18n';
import { useAuth } from '@features/auth/context/AuthProvider';
import { PageIntro } from '@shared/components/PageIntro';

const supportedLocales = ['en-US', 'es-MX'] as const;

function ShieldIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4.18 5 2.22V11c0 3.52-2.29 6.91-5 7.93C9.29 17.91 7 14.52 7 11V7.4l5-2.22z" />
    </SvgIcon>
  );
}

function SignOutIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M10 17v-2h4v-2h-4v-2l-4 3 4 3zm-6 2V5c0-1.1.9-2 2-2h7v2H6v14h7v2H6c-1.1 0-2-.9-2-2zm12.59-9.41L15.17 11l1.59 1.59H9v2h7.76l-1.59 1.59L16.59 17.6 20.59 13.6l-4-4z" />
    </SvgIcon>
  );
}

function LanguageIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.05 8.05 0 0 1 18.9 8zM12 4.04c.83 1.2 1.46 2.53 1.86 3.96h-3.72A13.6 13.6 0 0 1 12 4.04zM4.26 14a7.8 7.8 0 0 1 0-4h3.33a16.4 16.4 0 0 0 0 4H4.26zm.84 2h2.95a15.7 15.7 0 0 0 1.38 3.56A8.05 8.05 0 0 1 5.1 16zm2.95-8H5.1a8.05 8.05 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.05 8zM12 19.96A13.6 13.6 0 0 1 10.14 16h3.72A13.6 13.6 0 0 1 12 19.96zM14.41 14H9.59a14.2 14.2 0 0 1 0-4h4.82a14.2 14.2 0 0 1 0 4zm.16 5.56A15.7 15.7 0 0 0 15.95 16h2.95a8.05 8.05 0 0 1-4.33 3.56zM16.41 14a16.4 16.4 0 0 0 0-4h3.33a7.8 7.8 0 0 1 0 4h-3.33z" />
    </SvgIcon>
  );
}

function SupportIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-10 10v4a4 4 0 0 0 4 4h2v-8H4a8 8 0 0 1 16 0h-4v8h2a4 4 0 0 0 4-4v-4A10 10 0 0 0 12 2zm1 18h-2v2h2v-2z" />
    </SvgIcon>
  );
}

function PrivacyIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 18c-3.75-1.16-6.5-4.85-6.5-8V6.63L12 3.74l6.5 2.89V11c0 3.15-2.75 6.84-6.5 8zm-1.1-4.1 5.3-5.3-1.4-1.4-3.9 3.89-1.9-1.89-1.4 1.4 3.3 3.29z" />
    </SvgIcon>
  );
}

const widgetHeadingSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
} as const;

export function AccountPage() {
  const { i18n, t } = useTranslation();
  const { authenticationMethod, logout } = useAuth();
  const activeLocale = i18n.resolvedLanguage ?? i18n.language;

  return (
    <Stack spacing={3}>
      <PageIntro
        title={t('navigation.accountTitle')}
        description={t('navigation.accountSecurity')}
      />

      <Paper
        variant="outlined"
        data-widget-tone="preferences"
        data-widget-boundary="outlined"
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
          borderColor: alpha(theme.palette.primary.main, 0.16),
        })}
      >
        <Stack spacing={2}>
          <Typography component="h2" variant="h6" sx={widgetHeadingSx}>
            <LanguageIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            {t('navigation.accountLanguage')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            {supportedLocales.map((locale) => (
              <Button
                key={locale}
                aria-pressed={activeLocale === locale}
                variant={activeLocale === locale ? 'contained' : 'outlined'}
                onClick={() => void setApplicationLocale(locale)}
              >
                {t(`layout.languages.${locale}`)}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        data-widget-tone="secure"
        data-widget-boundary="outlined"
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
          borderLeft: '3px solid',
          borderColor: alpha(theme.palette.success.main, 0.36),
          borderLeftColor: theme.palette.success.main,
          backgroundColor: alpha(theme.palette.success.main, 0.04),
        })}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon color="success" sx={{ fontSize: 24 }} />
            <Typography component="h2" variant="h6">
              {t('navigation.accountSession')}
            </Typography>
          </Stack>
          <Typography color="text.secondary">
            {t('navigation.accountSecurity')}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {authenticationMethod === 'passkey'
              ? t('auth.login.securityNote')
              : t('layout.secureSessionAuthenticated')}
          </Typography>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        data-widget-tone="support"
        data-widget-boundary="outlined"
        sx={{ p: { xs: 2, sm: 3 } }}
      >
        <Stack spacing={2}>
          <Typography component="h2" variant="h6" sx={widgetHeadingSx}>
            <SupportIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            {t('navigation.accountSupport')}
          </Typography>
          <Typography color="text.secondary">
            {t('layout.footer.supportContact')}
          </Typography>
          <Divider />
          <Typography component="h2" variant="h6" sx={widgetHeadingSx}>
            <PrivacyIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            {t('navigation.accountPrivacy')}
          </Typography>
          <Typography color="text.secondary">
            {t('layout.footer.privacySummary')}
          </Typography>
        </Stack>
      </Paper>

      <Box>
        <Button
          color="error"
          data-testid={tid('navigation.accountSignOut')}
          onClick={() => void logout()}
          startIcon={<SignOutIcon />}
          variant="outlined"
        >
          {t('navigation.accountSignOut')}
        </Button>
      </Box>
    </Stack>
  );
}
