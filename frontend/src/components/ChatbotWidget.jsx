import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react'

const QUICK_PROMPTS = [
  'मेरा loan reject क्यों हो रहा है?',
  'Loan ke liye kaunse documents chahiye?',
  'Mere sector ke liye govt scheme hai kya?',
  'How to improve my credit score?',
]

const SYSTEM_PROMPT = `You are Jarvis, an AI assistant for Indian SMEs (Small and Medium Enterprises). You help with:
1. Credit score assessment and improvement
2. Loan documentation guidance  
3. Government scheme discovery (MUDRA, CGTMSE, PM SVANidhi, MSME schemes, etc.)
4. General SME financial advice

Respond in simple, friendly language. If the user writes in Hindi/Hinglish, respond in Hinglish. Be concise and practical. 
For credit scores: explain what factors affect them.
For documents: give specific lists.
For schemes: mention MUDRA, CGTMSE, Startup India, PM SVANidhi, state-specific schemes.
Always end with an actionable next step.`

export default function ChatbotWidget({ embedded = false, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 Main Jarvis hoon, aapka SME credit assistant. Aap mujhse apne loan, credit score, ya government schemes ke baare mein kuch bhi pooch sakte hain!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    const userText = text || input.trim()
    if (!userText) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userText }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userText }],
          system: SYSTEM_PROMPT
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, network issue. Please try again! 🙏'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3"
           style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(249,115,22,0.08)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <div className="font-display font-bold text-white text-sm">Jarvis AI</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            Online · SME Expert
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-message flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs
              ${m.role === 'user'
                ? 'bg-orange-500'
                : 'bg-slate-700'}`}>
              {m.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-orange-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed
              ${m.role === 'user'
                ? 'bg-orange-500 text-white rounded-tr-sm'
                : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}
                 style={{ fontFamily: 'DM Sans' }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
              <Bot size={14} className="text-orange-400" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-2">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"
                       style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length < 3 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p)}
              className="text-xs px-2 py-1 rounded-full border transition-colors"
              style={{ borderColor: 'rgba(249,115,22,0.3)', color: '#fb923c', fontFamily: 'DM Sans',
                       background: 'rgba(249,115,22,0.06)' }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your question..."
            className="input-field text-sm"
            style={{ flex: 1 }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-saffron px-3 py-2 flex items-center disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
