import { Step, StepLabel, Stepper } from '@mui/material';
import { testIds } from '@clara/app-i18n';
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
    <Stepper
      activeStep={activeStep}
      sx={{ mb: 3 }}
      data-testid={testIds.wizard.progress}
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
  );
}
