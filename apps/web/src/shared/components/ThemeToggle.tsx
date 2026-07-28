import { Button, SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@shared/theme/colorMode';
import { tid } from '@clara/app-i18n';

function ThemeIcon({ dark, ...props }: SvgIconProps & { dark: boolean }) {
  return (
    <SvgIcon aria-hidden {...props}>
      {dark ? (
        <path d="M20.8 14.1A8.5 8.5 0 0 1 9.9 3.2 8.5 8.5 0 1 0 20.8 14.1z" />
      ) : (
        <path d="M12 3V1m0 22v-2M4.22 4.22 2.81 2.81m18.38 18.38-1.41-1.41M3 12H1m22 0h-2M4.22 19.78l-1.41 1.41M21.19 2.81l-1.41 1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
      )}
    </SvgIcon>
  );
}

export function ThemeToggle() {
  const { t } = useTranslation();
  const { mode, toggleMode } = useColorMode();
  const dark = mode === 'dark';

  return (
    <Button
      type="button"
      aria-label={undefined}
      data-testid={tid('layout.themeToggle')}
      startIcon={<ThemeIcon dark={dark} />}
      onClick={toggleMode}
      sx={{ minWidth: 0, whiteSpace: 'nowrap' }}
    >
      {t(dark ? 'layout.theme.dark' : 'layout.theme.light')}
    </Button>
  );
}
