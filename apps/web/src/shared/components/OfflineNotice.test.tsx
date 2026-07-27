import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@app/i18n';
import { OfflineNotice } from './OfflineNotice';

const originalOnline = window.navigator.onLine;

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  });
}

describe('OfflineNotice', () => {
  afterEach(() => {
    setNavigatorOnline(originalOnline);
  });

  it('announces that connectivity is required for account and quote mutations', async () => {
    setNavigatorOnline(false);
    await i18n.changeLanguage('en-US');

    render(
      <I18nextProvider i18n={i18n}>
        <OfflineNotice />
      </I18nextProvider>
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      /reconnect to continue account and quote actions/i
    );
  });

  it('updates when the browser regains connectivity', async () => {
    setNavigatorOnline(false);
    await i18n.changeLanguage('en-US');

    render(
      <I18nextProvider i18n={i18n}>
        <OfflineNotice />
      </I18nextProvider>
    );

    act(() => {
      setNavigatorOnline(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
