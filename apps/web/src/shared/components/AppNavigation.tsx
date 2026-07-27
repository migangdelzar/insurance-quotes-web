import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router';
import {
  getActiveDestination,
  primaryDestinations,
} from '@shared/navigation/navigation';

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
          sx={{
            display: 'flex',
            width: 224,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
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
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemText primary={t(destination.labelKey)} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : null}

      {!isDesktop ? (
        <Box
          component="nav"
          aria-label={navigationLabel}
          sx={(theme) => ({
            display: 'block',
            position: 'fixed',
            zIndex: theme.zIndex.appBar,
            right: 0,
            bottom: 0,
            left: 0,
            pb: 'env(safe-area-inset-bottom)',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
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
                  sx={{
                    borderTop: '3px solid transparent',
                    '&.Mui-selected': {
                      borderTopColor: 'primary.main',
                      fontWeight: 700,
                    },
                    '&.Mui-selected .MuiBottomNavigationAction-label': {
                      fontWeight: 700,
                    },
                  }}
                />
              );
            })}
          </BottomNavigation>
        </Box>
      ) : null}
    </>
  );
}
