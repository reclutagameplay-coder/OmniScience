import React, { useState, useRef, useEffect } from 'react';
import { Subject, ChatMessage } from '../types';
import { SUBJECT_CONFIGS, LoadingSpinner } from '../constants';
import { solveProblem } from '../services/geminiService';

interface SolverProps {
  subject: Subject;
}

const Solver: React.FC<SolverProps> = ({ subject }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `¡Hola! Soy tu asistente de ${subject}. Plantéame cualquier problema, desde lo más básico hasta lo más complejo.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await solveProblem(subject, userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Lo siento, tuve problemas procesando esa solicitud. Por favor intenta de nuevo.',
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const config = SUBJECT_CONFIGS[subject];

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className={`p-4 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-xl font-bold text-white">Resolver {subject}</h2>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">
            Powered by Gemini 3.0 Pro (Thinking)
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 whitespace-pre-wrap ${
                msg.role === 'user'
                  ? `bg-gradient-to-r ${config.gradient} text-white`
                  : 'bg-slate-800 text-slate-200 border border-slate-700'
              } ${msg.isError ? 'border-red-500 text-red-100 bg-red-900/20' : ''}`}
            >
              {msg.role === 'model' ? (
                 /* Simple approach to render markdown-like content without heavy libraries */
                 msg.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0 min-h-[1rem]">
                        {line}
                    </p>
                 ))
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-800/80 border-t border-slate-700">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder={`Escribe tu problema de ${subject} aquí...`}
            className="w-full bg-slate-900 text-white rounded-xl py-3 pl-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
            rows={1}
            style={{ minHeight: '50px', maxHeight: '150px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute right-2 p-2 rounded-lg transition-colors ${
              !input.trim() || loading
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-blue-400 hover:bg-slate-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Shift + Enter para nueva línea. La IA puede cometer errores, verifica los resultados importantes.
        </p>
      </form>
    </div>
  );
};

export default Solver;
