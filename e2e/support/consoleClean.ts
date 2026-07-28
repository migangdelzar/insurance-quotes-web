import { expect, test as base } from '@playwright/test';

type ConsoleCleanFixtures = {
  consoleClean: void;
};

export const test = base.extend<ConsoleCleanFixtures>({
  consoleClean: [
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
      const expectedErrors = testInfo.annotations
        .filter((annotation) => annotation.type === 'expected-console-error')
        .map((annotation) => annotation.description ?? '');
      const unexpectedErrors = errors.filter(
        (error) => !expectedErrors.some((expected) => error.includes(expected))
      );

      expect(
        unexpectedErrors,
        `Unexpected browser errors in ${testInfo.title}`
      ).toEqual([]);
    },
    { auto: true },
  ],
});
