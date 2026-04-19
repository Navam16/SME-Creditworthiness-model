import React, { useState, useEffect } from 'react'
import { useSME } from '../hooks/useSME'
import { BookOpen, Filter, ExternalLink, ChevronDown, Search, Star, IndianRupee, Clock, FileCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const ALL_SCHEMES = [
  {
    id:1, name:'MUDRA Loan — Shishu', ministry:'Ministry of Finance',
    max_amount:'₹50,000', interest:'7-12%', tenure:'3-5 years',
    category:'Central', sectors:['All'], states:['All'],
    eligibility:['Business age < 1 year acceptable','No collateral required','Individual/Proprietorship'],
    documents:['Aadhaar','PAN','Business proof','Bank statement 6 months'],
    tag:'tag-jade', badge:'Most Popular',
    desc:'For new/micro businesses needing working capital. Easiest to get. No collateral.',
    link:'https://mudra.org.in'
  },
  {
    id:2, name:'MUDRA Loan — Kishor', ministry:'Ministry of Finance',
    max_amount:'₹5 Lakh', interest:'8-14%', tenure:'3-5 years',
    category:'Central', sectors:['All'], states:['All'],
    eligibility:['Business vintage 2+ years','Basic financials required','Micro/Small enterprise'],
    documents:['Aadhaar','PAN','ITR 2 years','Bank statement 12 months','Business registration'],
    tag:'tag-saffron', badge:'High Approval',
    desc:'For growing micro businesses. Moderate documentation. Good approval rate.',
    link:'https://mudra.org.in'
  },
  {
    id:3, name:'CGTMSE — Credit Guarantee', ministry:'MSME Ministry',
    max_amount:'₹2 Crore', interest:'Market rate', tenure:'7 years',
    category:'Central', sectors:['Manufacturing','Services','Retail'], states:['All'],
    eligibility:['Udyam registration mandatory','Profitable for 2 years','No NPA in last 2 years'],
    documents:['Udyam certificate','ITR 3 years','Balance sheet','Project report'],
    tag:'tag-blue', badge:'No Collateral',
    desc:'Collateral-free loans backed by govt guarantee. Best for SMEs without property.',
    link:'https://www.cgtmse.in'
  },
  {
    id:4, name:'PM SVANidhi — Street Vendors', ministry:'Housing & Urban Affairs',
    max_amount:'₹50,000', interest:'7%', tenure:'1 year',
    category:'Central', sectors:['Retail','Food & Beverage'], states:['All'],
    eligibility:['Street vendor/hawker','Vending certificate or LoR','Urban area'],
    documents:['Aadhaar','Vending certificate','Bank account'],
    tag:'tag-purple', badge:'Street Vendors',
    desc:'Specific to street vendors. Very low interest. Quick approval.',
    link:'https://pmsvanidhi.mohua.gov.in'
  },
  {
    id:5, name:'Startup India Seed Fund', ministry:'DPIIT',
    max_amount:'₹20 Lakh', interest:'0% (Grant)', tenure:'N/A',
    category:'Central', sectors:['Technology','Services'], states:['All'],
    eligibility:['DPIIT recognized startup','Less than 2 years old','Revenue < ₹25 Cr'],
    documents:['DPIIT certificate','Pitch deck','CA certificate','Bank statements'],
    tag:'tag-saffron', badge:'Grant/Equity',
    desc:'Equity or grant for early-stage DPIIT-registered startups. No repayment for grants.',
    link:'https://www.startupindia.gov.in'
  },
  {
    id:6, name:'MSME Samadhaan — Delayed Payment', ministry:'MSME Ministry',
    max_amount:'N/A (Recovery)', interest:'N/A', tenure:'N/A',
    category:'Central', sectors:['All'], states:['All'],
    eligibility:['MSME registered','Payment pending from large buyer','Udyam registration'],
    documents:['Udyam certificate','Invoice copies','Communication proof'],
    tag:'tag-red', badge:'Recovery',
    desc:'For recovering delayed payments from buyers. Legal recourse mechanism.',
    link:'https://samadhaan.msme.gov.in'
  },
  {
    id:7, name:'Maharashtra LEDP — SC/ST', ministry:'Maharashtra Govt',
    max_amount:'₹50 Lakh', interest:'4-6%', tenure:'7 years',
    category:'State', sectors:['Manufacturing','Services'], states:['Maharashtra'],
    eligibility:['SC/ST/OBC entrepreneur','Maharashtra resident','Business plan required'],
    documents:['Caste certificate','Aadhaar','ITR','Business plan','Bank statements'],
    tag:'tag-blue', badge:'Social Inclusion',
    desc:'Subsidized loans for SC/ST entrepreneurs in Maharashtra. Low interest.',
    link:'https://mahadbt.maharashtra.gov.in'
  },
  {
    id:8, name:'Gujarat MSME Assistance Scheme', ministry:'Gujarat Govt',
    max_amount:'₹1 Crore', interest:'5%', tenure:'5 years',
    category:'State', sectors:['Manufacturing','Textiles'], states:['Gujarat'],
    eligibility:['Gujarat-based enterprise','MSME registration','Minimum 2 years operation'],
    documents:['Udyam certificate','GST registration','ITR 2 years','Project DPR'],
    tag:'tag-jade', badge:'Manufacturing',
    desc:'For Gujarat manufacturers. Very competitive interest rates. Textile focus.',
    link:'https://ic.gujarat.gov.in'
  },
]

const SECTORS = ['All','Manufacturing','Retail','Technology','Services','Agriculture','Food & Beverage','Textiles','Healthcare','Construction']
const STATES  = ['All','Maharashtra','Gujarat','Karnataka','Tamil Nadu','Delhi','Rajasthan','Uttar Pradesh','West Bengal','Punjab']
const CATS    = ['All','Central','State']

export default function GovernmentSchemes() {
  const { smeProfile, creditResult } = useSME()
  const [search, setSearch] = useState('')
  const [filterSector, setFilterSector] = useState('All')
  const [filterState,  setFilterState]  = useState('All')
  const [filterCat,    setFilterCat]    = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [aiSchemes, setAiSchemes] = useState([])
  const [aiLoading, setAiLoading] = useState(false)

  // Auto-filter by profile
  useEffect(() => {
    if (smeProfile?.sector) setFilterSector(smeProfile.sector)
    if (smeProfile?.state)  setFilterState(smeProfile.state)
  }, [smeProfile])

  // AI scheme discovery
  async function fetchAISchemes() {
    if (!smeProfile) { toast.error('Please complete your credit assessment first'); return }
    setAiLoading(true)
    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: smeProfile, creditResult })
      })
      const data = await res.json()
      setAiSchemes(data.schemes || [])
      toast.success('AI found personalized schemes!')
    } catch {
      toast.error('Using local database')
    } finally {
      setAiLoading(false)
    }
  }

  const filtered = ALL_SCHEMES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
    const matchSector = filterSector === 'All' || s.sectors.includes('All') || s.sectors.includes(filterSector)
    const matchState  = filterState  === 'All' || s.states.includes('All')  || s.states.includes(filterState)
    const matchCat    = filterCat    === 'All' || s.category === filterCat
    return matchSearch && matchSector && matchState && matchCat
  })

  return (
    <div className="p-6 max-w-5xl animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-blue-400" />
            <span className="font-display font-bold text-white">Government Scheme Discovery</span>
            <span className="tag tag-blue ml-2">AI Agent</span>
          </div>
          <p className="text-sm text-slate-400">Central & State schemes matched to your SME profile</p>
        </div>
        <button
          onClick={fetchAISchemes}
          disabled={aiLoading}
          className="btn-saffron flex items-center gap-2 text-sm"
        >
          {aiLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Finding...</> : <>✨ AI Match Me</>}
        </button>
      </div>

      {/* AI personalized result */}
      {aiSchemes.length > 0 && (
        <div className="glass-card p-4" style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.05)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-orange-400" />
            <span className="font-display font-bold text-orange-400 text-sm">AI Personalized Recommendations</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{aiSchemes}</p>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes..."
              className="input-field pl-8 text-sm"
            />
          </div>
          <select className="input-field text-sm" value={filterSector} onChange={e => setFilterSector(e.target.value)}>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input-field text-sm" value={filterState} onChange={e => setFilterState(e.target.value)}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input-field text-sm" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            {CATS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Filter size={12} className="text-slate-500" />
          <span className="text-xs text-slate-500">{filtered.length} schemes matching your filters</span>
          {smeProfile && <span className="tag tag-saffron ml-2 text-xs">Filtered for {smeProfile.sector || 'your'} sector</span>}
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(scheme => (
          <div key={scheme.id} className="scheme-card">
            {/* Card header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`tag ${scheme.tag}`}>{scheme.badge}</span>
                  <span className="tag" style={{ background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.08)', fontSize:'10px', fontFamily:'Syne', fontWeight:'600', padding:'2px 8px', borderRadius:'20px' }}>
                    {scheme.category}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-sm leading-tight">{scheme.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{scheme.ministry}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{scheme.desc}</p>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { icon: IndianRupee, label:'Max Amount', val: scheme.max_amount },
                { icon: Star,        label:'Interest',   val: scheme.interest },
                { icon: Clock,       label:'Tenure',     val: scheme.tenure },
              ].map(({ icon:Icon, label, val }) => (
                <div key={label} className="text-center p-2 rounded-lg" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <Icon size={12} className="text-slate-500 mx-auto mb-1" />
                  <div className="text-xs font-mono text-white font-semibold">{val}</div>
                  <div className="text-xs text-slate-600">{label}</div>
                </div>
              ))}
            </div>

            {/* Expandable details */}
            <button
              onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
            >
              <span>Eligibility & Documents</span>
              <ChevronDown size={14} className={`transition-transform ${expanded === scheme.id ? 'rotate-180' : ''}`} />
            </button>

            {expanded === scheme.id && (
              <div className="mt-3 pt-3 border-t space-y-3 animate-fade-in" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="text-xs font-display font-bold text-white mb-2">✓ Eligibility</div>
                  {scheme.eligibility.map((e,i) => (
                    <div key={i} className="text-xs text-slate-400 flex items-start gap-1.5 mb-1">
                      <span className="text-green-400 mt-0.5">•</span> {e}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-display font-bold text-white mb-2">
                    <FileCheck size={12} className="inline mr-1" />Documents Required
                  </div>
                  {scheme.documents.map((d,i) => (
                    <div key={i} className="text-xs text-slate-400 flex items-start gap-1.5 mb-1">
                      <span className="text-orange-400 mt-0.5">•</span> {d}
                    </div>
                  ))}
                </div>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-saffron flex items-center gap-1.5 text-xs justify-center"
                  onClick={e => e.stopPropagation()}
                >
                  Apply on Official Portal <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-10 text-center">
          <div className="text-3xl mb-3">🔍</div>
          <div className="font-display font-bold text-white">No schemes found</div>
          <div className="text-sm text-slate-400 mt-1">Try clearing filters or searching differently</div>
        </div>
      )}
    </div>
  )
}
