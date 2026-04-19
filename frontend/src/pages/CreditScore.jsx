import React, { useState } from 'react'
import { useSME } from '../hooks/useSME'
import { Star, ChevronRight, Loader, CheckCircle, Info } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts'
import toast from 'react-hot-toast'

const SECTORS = ['Manufacturing','Retail','Technology','Food & Beverage','Agriculture','Services','Construction','Healthcare','Textiles','Other']
const STATES  = ['Delhi','Maharashtra','Gujarat','Karnataka','Tamil Nadu','Rajasthan','Uttar Pradesh','West Bengal','Punjab','Other']

const GRADE_META = {
  'AAA': { color:'#22c55e', label:'Highly Creditworthy', rec:'Approve at best rate', emoji:'🌟' },
  'AA':  { color:'#4ade80', label:'Very Creditworthy',   rec:'Approve, standard rate', emoji:'✅' },
  'A':   { color:'#86efac', label:'Creditworthy',        rec:'Approve with minor conditions', emoji:'👍' },
  'BBB': { color:'#fbbf24', label:'Moderate Risk',       rec:'Approve with collateral', emoji:'⚠️' },
  'BB':  { color:'#fb923c', label:'Mod-High Risk',       rec:'Higher collateral required', emoji:'⚠️' },
  'B':   { color:'#f97316', label:'High Risk',           rec:'Conditional approval only', emoji:'🔶' },
  'CCC': { color:'#ef4444', label:'Very High Risk',      rec:'Refer for detailed review', emoji:'🔴' },
  'D':   { color:'#dc2626', label:'Default Risk',        rec:'Decline or require guarantor', emoji:'❌' },
}

