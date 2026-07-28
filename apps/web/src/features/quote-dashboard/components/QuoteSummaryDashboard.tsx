import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tid } from '@clara/app-i18n';
import type { QuoteSummaryView } from '@clara/api-contract';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { Surface } from '@shared/components/Surface';

type QuoteSummaryDashboardProps = {
  summary: QuoteSummaryView | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
};

const statusKeys: Record<string, string> = {
  DRAFT: 'quotesList.statusDraft',
  SUBMITTED: 'quotesList.statusSubmitted',
  SUBMISSION_FAILED: 'quotesList.statusFailed',
  EXPIRED: 'quotesList.statusExpired',
};

const coverageKeys: Record<string, string> = {
  BASIC: 'wizard.coverage.basic',
  STANDARD: 'wizard.coverage.standard',
  PREMIUM: 'wizard.coverage.premium',
};

export function QuoteSummaryDashboard({
  summary,
  isLoading = false,
  isError = false,
  error,
  onRetry,
}: QuoteSummaryDashboardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'es-MX' ? 'es-MX' : 'en-US';
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Stack
      component="section"
      spacing={2.5}
      aria-labelledby="quote-analytics-title"
      data-testid={tid('quotesList.analytics')}
    >
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary">
          {t('quotesList.summary.title')}
        </Typography>
        <Typography component="h2" variant="h3" id="quote-analytics-title">
          {t('quotesList.analytics.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('quotesList.analytics.description')}
        </Typography>
      </Stack>

      {isLoading ? (
        <Surface
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={t('quotesList.analytics.loading')}
          data-widget-tone="loading"
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} variant="rounded" height={82} />
            ))}
          </Box>
        </Surface>
      ) : null}

      {isError ? (
        <Surface data-widget-tone="critical">
          <Stack spacing={1.5}>
            <ApiErrorAlert error={error} />
            <Typography variant="body2" color="text.secondary">
              {t('quotesList.analytics.error')}
            </Typography>
            <Button
              variant="outlined"
              onClick={onRetry}
              data-testid={tid('common.retry')}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('quotesList.analytics.retry')}
            </Button>
          </Stack>
        </Surface>
      ) : null}

      {summary ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(6, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            <Kpi
              label={t('quotesList.analytics.total')}
              value={summary.totalQuotes}
            />
            <Kpi
              label={t('quotesList.analytics.draft')}
              value={summary.draftQuotes}
            />
            <Kpi
              label={t('quotesList.analytics.submitted')}
              value={summary.submittedQuotes}
            />
            <Kpi
              label={t('quotesList.analytics.failed')}
              value={summary.submissionFailedQuotes}
            />
            <Kpi
              label={t('quotesList.analytics.expired')}
              value={summary.expiredQuotes}
            />
            <Kpi
              label={t('quotesList.analytics.priced')}
              value={summary.pricedQuotes}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            <MetricSurface
              label={t('quotesList.analytics.totalPremium')}
              value={formatCurrency(summary.totalMonthlyPremium)}
            />
            <MetricSurface
              label={t('quotesList.analytics.averagePremium')}
              value={formatCurrency(summary.averageMonthlyPremium)}
            />
            <MetricSurface
              label={t('quotesList.analytics.submissionRate')}
              value={`${summary.submissionRate.toFixed(2)}%`}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            <DistributionChart
              testId={tid('quotesList.analyticsStatus')}
              title={t('quotesList.analytics.statusDistribution')}
              entries={summary.statusDistribution}
              labelFor={(key) => t(statusKeys[key] ?? key)}
              accent="primary"
            />
            <DistributionChart
              testId={tid('quotesList.analyticsCoverage')}
              title={t('quotesList.analytics.coverageDistribution')}
              entries={summary.coverageDistribution}
              labelFor={(key) => t(coverageKeys[key] ?? key)}
              accent="secondary"
            />
          </Box>

          <TrendChart summary={summary} formatDate={(date) => date.slice(5)} />
        </>
      ) : null}
    </Stack>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <Surface sx={{ minWidth: 0, p: { xs: 1.5, sm: 2 } }}>
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography
          variant="h3"
          component="p"
          sx={{ overflowWrap: 'anywhere' }}
        >
          {value}
        </Typography>
      </Stack>
    </Surface>
  );
}

