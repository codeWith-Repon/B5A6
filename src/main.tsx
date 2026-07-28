import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './providers/theme.provider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'sonner';
import { SocketBridge } from './components/SocketBridge';
import { DriverTrackingBridge } from './components/DriverTrackingBridge';
import { GlobalChatWidget } from './components/GlobalChatWidget';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <SocketBridge />
        <DriverTrackingBridge />
        <GlobalChatWidget />
        <RouterProvider router={router} />
        <Toaster
          richColors
          position='top-right'
          toastOptions={{
            classNames: {
              toast: 'glass-strong border-border/60 rounded-2xl',
            },
          }}
        />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
