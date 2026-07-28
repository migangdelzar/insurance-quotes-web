import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';

type Props = { open: boolean; onClose: () => void };

export function PasskeyEnrollDialog({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { enrollPasskey } = useAuth();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const enroll = async () => {
    setError(false);
    setPending(true);
    try {
      await enrollPasskey();
      onClose();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={tid('auth.enroll.title')}
    >
      <DialogTitle data-testid={tid('auth.enroll.title')}>
        {t('auth.enroll.title')}
      </DialogTitle>
      <DialogContent>
        <Typography>{t('auth.enroll.description')}</Typography>
        {error && (
          <Alert severity="error" data-testid={tid('auth.enroll.error')}>
            {t('auth.enroll.error')}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid={tid('auth.enroll.skip')}>
          {t('auth.enroll.skip')}
        </Button>
        <Button
          variant="contained"
          onClick={() => void enroll()}
          disabled={pending}
          data-testid={tid('auth.enroll.action')}
        >
          {t('auth.enroll.action')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
