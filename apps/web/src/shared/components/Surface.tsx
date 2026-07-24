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
    borderColor: alpha(theme.palette.primary.main, 0.08),
  }),
  dark: (theme) => ({
    backgroundColor: theme.palette.charcoal.main,
    color: theme.palette.charcoal.contrastText,
    borderColor: alpha(theme.palette.charcoal.contrastText, 0.12),
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
