import type { ReactNode } from 'react';
import { Box, Stack, Typography, type StackProps } from '@mui/material';

type BrandMarkProps = StackProps & {
  productLabel?: ReactNode;
};

export function BrandMark({ productLabel, ...props }: BrandMarkProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      minWidth={0}
      {...props}
    >
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          width: 14,
          height: 14,
          flexShrink: 0,
          borderRadius: '4px',
          backgroundColor: theme.palette.secondary.main,
          boxShadow: `0 0 0 1px ${theme.palette.primary.main}1f`,
        })}
      />
      <Stack spacing={0.25} minWidth={0}>
        <Typography component="span" variant="h4" sx={{ lineHeight: 1 }}>
          Clara
        </Typography>
        {productLabel ? (
          <Typography
            component="span"
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase' }}
          >
            {productLabel}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}
