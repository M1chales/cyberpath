import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { AppStateProvider } from './state/AppStateContext.tsx'
import { ConsoleWorldProvider } from './state/ConsoleWorldContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppStateProvider>
          <ConsoleWorldProvider>
            <App />
          </ConsoleWorldProvider>
        </AppStateProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
