import { createTheme, alpha } from '@mui/material/styles';

const PRIMARY = '#0051BA';
const PRIMARY_DARK = '#003a8c';

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: '#EEF2FF',
      contrastText: '#fff',
    },
    error: { main: '#C81E1E' },
    success: { main: '#057A55' },
    warning: { main: '#92400E' },
    background: { default: '#F8FAFC', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Kanit", "Helvetica", "Arial", sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontSize: 13,
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.75rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '6px 6px 15px rgba(163,177,198,0.35),-6px -6px 15px rgba(255,255,255,0.8)',
          border: '1px solid rgba(255,255,255,0.6)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Kanit", sans-serif',
          fontSize: '0.6875rem',
          padding: '10px 16px',
          borderColor: '#f3f4f6',
        },
        head: {
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '0.625rem',
          backgroundColor: 'rgba(248,250,252,0.75)',
          color: '#9ca3af',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.625rem',
          fontWeight: 700,
          height: 20,
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
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 24 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.75rem' },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { fontFamily: '"Kanit", sans-serif' },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { fontSize: '0.75rem' },
        selectLabel: { fontSize: '0.75rem', fontFamily: '"Kanit", sans-serif' },
        displayedRows: { fontSize: '0.75rem', fontFamily: '"Kanit", sans-serif' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontSize: '0.75rem' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.625rem',
          fontFamily: '"Kanit", sans-serif',
          borderRadius: 8,
          backgroundColor: '#1e293b',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Kanit", "Helvetica", "Arial", sans-serif',
        },
        '*::-webkit-scrollbar': { width: 6, height: 6 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: 99 },
        '*::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
      },
    },
  },
});
