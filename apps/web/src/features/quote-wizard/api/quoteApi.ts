import type {
  CreateQuoteRequest,
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

export const listQuotes = (): Promise<QuoteView[]> => request('/quotes');
