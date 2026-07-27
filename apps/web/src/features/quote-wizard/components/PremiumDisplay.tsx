import {
  Box,
  CircularProgress,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Surface } from '@shared/components/Surface';

type Props = { premium: string | null; updating: boolean };

function PremiumIcon() {
  return (
    <SvgIcon aria-hidden sx={{ fontSize: 24 }}>
      <path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4zm4.24 8.59-4.95 4.95-2.83-2.83 1.41-1.41 1.42 1.42 3.54-3.54 1.41 1.41z" />
    </SvgIcon>
  );
}

export function PremiumDisplay({ premium, updating }: Props) {
  const { t } = useTranslation();

  return (
    <Surface
      tone="gold"
      data-widget-tone="accent"
      sx={(theme) => ({
        textAlign: 'center',
        borderTop: '3px solid',
        borderTopColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.gold.main, 0.24),
      })}
    >
      <Stack
        spacing={0.75}
        alignItems="center"
        aria-live="polite"
        aria-busy={updating}
      >
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            display: 'grid',
            width: 40,
            height: 40,
            placeItems: 'center',
            borderRadius: 2,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          })}
        >
          <PremiumIcon />
        </Box>
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
            data-widget-tone="accent"
          >
            {premium
              ? `${t('common.currencyPrefix')}${premium}`
              : t('common.notAvailable')}
          </Typography>
          {updating && (
            <CircularProgress
              size={20}
              aria-label={t('common.loading')}
              data-testid={tid('common.loading')}
            />
          )}
        </Stack>
      </Stack>
    </Surface>
  );
}
