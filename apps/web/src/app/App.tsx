import { Outlet } from 'react-router';
import { AppShell } from '@shared/components/AppShell';

export function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
