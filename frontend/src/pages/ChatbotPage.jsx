import React from 'react'
import { MessageCircle } from 'lucide-react'
import ChatbotWidget from '../components/ChatbotWidget'

export default function ChatbotPage() {
  return (
    <div className="p-6 h-screen flex flex-col max-w-3xl animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={20} className="text-orange-400" />
          <span className="font-display font-bold text-white">Jarvis AI Chatbot</span>
          <span className="tag tag-saffron ml-2">Claude Powered</span>
        </div>
        <p className="text-sm text-slate-400">Ask anything about credit scores, loans, government schemes, or documents</p>
      </div>
      <div className="glass-card flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ChatbotWidget />
      </div>
    </div>
  )
}
