import type { ReactNode } from 'react';
import { Box, Button, Stack, SvgIcon, Typography } from '@mui/material';
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

function ReassuranceIcon() {
  return (
    <SvgIcon aria-hidden sx={{ fontSize: 24 }}>
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4.18 5 2.22V11c0 3.52-2.29 6.91-5 7.93C9.29 17.91 7 14.52 7 11V7.4l5-2.22z" />
    </SvgIcon>
  );
}

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
  const headingId = `wizard-stage-${activeStep + 1}`;

  const reassurance = aside ?? (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1} alignItems="center">
        <ReassuranceIcon />
        <Typography variant="overline" color="inherit" sx={{ opacity: 0.76 }}>
          {t('wizard.reassurance.eyebrow')}
        </Typography>
      </Stack>
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
          aria-labelledby={headingId}
          data-widget-tone="workspace"
          sx={{
            minWidth: 0,
            borderTop: '3px solid',
            borderTopColor: 'primary.main',
            pb: {
              xs: stickyActions
                ? 'calc(152px + env(safe-area-inset-bottom))'
                : 0,
              sm: 0,
            },
          }}
        >
          <PageIntro
            title={title}
            description={description}
            titleRef={headingRef}
            titleProps={{ ...titleProps, id: headingId, tabIndex: -1 }}
          />
          {children}
        </Surface>
        <Surface
          component="aside"
          tone="dark"
          aria-label={t('wizard.reassurance.title')}
          data-widget-tone="reassurance"
          sx={{
            minWidth: 0,
            borderLeft: '3px solid',
            borderLeftColor: 'primary.main',
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
