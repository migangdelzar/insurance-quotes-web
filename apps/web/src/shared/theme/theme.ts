import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1a237e' },
    secondary: { main: '#00897b' },
  },
  components: {
    MuiTextField: { defaultProps: { fullWidth: true, size: 'small' } },
  },
});
