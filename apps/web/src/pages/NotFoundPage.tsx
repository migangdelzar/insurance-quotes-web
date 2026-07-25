import { Button, Stack, Typography } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '@shared/components/PageIntro';
import { Surface } from '@shared/components/Surface';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Surface
      component="section"
      aria-labelledby={tid('notFound.title')}
      sx={{ maxWidth: 760, mx: 'auto', width: '100%' }}
    >
      <PageIntro
        eyebrow={t('notFound.eyebrow')}
        title={t('notFound.title')}
        description={t('notFound.description')}
        titleProps={{ 'data-testid': tid('notFound.title') }}
      />
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="overline" color="text.secondary">
          404
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/quotes"
          data-testid={tid('notFound.home')}
        >
          {t('notFound.home')}
        </Button>
      </Stack>
    </Surface>
  );
}
