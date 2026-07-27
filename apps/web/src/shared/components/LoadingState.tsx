import { Skeleton, Stack } from '@mui/material';
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
      spacing={1.5}
    >
      <Skeleton variant="text" width="38%" height={28} />
      <Skeleton variant="rounded" height={96} />
    </Stack>
  );
}
