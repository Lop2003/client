import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Create Context for Toast
const ToastContext = createContext(null);

// Singleton reference for backward compatibility
let externalAddToast = null;
let toastId = 0;

/**
 * Backward-compatible function: call from anywhere (services, legacy hooks) to show a notification
 */
export function showToast(severity, message) {
  if (externalAddToast) {
    externalAddToast(severity, message);
  } else {
    console.warn('ToastProvider is not mounted yet. Message:', message);
  }
}

/**
 * Hook for modern React components/hooks to use Toast Context
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback to singleton bridge if hook is used outside ToastProvider
    return {
      showToast: (severity, message) => showToast(severity, message),
    };
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((severity, message) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, severity, message, open: true }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  // Update singleton reference inside lifecycle (safe from SSR / multiple mounts issues)
  useEffect(() => {
    externalAddToast = addToast;
    return () => {
      if (externalAddToast === addToast) {
        externalAddToast = null;
      }
    };
  }, [addToast]);

  const handleClose = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const contextValue = {
    showToast: addToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
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
    </ToastContext.Provider>
  );
}

// Keep a dummy container wrapper for backward compatibility in App.jsx
export function ToastContainer() {
  return null;
}

export default ToastContainer;
