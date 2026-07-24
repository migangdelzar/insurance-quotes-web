import { Container } from '@mui/material';
import { Outlet } from 'react-router';
import { tid, testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

export function App() {
  const { t } = useTranslation();

  return (
    <>
      <a
        href={`#${tid('layout.main')}`}
        data-testid={testIds.common.skipToContent}
      >
        {t('common.skipToContent')}
      </a>
      <Container
        component="main"
        id={tid('layout.main')}
        data-testid={tid('layout.main')}
        maxWidth="md"
        sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, md: 3 } }}
      >
        <Outlet />
      </Container>
    </>
  );
}
