import type { ReactNode } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router';
import { useAuth } from '@features/auth/context/AuthProvider';
import {
  getActiveDestination,
  primaryDestinations,
} from '@shared/navigation/navigation';
import { AppNavigation } from './AppNavigation';
import { BrandMark } from './BrandMark';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const activeDestination = getActiveDestination(
    location.pathname,
    location.search
  );
  const activeLabel = t(
    primaryDestinations.find((item) => item.id === activeDestination)
      ?.labelKey ?? 'navigation.home'
  );

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
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        })}
      >
        <Container maxWidth="xl" sx={{ py: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <BrandMark productLabel={t('common.appName')} />

            {isAuthenticated ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  {activeLabel}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1,
                    py: 0.625,
                    borderRadius: 99,
                    bgcolor: 'success.light',
                    color: 'success.dark',
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                    }}
                  />
                  <Typography variant="caption" fontWeight={700}>
                    {t('layout.secureSessionAuthenticated')}
                  </Typography>
                </Box>
                <Box
                  component={RouterLink}
                  to="/account"
                  aria-label={t('navigation.account')}
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    bgcolor: 'grey.100',
                    color: 'text.primary',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {t('navigation.account').slice(0, 1)}
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('layout.secureSessionAnonymous')}
              </Typography>
            )}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
        {isAuthenticated ? <AppNavigation /> : null}
        <Box
          component="main"
          id={tid('layout.main')}
          data-testid={tid('layout.main')}
          sx={{
            flex: 1,
            minWidth: 0,
            pb: isAuthenticated
              ? { xs: 'calc(72px + env(safe-area-inset-bottom))', md: 0 }
              : 0,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ py: { xs: 3, md: 5 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
