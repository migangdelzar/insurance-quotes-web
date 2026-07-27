import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router';
import {
  getActiveDestination,
  primaryDestinations,
} from '@shared/navigation/navigation';

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
                  aria-current={active ? 'page' : undefined}
                  data-testid={tid(destination.testIdKey)}
                />
              );
            })}
          </BottomNavigation>
        </Box>
      ) : null}
    </>
  );
}
