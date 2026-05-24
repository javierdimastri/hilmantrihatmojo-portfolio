"use client";

import { useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function Conversation() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!prompt.trim()) return;
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: prompt };
    setMessages((s) => [...s, userMsg]);
    setPrompt('');
    setLoading(true);
    try {
      const res = await fetch('/api/genai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.text }),
      });
      const data = await res.json();

      // Try a few common response shapes from Google Generative API
      const aiText = data?.candidates?.[0]?.output
        ?? data?.candidates?.[0]?.content?.[0]?.text
        ?? data?.output?.[0]?.content?.map((c: any) => c.text).join(' ')
        ?? JSON.stringify(data);

      const aiMsg: Message = { id: String(Date.now() + 1), role: 'assistant', text: aiText };
      setMessages((s) => [...s, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = { id: String(Date.now() + 2), role: 'assistant', text: 'Error: ' + String(err) };
      setMessages((s) => [...s, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-4 max-h-[60vh] overflow-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">Start the conversation by typing below.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`p-3 rounded-md ${m.role === 'user' ? 'bg-blue-50 self-end' : 'bg-gray-100'}`}>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">{m.text}</div>
              <div className="text-xs text-gray-500 mt-1">{m.role}</div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="flex-1 border rounded-md px-3 py-2 resize-none"
          placeholder="Ask something..."
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
