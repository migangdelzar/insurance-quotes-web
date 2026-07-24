import { Box } from '@mui/material';

type QuoteBadgeStatus = 'DRAFT' | 'SUBMITTED' | 'SUBMISSION_FAILED' | 'EXPIRED';

type StatusBadgeProps = {
  status: QuoteBadgeStatus;
  label: string;
};

const toneByStatus = {
  DRAFT: {
    background: 'rgba(98, 101, 107, 0.12)',
    foreground: '#4b4f56',
    accent: '#62656b',
  },
  SUBMITTED: {
    background: 'rgba(47, 107, 80, 0.12)',
    foreground: '#23533e',
    accent: '#2f6b50',
  },
  SUBMISSION_FAILED: {
    background: 'rgba(143, 61, 54, 0.12)',
    foreground: '#7c342e',
    accent: '#8f3d36',
  },
  EXPIRED: {
    background: 'rgba(139, 107, 40, 0.14)',
    foreground: '#70551f',
    accent: '#8b6b28',
  },
} as const satisfies Record<
  QuoteBadgeStatus,
  { background: string; foreground: string; accent: string }
>;

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const tone = toneByStatus[status];

  return (
    <Box
      component="span"
      data-status={status}
      sx={{
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
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          width: 7,
          height: 7,
          flexShrink: 0,
          borderRadius: '50%',
          backgroundColor: tone.accent,
        }}
      />
      <span data-status={status}>{label}</span>
    </Box>
  );
}
