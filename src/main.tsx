import '@fontsource/libre-caslon-display/400.css';
import '@fontsource/libre-caslon-text/400-italic.css';
import '@fontsource-variable/hanken-grotesk';
import './styles/global.css';
import './styles/pages.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
