import { CXProvider } from './context/CXContext';
import AppRoutes from './routes';
import ToastContainer from './components/Toast';

// CXProvider must be inside BrowserRouter so it can use useLocation
export default function App() {
  return (
    <CXProvider>
      <AppRoutes />
      <ToastContainer />
    </CXProvider>
  );
}
