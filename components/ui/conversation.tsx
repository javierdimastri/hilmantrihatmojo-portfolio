"use client";

import { useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function Conversation() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg: Message = { id: String(Date.now()), role: 'user', text: prompt.trim() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setPrompt('');
    setLoading(true);

    try {
      // Build history from all messages BEFORE the current user message
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/genai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.text, history }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const aiText: string = data.text ?? 'No response returned.';

      const aiMsg: Message = { id: String(Date.now() + 1), role: 'assistant', text: aiText };
      setMessages((s) => [...s, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        id: String(Date.now() + 2),
        role: 'assistant',
        text: '⚠️ Something went wrong. Please try again.',
      };
      setMessages((s) => [...s, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Simple markdown-like renderer for bold and bullet lists
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold: **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      // Bullet list line
      if (line.trimStart().startsWith('- ') || line.trimStart().startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 my-0.5">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{parts}</span>
          </div>
        );
      }
      return (
        <div key={i} className={line === '' ? 'h-2' : ''}>
          {parts}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 space-y-3 max-h-72 overflow-y-auto mb-3 pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-2xl mb-2">👋</div>
            <p className="text-sm text-gray-500 font-medium">Hi! Ask me anything about Hilman.</p>
            <p className="text-xs text-gray-400 mt-1">e.g. "Where does he work?" or "What are his skills?"</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 shrink-0">
                  H
                </div>
              )}
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {m.role === 'assistant' ? renderText(m.text) : m.text}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 shrink-0">
              H
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2 items-end border-t pt-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 max-h-24"
          placeholder="Ask about Hilman… (Enter to send)"
          style={{ minHeight: '38px' }}
        />
        <button
          onClick={send}
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
