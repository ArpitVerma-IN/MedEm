import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { ErrorBoundary } from './core/error/ErrorBoundary.tsx'
import { AuthProvider } from './core/auth/AuthContext.tsx'

// Aggressive cache management: Automatically update service worker on new builds
const updateSW = registerSW({
  onNeedRefresh() {
    // Force the new service worker to take control and reload the page
    // This clears stale DOM nodes like old LocalStorage keys or old cached App bundles
    updateSW(true)
  },
  onOfflineReady() {
    console.log("App ready to work offline")
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
