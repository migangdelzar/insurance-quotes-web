import { useEffect, useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

function getOnlineStatus(): boolean {
  return navigator.onLine;
}

export function OfflineNotice() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(getOnlineStatus);

  useEffect(() => {
    const markOnline = () => setIsOnline(true);
    const markOffline = () => setIsOnline(false);

    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);

    return () => {
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      role="status"
      aria-live="polite"
      data-testid={tid('navigation.offlineNotice')}
      sx={{ mb: 2 }}
    >
      <AlertTitle data-testid={tid('navigation.offlineTitle')}>
        {t('navigation.offlineTitle')}
      </AlertTitle>
      <span data-testid={tid('navigation.offlineDescription')}>
        {t('navigation.offlineDescription')}
      </span>
    </Alert>
  );
}
