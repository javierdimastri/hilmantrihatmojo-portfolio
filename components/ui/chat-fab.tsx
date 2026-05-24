"use client";

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import Conversation from './conversation';

export default function ChatFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <MessageCircle size={20} />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-6 bottom-20 z-50 w-96 max-w-full">
          <div className="bg-white border rounded-2xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Conversation</div>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-500 hover:text-gray-800">
                <X size={18} />
              </button>
            </div>
            <Conversation />
          </div>
        </div>
      )}
    </>
  );
}
