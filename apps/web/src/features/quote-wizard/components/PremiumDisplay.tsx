import { CircularProgress, Stack, Typography } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Surface } from '@shared/components/Surface';

type Props = { premium: string | null; updating: boolean };

export function PremiumDisplay({ premium, updating }: Props) {
  const { t } = useTranslation();

  return (
    <Surface tone="gold" sx={{ textAlign: 'center' }}>
      <Stack
        spacing={0.5}
        alignItems="center"
        aria-live="polite"
        aria-busy={updating}
      >
        <Typography variant="overline" color="text.secondary">
          {t('wizard.coverage.premiumLabel')}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: 48 }}
        >
          <Typography
            variant="h4"
            data-testid={tid('wizard.coverage.premiumLabel')}
          >
            {premium
              ? `${t('common.currencyPrefix')}${premium}`
              : t('common.notAvailable')}
          </Typography>
          {updating && (
            <CircularProgress
              size={16}
              aria-label={t('common.loading')}
              data-testid={tid('common.loading')}
            />
          )}
        </Stack>
      </Stack>
    </Surface>
  );
}
