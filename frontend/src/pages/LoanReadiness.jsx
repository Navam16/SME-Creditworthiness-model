import React, { useState } from 'react'
import { useSME } from '../hooks/useSME'
import { FileCheck, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, Download, Info } from 'lucide-react'

const DOC_SETS = {
  base: {
    label: 'All SMEs — Required',
    color: '#f97316',
    docs: [
      { id:'pan', name:'PAN Card (Business & Promoter)', critical:true, tip:'Apply on NSDL if missing. Takes 7-10 days.' },
      { id:'gst', name:'GST Registration Certificate', critical:true, tip:'Register at gst.gov.in. Free and mandatory for turnover > ₹20L.' },
      { id:'itr', name:'ITR for last 2-3 years', critical:true, tip:'File pending ITRs immediately. Banks check 2-3 year history.' },
      { id:'bank', name:'Bank Statements (12 months)', critical:true, tip:'Ensure no cheque bounces in last 6 months.' },
      { id:'inc', name:'Business Incorporation / Registration', critical:true, tip:'MSME/Udyam registration gives additional benefits.' },
      { id:'adr', name:'Address Proof (Business premises)', critical:false, tip:'Utility bill, lease agreement, or property document.' },
      { id:'photo', name:'Passport size photographs', critical:false, tip:'Usually 2-4 photos required.' },
    ]
  },
  financial: {
    label: 'Financial Documents',
    color: '#22c55e',
    docs: [
      { id:'bs', name:'Balance Sheet (last 2 years)', critical:true, tip:'CA-certified preferred. Shows assets and liabilities.' },
      { id:'pl', name:'P&L Statement (last 2 years)', critical:true, tip:'Shows profitability trend — key for loan approval.' },
      { id:'proj', name:'Business Financial Projections (3 years)', critical:false, tip:'Show growth potential. Lenders value realistic projections.' },
      { id:'sal', name:'Sales invoices / Purchase bills', critical:false, tip:'Demonstrates business activity and revenue.' },
    ]
  },
  collateral: {
    label: 'Collateral Documents',
    color: '#3b82f6',
    docs: [
      { id:'prop', name:'Property documents (if pledging)', critical:false, tip:'Title deed, encumbrance certificate, latest tax receipt.' },
      { id:'val', name:'Valuation report', critical:false, tip:'From a registered valuer — banks may insist on their empanelled valuers.' },
      { id:'ins', name:'Insurance policies', critical:false, tip:'Life insurance and asset insurance add creditworthiness.' },
    ]
  }
}

const REJECTION_RISKS = [
  { risk:'Low CIBIL / Credit Score', severity:'high', fix:'Pay all EMIs on time for 6+ months. Check credit report for errors.' },
  { risk:'Insufficient Income Proof', severity:'high', fix:'Get income verified. File ITR if pending. Maintain proper books.' },
  { risk:'High DTI Ratio (> 50%)', severity:'high', fix:'Close existing loans before applying. Reduce credit card dues.' },
  { risk:'Short Business Vintage (< 2 yrs)', severity:'medium', fix:'Apply for MUDRA Shishu loan instead. Easier eligibility.' },
  { risk:'No GST Filing', severity:'high', fix:'Register for GST and file returns for at least 2 quarters before applying.' },
  { risk:'Cheque Bounces in Bank Statement', severity:'medium', fix:'Maintain minimum balance. Avoid ECS failures 6 months before applying.' },
  { risk:'Multiple Loan Applications', severity:'low', fix:'Avoid applying to multiple banks simultaneously — each inquiry hurts score.' },
]

