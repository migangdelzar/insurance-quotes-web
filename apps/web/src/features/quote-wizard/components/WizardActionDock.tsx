import type { ReactNode } from 'react';
import { Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

type Props = { children: ReactNode };

export function WizardActionDock({ children }: Props) {
  const { t } = useTranslation();

  return (
    <Stack
      component="nav"
      aria-label={t('wizard.actions')}
      data-testid={tid('wizard.actions')}
      data-widget-tone="actions"
      spacing={1.5}
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        '& > *': { width: { xs: '100%', sm: 'auto' } },
        position: { xs: 'fixed', sm: 'static' },
        left: { xs: 0, sm: 'auto' },
        right: { xs: 0, sm: 'auto' },
        bottom: {
          xs: 'calc(56px + env(safe-area-inset-bottom))',
          sm: 'auto',
        },
        zIndex: { xs: (theme) => theme.zIndex.appBar, sm: 'auto' },
        px: { xs: 2, sm: 0 },
        pt: { xs: 1.5, sm: 0 },
        pb: {
          xs: 1.5,
          sm: 0,
        },
        backgroundColor: {
          xs: (theme) => alpha(theme.palette.background.default, 0.94),
          sm: 'transparent',
        },
        borderTop: { xs: '1px solid', sm: 0 },
        borderColor: {
          xs: (theme) => alpha(theme.palette.ink.main, 0.14),
          sm: 'transparent',
        },
        boxShadow: {
          xs: (theme) => `0 -8px 24px ${alpha(theme.palette.ink.main, 0.08)}`,
          sm: 'none',
        },
        backdropFilter: { xs: 'blur(14px)', sm: 'none' },
      }}
    >
      {children}
    </Stack>
  );
}
