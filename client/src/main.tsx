import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply full width style to root element
const rootElement = document.getElementById('root')!;
rootElement.style.width = '100%';
rootElement.style.maxWidth = '100%';
rootElement.style.padding = '0';
rootElement.style.margin = '0';

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
