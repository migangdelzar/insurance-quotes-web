import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { tid } from '@clara/app-i18n';
import type { QuoteStatus } from '@clara/api-contract';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { listQuotes } from '@features/quote-wizard/api/quoteApi';

const statusKeys: Record<QuoteStatus, string> = {
  DRAFT: 'quotesList.statusDraft',
  SUBMITTED: 'quotesList.statusSubmitted',
  SUBMISSION_FAILED: 'quotesList.statusFailed',
  EXPIRED: 'quotesList.statusExpired',
};

export function QuotesListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const quotes = useQuery({ queryKey: ['quotes'], queryFn: listQuotes });

  return (
    <Stack spacing={2}>
      <Typography variant="h5" data-testid={tid('quotesList.title')}>
        {t('quotesList.title')}
      </Typography>
      {quotes.isPending ? (
        <Skeleton height={120} data-testid={tid('common.loading')} />
      ) : null}
      {quotes.isError ? <ApiErrorAlert error={quotes.error} /> : null}
      {quotes.isSuccess && quotes.data.length === 0 ? (
        <Alert severity="info" data-testid={tid('quotesList.empty')}>
          {t('quotesList.empty')}
        </Alert>
      ) : null}
      {quotes.isSuccess && quotes.data.length > 0 ? (
        <List>
          {quotes.data.map((quote) => {
            const status = quote.status
              ? t(statusKeys[quote.status])
              : t('common.notAvailable');
            const premium =
              quote.monthlyPremium == null
                ? ''
                : ` · ${t('common.currencyPrefix')}${quote.monthlyPremium}`;
            return (
              <ListItem key={quote.id} divider>
                <ListItemText
                  primary={`${quote.name ?? t('common.notAvailable')} — ${quote.coverageType ?? t('common.notAvailable')}`}
                  secondary={`${status}${premium}`}
                />
              </ListItem>
            );
          })}
        </List>
      ) : null}
      <Button
        variant="contained"
        onClick={() => void navigate('/quote/personal')}
        data-testid={tid('quotesList.startQuote')}
      >
        {t('quotesList.startQuote')}
      </Button>
    </Stack>
  );
}
