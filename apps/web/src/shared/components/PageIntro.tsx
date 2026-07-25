import type { ReactNode, Ref } from 'react';
import { Stack, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

type PageIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  titleRef?: Ref<HTMLHeadingElement>;
  titleProps?: TypographyProps;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  titleRef,
  titleProps,
}: PageIntroProps) {
  return (
    <Stack
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
        <Typography {...titleProps} component="h1" variant="h2" ref={titleRef}>
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
