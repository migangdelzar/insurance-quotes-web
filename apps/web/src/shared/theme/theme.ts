import { alpha, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    ink: Palette['primary'];
    charcoal: Palette['primary'];
    cream: Palette['primary'];
    surface: Palette['primary'];
    slate: Palette['primary'];
    gold: Palette['primary'];
  }

  interface PaletteOptions {
    ink?: PaletteOptions['primary'];
    charcoal?: PaletteOptions['primary'];
    cream?: PaletteOptions['primary'];
    surface?: PaletteOptions['primary'];
    slate?: PaletteOptions['primary'];
    gold?: PaletteOptions['primary'];
  }
}

const palette = {
  ink: '#1b1d21',
  charcoal: '#23262d',
  cream: '#f4f0e8',
  surface: '#fffdf8',
  slate: '#62656b',
  gold: '#c8a66a',
  success: '#2f6b50',
  warning: '#8b6b28',
  error: '#8f3d36',
} as const;

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.ink,
      contrastText: '#f8f4ec',
    },
    secondary: {
      main: palette.gold,
      contrastText: palette.ink,
    },
    background: {
      default: palette.cream,
      paper: palette.surface,
    },
    text: {
      primary: palette.ink,
      secondary: palette.slate,
    },
    success: {
      main: palette.success,
      contrastText: '#f8f4ec',
    },
    warning: {
      main: palette.warning,
      contrastText: '#1f1a10',
    },
    error: {
      main: palette.error,
      contrastText: '#fff7f6',
    },
    divider: 'rgba(27, 29, 33, 0.12)',
    ink: {
      main: palette.ink,
      contrastText: '#f8f4ec',
    },
    charcoal: {
      main: palette.charcoal,
      contrastText: '#f8f4ec',
    },
    cream: {
      main: palette.cream,
      contrastText: palette.ink,
    },
    surface: {
      main: palette.surface,
      contrastText: palette.ink,
    },
    slate: {
      main: palette.slate,
      contrastText: '#f8f4ec',
    },
    gold: {
      main: palette.gold,
      contrastText: palette.ink,
    },
  },
  shape: {
    borderRadius: 14,
  },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      lineHeight: 1.1,
      fontWeight: 600,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      lineHeight: 1.15,
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: 1.3,
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
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
          colorScheme: 'light',
          '--clara-focus-ring-inner': theme.palette.surface.main,
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
          'html:focus-within': {
            scrollBehavior: 'auto',
          },
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
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: theme.spacing(2),
          paddingBlock: theme.spacing(1.25),
        },
        contained: {
          boxShadow: '0 8px 20px rgba(27, 29, 33, 0.08)',
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.05)}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, size: 'small' },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          minWidth: 0,
          overflowWrap: 'anywhere',
        },
      },
    },
  },
});

export { theme };
