import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <a style={{position: 'absolute', top: '3em', left: '3em'}} href='./index.html#toc'>Table of Contents</a>
      <App />
    <a style={{position: 'absolute', bottom: '3em', left: '3em'}} href='./index.html#toc'>Table of Contents</a>
  </StrictMode>,
)
