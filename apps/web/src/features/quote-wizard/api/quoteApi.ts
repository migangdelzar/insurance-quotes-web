import type {
  CreateQuoteRequest,
  CoverageType,
  QuotePageView,
  QuoteSummaryView,
  QuoteStatus,
  QuoteView,
  UpdateCoverageRequest,
} from '@clara/api-contract';
import { request } from '@shared/api/httpClient';

export const createQuote = (body: CreateQuoteRequest): Promise<QuoteView> =>
  request('/quotes', { method: 'POST', body });

export const updateCoverage = (
  id: string,
  body: UpdateCoverageRequest
): Promise<QuoteView> =>
  request(`/quotes/${id}/coverage`, { method: 'PATCH', body });

export const submitQuote = (id: string): Promise<QuoteView> =>
  request(`/quotes/${id}/submit`, { method: 'POST' });

export const getQuote = (id: string): Promise<QuoteView> =>
  request(`/quotes/${id}`);

export type QuoteSortField =
  'createdAt' | 'updatedAt' | 'name' | 'monthlyPremium' | 'status';

export type QuoteListQuery = {
  page: number;
  size: number;
  search?: string;
  status?: QuoteStatus;
  coverage?: CoverageType;
  sortBy: QuoteSortField;
  direction: 'asc' | 'desc';
};

export const defaultQuoteListQuery: QuoteListQuery = {
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  direction: 'desc',
};

export const listQuotes = (
  query: QuoteListQuery = defaultQuoteListQuery
): Promise<QuotePageView> => {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  if (query.coverage) params.set('coverage', query.coverage);
  params.set('sortBy', query.sortBy);
  params.set('direction', query.direction);
  return request(`/quotes?${params.toString()}`);
};

export const getQuoteSummary = (): Promise<QuoteSummaryView> =>
  request('/quotes/summary');
