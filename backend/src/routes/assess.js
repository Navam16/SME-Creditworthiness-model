import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── TOPSIS Configuration ────────────────────────────────────────────
// Roy & Shaw (2021, 2023) weights
const TOPSIS_WEIGHTS = {
  character:    0.32,
  experience:   0.26,
  transparency: 0.18,
  asset:        0.14,
  sme_type:     0.10,
}

const GRADE_BANDS = [
  { min: 85, grade: 'AAA', label: 'Highly Creditworthy',  rec: 'Approve at best rate' },
  { min: 75, grade: 'AA',  label: 'Very Creditworthy',    rec: 'Approve, standard rate' },
  { min: 65, grade: 'A',   label: 'Creditworthy',         rec: 'Approve with minor conditions' },
  { min: 55, grade: 'BBB', label: 'Moderate Risk',        rec: 'Approve with collateral' },
  { min: 45, grade: 'BB',  label: 'Moderate-High Risk',   rec: 'Higher collateral required' },
  { min: 35, grade: 'B',   label: 'High Risk',            rec: 'Conditional approval only' },
  { min: 25, grade: 'CCC', label: 'Very High Risk',       rec: 'Refer for detailed review' },
  { min: 0,  grade: 'D',   label: 'Default Risk',         rec: 'Decline or require guarantor' },
]

function assignGrade(score) {
  return GRADE_BANDS.find(b => score >= b.min) || GRADE_BANDS[GRADE_BANDS.length - 1]
}

// ─── Compute TOPSIS closeness coefficient ────────────────────────────
function computeTOPSIS(charVal, expVal, transpVal, assetVal, smeTypeVal) {
  const factors = [charVal, expVal, transpVal, assetVal, smeTypeVal]
  const weights = Object.values(TOPSIS_WEIGHTS)

  // Normalize (single-row: just divide by the value itself * sqrt(n) approx)
  const norm = factors.map((v, i) => v / (Math.sqrt(factors.reduce((s, x) => s + x * x, 0)) + 1e-10))
  const weighted = norm.map((v, i) => v * weights[i])

  // PIS & NIS: 1-5 scale, higher is better for all
  // Use reference population: [5,5,5,5,5] = best, [1,1,1,1,1] = worst
  const pisVec = weights.map((w, i) => (5 / Math.sqrt(5 * 25)) * w)
  const nisVec = weights.map((w, i) => (1 / Math.sqrt(5 * 1))  * w)

  const dp = Math.sqrt(weighted.reduce((s, v, i) => s + Math.pow(v - pisVec[i], 2), 0))
  const dn = Math.sqrt(weighted.reduce((s, v, i) => s + Math.pow(v - nisVec[i], 2), 0))

  return dn / (dp + dn + 1e-10)
}

// ─── Quantitative scoring (ML simulation) ────────────────────────────
function computeQuantScore(form) {
  const {
    loan_amount = 500000,
    annual_income = 1000000,
    dti = 30,
    revol_util = 50,
    open_accounts = 5,
    total_accounts = 10,
    delinquencies = 0,
    pub_records = 0,
    bankruptcies = 0,
    inquiries = 1,
    credit_history_years = 5,
    home_ownership = 'RENT',
    verification = 'Not Verified',
    grade = 'C',
  } = form

  let score = 70 // base

  // DTI adjustment
  const dtiNum = parseFloat(dti) || 30
  if (dtiNum < 20) score += 10
  else if (dtiNum < 30) score += 5
  else if (dtiNum > 50) score -= 15
  else if (dtiNum > 40) score -= 8

  // Revolving utilization
  const revUtil = parseFloat(revol_util) || 50
  if (revUtil < 20) score += 8
  else if (revUtil < 40) score += 3
  else if (revUtil > 70) score -= 12
  else if (revUtil > 55) score -= 6

  // Delinquencies
  const delinq = parseInt(delinquencies) || 0
  if (delinq === 0) score += 10
  else if (delinq <= 1) score += 2
  else if (delinq <= 3) score -= 8
  else score -= 18

  // Public records
  const pubRec = parseInt(pub_records) || 0
  const bankr  = parseInt(bankruptcies) || 0
  if (pubRec === 0 && bankr === 0) score += 5
  else if (bankr > 0) score -= 20
  else score -= 10

  // Credit history
  const histYrs = parseFloat(credit_history_years) || 5
  if (histYrs > 15) score += 8
  else if (histYrs > 10) score += 5
  else if (histYrs > 5) score += 2
  else if (histYrs < 2) score -= 8

  // Grade
  const gradeMap = { A: 12, B: 8, C: 2, D: -5, E: -10, F: -15, G: -20 }
  score += (gradeMap[grade] || 0)

  // Verification
  if (verification === 'Verified') score += 5
  else if (verification === 'Source Verified') score += 2
  else score -= 3

  // Home ownership
  if (home_ownership === 'OWN') score += 4
  else if (home_ownership === 'MORTGAGE') score += 2

  // Inquiries
  const inq = parseInt(inquiries) || 0
  if (inq > 4) score -= 8
  else if (inq > 2) score -= 4

  // Loan-to-income ratio
  const lti = (parseFloat(loan_amount) || 500000) / ((parseFloat(annual_income) || 1000000) + 1)
  if (lti < 0.3) score += 5
  else if (lti > 1) score -= 10
  else if (lti > 0.7) score -= 5

  return Math.max(5, Math.min(98, score))
}

