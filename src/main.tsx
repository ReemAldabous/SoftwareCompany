import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router> <CookiesProvider>
    <App />  </CookiesProvider></Router>
  </StrictMode>,
)
