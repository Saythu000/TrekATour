import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { performanceMonitor } from './lib/performance'
import { initDevSecurity } from './lib/devSecurity'
import { sessionSecurity } from './lib/sessionSecurity'
import { initXSSProtection } from './lib/xssProtection'
import './index.css'

// Performance monitoring is auto-initialized

// Initialize development security checks
initDevSecurity();

// Initialize session security
sessionSecurity.init();

// Initialize XSS protection
initXSSProtection();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
