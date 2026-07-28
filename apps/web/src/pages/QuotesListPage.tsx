import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { tid } from '@clara/app-i18n';
import type { CoverageType, QuoteStatus } from '@clara/api-contract';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { PageIntro } from '@shared/components/PageIntro';
import { StatusBadge } from '@shared/components/StatusBadge';
import { Surface } from '@shared/components/Surface';
import {
  defaultQuoteListQuery,
  getQuoteSummary,
  listQuotes,
  type QuoteListQuery,
} from '@features/quote-wizard/api/quoteApi';
import { QuoteSummaryDashboard } from '@features/quote-dashboard/components/QuoteSummaryDashboard';

const statusKeys: Record<QuoteStatus, string> = {
  DRAFT: 'quotesList.statusDraft',
  SUBMITTED: 'quotesList.statusSubmitted',
  SUBMISSION_FAILED: 'quotesList.statusFailed',
  EXPIRED: 'quotesList.statusExpired',
};

const coverageKeys = {
  BASIC: 'wizard.coverage.basic',
  STANDARD: 'wizard.coverage.standard',
  PREMIUM: 'wizard.coverage.premium',
} as const;

type QuotesListView = 'overview' | 'history';

type QuotesListPageProps = {
  view?: QuotesListView;
};

export function QuotesListPage({ view = 'overview' }: QuotesListPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultQuoteListQuery);
  const [searchInput, setSearchInput] = useState('');
  const isOverview = view === 'overview';
  const quoteQuery = isOverview ? { ...defaultQuoteListQuery, size: 4 } : query;
  const quotes = useQuery({
    queryKey: ['quotes', quoteQuery],
    queryFn: () => listQuotes(quoteQuery),
  });
  const summary = useQuery({
    queryKey: ['quote-summary'],
    queryFn: getQuoteSummary,
    enabled: isOverview,
  });
  const locale = i18n.resolvedLanguage === 'es-MX' ? 'es-MX' : 'en-US';
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const quoteData = quotes.data?.content ?? [];
  const totalElements = quotes.data?.totalElements ?? 0;
  const hasQuotes = totalElements > 0;

  const startQuote = () => void navigate('/quote/personal');
  const updateQuery = <K extends keyof QuoteListQuery>(
    key: K,
    value: QuoteListQuery[K]
  ) => {
    setQuery((current) => ({ ...current, [key]: value, page: 0 }));
  };
  const clearFilters = () => {
    setSearchInput('');
    setQuery(defaultQuoteListQuery);
  };

  return (
    <Stack spacing={4}>
      <PageIntro
        eyebrow={t('quotesList.eyebrow')}
        title={
          <span data-testid={tid('quotesList.title')}>
            {t('quotesList.title')}
          </span>
        }
        description={t('quotesList.description')}
        actions={
          isOverview && quotes.isSuccess && hasQuotes ? (
            <Button
              variant="contained"
              onClick={startQuote}
              data-testid={tid('quotesList.startQuote')}
            >
              {t('quotesList.startQuote')}
            </Button>
          ) : null
        }
      />

      {!isOverview && quotes.isSuccess ? (
        <Surface
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            updateQuery('search', searchInput.trim() || undefined);
          }}
          aria-labelledby="quotes-filter-title"
          data-testid={tid('quotesList.filters')}
        >
          <Stack spacing={2}>
            <Typography component="h2" variant="h4" id="quotes-filter-title">
              {t('quotesList.filters')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              <TextField
                label={t('quotesList.search')}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                inputProps={{ 'data-testid': tid('quotesList.search') }}
              />
              <FormControl>
                <InputLabel id="quotes-status-filter-label">
                  {t('quotesList.statusFilter')}
                </InputLabel>
                <Select
                  labelId="quotes-status-filter-label"
                  label={t('quotesList.statusFilter')}
                  value={query.status ?? ''}
                  onChange={(event) =>
                    updateQuery(
                      'status',
                      (event.target.value || undefined) as
                        QuoteStatus | undefined
                    )
                  }
                  data-testid={tid('quotesList.statusFilter')}
                >
                  <MenuItem value="">{t('quotesList.allStatuses')}</MenuItem>
                  <MenuItem value="DRAFT">
                    {t('quotesList.statusDraft')}
                  </MenuItem>
                  <MenuItem value="SUBMITTED">
                    {t('quotesList.statusSubmitted')}
                  </MenuItem>
                  <MenuItem value="SUBMISSION_FAILED">
                    {t('quotesList.statusFailed')}
                  </MenuItem>
                  <MenuItem value="EXPIRED">
                    {t('quotesList.statusExpired')}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="quotes-coverage-filter-label">
                  {t('quotesList.coverageFilter')}
                </InputLabel>
                <Select
                  labelId="quotes-coverage-filter-label"
                  label={t('quotesList.coverageFilter')}
                  value={query.coverage ?? ''}
                  onChange={(event) =>
                    updateQuery(
                      'coverage',
                      (event.target.value || undefined) as
                        CoverageType | undefined
                    )
                  }
                  data-testid={tid('quotesList.coverageFilter')}
                >
                  <MenuItem value="">{t('quotesList.allCoverages')}</MenuItem>
                  <MenuItem value="BASIC">
                    {t('wizard.coverage.basic')}
                  </MenuItem>
                  <MenuItem value="STANDARD">
                    {t('wizard.coverage.standard')}
                  </MenuItem>
                  <MenuItem value="PREMIUM">
                    {t('wizard.coverage.premium')}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="quotes-sort-by-label">
                  {t('quotesList.sortBy')}
                </InputLabel>
                <Select
                  labelId="quotes-sort-by-label"
                  label={t('quotesList.sortBy')}
                  value={query.sortBy}
                  onChange={(event) =>
                    updateQuery(
                      'sortBy',
                      event.target.value as QuoteListQuery['sortBy']
                    )
                  }
                  data-testid={tid('quotesList.sortBy')}
                >
                  <MenuItem value="createdAt">
                    {t('quotesList.createdAt')}
                  </MenuItem>
                  <MenuItem value="updatedAt">
                    {t('quotesList.updatedAt')}
                  </MenuItem>
                  <MenuItem value="name">{t('quotesList.nameSort')}</MenuItem>
                  <MenuItem value="monthlyPremium">
                    {t('quotesList.premiumSort')}
                  </MenuItem>
                  <MenuItem value="status">
                    {t('quotesList.statusSort')}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="quotes-direction-label">
                  {t('quotesList.direction')}
                </InputLabel>
                <Select
                  labelId="quotes-direction-label"
                  label={t('quotesList.direction')}
                  value={query.direction}
                  onChange={(event) =>
                    updateQuery(
                      'direction',
                      event.target.value as QuoteListQuery['direction']
                    )
                  }
                  data-testid={tid('quotesList.direction')}
                >
                  <MenuItem value="desc">{t('quotesList.descending')}</MenuItem>
                  <MenuItem value="asc">{t('quotesList.ascending')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                type="submit"
                variant="contained"
                data-testid={tid('quotesList.applyFilters')}
              >
                {t('quotesList.applyFilters')}
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={clearFilters}
                data-testid={tid('quotesList.clearFilters')}
              >
                {t('quotesList.clearFilters')}
              </Button>
            </Stack>
          </Stack>
        </Surface>
      ) : null}

      {quotes.isPending ? (
        <Surface
          component="section"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={t('quotesList.loading')}
          data-widget-tone="loading"
          sx={(theme) => ({
            borderColor: alpha(theme.palette.slate.main, 0.2),
            backgroundColor: alpha(theme.palette.slate.main, 0.035),
          })}
        >
          <Stack spacing={2}>
            <Skeleton
              variant="text"
              width="30%"
              height={28}
              data-testid={tid('quotesList.loading')}
            />
            <Skeleton variant="rounded" height={160} />
          </Stack>
        </Surface>
      ) : null}

      {quotes.isError ? (
        <Stack spacing={2}>
          <ApiErrorAlert error={quotes.error} />
          <Button
            variant="outlined"
            onClick={() => void quotes.refetch()}
            data-testid={tid('common.retry')}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('common.retry')}
          </Button>
        </Stack>
      ) : null}

      {isOverview ? (
        <QuoteSummaryDashboard
          summary={summary.data}
          isLoading={summary.isPending}
          isError={summary.isError}
          error={summary.error}
          onRetry={() => void summary.refetch()}
        />
      ) : null}

      {quotes.isSuccess && !hasQuotes ? (
        <Surface
          component="section"
          tone="dark"
          data-testid={tid('quotesList.empty')}
          data-widget-tone="charcoal"
          role="status"
          aria-live="polite"
          aria-labelledby="quotes-empty-title"
        >
          <Stack spacing={1.5}>
            <Typography component="h2" variant="h3" id="quotes-empty-title">
              {t('quotesList.emptyTitle')}
            </Typography>
            <Typography color="inherit" sx={{ opacity: 0.82 }}>
              {t('quotesList.emptyDescription')}
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.68 }}>
              {t('quotesList.empty')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={startQuote}
              data-testid={tid('quotesList.startQuote')}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('quotesList.startQuote')}
            </Button>
          </Stack>
        </Surface>
      ) : null}

      {quotes.isSuccess && hasQuotes ? (
        <Stack
          component="section"
          spacing={2}
          aria-labelledby="quotes-history-title"
        >
          <Stack spacing={0.5}>
            <Typography component="h2" variant="h3" id="quotes-history-title">
              {t(
                isOverview ? 'quotesList.latestQuotes' : 'quotesList.yourQuotes'
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('quotesList.historyDescription')}
            </Typography>
          </Stack>
          <Box
            component="ul"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 2,
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
          >
            {quoteData.map((quote, index) => {
              const statusLabel = quote.status
                ? t(statusKeys[quote.status])
                : t('common.notAvailable');
              const coverageLabel = quote.coverageType
                ? t(coverageKeys[quote.coverageType])
                : t('common.notAvailable');
              const titleId = `quote-${quote.id ?? index}-title`;

              return (
                <Box
                  component="li"
                  key={quote.id ?? index}
                  sx={{ minWidth: 0 }}
                >
                  <Surface
                    component="article"
                    aria-labelledby={titleId}
                    data-widget-tone="quote"
                    sx={(theme) => ({
                      height: '100%',
                      borderTop: '3px solid',
                      borderTopColor: alpha(theme.palette.primary.main, 0.42),
                    })}
                  >
                    <Stack spacing={2} height="100%">
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                      >
                        <Box minWidth={0}>
                          <Typography
                            component="h3"
                            variant="h4"
                            id={titleId}
                            noWrap
                          >
                            {quote.name ?? t('common.notAvailable')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {coverageLabel}
                          </Typography>
                        </Box>
                        {quote.status ? (
                          <StatusBadge
                            status={quote.status}
                            label={statusLabel}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {statusLabel}
                          </Typography>
                        )}
                      </Stack>
                      <Divider />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                        mt="auto"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {t('quotesList.monthlyPremium')}
                        </Typography>
                        <Typography
                          variant="h4"
                          component="p"
                          sx={{ textAlign: 'right' }}
                        >
                          {quote.monthlyPremium == null
                            ? t('common.notAvailable')
                            : formatCurrency(quote.monthlyPremium)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Surface>
                </Box>
              );
            })}
          </Box>
        </Stack>
      ) : null}

      {!isOverview && quotes.isSuccess ? (
        <TablePagination
          component="div"
          count={totalElements}
          page={quotes.data?.page ?? query.page}
          rowsPerPage={quotes.data?.size ?? query.size}
          onPageChange={(_event, page) =>
            setQuery((current) => ({ ...current, page }))
          }
          onRowsPerPageChange={(event) =>
            setQuery((current) => ({
              ...current,
              page: 0,
              size: Number(event.target.value),
            }))
          }
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage={t('quotesList.pagination')}
          data-testid={tid('quotesList.pagination')}
        />
      ) : null}
    </Stack>
  );
}
