import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSME } from '../hooks/useSME'
import {
  Star, FileCheck, BookOpen, ArrowRight, TrendingUp,
  Users, IndianRupee, Award, Zap, AlertCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'

const STATS = [
  { label: 'SMEs Assessed', value: '12,847', change: '+18%', icon: Users, color: '#f97316' },
  { label: 'Loans Facilitated', value: '₹4.2 Cr', change: '+31%', icon: IndianRupee, color: '#22c55e' },
  { label: 'Schemes Matched', value: '94.2%', change: '+5%', icon: Award, color: '#3b82f6' },
  { label: 'Avg Credit Score', value: '68.4', change: '+2.1', icon: Star, color: '#a855f7' },
]

const TREND_DATA = [
  { month: 'Aug', assessments: 820, loans: 340 },
  { month: 'Sep', assessments: 1050, loans: 420 },
  { month: 'Oct', assessments: 980, loans: 390 },
  { month: 'Nov', assessments: 1320, loans: 540 },
  { month: 'Dec', assessments: 1540, loans: 620 },
  { month: 'Jan', assessments: 1890, loans: 780 },
  { month: 'Feb', assessments: 2100, loans: 890 },
]

const SECTOR_DATA = [
  { sector: 'Manufacturing', score: 72, color: '#f97316' },
  { sector: 'Retail', score: 58, color: '#fb923c' },
  { sector: 'Services', score: 75, color: '#22c55e' },
  { sector: 'Agriculture', score: 61, color: '#4ade80' },
  { sector: 'Technology', score: 83, color: '#3b82f6' },
  { sector: 'Food & Bev', score: 55, color: '#a855f7' },
]

const QUICK_ACTIONS = [
  { label: 'Assess Credit Score', sub: 'ML + TOPSIS Model', to: '/credit-score', icon: Star, color: '#f97316' },
  { label: 'Check Documents', sub: 'Loan Readiness', to: '/loan-readiness', icon: FileCheck, color: '#22c55e' },
  { label: 'Find Schemes', sub: 'AI Discovery', to: '/schemes', icon: BookOpen, color: '#3b82f6' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { creditResult } = useSME()

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag tag-saffron">
              <Zap size={10} /> Live Platform
            </span>
            <span className="tag tag-jade">v2.0 — Hybrid ML</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            SME Credit<span className="gradient-text"> Enablement</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: 'DM Sans' }}>
            AI-powered creditworthiness assessment for Indian SMEs — Powered by LendingClub ML + TOPSIS
          </p>
        </div>
        <button onClick={() => navigate('/credit-score')} className="btn-saffron flex items-center gap-2">
          <Star size={16} /> Assess My SME
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs text-green-400 font-mono">{change}</span>
            </div>
            <div className="font-display text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'DM Sans' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-white text-sm">Platform Activity</h3>
              <p className="text-xs text-slate-500">Monthly assessments & loan facilitations</p>
            </div>
            <span className="tag tag-saffron">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="gAssess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e2040', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 12 }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="assessments" stroke="#f97316" strokeWidth={2} fill="url(#gAssess)" name="Assessments" />
              <Area type="monotone" dataKey="loans" stroke="#22c55e" strokeWidth={2} fill="url(#gLoans)" name="Loans" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector scores */}
        <div className="glass-card p-5">
          <div className="mb-4">
            <h3 className="font-display font-bold text-white text-sm">Avg Score by Sector</h3>
            <p className="text-xs text-slate-500">Credit index distribution</p>
          </div>
          <div className="space-y-3">
            {SECTOR_DATA.map(({ sector, score, color }) => (
              <div key={sector}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{sector}</span>
                  <span className="font-mono" style={{ color }}>{score}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display font-bold text-white text-sm mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ label, sub, to, icon: Icon, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="glass-card p-5 flex items-center gap-4 text-left group hover:scale-[1.01] transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-white text-sm">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
              </div>
              <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Alert banner if no assessment done */}
      {!creditResult && (
        <div className="glass-card p-4 flex items-center gap-3"
             style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.05)' }}>
          <AlertCircle size={18} className="text-orange-400 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm text-orange-300 font-display font-semibold">No assessment yet</span>
            <span className="text-xs text-slate-400 ml-2" style={{ fontFamily: 'DM Sans' }}>
              Complete your SME credit assessment to unlock personalized scheme recommendations
            </span>
          </div>
          <button onClick={() => navigate('/credit-score')} className="btn-saffron text-xs px-3 py-1.5">
            Start Now
          </button>
        </div>
      )}

      {/* Agent Architecture mini display */}
      <div className="glass-card p-5">
        <h3 className="font-display font-bold text-white text-sm mb-4">AI Agent Architecture</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Credit Agent', desc: 'ML + TOPSIS scoring', color: '#f97316', icon: '🧠' },
            { name: 'Doc Agent', desc: 'Checklist & guidance', color: '#22c55e', icon: '📋' },
            { name: 'Scheme Agent', desc: 'Govt scheme matcher', color: '#3b82f6', icon: '🏛️' },
            { name: 'Improve Agent', desc: 'Action recommendations', color: '#a855f7', icon: '📈' },
          ].map(a => (
            <div key={a.name} className="rounded-xl p-3 text-center"
                 style={{ background: `${a.color}10`, border: `1px solid ${a.color}25` }}>
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="font-display font-bold text-xs text-white">{a.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: a.color }} />
                <span className="text-xs" style={{ color: a.color }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
