import type { ReactNode } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { tid } from '@clara/app-i18n';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '@shared/components/PageIntro';
import { Surface } from '@shared/components/Surface';
import { useFocusHeading } from '@shared/hooks/useFocusHeading';
import { WizardProgress } from './WizardProgress';

type WizardFrameProps = {
  activeStep: 0 | 1 | 2;
  title: ReactNode;
  titleProps?: TypographyProps & { 'data-testid'?: string };
  description?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  stickyActions?: boolean;
};

export function WizardFrame({
  activeStep,
  title,
  titleProps,
  description,
  children,
  aside,
  stickyActions = false,
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
      <Stack direction="row" justifyContent="flex-start">
        <Button
          component={Link}
          to="/quotes"
          variant="outlined"
          size="small"
          data-testid={tid('wizard.backToQuotes')}
        >
          {t('wizard.backToQuotes')}
        </Button>
      </Stack>
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
        <Surface
          component="section"
          sx={{ minWidth: 0, pb: { xs: stickyActions ? 12 : 0, sm: 0 } }}
        >
          <PageIntro
            title={title}
            description={description}
            titleRef={headingRef}
            titleProps={{ ...titleProps, tabIndex: -1 }}
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
