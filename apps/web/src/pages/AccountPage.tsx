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
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
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

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            {t('navigation.accountLanguage')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            {supportedLocales.map((locale) => (
              <Button
                key={locale}
                aria-pressed={activeLocale === locale}
                variant={activeLocale === locale ? 'contained' : 'outlined'}
                onClick={() => void i18n.changeLanguage(locale)}
              >
                {t(`layout.languages.${locale}`)}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon color="success" />
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

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            {t('navigation.accountSupport')}
          </Typography>
          <Typography color="text.secondary">
            {t('layout.footer.supportContact')}
          </Typography>
          <Divider />
          <Typography component="h2" variant="h6">
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
