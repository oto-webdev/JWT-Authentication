import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Toaster />
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </Router>
  </StrictMode>,
)
