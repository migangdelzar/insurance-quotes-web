import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Portal,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router';
import {
  getActiveDestination,
  primaryDestinations,
} from '@shared/navigation/navigation';
import { useColorMode } from '@shared/theme/colorMode';

function NavigationIcon({
  destination,
  ...props
}: SvgIconProps & { destination: (typeof primaryDestinations)[number]['id'] }) {
  const paths = {
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    quotes: 'M4 4h16v12H7l-3 3V4zm3 5h10V7H7v2zm0 4h7v-2H7v2z',
    newQuote: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    account:
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  } as const;

  return (
    <SvgIcon aria-hidden {...props}>
      <path d={paths[destination]} />
    </SvgIcon>
  );
}

export function AppNavigation() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mode } = useColorMode();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const activeDestination = getActiveDestination(
    location.pathname,
    location.search
  );
  const navigationLabel = t('navigation.primary');

  return (
    <>
      {isDesktop ? (
        <Box
          component="nav"
          aria-label={navigationLabel}
          data-shell-tone="charcoal"
          data-shell-mode={mode}
          data-shell-position="fixed"
          sx={(theme) => ({
            display: 'flex',
            position: 'fixed',
            top: '72px',
            bottom: 0,
            left: 0,
            zIndex: theme.zIndex.appBar - 1,
            width: 224,
            flexShrink: 0,
            borderRight: 1,
            borderColor: alpha(theme.palette.shell.contrastText, 0.16),
            bgcolor: 'shell.main',
            color: 'shell.contrastText',
          })}
        >
          <List disablePadding sx={{ width: '100%', p: 1 }}>
            {primaryDestinations.map((destination) => {
              const active = activeDestination === destination.id;

              return (
                <ListItem key={destination.id} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={destination.path}
                    aria-current={active ? 'page' : undefined}
                    data-testid={tid(destination.testIdKey)}
                    selected={active}
                    className={active ? 'navigation-action--active' : undefined}
                    sx={(theme) => ({
                      mb: 0.5,
                      borderRadius: 2,
                      color: theme.palette.shell.contrastText,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.shell.contrastText, 0.08),
                      },
                      '&.Mui-selected, &.navigation-action--active': {
                        bgcolor: alpha(theme.palette.shell.contrastText, 0.14),
                      },
                      '&.Mui-selected:hover, &.navigation-action--active:hover':
                        {
                          bgcolor: alpha(theme.palette.shell.contrastText, 0.2),
                        },
                      '& .MuiListItemText-primary': {
                        fontWeight: active ? 700 : 500,
                      },
                    })}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: 'inherit',
                      }}
                    >
                      <NavigationIcon destination={destination.id} />
                    </ListItemIcon>
                    <ListItemText primary={t(destination.labelKey)} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : null}

      {!isDesktop ? (
        <Portal>
          <Box
            component="nav"
            aria-label={navigationLabel}
            data-shell-tone="charcoal"
            data-shell-mode={mode}
            data-shell-position="fixed"
            sx={(theme) => ({
              display: 'block',
              position: 'fixed',
              zIndex: theme.zIndex.modal,
              isolation: 'isolate',
              pointerEvents: 'auto',
              right: 0,
              bottom: 0,
              left: 0,
              pb: 'env(safe-area-inset-bottom)',
              borderTop: 1,
              borderColor: alpha(theme.palette.shell.contrastText, 0.16),
              bgcolor: 'shell.main',
              color: 'shell.contrastText',
              '& .MuiBottomNavigation-root': {
                bgcolor: 'transparent',
              },
            })}
          >
            <BottomNavigation showLabels value={activeDestination}>
              {primaryDestinations.map((destination) => {
                const active = activeDestination === destination.id;

                return (
                  <BottomNavigationAction
                    key={destination.id}
                    component={RouterLink}
                    to={destination.path}
                    value={destination.id}
                    label={t(destination.labelKey)}
                    icon={<NavigationIcon destination={destination.id} />}
                    aria-current={active ? 'page' : undefined}
                    data-testid={tid(destination.testIdKey)}
                    className={active ? 'navigation-action--active' : undefined}
                    sx={(theme) => ({
                      borderTop: '3px solid transparent',
                      color: alpha(theme.palette.shell.contrastText, 0.72),
                      '&.Mui-selected': {
                        borderTopColor: theme.palette.primary.main,
                        color: theme.palette.shell.contrastText,
                        fontWeight: 700,
                      },
                      '&.Mui-selected .MuiBottomNavigationAction-label': {
                        fontWeight: 700,
                      },
                    })}
                  />
                );
              })}
            </BottomNavigation>
          </Box>
        </Portal>
      ) : null}
    </>
  );
}
