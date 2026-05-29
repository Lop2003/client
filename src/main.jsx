import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { theme } from './theme';
import { ToastProvider } from './components/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <CssBaseline />
        <App />
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);
