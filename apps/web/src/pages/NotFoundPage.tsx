import { Typography } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Typography variant="h6" data-testid={tid('notFound.title')}>
      {t('notFound.title')}{' '}
      <Link to="/quotes" data-testid={tid('notFound.home')}>
        {t('notFound.home')}
      </Link>
    </Typography>
  );
}
