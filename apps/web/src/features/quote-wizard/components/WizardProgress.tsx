import {
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';

type Props = { activeStep: 0 | 1 | 2 };

export function WizardProgress({ activeStep }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));
  const labels = [
    t('wizard.personal.title'),
    t('wizard.coverage.title'),
    t('wizard.summary.title'),
  ];

  return (
    <Stepper
      activeStep={activeStep}
      orientation={isNarrow ? 'vertical' : 'horizontal'}
      sx={{ mb: 3 }}
      data-testid={tid('wizard.progress')}
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
