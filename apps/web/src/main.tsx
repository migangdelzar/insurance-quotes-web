import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@app/i18n';
import { queryClient } from '@app/queryClient';
import { router } from '@app/routes';
import { ColorModeProvider } from '@shared/theme/colorMode';
import { registerPwa } from './pwa/register';

registerPwa();

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <ColorModeProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ColorModeProvider>
      </I18nextProvider>
    </StrictMode>
  );
}
