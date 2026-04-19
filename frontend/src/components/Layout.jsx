import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Star, FileCheck, BookOpen,
  MessageCircle, ChevronRight, Zap, Menu, X, TrendingUp
} from 'lucide-react'
import ChatbotWidget from './ChatbotWidget'

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard',          sub: 'Overview' },
  { to: '/credit-score', icon: Star,            label: 'Credit Score',       sub: 'ML Assessment' },
  { to: '/loan-readiness',icon: FileCheck,      label: 'Loan Readiness',     sub: 'Doc Checklist' },
  { to: '/schemes',      icon: BookOpen,        label: 'Govt Schemes',       sub: 'AI Discovery' },
  { to: '/chatbot',      icon: MessageCircle,   label: 'Chatbot Help',       sub: 'Ask Jarvis' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="mesh-bg min-h-screen flex noise-bg">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex-shrink-0 flex flex-col`}
        style={{ background: 'rgba(15,17,40,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            <Zap size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-display font-bold text-white text-base leading-tight">JARVIS</div>
              <div className="text-xs text-slate-500" style={{ fontFamily: 'DM Sans' }}>SME Credit Platform</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* India strip */}
        <div className="india-flag-strip" />

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {NAV.map(({ to, icon: Icon, label, sub }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-tight">{label}</div>
                  <div className="text-xs text-slate-600 font-normal" style={{ fontFamily: 'DM Sans' }}>{sub}</div>
                </div>
              )}
              {sidebarOpen && <ChevronRight size={14} className="text-slate-600 flex-shrink-0" />}
            </NavLink>
          ))}
        </nav>

        {/* Bottom card */}
        {sidebarOpen && (
          <div className="p-3 mb-4">
            <div className="glass-card p-3" style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-orange-400" />
                <span className="font-display text-xs font-bold text-orange-400">AI-Powered</span>
              </div>
              <p className="text-xs text-slate-400" style={{ fontFamily: 'DM Sans' }}>
                Hybrid ML + TOPSIS model with 5 qualitative factors
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto relative z-10">
        <Outlet />
      </main>

      {/* Floating Chatbot Button */}
      {location.pathname !== '/chatbot' && (
        <>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="chatbot-bubble fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 32px rgba(249,115,22,0.4)' }}
          >
            {chatOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
          </button>
          {chatOpen && (
            <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] glass-card overflow-hidden shadow-2xl"
                 style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <ChatbotWidget embedded onClose={() => setChatOpen(false)} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
