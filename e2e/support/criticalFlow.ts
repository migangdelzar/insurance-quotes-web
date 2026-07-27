import { expect, test as base } from '@playwright/test';

type CriticalFlowFixtures = {
  criticalFlowErrors: void;
};

export const test = base.extend<CriticalFlowFixtures>({
  criticalFlowErrors: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      const capturePageError = (error: Error) =>
        errors.push(`pageerror: ${error.message}`);
      const captureConsoleError = (message: {
        type(): string;
        text(): string;
      }) => {
        if (message.type() === 'error') {
          errors.push(`console.error: ${message.text()}`);
        }
      };

      page.on('pageerror', capturePageError);
      page.on('console', captureConsoleError);

      await use();

      page.off('pageerror', capturePageError);
      page.off('console', captureConsoleError);
      expect(errors, `Unexpected browser errors in ${testInfo.title}`).toEqual(
        []
      );
    },
    { auto: true },
  ],
});
