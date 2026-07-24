import { Paper, Skeleton, Typography } from '@mui/material';
import { testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

type Props = { premium: string | null; updating: boolean };

export function PremiumDisplay({ premium, updating }: Props) {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="overline">
        {t('wizard.coverage.premiumLabel')}
      </Typography>
      {updating ? (
        <Skeleton
          width={120}
          height={48}
          sx={{ mx: 'auto' }}
          data-testid={testIds.common.loading}
        />
      ) : (
        <Typography
          variant="h4"
          data-testid={testIds.wizard.coverage.premiumLabel}
        >
          {premium
            ? `${t('common.currencyPrefix')}${premium}`
            : t('common.notAvailable')}
        </Typography>
      )}
    </Paper>
  );
}
