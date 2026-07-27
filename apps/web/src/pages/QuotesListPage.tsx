import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { tid } from '@clara/app-i18n';
import type { QuoteStatus } from '@clara/api-contract';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { PageIntro } from '@shared/components/PageIntro';
import { StatusBadge } from '@shared/components/StatusBadge';
import { Surface } from '@shared/components/Surface';
import { listQuotes } from '@features/quote-wizard/api/quoteApi';

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
  const quotes = useQuery({ queryKey: ['quotes'], queryFn: listQuotes });
  const locale = i18n.resolvedLanguage === 'es-MX' ? 'es-MX' : 'en-US';
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const quoteData = quotes.data ?? [];
  const isOverview = view === 'overview';
  const hasQuotes = quoteData.length > 0;
  const submittedCount = quoteData.filter(
    (quote) => quote.status === 'SUBMITTED'
  ).length;
  const monthlyValue = quoteData.reduce(
    (total, quote) => total + (quote.monthlyPremium ?? 0),
    0
  );

  const startQuote = () => void navigate('/quote/personal');

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

      {quotes.isSuccess && isOverview ? (
        <Surface
          tone="gold"
          component="section"
          aria-label={t('quotesList.summary.title')}
          data-widget-tone="accent"
          sx={(theme) => ({
            borderTop: '3px solid',
            borderTopColor: theme.palette.primary.main,
          })}
        >
          <Stack spacing={2}>
            <Typography variant="overline" color="text.secondary">
              {t('quotesList.summary.title')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(3, minmax(0, 1fr))',
                },
                gap: { xs: 2, sm: 3 },
              }}
            >
              <SummaryMetric
                icon="quotes"
                label={t('quotesList.summary.totalLabel')}
                value={t('quotesList.summary.total', {
                  count: quoteData.length,
                })}
              />
              <SummaryMetric
                icon="submitted"
                label={t('quotesList.summary.submittedLabel')}
                value={t('quotesList.summary.submitted', {
                  count: submittedCount,
                })}
              />
              <SummaryMetric
                icon="premium"
                label={t('quotesList.summary.monthlyValueLabel')}
                value={formatCurrency(monthlyValue)}
              />
            </Box>
          </Stack>
        </Surface>
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
              {t('quotesList.yourQuotes')}
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
            {quotes.data.map((quote, index) => {
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
    </Stack>
  );
}

function MetricIcon({
  kind,
  ...props
}: SvgIconProps & { kind: 'quotes' | 'submitted' | 'premium' }) {
  const paths = {
    quotes: 'M4 4h16v12H7l-3 3V4zm3 5h10V7H7v2zm0 4h7v-2H7v2z',
    submitted: 'm9 16.17-3.88-3.88L3.71 13.7 9 19l12-12-1.41-1.41L9 16.17z',
    premium:
      'M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4zm4.24 8.59-4.95 4.95-2.83-2.83 1.41-1.41 1.42 1.42 3.54-3.54 1.41 1.41z',
  } as const;

  return (
    <SvgIcon aria-hidden {...props}>
      <path d={paths[kind]} />
    </SvgIcon>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: 'quotes' | 'submitted' | 'premium';
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" spacing={1.25} minWidth={0} alignItems="center">
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          display: 'grid',
          width: 40,
          height: 40,
          flexShrink: 0,
          placeItems: 'center',
          borderRadius: 2,
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        })}
      >
        <MetricIcon kind={icon} sx={{ fontSize: 24 }} />
      </Box>
      <Stack spacing={0.25} minWidth={0}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h4"
          component="p"
          sx={{ overflowWrap: 'anywhere' }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}
