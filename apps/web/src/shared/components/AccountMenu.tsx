import { useRef, useState } from 'react';
import {
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  SvgIcon,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '@features/auth/context/AuthProvider';

function AccountIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </SvgIcon>
  );
}

function SignOutIcon(props: SvgIconProps) {
  return (
    <SvgIcon aria-hidden {...props}>
      <path d="M10 17v-2h4v-2h-4v-2l-4 3 4 3zm-6 2V5c0-1.1.9-2 2-2h7v2H6v14h7v2H6c-1.1 0-2-.9-2-2zm12.59-9.41L15.17 11l1.59 1.59H9v2h7.76l-1.59 1.59L16.59 17.6 20.59 13.6l-4-4z" />
    </SvgIcon>
  );
}

export function AccountMenu() {
  const { i18n, t } = useTranslation();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(anchorEl);

  function closeMenu() {
    setAnchorEl(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  async function changeLanguage(locale: 'en-US' | 'es-MX') {
    await i18n.changeLanguage(locale);
    closeMenu();
  }

  function signOut() {
    closeMenu();
    void logout();
  }

  return (
    <>
      <Button
        ref={triggerRef}
        aria-controls={open ? 'account-actions-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="menu"
        aria-label={t('navigation.account')}
        data-testid={tid('navigation.account')}
        endIcon={<span aria-hidden="true">⌄</span>}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        startIcon={<AccountIcon />}
        sx={{ textTransform: 'none' }}
      >
        {t('navigation.account')}
      </Button>

      <Menu
        id="account-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        slotProps={{ list: { 'aria-label': t('navigation.account') } }}
      >
        <MenuItem component={RouterLink} to="/account" onClick={closeMenu}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          {t('navigation.account')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => void changeLanguage('en-US')}>
          {t('layout.languages.en-US')}
        </MenuItem>
        <MenuItem onClick={() => void changeLanguage('es-MX')}>
          {t('layout.languages.es-MX')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="small" />
          </ListItemIcon>
          {t('layout.signOut')}
        </MenuItem>
      </Menu>
    </>
  );
}
