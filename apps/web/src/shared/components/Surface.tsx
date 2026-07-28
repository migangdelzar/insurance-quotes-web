import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { Paper, type PaperProps } from '@mui/material';

type SurfaceTone = 'default' | 'dark' | 'gold';

type SurfaceProps = PaperProps & {
  children: ReactNode;
  tone?: SurfaceTone;
};

const toneStyles: Record<SurfaceTone, Pick<PaperProps, 'sx'>['sx']> = {
  default: (theme) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
  }),
  dark: (theme) => ({
    backgroundColor: theme.palette.charcoal.main,
    color: theme.palette.charcoal.contrastText,
    borderColor: alpha(theme.palette.charcoal.contrastText, 0.24),
  }),
  gold: (theme) => ({
    backgroundColor: alpha(theme.palette.gold.main, 0.16),
    color: theme.palette.text.primary,
    borderColor: alpha(theme.palette.gold.main, 0.42),
  }),
};

export function Surface({
  children,
  tone = 'default',
  sx,
  ...paperProps
}: SurfaceProps) {
  return (
    <Paper
      data-tone={tone}
      data-widget-boundary="outlined"
      sx={[
        {
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          minWidth: 0,
        },
        toneStyles[tone],
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...paperProps}
    >
      {children}
    </Paper>
  );
}
