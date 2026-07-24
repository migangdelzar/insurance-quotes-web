import { Container } from '@mui/material';
import { Outlet } from 'react-router';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

export function App() {
  const { t } = useTranslation();

  return (
    <>
      <a
        href={`#${tid('layout.main')}`}
        data-testid={tid('common.skipToContent')}
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 8,
          zIndex: 1300,
        }}
        onFocus={(event) => {
          event.currentTarget.style.left = '8px';
        }}
        onBlur={(event) => {
          event.currentTarget.style.left = '-10000px';
        }}
      >
        {t('common.skipToContent')}
      </a>
      <Container
        component="main"
        id={tid('layout.main')}
        data-testid={tid('layout.main')}
        maxWidth="md"
        sx={{
          py: { xs: 2, md: 3 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
          minWidth: 0,
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
