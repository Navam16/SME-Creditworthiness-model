# 🚀 Jarvis — SME Credit Enablement Platform

AI-powered creditworthiness assessment for Indian SMEs, featuring:
- **Hybrid ML + TOPSIS scoring** (Roy & Shaw 2021/2023 weights)
- **Government scheme discovery** with AI matching
- **Loan readiness checklist** and rejection risk analysis
- **Bilingual AI chatbot** (English + Hinglish)

---

## 📁 Project Structure

```
jarvis-sme/
├── frontend/          ← React + Vite (deploy to Vercel)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreditScore.jsx
│   │   │   ├── LoanReadiness.jsx
│   │   │   ├── GovernmentSchemes.jsx
│   │   │   └── ChatbotPage.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ChatbotWidget.jsx
│   │   └── hooks/
│   │       └── useSME.js
│   └── package.json
├── backend/           ← Express + Claude API (deploy to Render)
│   ├── src/
│   │   ├── index.js
│   │   └── routes/
│   │       ├── chat.js        ← Chatbot (Claude AI)
│   │       ├── assess.js      ← Credit scoring (TOPSIS engine)
│   │       └── schemes.js     ← Govt scheme AI matching
│   └── package.json
├── vercel.json
└── README.md
```

---

## ⚙️ Local Development

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY in .env
npm run dev
# Runs on http://localhost:4000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Deployment

### Backend → Render (Free tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
5. Environment Variables:
   ```
   ANTHROPIC_API_KEY = sk-ant-...
   FRONTEND_URL      = https://your-app.vercel.app
   PORT              = 4000
   ```
6. Deploy → Copy your Render URL (e.g. `https://jarvis-sme.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variables:
   ```
   VITE_API_URL = https://jarvis-sme.onrender.com
   ```
5. Deploy ✅

### Update vercel.json
After getting your Render URL, update `vercel.json`:
```json
{
  "src": "/api/(.*)",
  "dest": "https://jarvis-sme.onrender.com/api/$1"
}
```

---

## 🤖 AI Architecture

```
User Input
    │
    ├── Credit Assessment Agent    (/api/assess)
    │   ├── Quantitative: ML-style scoring (12 financial features)
    │   └── Qualitative: TOPSIS with 5 factors (Roy & Shaw weights)
    │
    ├── Scheme Discovery Agent     (/api/schemes)
    │   └── Claude AI: Profile-matched scheme recommendations
    │
    ├── Documentation Agent        (frontend rule engine)
    │   └── Dynamic checklist based on SME profile
    │
    └── Chatbot Agent             (/api/chat)
        └── Claude AI: Bilingual SME advisor
```

## 📊 TOPSIS Weights (Roy & Shaw 2021/2023)

| Factor          | Weight | Source |
|-----------------|--------|--------|
| Character       | 32%    | Roy & Shaw 2023 |
| Experience      | 26%    | Roy & Shaw 2021 |
| Transparency    | 18%    | Bhimani et al. 2013 |
| Asset Rootedness| 14%    | Roy & Shaw 2023 |
| SME Type        | 10%    | Roy & Shaw 2021 + Bhimani 2013 |

## 📝 Grade Bands

| Grade | Score | Recommendation |
|-------|-------|----------------|
| AAA   | 85+   | Approve at best rate |
| AA    | 75-85 | Approve, standard rate |
| A     | 65-75 | Approve with minor conditions |
| BBB   | 55-65 | Approve with collateral |
| BB    | 45-55 | Higher collateral required |
| B     | 35-45 | Conditional approval only |
| CCC   | 25-35 | Refer for detailed review |
| D     | <25   | Decline or require guarantor |

---

## 🔑 API Endpoints

| Method | Endpoint      | Description |
|--------|--------------|-------------|
| GET    | /api/health  | Health check |
| POST   | /api/assess  | Credit score assessment |
| POST   | /api/chat    | Chatbot message |
| POST   | /api/schemes | AI scheme discovery |

---

## 📚 References

- Roy, P.K. & Shaw, K. (2021). A multicriteria credit scoring model for SMEs using hybrid BWM and TOPSIS. *Financial Innovation*. https://doi.org/10.1186/s40854-021-00295-5
- Roy, P.K. & Shaw, K. (2023). A credit scoring model for SMEs using AHP and TOPSIS. *Int. J. Finance & Economics*, 28(1), 372–391.
- Bhimani, A., Gulamhussen, M.A., & Lopes, S. (2013). The role of financial, macroeconomic and non-financial information in bank loan default timing prediction. *European Accounting Review*.
- Altman, E.I. & Sabato, G. (2007). Modeling Credit Risk for SMEs: Evidence from the U.S. Market. *Abacus*, 43(3), 332–357.
