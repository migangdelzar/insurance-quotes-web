import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

type Props = { activeStep: 0 | 1 | 2 };

export function WizardProgress({ activeStep }: Props) {
  const { t } = useTranslation();
  const labels = [
    t('wizard.personal.title'),
    t('wizard.coverage.title'),
    t('wizard.summary.title'),
  ];

  return (
    <Box
      component="nav"
      aria-label={t('wizard.progress')}
      data-testid={tid('wizard.progress')}
      sx={{ mb: { xs: 2, sm: 3 } }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        {activeStep + 1} / {labels.length} · {labels[activeStep]}
      </Typography>
      <Stepper
        activeStep={activeStep}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        {labels.map((label, index) => (
          <Step
            key={label}
            aria-current={index === activeStep ? 'step' : undefined}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
