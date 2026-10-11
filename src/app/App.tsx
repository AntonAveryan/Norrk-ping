import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRouter } from './router';
import { ToastContainer } from '../components/feedback/ToastContainer';
import '../styles/globals.css';
import '../styles/animations.css';

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
        <ToastContainer />
      </AppProviders>
    </BrowserRouter>
  );
}
