import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

type PageIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: PageIntroProps) {
  return (
    <Stack
      component="section"
      spacing={2}
      sx={{
        width: '100%',
        minWidth: 0,
        py: { xs: 1, sm: 2 },
      }}
    >
      <Stack spacing={1.25} minWidth={0}>
        {eyebrow ? (
          <Typography component="p" variant="overline" color="text.secondary">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography component="h1" variant="h2">
          {title}
        </Typography>
        {description ? (
          <Typography
            component="p"
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '65ch' }}
          >
            {description}
          </Typography>
        ) : null}
      </Stack>
      {actions ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}