export default function LoanReadiness() {
  const { smeProfile, creditResult } = useSME()
  const [checked, setChecked] = useState({})
  const [expanded, setExpanded] = useState({ base: true, financial: false, collateral: false })

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleSection(key) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const allDocs = Object.values(DOC_SETS).flatMap(s => s.docs)
  const criticalDocs = allDocs.filter(d => d.critical)
  const checkedCount = allDocs.filter(d => checked[d.id]).length
  const criticalDone = criticalDocs.filter(d => checked[d.id]).length
  const pct = Math.round((checkedCount / allDocs.length) * 100)
  const readinessLevel = pct >= 80 ? 'high' : pct >= 50 ? 'medium' : 'low'
  const readinessColor = { high:'#22c55e', medium:'#f97316', low:'#ef4444' }[readinessLevel]
  const readinessLabel = { high:'High Readiness', medium:'Moderate Readiness', low:'Low Readiness' }[readinessLevel]

  const TIMELINE = [
    { step:'Documents Ready', days:'Day 1-3', done: pct >= 80 },
    { step:'Application Submitted', days:'Day 3-5', done: false },
    { step:'Bank Verification', days:'Day 5-10', done: false },
    { step:'Credit Assessment', days:'Day 10-15', done: false },
    { step:'Sanction Letter', days:'Day 15-20', done: false },
    { step:'Disbursement', days:'Day 20-25', done: false },
  ]

  return (
    <div className="p-6 max-w-4xl animate-fade-in space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileCheck size={20} className="text-green-400" />
          <span className="font-display font-bold text-white">Loan Readiness & Documentation</span>
          <span className="tag tag-jade ml-2">Doc Agent</span>
        </div>
        <p className="text-sm text-slate-400">Track your documents, understand timelines, and avoid common rejection reasons</p>
      </div>

      {/* Readiness meter */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-display text-2xl font-bold" style={{ color: readinessColor }}>
              {pct}% Ready
            </div>
            <div className="text-sm text-slate-400">{readinessLabel} — {checkedCount}/{allDocs.length} documents</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-orange-400 font-display font-semibold">{criticalDone}/{criticalDocs.length}</div>
            <div className="text-xs text-slate-500">Critical docs</div>
          </div>
        </div>
        <div className="progress-bar h-3 rounded-full">
          <div className="progress-fill" style={{ width:`${pct}%`, background: `linear-gradient(90deg, ${readinessColor}, ${readinessColor}aa)` }} />
        </div>

        {pct >= 80 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
            <CheckCircle size={16} /> You're ready to apply! Expected processing: 15-20 working days
          </div>
        )}
        {pct < 50 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-orange-400">
            <AlertCircle size={16} /> Complete at least the critical documents before approaching a bank
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Document checklist */}
        <div className="lg:col-span-2 space-y-3">
          {Object.entries(DOC_SETS).map(([key, set]) => (
            <div key={key} className="glass-card overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: set.color }} />
                  <span className="font-display font-semibold text-white text-sm">{set.label}</span>
                  <span className="tag" style={{ background:`${set.color}15`, color:set.color, border:`1px solid ${set.color}25`, fontSize:'10px', fontFamily:'Syne', fontWeight:'600', padding:'2px 8px', borderRadius:'20px' }}>
                    {set.docs.filter(d => checked[d.id]).length}/{set.docs.length}
                  </span>
                </div>
                {expanded[key] ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
              </button>

              {expanded[key] && (
                <div className="border-t pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {set.docs.map(doc => (
                    <div key={doc.id}
                         className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                         onClick={() => toggle(doc.id)}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                        ${checked[doc.id] ? 'bg-green-500' : 'border border-slate-600'}`}>
                        {checked[doc.id] && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm ${checked[doc.id] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                          {doc.name}
                          {doc.critical && <span className="ml-1.5 tag tag-red" style={{ fontSize:'9px', padding:'1px 5px' }}>Critical</span>}
                        </div>
                        {!checked[doc.id] && (
                          <div className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                            <Info size={10} className="flex-shrink-0 mt-0.5" /> {doc.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Timeline */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-blue-400" />
              <h4 className="font-display font-bold text-white text-sm">Processing Timeline</h4>
            </div>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-700" />
              {TIMELINE.map((t, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-3 w-3 h-3 rounded-full border-2 ${t.done ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-600'}`} />
                  <div className="text-xs font-display font-semibold text-white">{t.step}</div>
                  <div className="text-xs text-slate-500 font-mono">{t.days}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rejection risks */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-orange-400" />
              <h4 className="font-display font-bold text-white text-sm">Common Rejection Risks</h4>
            </div>
            <div className="space-y-2">
              {REJECTION_RISKS.slice(0,4).map((r,i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${r.severity==='high'?'bg-red-400':r.severity==='medium'?'bg-orange-400':'bg-yellow-400'}`} />
                    <span className="text-xs font-display font-semibold text-white">{r.risk}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-3.5">{r.fix}</p>
                </div>
              ))}
              <div className="text-xs text-slate-500 text-center pt-1">+ {REJECTION_RISKS.length - 4} more risks</div>
            </div>
          </div>
        </div>
      </div>

      {/* All rejection risks */}
      <div className="glass-card p-5">
        <h4 className="font-display font-bold text-white text-sm mb-4">Full Rejection Risk Register</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REJECTION_RISKS.map((r,i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
              <div className={`tag mt-0.5 ${r.severity==='high'?'tag-red':r.severity==='medium'?'tag-saffron':'tag-blue'}`}>
                {r.severity}
              </div>
              <div>
                <div className="text-xs font-display font-semibold text-white">{r.risk}</div>
                <div className="text-xs text-slate-400 mt-0.5">💡 {r.fix}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
