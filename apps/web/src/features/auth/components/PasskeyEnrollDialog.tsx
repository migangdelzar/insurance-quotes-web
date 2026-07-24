import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';

type Props = { open: boolean; onClose: () => void };

export function PasskeyEnrollDialog({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { enrollPasskey } = useAuth();

  const enroll = async () => {
    await enrollPasskey().catch(() => undefined);
    onClose();
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
        <Typography>{t('auth.mfa.prompt')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid={tid('auth.enroll.skip')}>
          {t('auth.enroll.skip')}
        </Button>
        <Button
          variant="contained"
          onClick={() => void enroll()}
          data-testid={tid('auth.enroll.action')}
        >
          {t('auth.enroll.action')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
