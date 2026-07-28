import { useEffect, useRef, type ReactNode } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useAuth } from '@features/auth/context/AuthProvider';
import {
  getActiveDestination,
  primaryDestinations,
} from '@shared/navigation/navigation';
import { AppNavigation } from './AppNavigation';
import { AccountMenu } from './AccountMenu';
import { BrandMark } from './BrandMark';
import { OfflineNotice } from './OfflineNotice';
import { ThemeToggle } from './ThemeToggle';
import { useColorMode } from '@shared/theme/colorMode';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { mode } = useColorMode();
  const mainRef = useRef<HTMLElement>(null);
  const activeDestination = getActiveDestination(
    location.pathname,
    location.search
  );
  const activeLabel = t(
    primaryDestinations.find((item) => item.id === activeDestination)
      ?.labelKey ?? 'navigation.home'
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const heading = mainRef.current?.querySelector<HTMLHeadingElement>('h1');
    if (!heading) return;

    heading.tabIndex = -1;
    heading.focus();
  }, [isAuthenticated, location.pathname, location.search]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        pt: isAuthenticated ? { xs: '64px', md: '72px' } : 0,
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
        data-shell-tone={isAuthenticated ? 'charcoal' : undefined}
        data-shell-mode={isAuthenticated ? mode : undefined}
        data-shell-position={isAuthenticated ? 'fixed' : undefined}
        sx={(theme) => {
          const shellDivider = alpha(theme.palette.shell.contrastText, 0.16);

          return {
            position: isAuthenticated ? 'fixed' : 'relative',
            top: 0,
            right: 0,
            left: 0,
            zIndex: isAuthenticated ? theme.zIndex.appBar : 'auto',
            borderBottom: `1px solid ${
              isAuthenticated ? shellDivider : theme.palette.divider
            }`,
            bgcolor: isAuthenticated ? 'shell.main' : 'background.paper',
            color: isAuthenticated ? 'shell.contrastText' : 'text.primary',
          };
        }}
      >
        <Container maxWidth="xl" sx={{ py: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <BrandMark
              productLabel={t('common.appName')}
              sx={
                isAuthenticated
                  ? {
                      '& .MuiTypography-root': {
                        color: 'shell.contrastText',
                      },
                      '& .MuiTypography-root:last-child': {
                        opacity: 0.72,
                      },
                    }
                  : undefined
              }
            />

            {isAuthenticated ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    color: 'shell.contrastText',
                    opacity: 0.72,
                  }}
                >
                  {activeLabel}
                </Typography>
                <Box
                  sx={(theme) => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1,
                    py: 0.625,
                    borderRadius: 99,
                    border: `1px solid ${alpha(
                      theme.palette.shell.contrastText,
                      0.2
                    )}`,
                    bgcolor: alpha(theme.palette.shell.contrastText, 0.1),
                    color: 'shell.contrastText',
                  })}
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
                <ThemeToggle />
                <Box
                  sx={(theme) => ({
                    display: { xs: 'none', sm: 'inline-flex' },
                    '& .MuiButton-root': {
                      color: theme.palette.shell.contrastText,
                    },
                    '& .MuiButton-root:hover': {
                      bgcolor: alpha(theme.palette.shell.contrastText, 0.1),
                    },
                  })}
                >
                  <AccountMenu />
                </Box>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('layout.secureSessionAnonymous')}
                </Typography>
                <ThemeToggle />
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
        {isAuthenticated ? <AppNavigation /> : null}
        <Box
          component="main"
          ref={mainRef}
          id={tid('layout.main')}
          data-testid={tid('layout.main')}
          sx={{
            flex: 1,
            minWidth: 0,
            ml: isAuthenticated ? { xs: 0, md: '224px' } : 0,
            pb: isAuthenticated
              ? { xs: 'calc(72px + env(safe-area-inset-bottom))', md: 0 }
              : 0,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ py: { xs: 3, md: 5 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}
          >
            {isAuthenticated ? <OfflineNotice /> : null}
            {children}
          </Container>
        </Box>
      </Box>

      {isAuthenticated ? (
        <Box
          component="footer"
          data-testid={tid('layout.footer')}
          data-shell-tone="charcoal"
          data-shell-mode={mode}
          sx={(theme) => ({
            borderTop: `1px solid ${alpha(
              theme.palette.shell.contrastText,
              0.16
            )}`,
            bgcolor: 'shell.main',
            color: 'shell.contrastText',
            ml: { xs: 0, md: '224px' },
            mb: {
              xs: 'calc(56px + env(safe-area-inset-bottom))',
              md: 0,
            },
            '& .MuiTypography-root': {
              color: theme.palette.shell.contrastText,
              opacity: 0.72,
            },
          })}
        >
          <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 2.5 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Typography variant="caption" color="text.secondary">
                {t('layout.footer.trustStatement')}
              </Typography>
              <Stack direction="row" spacing={2} flexShrink={0}>
                <Typography variant="caption" color="text.secondary">
                  {t('layout.footer.support')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('layout.footer.privacySecurity')}
                </Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>
      ) : null}
    </Box>
  );
}
