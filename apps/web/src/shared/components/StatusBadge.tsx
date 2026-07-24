import { alpha, type Theme } from '@mui/material/styles';
import { Box } from '@mui/material';

type QuoteBadgeStatus = 'DRAFT' | 'SUBMITTED' | 'SUBMISSION_FAILED' | 'EXPIRED';

type StatusBadgeProps = {
  status: QuoteBadgeStatus;
  label: string;
};

type StatusTone = {
  background: string;
  foreground: string;
  accent: string;
};

const toneByStatus = {
  DRAFT: (theme) => ({
    background: alpha(theme.palette.slate.main, 0.12),
    foreground: theme.palette.text.secondary,
    accent: theme.palette.slate.main,
  }),
  SUBMITTED: (theme) => ({
    background: alpha(theme.palette.success.main, 0.12),
    foreground: theme.palette.success.dark,
    accent: theme.palette.success.main,
  }),
  SUBMISSION_FAILED: (theme) => ({
    background: alpha(theme.palette.error.main, 0.12),
    foreground: theme.palette.error.dark,
    accent: theme.palette.error.main,
  }),
  EXPIRED: (theme) => ({
    background: alpha(theme.palette.warning.main, 0.14),
    foreground: theme.palette.warning.dark,
    accent: theme.palette.warning.main,
  }),
} as const satisfies Record<QuoteBadgeStatus, (theme: Theme) => StatusTone>;

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Box
      component="span"
      data-status={status}
      sx={(theme) => {
        const tone = toneByStatus[status](theme);

        return {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          maxWidth: '100%',
          px: 1.25,
          py: 0.5,
          border: '1px solid',
          borderColor: tone.accent,
          borderRadius: 999,
          backgroundColor: tone.background,
          color: tone.foreground,
          fontSize: '0.8125rem',
          fontWeight: 700,
          lineHeight: 1.4,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        };
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={(theme) => ({
          width: 7,
          height: 7,
          flexShrink: 0,
          borderRadius: '50%',
          backgroundColor: toneByStatus[status](theme).accent,
        })}
      />
      <span data-status={status}>{label}</span>
    </Box>
  );
}
