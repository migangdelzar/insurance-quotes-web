import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PremiumDisplay } from '@features/quote-wizard/components/PremiumDisplay';
import { WizardFrame } from '@features/quote-wizard/components/WizardFrame';
import { useQuoteWizard } from '@features/quote-wizard/context/QuoteWizardProvider';
import { SubmissionResult } from './SubmissionResult';
import { useSubmitQuote } from './useSubmitQuote';

export function SummaryStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch } = useQuoteWizard();
  const { submit, submission, error } = useSubmitQuote(state, dispatch);
  const rows: Array<[string, string]> = [
    [
      t('wizard.personal.name'),
      state.personal?.name ?? t('common.notAvailable'),
    ],
    [
      t('wizard.personal.email'),
      state.personal?.email ?? t('common.notAvailable'),
    ],
    [
      t('wizard.personal.age'),
      state.personal ? String(state.personal.age) : t('common.notAvailable'),
    ],
    [
      t('wizard.personal.zipCode'),
      state.personal?.zipCode ?? t('common.notAvailable'),
    ],
    [
      t('wizard.coverage.title'),
      state.coverage.coverageType ?? t('common.notAvailable'),
    ],
  ];

  return (
    <WizardFrame
      activeStep={2}
      title={t('wizard.summary.title')}
      titleProps={{ 'data-testid': tid('wizard.summary.title') }}
      description={t('wizard.summary.description')}
    >
      <Stack spacing={3}>
        <List
          aria-label={t('wizard.summary.title')}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 1,
            p: 0,
          }}
        >
          {rows.map(([label, value]) => (
            <ListItem key={label} sx={{ display: 'block', minWidth: 0, p: 1 }}>
              <ListItemText primary={label} secondary={value} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <PremiumDisplay premium={state.premium} updating={false} />
        <SubmissionResult
          submission={submission}
          error={error}
          onRetry={submit}
        />
        {submission === 'idle' ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ '& > *': { width: { xs: '100%', sm: 'auto' } } }}
          >
            <Button
              onClick={() => void navigate('/quote/coverage')}
              data-testid={tid('common.back')}
            >
              {t('common.back')}
            </Button>
            <Button
              variant="contained"
              onClick={submit}
              data-testid={tid('wizard.summary.submit')}
            >
              {t('wizard.summary.submit')}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </WizardFrame>
  );
}
