import type { BrowserContext, Page } from '@playwright/test';

/** Registers a CDP virtual authenticator so passkey ceremonies can run headlessly. */
export async function enableVirtualAuthenticator(
  context: BrowserContext,
  page: Page
): Promise<{
  authenticatorId: string;
  cdp: Awaited<ReturnType<BrowserContext['newCDPSession']>>;
}> {
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send(
    'WebAuthn.addVirtualAuthenticator',
    {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    }
  );
  return { authenticatorId, cdp };
}
