import { Container } from '@mui/material';
import { Outlet } from 'react-router';
import { testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

export function App() {
  const { t } = useTranslation();

  return (
    <>
      <a href="#main-content" data-testid={testIds.common.skipToContent}>
        {t('common.skipToContent')}
      </a>
      <Container
        component="main"
        id="main-content"
        maxWidth="md"
        sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, md: 3 } }}
      >
        <Outlet />
      </Container>
    </>
  );
}
