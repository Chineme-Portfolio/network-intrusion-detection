import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/styles.css'; // the design tokens (vendored from the export)
import './index.css'; // app-level reset + the icon rule
import App from './App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('[frontend] #root element missing from index.html');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
