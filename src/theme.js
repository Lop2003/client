import { createTheme, alpha } from '@mui/material/styles';

const PRIMARY = '#0051bb';
const PRIMARY_DARK = '#00348C';
const SECONDARY = '#ffdb1b'; // Vibrant Yellow
const SECONDARY_DARK = '#e0bd10';

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: '#F0F5FF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: SECONDARY,
      dark: SECONDARY_DARK,
      light: '#FFFDF0',
      contrastText: '#1E293B',
    },
    error: {
      main: '#EF4444', // Premium coral red
      light: '#FEE2E2',
      dark: '#B91C1C',
    },
    success: {
      main: '#10B981', // Premium emerald green
      light: '#D1FAE5',
      dark: '#047857',
    },
    warning: {
      main: '#F59E0B', // Premium warm amber
      light: '#FEF3C7',
      dark: '#B45309',
    },
    background: {
      default: '#F3F7FC',
      paper: 'rgba(255, 255, 255, 0.85)', // Transparent paper for Glassmorphism
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: 'rgba(226, 232, 240, 0.8)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Kanit", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontSize: 13,
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '0' },
    h5: { fontWeight: 700, letterSpacing: '0' },
    h6: { fontWeight: 700, letterSpacing: '0.01em' },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 700, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Plus Jakarta Sans", "Kanit", "Helvetica", "Arial", sans-serif',
          background: '#F3F7FC',
          color: '#1E293B',
        },
        '*::-webkit-scrollbar': { width: 6, height: 6 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: 99 },
        '*::-webkit-scrollbar-thumb:hover': { background: '#94A3B8' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.75rem',
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 81, 186, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        containedSecondary: {
          color: '#1E293B',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 219, 27, 0.25)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            background: 'rgba(0, 81, 186, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 10px 30px -10px rgba(0, 81, 186, 0.06), 0 1px 3px rgba(0, 0, 0, 0.01)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: 'rgba(226, 232, 240, 0.8)',
          borderRadius: 16,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          padding: '12px 18px',
          borderColor: 'rgba(241, 245, 249, 0.8)',
          color: '#334155',
        },
        head: {
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.6875rem',
          backgroundColor: 'rgba(248, 250, 252, 0.75)',
          color: '#64748B',
          borderBottom: '2px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.6875rem',
          fontWeight: 700,
          height: 22,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontSize: '0.75rem',
            transition: 'all 0.2s ease-in-out',
            background: 'rgba(255, 255, 255, 0.6)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              background: '#ffffff',
              boxShadow: '0 0 0 3px rgba(0, 81, 186, 0.12)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.75rem',
          background: 'rgba(255, 255, 255, 0.6)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.9)',
          },
          '&.Mui-focused': {
            background: '#ffffff',
            boxShadow: '0 0 0 3px rgba(0, 81, 186, 0.12)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 500,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { fontSize: '0.75rem' },
        selectLabel: { fontSize: '0.75rem', fontWeight: 500 },
        displayedRows: { fontSize: '0.75rem', fontWeight: 500 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          fontSize: '0.75rem',
          fontWeight: 500,
          border: '1px solid',
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          borderColor: '#FCA5A5',
          color: '#991B1B',
        },
        standardSuccess: {
          backgroundColor: '#ECFDF5',
          borderColor: '#A7F3D0',
          color: '#065F46',
        },
        standardWarning: {
          backgroundColor: '#FFFBEB',
          borderColor: '#FDE68A',
          color: '#92400E',
        },
        standardInfo: {
          backgroundColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          color: '#1E40AF',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.6875rem',
          borderRadius: 8,
          backgroundColor: '#1E293B',
          padding: '6px 10px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
