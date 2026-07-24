import { Container } from '@mui/material';
import { Outlet } from 'react-router';

export function App() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 3 }}>
      <Outlet />
    </Container>
  );
}