export default function CreditScore() {
  const { setSmeProfile, setCreditResult, creditResult } = useSME()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    sector: '', state: '', turnover_range: '', years_operation: '',
    loan_amount: '', annual_income: '', dti: '', revol_util: '',
    open_accounts: '', total_accounts: '', delinquencies: '',
    pub_records: '', bankruptcies: '', inquiries: '',
    interest_rate: '', credit_history_years: '',
    emp_length: '< 1 year', home_ownership: 'RENT',
    verification: 'Not Verified', grade: 'C',
    // Qualitative
    q_character: 3, q_experience: 3, q_transparency: 3, q_asset: 3, q_sme_type: 3,
  })

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setCreditResult(data)
      setSmeProfile(form)
      setStep(3)
      toast.success('Assessment complete!')
    } catch {
      toast.error('Server error. Using demo mode.')
      // Demo fallback
      const demoResult = {
        credit_index: 71.4,
        grade: 'A',
        quant_score: 74.2,
        topsis_score: 66.8,
        default_prob: 25.8,
        qual_factors: {
          character: form.q_character, experience: form.q_experience,
          transparency: form.q_transparency, asset: form.q_asset, sme_type: form.q_sme_type
        },
        strengths: ['Good payment history', 'Verified income source', 'Stable employment'],
        improvements: ['Reduce revolving credit utilization', 'Build longer credit history', 'Reduce DTI ratio below 30%'],
        radar_data: [
          { factor: 'Character', score: form.q_character * 20 },
          { factor: 'Experience', score: form.q_experience * 20 },
          { factor: 'Transparency', score: form.q_transparency * 20 },
          { factor: 'Assets', score: form.q_asset * 20 },
          { factor: 'SME Type', score: form.q_sme_type * 20 },
        ]
      }
      setCreditResult(demoResult)
      setSmeProfile(form)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const QUAL_LABELS = [
    { key: 'q_character',    label: 'Character & Integrity',      desc: 'Payment discipline, no defaults' },
    { key: 'q_experience',   label: 'Business Experience',        desc: 'Years of operation, management quality' },
    { key: 'q_transparency', label: 'Financial Transparency',     desc: 'Books, GST filing, income verification' },
    { key: 'q_asset',        label: 'Asset Ownership',            desc: 'Property, machinery, collateral' },
    { key: 'q_sme_type',     label: 'Sector Risk Rating',         desc: 'Industry stability & growth potential' },
  ]

  const gradeMeta = creditResult ? (GRADE_META[creditResult.grade] || GRADE_META['BBB']) : null
  const gaugeAngle = creditResult ? ((creditResult.credit_index / 100) * 180) - 90 : -90

  return (
    <div className="p-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Star size={20} className="text-orange-400" />
          <span className="font-display font-bold text-white">Credit Score Assessment</span>
          <span className="tag tag-saffron ml-2">AI Agent</span>
        </div>
        <p className="text-sm text-slate-400">Hybrid ML + 5-Factor TOPSIS model based on Roy & Shaw (2023)</p>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-3">
          {[1,2,3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold
                ${step >= s ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {step > s ? <CheckCircle size={14} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 max-w-16 ${step > s ? 'bg-orange-500' : 'bg-slate-800'}`} />}
            </React.Fragment>
          ))}
          <div className="ml-2 text-xs text-slate-500">
            {step === 1 ? 'Business Profile' : step === 2 ? 'Qualitative Factors' : 'Your Results'}
          </div>
        </div>
      </div>

      {/* STEP 1: Business Profile */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-5 animate-slide-up">
          <h3 className="font-display font-bold text-white">Business & Financial Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Business Sector *</label>
              <select className="input-field" value={form.sector} onChange={e => update('sector', e.target.value)}>
                <option value="">Select sector</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">State *</label>
              <select className="input-field" value={form.state} onChange={e => update('state', e.target.value)}>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Annual Turnover (₹)</label>
              <input className="input-field" placeholder="e.g. 2500000" type="number"
                value={form.annual_income} onChange={e => update('annual_income', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Loan Amount Required (₹)</label>
              <input className="input-field" placeholder="e.g. 500000" type="number"
                value={form.loan_amount} onChange={e => update('loan_amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Debt-to-Income Ratio (%)</label>
              <input className="input-field" placeholder="e.g. 28" type="number"
                value={form.dti} onChange={e => update('dti', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Credit Card Utilization (%)</label>
              <input className="input-field" placeholder="e.g. 45" type="number"
                value={form.revol_util} onChange={e => update('revol_util', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Years in Business</label>
              <input className="input-field" placeholder="e.g. 5" type="number"
                value={form.years_operation} onChange={e => update('years_operation', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Credit History (years)</label>
              <input className="input-field" placeholder="e.g. 10" type="number"
                value={form.credit_history_years} onChange={e => update('credit_history_years', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Home Ownership</label>
              <select className="input-field" value={form.home_ownership} onChange={e => update('home_ownership', e.target.value)}>
                <option value="OWN">Own</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="RENT">Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Income Verification</label>
              <select className="input-field" value={form.verification} onChange={e => update('verification', e.target.value)}>
                <option>Verified</option>
                <option>Source Verified</option>
                <option>Not Verified</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Delinquencies (last 2 yrs)</label>
              <input className="input-field" placeholder="0" type="number"
                value={form.delinquencies} onChange={e => update('delinquencies', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-display">Credit Inquiries (last 6m)</label>
              <input className="input-field" placeholder="1" type="number"
                value={form.inquiries} onChange={e => update('inquiries', e.target.value)} />
            </div>
          </div>

          <button onClick={() => setStep(2)} className="btn-saffron flex items-center gap-2">
            Next: Qualitative Factors <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2: Qualitative Factors */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-display font-bold text-white">Qualitative Assessment</h3>
            <span className="tag tag-blue">5 TOPSIS Factors</span>
          </div>
          <p className="text-xs text-slate-400">Rate each factor on a scale of 1-5 based on your business situation. These follow Roy & Shaw (2023) weights.</p>

          <div className="space-y-5">
            {QUAL_LABELS.map(({ key, label, desc }, idx) => {
              const weights = [0.32, 0.26, 0.18, 0.14, 0.10]
              const pct = (weights[idx] * 100).toFixed(0)
              return (
                <div key={key} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-display font-bold text-sm text-white">{label}</div>
                      <div className="text-xs text-slate-500">{desc}</div>
                    </div>
                    <span className="tag tag-saffron">{pct}% weight</span>
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        onClick={() => update(key, v)}
                        className={`flex-1 h-10 rounded-lg text-sm font-display font-bold transition-all
                          ${form[key] === v
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'}`}
                        style={{ background: form[key] === v ? '' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1 px-1">
                    <span>Very Low</span><span>Excellent</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-saffron flex items-center gap-2 flex-1 justify-center">
              {loading ? <><Loader size={16} className="animate-spin" /> Analysing...</> : <>Generate Credit Score <Star size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Results */}
      {step === 3 && creditResult && gradeMeta && (
        <div className="space-y-5 animate-slide-up">
          {/* Score card */}
          <div className="glass-card p-6" style={{ borderColor: `${gradeMeta.color}40` }}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Gauge */}
              <div className="relative w-48 h-28 flex-shrink-0">
                <svg viewBox="0 0 200 120" className="w-full">
                  {/* Background arc */}
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" strokeLinecap="round" />
                  {/* Score arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={gradeMeta.color}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${251.2 * (creditResult.credit_index / 100)} 251.2`}
                    filter={`drop-shadow(0 0 8px ${gradeMeta.color}80)`}
                  />
                  {/* Needle */}
                  <g transform={`rotate(${gaugeAngle}, 100, 100)`}>
                    <line x1="100" y1="100" x2="100" y2="28" stroke={gradeMeta.color} strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="100" r="5" fill={gradeMeta.color} />
                  </g>
                  <text x="100" y="116" textAnchor="middle" fill={gradeMeta.color} fontSize="22" fontFamily="Syne" fontWeight="800">
                    {creditResult.credit_index}
                  </text>
                </svg>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="font-display text-5xl font-bold mb-1" style={{ color: gradeMeta.color }}>
                  {gradeMeta.emoji} Grade {creditResult.grade}
                </div>
                <div className="font-display text-lg font-semibold text-white">{gradeMeta.label}</div>
                <div className="text-sm text-slate-400 mt-1">{gradeMeta.rec}</div>

                <div className="flex gap-3 mt-4 flex-wrap justify-center md:justify-start">
                  <div className="text-center">
                    <div className="font-display text-xl font-bold text-white">{creditResult.quant_score}</div>
                    <div className="text-xs text-slate-500">ML Score</div>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <div className="font-display text-xl font-bold text-white">{creditResult.topsis_score}</div>
                    <div className="text-xs text-slate-500">TOPSIS Score</div>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <div className="font-display text-xl font-bold text-red-400">{creditResult.default_prob}%</div>
                    <div className="text-xs text-slate-500">Default Risk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar + Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h4 className="font-display font-bold text-white text-sm mb-3">Qualitative Factor Profile</h4>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={creditResult.radar_data || QUAL_LABELS.map((l,i)=>({ factor:l.label.split(' ')[0], score: form[l.key]*20 }))}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'DM Sans' }} />
                  <Radar dataKey="score" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <h4 className="font-display font-bold text-white text-sm mb-3">Score Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">ML Quantitative (60%)</span>
                    <span className="text-orange-400 font-mono">{creditResult.quant_score}/100</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${creditResult.quant_score}%`, background:'#f97316' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">TOPSIS Qualitative (40%)</span>
                    <span className="text-green-400 font-mono">{creditResult.topsis_score}/100</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${creditResult.topsis_score}%`, background:'#22c55e' }} />
                  </div>
                </div>
              </div>

              {creditResult.strengths?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-display font-bold text-green-400 mb-2">✓ Strengths</div>
                  {creditResult.strengths.map((s,i) => (
                    <div key={i} className="text-xs text-slate-400 mb-1">• {s}</div>
                  ))}
                </div>
              )}

              {creditResult.improvements?.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-display font-bold text-orange-400 mb-2">↑ Improvement Areas</div>
                  {creditResult.improvements.map((s,i) => (
                    <div key={i} className="text-xs text-slate-400 mb-1">• {s}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setStep(1)} className="btn-ghost text-sm">← Reassess with different inputs</button>
        </div>
      )}
    </div>
  )
}
