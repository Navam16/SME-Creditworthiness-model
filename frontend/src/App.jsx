import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CreditScore from './pages/CreditScore'
import LoanReadiness from './pages/LoanReadiness'
import GovernmentSchemes from './pages/GovernmentSchemes'
import ChatbotPage from './pages/ChatbotPage'
import { SMEContext } from './hooks/useSME'

export default function App() {
  const [smeProfile, setSmeProfile] = useState(null)
  const [creditResult, setCreditResult] = useState(null)

  return (
    <SMEContext.Provider value={{ smeProfile, setSmeProfile, creditResult, setCreditResult }}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e2040', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'DM Sans' }
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="credit-score" element={<CreditScore />} />
            <Route path="loan-readiness" element={<LoanReadiness />} />
            <Route path="schemes" element={<GovernmentSchemes />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SMEContext.Provider>
  )
}
