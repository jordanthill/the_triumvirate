"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  color: string;
}

const MEMBER_COLORS: Record<string, string> = {
  Jordan: "text-indigo-400",
  Brian: "text-emerald-400",
  James: "text-amber-400",
  Guest: "text-pink-400",
};

const AVATARS: Record<string, string> = {
  Jordan: "bg-indigo-500/20 text-indigo-400",
  Brian: "bg-emerald-500/20 text-emerald-400",
  James: "bg-amber-500/20 text-amber-400",
  Guest: "bg-pink-500/20 text-pink-400",
};

const STORAGE_KEY = "triumvirate-chat";

const SEED_MESSAGES: Message[] = [
  {
    id: "seed-1",
    author: "Jordan",
    text: "Welcome to The Triumvirate chat wall! Leave a message for everyone to see.",
    timestamp: Date.now() - 86400000 * 2,
    color: "text-indigo-400",
  },
  {
    id: "seed-2",
    author: "Brian",
    text: "This site is coming along nicely. Can't wait to build out my section!",
    timestamp: Date.now() - 86400000,
    color: "text-emerald-400",
  },
  {
    id: "seed-3",
    author: "James",
    text: "The heatmap is so cool. We need to add more stuff like that.",
    timestamp: Date.now() - 3600000 * 5,
    color: "text-amber-400",
  },
];

function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("Jordan");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        setMessages(SEED_MESSAGES);
      }
    } else {
      setMessages(SEED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const msg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author,
      text: trimmed,
      timestamp: Date.now(),
      color: MEMBER_COLORS[author] || MEMBER_COLORS.Guest,
    };

    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setText("");
  };

  const clearChat = () => {
    setMessages(SEED_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Home
        </Link>
        <h1 className="text-2xl font-bold text-white">Chat Wall</h1>
        <span className="text-xs text-gray-600 ml-auto">{messages.length} messages</span>
      </div>

      <p className="text-sm text-gray-500">
        A shared message board for The Triumvirate. Messages are saved in your browser.
      </p>

      {/* Messages */}
      <div className="space-y-1 glass rounded-2xl p-4 max-h-[500px] overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 py-2 group">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                AVATARS[msg.author] || AVATARS.Guest
              }`}
            >
              {msg.author[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-semibold ${msg.color}`}>
                  {msg.author}
                </span>
                <span className="text-[10px] text-gray-600">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-300 break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-4 space-y-3">
        {/* Author picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Posting as:</span>
          <div className="flex gap-1">
            {["Jordan", "Brian", "James", "Guest"].map((name) => (
              <button
                key={name}
                onClick={() => setAuthor(name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  author === name
                    ? "bg-white text-gray-900"
                    : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={clearChat}
            className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
          >
            Reset chat
          </button>
        </div>
      </div>
    </div>
  );
}
