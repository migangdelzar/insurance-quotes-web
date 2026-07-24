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
    borderColor: 'rgba(27, 29, 33, 0.08)',
  }),
  dark: (theme) => ({
    backgroundColor: theme.palette.charcoal.main,
    color: theme.palette.charcoal.contrastText,
    borderColor: 'rgba(248, 244, 236, 0.12)',
  }),
  gold: (theme) => ({
    backgroundColor: 'rgba(200, 166, 106, 0.16)',
    color: theme.palette.text.primary,
    borderColor: 'rgba(200, 166, 106, 0.42)',
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