function MetricSurface({ label, value }: { label: string; value: string }) {
  return (
    <Surface tone="gold">
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h3"
          component="p"
          sx={{ overflowWrap: 'anywhere' }}
        >
          {value}
        </Typography>
      </Stack>
    </Surface>
  );
}

function DistributionChart({
  testId,
  title,
  entries,
  labelFor,
  accent,
}: {
  testId: string;
  title: string;
  entries: QuoteSummaryView['statusDistribution'];
  labelFor: (key: string) => string;
  accent: 'primary' | 'secondary';
}) {
  const { t } = useTranslation();
  const maximum = Math.max(...entries.map((entry) => entry.count), 1);

  return (
    <Surface component="section" aria-labelledby={`${testId}-title`}>
      <Stack spacing={2}>
        <Typography component="h3" variant="h4" id={`${testId}-title`}>
          {title}
        </Typography>
        <Stack
          role="img"
          aria-label={title}
          data-testid={testId}
          spacing={1.25}
        >
          {entries.map((entry) => (
            <Stack key={entry.key} spacing={0.5}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography variant="body2">{labelFor(entry.key)}</Typography>
                <Typography variant="body2" fontWeight={700}>
                  {entry.count}
                </Typography>
              </Stack>
              <Box
                sx={(theme) => ({
                  height: 8,
                  borderRadius: 999,
                  overflow: 'hidden',
                  backgroundColor: alpha(theme.palette.text.primary, 0.08),
                })}
              >
                <Box
                  sx={(theme) => ({
                    width: `${(entry.count / maximum) * 100}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: theme.palette[accent].main,
                  })}
                />
              </Box>
            </Stack>
          ))}
          {entries.every((entry) => entry.count === 0) ? (
            <Typography variant="body2" color="text.secondary">
              {t('quotesList.analytics.noData')}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Surface>
  );
}

function TrendChart({
  summary,
  formatDate,
}: {
  summary: QuoteSummaryView;
  formatDate: (date: string) => string;
}) {
  const { t } = useTranslation();
  const width = 640;
  const height = 210;
  const padding = 24;
  const maximum = Math.max(
    ...summary.trend.flatMap((point) => [
      point.created,
      point.submitted,
      point.failed,
    ]),
    1
  );
  const pointsFor = (key: 'created' | 'submitted' | 'failed') =>
    summary.trend
      .map((point, index) => {
        const x =
          summary.trend.length === 1
            ? width / 2
            : padding +
              (index / (summary.trend.length - 1)) * (width - padding * 2);
        const y =
          height - padding - (point[key] / maximum) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <Surface component="section" aria-labelledby="quote-analytics-trend-title">
      <Stack spacing={1.5}>
        <Typography
          component="h3"
          variant="h4"
          id="quote-analytics-trend-title"
        >
          {t('quotesList.analytics.trend')}
        </Typography>
        <Box
          role="img"
          aria-label={t('quotesList.analytics.trend')}
          data-testid={tid('quotesList.analyticsTrend')}
          sx={{ width: '100%', overflowX: 'auto' }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height="210"
            aria-hidden="true"
          >
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="currentColor"
              opacity="0.16"
            />
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsFor('created')}
            />
            <polyline
              fill="none"
              stroke="#C38B32"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsFor('submitted')}
            />
            <polyline
              fill="none"
              stroke="#B94A48"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsFor('failed')}
            />
          </svg>
        </Box>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Legend
            color="currentColor"
            label={t('quotesList.analytics.created')}
          />
          <Legend
            color="#C38B32"
            label={t('quotesList.analytics.submittedSeries')}
          />
          <Legend
            color="#B94A48"
            label={t('quotesList.analytics.failedSeries')}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          {summary.trend.map((point) => (
            <Typography
              key={point.date}
              variant="caption"
              color="text.secondary"
            >
              {formatDate(point.date)}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Surface>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box
        aria-hidden
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      <Typography variant="caption">{label}</Typography>
    </Stack>
  );
}
