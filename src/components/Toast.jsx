import { useState, useEffect, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Singleton reference so showToast() can be called from anywhere
let externalAddToast = null;
let toastId = 0;

/** Call from anywhere (services, context, etc.) to show a notification */
export function showToast(severity, message) {
  externalAddToast?.(severity, message);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((severity, message) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, severity, message, open: true }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  useEffect(() => {
    externalAddToast = addToast;
    return () => { externalAddToast = null; };
  }, [addToast]);

  const handleClose = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Stack
      spacing={1}
      sx={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, width: 360, maxWidth: '100vw' }}
    >
      {toasts.map(t => (
        <Snackbar
          key={t.id}
          open={t.open}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: 'relative', top: 'unset', right: 'unset', transform: 'none' }}
        >
          <Alert
            severity={t.severity}
            onClose={() => handleClose(t.id)}
            variant="filled"
            sx={{
              width: '100%',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
