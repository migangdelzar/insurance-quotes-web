import { Typography } from '@mui/material';
import { testIds } from '@clara/app-i18n';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Typography variant="h6" data-testid={testIds.notFound.title}>
      {t('notFound.title')}{' '}
      <Link to="/quotes" data-testid={testIds.notFound.home}>
        {t('notFound.home')}
      </Link>
    </Typography>
  );
}
