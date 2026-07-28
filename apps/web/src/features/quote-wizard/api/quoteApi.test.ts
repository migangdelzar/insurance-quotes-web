import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@shared/api/httpClient';
import { listQuotes } from './quoteApi';

vi.mock('@shared/api/httpClient', () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);

describe('quoteApi', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('serializes pagination, filters, and ordering for the quote endpoint', async () => {
    mockedRequest.mockResolvedValue({});

    await listQuotes({
      page: 2,
      size: 10,
      search: 'Jane Roe',
      status: 'SUBMITTED',
      coverage: 'STANDARD',
      sortBy: 'name',
      direction: 'asc',
    });

    expect(mockedRequest).toHaveBeenCalledWith(
      '/quotes?page=2&size=10&search=Jane+Roe&status=SUBMITTED&coverage=STANDARD&sortBy=name&direction=asc'
    );
  });
});