function generateStrengths(form, quantScore, topsisScore) {
  const strengths = []
  const { delinquencies = 0, pub_records = 0, bankruptcies = 0, verification, home_ownership, dti = 30, revol_util = 50, q_character, q_experience } = form

  if (parseInt(delinquencies) === 0 && parseInt(pub_records) === 0) strengths.push('Clean payment history — no delinquencies or public records')
  if (verification === 'Verified') strengths.push('Income fully verified — reduces lender risk perception')
  if (parseFloat(dti) < 30) strengths.push(`Low DTI ratio (${dti}%) — strong debt management`)
  if (parseFloat(revol_util) < 30) strengths.push('Low credit utilization — signals responsible credit use')
  if (home_ownership === 'OWN') strengths.push('Property ownership strengthens collateral position')
  if (parseInt(q_experience) >= 4) strengths.push('Strong business/management experience record')
  if (quantScore >= 70) strengths.push('Above-average quantitative creditworthiness score')
  if (topsisScore >= 65) strengths.push('Strong qualitative profile across TOPSIS factors')

  return strengths.slice(0, 4)
}

function generateImprovements(form) {
  const improvements = []
  const { dti = 30, revol_util = 50, delinquencies = 0, verification, credit_history_years = 5, inquiries = 1 } = form

  if (parseFloat(dti) > 40)     improvements.push(`Reduce DTI from ${dti}% to below 35% by paying down existing loans`)
  if (parseFloat(revol_util) > 50) improvements.push(`Lower credit card utilization from ${revol_util}% to under 30%`)
  if (parseInt(delinquencies) > 0)  improvements.push('Clear all outstanding dues and maintain on-time payments for 6+ months')
  if (verification !== 'Verified')  improvements.push('Get income fully verified — file ITR and maintain clean books')
  if (parseFloat(credit_history_years) < 5) improvements.push('Build credit history — use credit cards responsibly and maintain accounts')
  if (parseInt(inquiries) > 3)      improvements.push('Avoid multiple loan applications — each inquiry reduces score temporarily')

  improvements.push('Register on Udyam (MSME) portal to access collateral-free CGTMSE scheme')
  return improvements.slice(0, 4)
}

// ─── Main assessment route ────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const form = req.body

    // Qualitative inputs (default 3 if not provided)
    const charVal    = parseFloat(form.q_character)    || 3
    const expVal     = parseFloat(form.q_experience)   || 3
    const transpVal  = parseFloat(form.q_transparency) || 3
    const assetVal   = parseFloat(form.q_asset)        || 3
    const smeTypeVal = parseFloat(form.q_sme_type)     || 3

    // Compute scores
    const topsisCC   = computeTOPSIS(charVal, expVal, transpVal, assetVal, smeTypeVal)
    const topsisScore = parseFloat((topsisCC * 100).toFixed(1))
    const quantScore  = parseFloat(computeQuantScore(form).toFixed(1))
    const defaultProb = parseFloat((100 - quantScore).toFixed(1))
    const creditIndex = parseFloat((0.60 * quantScore + 0.40 * topsisScore).toFixed(1))

    const gradeMeta = assignGrade(creditIndex)
    const strengths    = generateStrengths(form, quantScore, topsisScore)
    const improvements = generateImprovements(form)

    // Radar data for frontend chart
    const radarData = [
      { factor: 'Character',    score: charVal * 20 },
      { factor: 'Experience',   score: expVal * 20 },
      { factor: 'Transparency', score: transpVal * 20 },
      { factor: 'Assets',       score: assetVal * 20 },
      { factor: 'SME Type',     score: smeTypeVal * 20 },
    ]

    res.json({
      credit_index:  creditIndex,
      grade:         gradeMeta.grade,
      grade_label:   gradeMeta.label,
      recommendation: gradeMeta.rec,
      quant_score:   quantScore,
      topsis_score:  topsisScore,
      default_prob:  defaultProb,
      qual_factors: { character: charVal, experience: expVal, transparency: transpVal, asset: assetVal, sme_type: smeTypeVal },
      radar_data:    radarData,
      strengths,
      improvements,
    })
  } catch (err) {
    console.error('Assessment error:', err.message)
    res.status(500).json({ error: 'Assessment failed', details: err.message })
  }
})

export default router
