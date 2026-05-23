/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  User, 
  Bot, 
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatbotProps {
  studentSubject?: string;
}

export default function AIChatbot({ studentSubject = "Science" }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello there! I am **TuitionAI**, your digital tuition teaching helper. \n\nI can resolve your school math problems, science questions, or language grammar doubts instantly! What are you studying specifically today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState(studentSubject);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textSend = customText || inputMessage;
    if (!textSend.trim()) return;

    const userMsg: Message = { role: 'user', content: textSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textSend,
          subject: subject,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Doubt solver failed.');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.text }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered a minor communication lag! Please double-check your connection or leave a message directly for your Teacher in our Tuition Chats tab.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChip = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
      {/* Bot Header */}
      <div className="bg-gradient-to-r from-indigo-900/80 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg ring-2 ring-indigo-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              TuitionAI Assistant
            </h3>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Doubts & Syllabus Solver</span>
          </div>
        </div>

        {/* Quick Subject Select Option */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-slate-950 text-indigo-400 text-xs font-bold border border-slate-800 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
        >
          <option value="Science">Science Hub</option>
          <option value="Mathematics">Mathematics Help</option>
          <option value="Social Science">Social Science</option>
          <option value="English">English / Grammar</option>
          <option value="Hindi">Hindi</option>
          <option value="EVS">EVS Hub</option>
        </select>
      </div>

      {/* Message window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60" id="doubt-chatbot-scroller">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 max-w-[85%] ${
              m.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {m.role === 'user' ? (
              <div className="bg-indigo-600 text-white p-2 rounded-xl flex items-center justify-center">
                <User className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="bg-slate-800 text-indigo-400 p-2 rounded-xl border border-slate-700 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            
            <div
              className={`p-3.5 text-xs rounded-2xl leading-relaxed font-normal whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                  : 'bg-slate-900 text-gray-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 pl-3">
            <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" />
            <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce delay-75" />
            <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce delay-150" />
            <span>Thinking science concepts & mathematical formulas...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested chips list */}
      <div className="px-4 py-2 border-t border-slate-950 flex flex-wrap gap-1.5 bg-slate-950">
        <span className="text-[10px] text-gray-500 block w-full mb-1 font-semibold">Suggested tuition questions:</span>
        {subject === 'Science' ? (
          <>
            <button
              onClick={() => handlePromptChip("Explain how water condensation cycle works.")}
              className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 text-gray-400 border border-slate-850 py-1 px-2 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
            >
              🌿 Water Cycle
            </button>
            <button
              onClick={() => handlePromptChip("What are the standard steps to prevent local environmental pollution?")}
              className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 text-gray-400 border border-slate-850 py-1 px-2 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
            >
              ♻️ Prevent Pollution
            </button>
          </>
        ) : subject === 'Mathematics' ? (
          <>
            <button
              onClick={() => handlePromptChip("How do I add fractions with different denominators?")}
              className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 text-gray-400 border border-slate-850 py-1 px-2 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
            >
              🧮 Fraction Addition
            </button>
            <button
              onClick={() => handlePromptChip("Explain cross multiplication of fractions step-by-step.")}
              className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 text-gray-400 border border-slate-850 py-1 px-2 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
            >
              ⚙️ Cross Multiplication
            </button>
          </>
        ) : subject === 'Social Science' ? (
          <>
            <button
              onClick={() => handlePromptChip("What are some historical landmark sites of the freedom struggle in India?")}
              className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 text-gray-400 border border-slate-850 py-1 px-2 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
            >
              🗺️ Freedom Struggle
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handlePromptChip("Explain the difference between singular and plural nouns with grammar exercises.")}
              className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 text-gray-400 border border-slate-850 py-1 px-2 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
            >
              📝 Singular/Plural
            </button>
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={`Submit ${subject} doubt question here...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputMessage.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition duration-150 active:scale-95 disabled:opacity-40 disabled:scale-100 cursor-pointer text-center flex items-center justify-center.5"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
