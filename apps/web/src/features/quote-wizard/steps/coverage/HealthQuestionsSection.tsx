import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { HEALTH_CONDITIONS } from '@clara/api-contract';
import type { HealthCondition } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import type { InputHTMLAttributes } from 'react';
import type { CoverageData } from '@features/quote-wizard/context/wizardReducer';

type Props = { coverage: CoverageData; onChange: (next: CoverageData) => void };

const conditionTestIds: Record<HealthCondition, string> = {
  DIABETES: tid('wizard.coverage.health.diabetes'),
  HEART_DISEASE: tid('wizard.coverage.health.heartDisease'),
  HYPERTENSION: tid('wizard.coverage.health.hypertension'),
  CANCER_HISTORY: tid('wizard.coverage.health.cancerHistory'),
  OTHER: tid('wizard.coverage.health.other'),
};

const conditionLabelKeys: Record<HealthCondition, string> = {
  DIABETES: 'wizard.coverage.health.diabetes',
  HEART_DISEASE: 'wizard.coverage.health.heartDisease',
  HYPERTENSION: 'wizard.coverage.health.hypertension',
  CANCER_HISTORY: 'wizard.coverage.health.cancerHistory',
  OTHER: 'wizard.coverage.health.other',
};

function YesNoQuestion({
  labelKey,
  testId,
  value,
  onAnswer,
}: {
  labelKey: string;
  testId: string;
  value: boolean | null;
  onAnswer: (answer: boolean) => void;
}) {
  const { t } = useTranslation();
  const labelId = `${testId}-label`;

  return (
    <FormControl component="fieldset" data-testid={testId}>
      <FormLabel component="legend" id={labelId}>
        {t(labelKey)}
      </FormLabel>
      <RadioGroup
        aria-labelledby={labelId}
        row
        value={value === null ? '' : String(value)}
        onChange={(event) => onAnswer(event.target.value === 'true')}
      >
        <FormControlLabel value="true" control={<Radio />} label={t('wizard.coverage.health.yes')} />
        <FormControlLabel value="false" control={<Radio />} label={t('wizard.coverage.health.no')} />
      </RadioGroup>
    </FormControl>
  );
}

export function HealthQuestionsSection({ coverage, onChange }: Props) {
  const { t } = useTranslation();

  const toggleCondition = (condition: HealthCondition) => {
    const conditions = coverage.conditions.includes(condition)
      ? coverage.conditions.filter((item) => item !== condition)
      : [...coverage.conditions, condition];
    onChange({ ...coverage, conditions });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" data-testid={tid('wizard.coverage.health.title')}>
        {t('wizard.coverage.health.title')}
      </Typography>
      <YesNoQuestion labelKey="wizard.coverage.health.preexisting" testId={tid('wizard.coverage.health.preexisting')} value={coverage.hasPreexistingConditions} onAnswer={(answer) => onChange({ ...coverage, hasPreexistingConditions: answer, conditions: answer ? coverage.conditions : [] })} />
      {coverage.hasPreexistingConditions === true ? (
        <FormControl
          component="fieldset"
          data-testid={tid('wizard.coverage.health.conditions')}
        >
          <FormLabel
            component="legend"
            id={`${tid('wizard.coverage.health.conditions')}-label`}
          >
            {t('wizard.coverage.health.conditions')}
          </FormLabel>
          <FormGroup aria-labelledby={`${tid('wizard.coverage.health.conditions')}-label`}>
            {HEALTH_CONDITIONS.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Checkbox checked={coverage.conditions.includes(condition)} onChange={() => toggleCondition(condition)} inputProps={{ 'data-testid': conditionTestIds[condition] } as InputHTMLAttributes<HTMLInputElement>} />}
                label={t(conditionLabelKeys[condition])}
              />
            ))}
          </FormGroup>
        </FormControl>
      ) : null}
      <YesNoQuestion labelKey="wizard.coverage.health.prescription" testId={tid('wizard.coverage.health.prescription')} value={coverage.takesPrescriptionMedication} onAnswer={(answer) => onChange({ ...coverage, takesPrescriptionMedication: answer })} />
      <YesNoQuestion labelKey="wizard.coverage.health.tobacco" testId={tid('wizard.coverage.health.tobacco')} value={coverage.usesTobacco} onAnswer={(answer) => onChange({ ...coverage, usesTobacco: answer })} />
      <YesNoQuestion labelKey="wizard.coverage.health.spouse" testId={tid('wizard.coverage.health.spouse')} value={coverage.needsSpouseCoverage} onAnswer={(answer) => onChange({ ...coverage, needsSpouseCoverage: answer })} />
    </Stack>
  );
}
