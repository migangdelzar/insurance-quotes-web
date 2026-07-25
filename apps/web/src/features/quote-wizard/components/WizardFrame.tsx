import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '@shared/components/PageIntro';
import { Surface } from '@shared/components/Surface';
import { useFocusHeading } from '@shared/hooks/useFocusHeading';
import { WizardProgress } from './WizardProgress';

type WizardFrameProps = {
  activeStep: 0 | 1 | 2;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
};

export function WizardFrame({
  activeStep,
  title,
  description,
  children,
  aside,
}: WizardFrameProps) {
  const { t } = useTranslation();
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  const reassurance = aside ?? (
    <Stack spacing={1.25}>
      <Typography variant="overline" color="secondary.light">
        {t('wizard.reassurance.eyebrow')}
      </Typography>
      <Typography component="h2" variant="h3">
        {t('wizard.reassurance.title')}
      </Typography>
      <Typography variant="body2" color="inherit" sx={{ opacity: 0.78 }}>
        {t('wizard.reassurance.description')}
      </Typography>
    </Stack>
  );

  return (
    <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ width: '100%', minWidth: 0 }}>
      <WizardProgress activeStep={activeStep} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1fr) minmax(220px, 280px)',
          },
          gap: { xs: 2, lg: 3 },
          alignItems: 'start',
          minWidth: 0,
        }}
      >
        <Surface component="section" sx={{ minWidth: 0 }}>
          <PageIntro
            title={title}
            description={description}
            titleRef={headingRef}
            titleProps={{ tabIndex: -1 }}
          />
          {children}
        </Surface>
        <Surface
          component="aside"
          tone="dark"
          aria-label={t('wizard.reassurance.title')}
          sx={{
            minWidth: 0,
            display: { xs: 'none', lg: 'block' },
            position: 'sticky',
            top: 24,
          }}
        >
          {reassurance}
        </Surface>
      </Box>
    </Stack>
  );
}
