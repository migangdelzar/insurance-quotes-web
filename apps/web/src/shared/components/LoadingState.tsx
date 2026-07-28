import { Box, CircularProgress, Skeleton, Stack } from '@mui/material';
import { tid } from '@clara/app-i18n';

type LoadingStateProps = {
  label: string;
  testId?: string;
};

export function LoadingState({
  label,
  testId = tid('common.loading'),
}: LoadingStateProps) {
  return (
    <Stack
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      data-testid={testId}
      data-widget-tone="loading"
      data-widget-boundary="outlined"
      spacing={1.5}
      sx={(theme) => ({
        p: { xs: 2, sm: 2.5 },
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 3,
        backgroundColor: theme.palette.raised.main,
      })}
    >
      <Box aria-hidden="true" sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
      <Skeleton variant="text" width="38%" height={28} />
      <Skeleton variant="rounded" height={96} />
    </Stack>
  );
}
