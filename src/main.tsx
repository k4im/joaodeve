import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/index.ts'
import { LoadingBarContainer } from "react-top-loading-bar";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingBarContainer>
      <App />
    </LoadingBarContainer>
  </StrictMode>,
)
