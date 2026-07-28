import { alpha, createTheme, type Theme } from '@mui/material/styles';

export type ColorMode = 'light' | 'dark';

declare module '@mui/material/styles' {
  interface Palette {
    ink: Palette['primary'];
    shell: Palette['primary'];
    charcoal: Palette['primary'];
    cream: Palette['primary'];
    surface: Palette['primary'];
    raised: Palette['primary'];
    slate: Palette['primary'];
    gold: Palette['primary'];
  }

  interface PaletteOptions {
    ink?: PaletteOptions['primary'];
    shell?: PaletteOptions['primary'];
    charcoal?: PaletteOptions['primary'];
    cream?: PaletteOptions['primary'];
    surface?: PaletteOptions['primary'];
    raised?: PaletteOptions['primary'];
    slate?: PaletteOptions['primary'];
    gold?: PaletteOptions['primary'];
  }
}

type ModeTokens = {
  canvas: string;
  surface: string;
  raised: string;
  border: string;
  text: string;
  muted: string;
  shell: string;
  shellText: string;
  gold: string;
  primary: string;
  primaryText: string;
};

const modeTokens: Record<ColorMode, ModeTokens> = {
  light: {
    canvas: '#F4F6F8',
    surface: '#FFFFFF',
    raised: '#E9EDF2',
    border: '#CBD3DD',
    text: '#171A1F',
    muted: '#53606D',
    shell: '#151A20',
    shellText: '#F3F6F8',
    gold: '#B7791F',
    primary: '#0071E3',
    primaryText: '#FFFFFF',
  },
  dark: {
    canvas: '#101419',
    surface: '#1A2028',
    raised: '#232C36',
    border: '#3A4653',
    text: '#F3F6F8',
    muted: '#B5C0CB',
    shell: '#0B0F13',
    shellText: '#F3F6F8',
    gold: '#F2C86B',
    primary: '#63B3FF',
    primaryText: '#08111A',
  },
};

export function createAppTheme(mode: ColorMode): Theme {
  const tokens = modeTokens[mode];
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        contrastText: tokens.primaryText,
      },
      secondary: {
        main: tokens.gold,
        contrastText: tokens.text,
      },
      background: {
        default: tokens.canvas,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.text,
        secondary: tokens.muted,
      },
      success: {
        main: mode === 'dark' ? '#55C878' : '#248A3D',
        contrastText: mode === 'dark' ? '#08130C' : '#F8F4EC',
      },
      warning: {
        main: mode === 'dark' ? '#F0B44D' : '#A15C00',
        contrastText: '#1F1A10',
      },
      error: {
        main: mode === 'dark' ? '#FF8B83' : '#B42318',
        contrastText: mode === 'dark' ? '#210908' : '#FFF7F6',
      },
      divider: tokens.border,
      ink: {
        main: tokens.text,
        contrastText: tokens.surface,
      },
      shell: {
        main: tokens.shell,
        contrastText: tokens.shellText,
      },
      charcoal: {
        main: tokens.shell,
        contrastText: tokens.shellText,
      },
      cream: {
        main: tokens.canvas,
        contrastText: tokens.text,
      },
      surface: {
        main: tokens.surface,
        contrastText: tokens.text,
      },
      raised: {
        main: tokens.raised,
        contrastText: tokens.text,
      },
      slate: {
        main: tokens.muted,
        contrastText: tokens.surface,
      },
      gold: {
        main: tokens.gold,
        contrastText: tokens.text,
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        lineHeight: 1.1,
        fontWeight: 650,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        lineHeight: 1.15,
        fontWeight: 650,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontSize: '1.5rem',
        lineHeight: 1.2,
        fontWeight: 650,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontSize: '1.25rem',
        lineHeight: 1.3,
        fontWeight: 650,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.65,
      },
      body2: {
        fontSize: '0.9375rem',
        lineHeight: 1.55,
      },
      button: {
        textTransform: 'none',
        fontWeight: 650,
        letterSpacing: '0.01em',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.18em',
        lineHeight: 1.4,
      },
      subtitle2: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
      },
    },
  });

  theme = createTheme(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: mode,
            '--clara-focus-ring-inner': theme.palette.background.paper,
            '--clara-focus-ring-outer': theme.palette.primary.main,
          },
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          html: {
            width: '100%',
            backgroundColor: theme.palette.background.default,
          },
          body: {
            margin: 0,
            minWidth: 320,
            width: '100%',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          '#root': {
            minHeight: '100vh',
          },
          '*:focus-visible, *[data-focus-visible-added]': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow:
              '0 0 0 2px var(--clara-focus-ring-inner), 0 0 0 4px var(--clara-focus-ring-outer)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            'html:focus-within': { scrollBehavior: 'auto' },
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: theme.spacing(2),
            paddingBlock: theme.spacing(1.25),
          },
          contained: {
            boxShadow: `0 6px 16px ${alpha(theme.palette.ink.main, 0.16)}`,
          },
          outlined: { borderWidth: 1 },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 4px 16px ${alpha(theme.palette.ink.main, mode === 'dark' ? 0.2 : 0.06)}`,
          },
        },
      },
      MuiTextField: {
        defaultProps: { fullWidth: true, size: 'small' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: theme.spacing(1),
            borderColor: theme.palette.divider,
            fontWeight: theme.typography.fontWeightMedium,
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: { minWidth: 0, overflowWrap: 'anywhere' },
        },
      },
    },
  });

  return theme;
}

export const theme = createAppTheme('light');
