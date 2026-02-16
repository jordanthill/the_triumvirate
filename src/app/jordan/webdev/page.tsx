"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Shared Styles ─────────────────────────────────────────────────────────────

const demoBox = "rounded-xl bg-gray-900 border border-white/10 p-4";
const demoLabel = "text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium";

// ─── Demo Components ───────────────────────────────────────────────────────────

function GlassmorphismDemo() {
  return (
    <div
      className="relative h-36 rounded-xl overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
      }}
    >
      <div
        className="px-6 py-4 rounded-xl text-center"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <p className="text-white font-semibold text-sm">Glassmorphism Card</p>
        <p className="text-white/70 text-xs mt-1">Frosted glass effect</p>
      </div>
    </div>
  );
}

function GradientTextDemo() {
  return (
    <div className="flex flex-col items-center justify-center h-36 gap-3">
      <p
        className="text-4xl font-bold"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #ef4444, #ec4899, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Hello World
      </p>
      <p
        className="text-sm font-medium animate-gradient"
        style={{
          background: "linear-gradient(90deg, #6ee7b7, #3b82f6, #a78bfa, #6ee7b7)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Animated gradient text
      </p>
    </div>
  );
}

function KeyframeDemo() {
  const [animation, setAnimation] = useState<"bounce" | "spin" | "pulse" | "float">("bounce");
  const styles: Record<string, React.CSSProperties> = {
    bounce: { animation: "bounce 1s ease-in-out infinite" },
    spin: { animation: "spin 1.2s linear infinite" },
    pulse: { animation: "pulse 1.5s ease-in-out infinite" },
    float: { animation: "float 2s ease-in-out infinite" },
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-16 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"
          style={styles[animation]}
        />
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {(["bounce", "spin", "pulse", "float"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAnimation(a)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              animation === a
                ? "bg-indigo-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

function TransitionDemo() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex items-center justify-center h-32 gap-6">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
          transform: hovered ? "translateY(-6px) scale(1.05)" : "translateY(0) scale(1)",
          boxShadow: hovered ? "0 20px 40px rgba(99, 102, 241, 0.4)" : "0 0 0 rgba(0,0,0,0)",
          background: hovered
            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
            : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "1rem 2rem",
          borderRadius: "0.75rem",
          cursor: "pointer",
        }}
        className="text-sm font-medium text-white select-none"
      >
        Hover me
      </div>
      <div className="text-xs text-gray-500 max-w-[100px] leading-relaxed">
        {hovered ? "↑ Lifted state" : "Hover the card to see the transition"}
      </div>
    </div>
  );
}

function CSSGridDemo() {
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const colors = [
    "from-indigo-500/30 to-purple-500/30",
    "from-pink-500/30 to-rose-500/30",
    "from-cyan-500/30 to-blue-500/30",
    "from-amber-500/30 to-orange-500/30",
    "from-emerald-500/30 to-teal-500/30",
    "from-violet-500/30 to-fuchsia-500/30",
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Columns:</span>
        {([2, 3, 4] as const).map((n) => (
          <button
            key={n}
            onClick={() => setCols(n)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              cols === n ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div
        className="gap-2"
        style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            className={`h-10 rounded-lg bg-gradient-to-br ${c} border border-white/10 flex items-center justify-center text-xs text-white/60`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlexboxDemo() {
  const [justify, setJustify] = useState("space-between");
  const [align, setAlign] = useState("center");
  const justifyOptions = ["flex-start", "center", "flex-end", "space-between", "space-around"];
  const alignOptions = ["flex-start", "center", "flex-end", "stretch"];
  return (
    <div className="space-y-3">
      <div className="flex gap-4 flex-wrap text-xs">
        <div className="space-y-1">
          <p className="text-gray-500">justify-content</p>
          <div className="flex gap-1 flex-wrap">
            {justifyOptions.map((j) => (
              <button
                key={j}
                onClick={() => setJustify(j)}
                className={`px-2 py-0.5 rounded text-xs transition-all ${
                  justify === j ? "bg-pink-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {j.replace("flex-", "")}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">align-items</p>
          <div className="flex gap-1 flex-wrap">
            {alignOptions.map((a) => (
              <button
                key={a}
                onClick={() => setAlign(a)}
                className={`px-2 py-0.5 rounded text-xs transition-all ${
                  align === a ? "bg-pink-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {a.replace("flex-", "")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className="h-16 rounded-lg bg-white/[0.03] border border-white/10 px-3"
        style={{ display: "flex", justifyContent: justify, alignItems: align, gap: "0.5rem" }}
      >
        {["A", "B", "C"].map((l, i) => (
          <div
            key={l}
            className="w-8 rounded bg-pink-500/40 border border-pink-400/30 flex items-center justify-center text-xs text-white font-medium"
            style={{ height: i === 1 ? "32px" : "24px" }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function CSSVariablesDemo() {
  const [color, setColor] = useState("#6366f1");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--demo-primary", color);
    }
  }, [color]);

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="flex items-center gap-3 text-xs">
        <span className="text-gray-400">--primary-color:</span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        />
        <code className="text-gray-300 font-mono">{color}</code>
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-80"
          style={{ background: "var(--demo-primary, #6366f1)" }}
        >
          Primary Button
        </button>
        <div
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            border: "1.5px solid var(--demo-primary, #6366f1)",
            color: "var(--demo-primary, #6366f1)",
          }}
        >
          Outlined
        </div>
        <div
          className="w-10 h-10 rounded-full"
          style={{ background: `${color}30`, border: `1.5px solid ${color}80` }}
        />
      </div>
    </div>
  );
}

function ScrollSnapDemo() {
  const cards = [
    { label: "Slide 1", color: "from-indigo-600 to-purple-600" },
    { label: "Slide 2", color: "from-pink-600 to-rose-600" },
    { label: "Slide 3", color: "from-cyan-600 to-blue-600" },
    { label: "Slide 4", color: "from-amber-600 to-orange-600" },
  ];
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Scroll horizontally →</p>
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            className={`flex-shrink-0 w-40 h-24 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-semibold text-sm`}
            style={{ scrollSnapAlign: "start" }}
          >
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: "What is the DOM?", a: "The Document Object Model is a tree-structured API that lets JavaScript read and manipulate HTML elements, attributes, and styles on a live webpage." },
    { q: "What is a CSS specificity?", a: "Specificity is a weight given to CSS selectors. Inline styles beat IDs, which beat classes, which beat elements. The browser uses it to decide which rule wins." },
    { q: "What does async/await do?", a: "async/await is syntactic sugar over Promises. It lets you write asynchronous code that reads like synchronous code, pausing at each await until the Promise resolves." },
  ];
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors text-left"
          >
            <span>{item.q}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-4 pb-3 text-sm text-gray-400 leading-relaxed border-t border-white/5">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-center h-24">
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 rounded-full bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium transition-colors"
      >
        Open Modal
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-white font-semibold text-lg">Modal Dialog</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modals trap focus and overlay the rest of the page. Click outside or the ✕ to close.
              The HTML5 <code className="text-violet-300">&lt;dialog&gt;</code> element handles this natively.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToastDemo() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" | "info" }[]>([]);
  const counter = useRef(0);

  const addToast = (type: "success" | "error" | "info") => {
    const messages = {
      success: "Changes saved successfully!",
      error: "Something went wrong. Try again.",
      info: "New update available.",
    };
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message: messages[type], type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const typeStyles = {
    success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    error: "border-red-400/30 bg-red-500/10 text-red-300",
    info: "border-blue-400/30 bg-blue-500/10 text-blue-300",
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {(["success", "error", "info"] as const).map((t) => (
          <button
            key={t}
            onClick={() => addToast(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:opacity-80 ${typeStyles[t]}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="relative h-12">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`absolute bottom-0 left-0 px-3 py-2 rounded-lg border text-xs font-medium ${typeStyles[toast.type]}`}
            style={{ animation: "float 0.3s ease-out" }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="space-y-3">
      <button
        onClick={() => setLoading((l) => !l)}
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
      >
        Toggle: {loading ? "Loading" : "Loaded"}
      </button>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
          {!loading && <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">JD</div>}
          {loading && <div className="w-full h-full skeleton-shimmer" />}
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 rounded-full overflow-hidden" style={{ width: loading ? "60%" : "auto" }}>
            {loading ? <div className="h-full skeleton-shimmer" /> : <span className="text-sm text-white font-medium">Jordan Developer</span>}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ width: loading ? "80%" : "auto" }}>
            {loading ? <div className="h-full skeleton-shimmer" /> : <span className="text-xs text-gray-400">Full-stack engineer · San Francisco</span>}
          </div>
        </div>
      </div>
      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

function ClipboardDemo() {
  const [copied, setCopied] = useState(false);
  const text = "navigator.clipboard.writeText(text)";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-2 h-20">
      <code className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-xs text-green-300 font-mono truncate">
        {text}
      </code>
      <button
        onClick={handleCopy}
        className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
          copied ? "bg-emerald-500 text-white" : "bg-white/5 hover:bg-white/10 text-gray-300"
        }`}
      >
        {copied ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );
}

function IntersectionObserverDemo() {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible((prev) => new Set([...prev, i]));
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const reset = () => setVisible(new Set());

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Scroll down inside the box →</p>
        <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Reset</button>
      </div>
      <div className="h-32 overflow-y-auto rounded-lg bg-gray-800/50 border border-white/10 p-3 space-y-2">
        {[1, 2, 3, 4, 5].map((n, i) => (
          <div
            key={n}
            ref={(el) => { refs.current[i] = el; }}
            style={{
              opacity: visible.has(i) ? 1 : 0,
              transform: visible.has(i) ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
            className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/20 text-xs text-indigo-300"
          >
            Element {n} — entered viewport
          </div>
        ))}
      </div>
    </div>
  );
}

function LocalStorageDemo() {
  const KEY = "webdev-demo-name";
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setValue(stored);
  }, []);

  const save = () => {
    localStorage.setItem(KEY, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clear = () => {
    localStorage.removeItem(KEY);
    setValue("");
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Type a name — it persists across page refreshes.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your name…"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500/50"
        />
        <button
          onClick={save}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-indigo-500 hover:bg-indigo-400 text-white"
          }`}
        >
          {saved ? "Saved!" : "Save"}
        </button>
        <button
          onClick={clear}
          className="px-3 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
        >
          Clear
        </button>
      </div>
      {value && (
        <p className="text-xs text-gray-500">
          Stored: <code className="text-amber-300 font-mono">{`localStorage.getItem("webdev-demo-name") → "${value}"`}</code>
        </p>
      )}
    </div>
  );
}

function DragDropDemo() {
  const [cols, setCols] = useState<{ [key: string]: string[] }>({
    todo: ["Design mockup", "Write tests"],
    done: ["Set up project", "Add routing"],
  });
  const dragging = useRef<{ item: string; from: string } | null>(null);

  const onDragStart = (item: string, from: string) => {
    dragging.current = { item, from };
  };

  const onDrop = (to: string) => {
    if (!dragging.current || dragging.current.from === to) return;
    const { item, from } = dragging.current;
    setCols((prev) => ({
      ...prev,
      [from]: prev[from].filter((i) => i !== item),
      [to]: [...prev[to], item],
    }));
    dragging.current = null;
  };

  return (
    <div className="flex gap-3">
      {(["todo", "done"] as const).map((col) => (
        <div
          key={col}
          className="flex-1 rounded-xl bg-gray-800/50 border border-white/10 p-3 space-y-2 min-h-[100px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(col)}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {col === "todo" ? "To Do" : "Done"}
          </p>
          {cols[col].map((item) => (
            <div
              key={item}
              draggable
              onDragStart={() => onDragStart(item, col)}
              className="px-3 py-2 rounded-lg bg-gray-700/60 border border-white/10 text-xs text-gray-300 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors"
            >
              {item}
            </div>
          ))}
          {cols[col].length === 0 && (
            <div className="text-xs text-gray-600 text-center py-3">Drop here</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

type Demo = {
  id: string;
  title: string;
  tag: string;
  lang: string;
  description: string;
  component: React.ReactNode;
  code: string;
};

type Category = {
  id: string;
  label: string;
  color: string;
  demos: Demo[];
};

const categories: Category[] = [
  {
    id: "css",
    label: "CSS Effects",
    color: "indigo",
    demos: [
      {
        id: "glass",
        title: "Glassmorphism",
        tag: "backdrop-filter",
        lang: "CSS",
        description:
          "Creates a frosted-glass look by blurring the content behind an element. Relies on backdrop-filter: blur() with a semi-transparent background.",
        component: <GlassmorphismDemo />,
        code: `.glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
      },
      {
        id: "gradient-text",
        title: "Gradient Text",
        tag: "background-clip: text",
        lang: "CSS",
        description:
          "Paints a gradient onto text by setting a gradient as the background, then clipping it to the text shape with background-clip: text.",
        component: <GradientTextDemo />,
        code: `.gradient-text {
  background: linear-gradient(
    135deg, #f59e0b, #ef4444, #ec4899
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animated version */
.gradient-text-animated {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}`,
      },
      {
        id: "keyframes",
        title: "Keyframe Animations",
        tag: "@keyframes / animation",
        lang: "CSS",
        description:
          "@keyframes defines a named animation sequence. The animation property applies it to an element, controlling duration, easing, and loop count.",
        component: <KeyframeDemo />,
        code: `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-20px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.floating { animation: float 2s ease-in-out infinite; }
.spinning { animation: spin  1.2s linear infinite; }`,
      },
      {
        id: "transitions",
        title: "CSS Transitions",
        tag: "transition",
        lang: "CSS",
        description:
          "Smoothly interpolates between two CSS states. Unlike animations, transitions are triggered by a state change (hover, focus, class toggle).",
        component: <TransitionDemo />,
        code: `.card {
  transition:
    transform  0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
}

.card:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
}`,
      },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    color: "pink",
    demos: [
      {
        id: "css-grid",
        title: "CSS Grid",
        tag: "display: grid",
        lang: "CSS",
        description:
          "A two-dimensional layout system. auto-fill with minmax() creates a responsive grid that adds columns as space allows — no media queries needed.",
        component: <CSSGridDemo />,
        code: `.grid-container {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

/* Named areas */
.layout {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}`,
      },
      {
        id: "flexbox",
        title: "Flexbox",
        tag: "display: flex",
        lang: "CSS",
        description:
          "A one-dimensional layout system for rows or columns. justify-content controls the main axis, align-items controls the cross axis.",
        component: <FlexboxDemo />,
        code: `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Center anything */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
      },
      {
        id: "css-variables",
        title: "CSS Custom Properties",
        tag: "var() / --custom-prop",
        lang: "CSS",
        description:
          "CSS variables (custom properties) store reusable values. Defined with -- prefix, read with var(). Can be updated at runtime with JS for live theming.",
        component: <CSSVariablesDemo />,
        code: `:root {
  --primary: #6366f1;
  --radius: 0.75rem;
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
}

/* Override with JavaScript */
document.documentElement
  .style.setProperty('--primary', '#ec4899');`,
      },
      {
        id: "scroll-snap",
        title: "Scroll Snap",
        tag: "scroll-snap-type",
        lang: "CSS",
        description:
          "Forces scroll positions to snap to defined points — perfect for carousels and paged content. No JavaScript required.",
        component: <ScrollSnapDemo />,
        code: `.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
}

.scroll-item {
  flex-shrink: 0;
  width: 200px;
  scroll-snap-align: start;
}`,
      },
    ],
  },
  {
    id: "ui",
    label: "UI Patterns",
    color: "violet",
    demos: [
      {
        id: "accordion",
        title: "Accordion",
        tag: "<details> / <summary>",
        lang: "HTML",
        description:
          "Collapsible sections that show/hide content. Native HTML uses <details>/<summary>. In React you toggle an open state and conditionally render the body.",
        component: <AccordionDemo />,
        code: `<!-- Native HTML approach -->
<details>
  <summary>Click to expand</summary>
  <p>Hidden content here.</p>
</details>

/* Style the marker */
summary { cursor: pointer; list-style: none; }
summary::after { content: "›"; float: right; }
details[open] summary::after { transform: rotate(90deg); }`,
      },
      {
        id: "modal",
        title: "Modal / Dialog",
        tag: "<dialog> / overlay",
        lang: "HTML",
        description:
          "A layer that appears above page content. The HTML5 <dialog> element handles focus trapping natively. In React you can recreate this with a fixed-position overlay and a z-index.",
        component: <ModalDemo />,
        code: `<!-- Native HTML5 dialog -->
<dialog id="modal">
  <p>Modal content</p>
  <button onclick="modal.close()">Close</button>
</dialog>

<button onclick="modal.showModal()">Open</button>

/* CSS */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}`,
      },
      {
        id: "toast",
        title: "Toast Notification",
        tag: "ephemeral UI",
        lang: "JS",
        description:
          "Short-lived messages that inform the user of an action result without interrupting their workflow. Auto-dismiss with setTimeout.",
        component: <ToastDemo />,
        code: `function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = \`toast toast--\${type}\`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('toast--exit');
    toast.addEventListener('animationend',
      () => toast.remove()
    );
  }, 3000);
}`,
      },
      {
        id: "skeleton",
        title: "Skeleton Loader",
        tag: "loading state / shimmer",
        lang: "CSS",
        description:
          "Placeholder UI that mirrors the shape of loading content. The shimmer animation uses a gradient that slides across, signaling activity.",
        component: <SkeletonDemo />,
        code: `.skeleton {
  background: linear-gradient(
    90deg,
    #1f2937 25%,
    #374151 50%,
    #1f2937 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
      },
    ],
  },
  {
    id: "js",
    label: "JavaScript APIs",
    color: "amber",
    demos: [
      {
        id: "clipboard",
        title: "Clipboard API",
        tag: "navigator.clipboard",
        lang: "JS",
        description:
          "The modern async Clipboard API lets you read/write clipboard content. It requires a secure context (HTTPS) and the user must have recently interacted with the page.",
        component: <ClipboardDemo />,
        code: `// Write to clipboard
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied!');
  } catch (err) {
    console.error('Permission denied:', err);
  }
}

// Read from clipboard
async function paste() {
  const text = await navigator.clipboard.readText();
  console.log('Pasted:', text);
}`,
      },
      {
        id: "intersection-observer",
        title: "Intersection Observer",
        tag: "IntersectionObserver API",
        lang: "JS",
        description:
          "Efficiently watches when elements enter or exit the viewport. Used for lazy-loading images, scroll-triggered animations, and infinite scroll — no scroll event listeners needed.",
        component: <IntersectionObserverDemo />,
        code: `const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // once
      }
    });
  },
  { threshold: 0.1 } // 10% visible to trigger
);

document.querySelectorAll('.fade-in')
  .forEach(el => observer.observe(el));`,
      },
      {
        id: "localstorage",
        title: "localStorage",
        tag: "Web Storage API",
        lang: "JS",
        description:
          "Key-value storage that persists across browser sessions. Synchronous and limited to ~5MB per origin. Use sessionStorage if you only want data for the current tab.",
        component: <LocalStorageDemo />,
        code: `// Store a value
localStorage.setItem('username', 'Jordan');

// Read it back (returns null if missing)
const name = localStorage.getItem('username');

// Store an object (must stringify)
localStorage.setItem('user',
  JSON.stringify({ name: 'Jordan', role: 'admin' })
);
const user = JSON.parse(localStorage.getItem('user'));

// Remove a key
localStorage.removeItem('username');`,
      },
      {
        id: "drag-drop",
        title: "Drag and Drop API",
        tag: "draggable / DataTransfer",
        lang: "JS",
        description:
          "Native browser drag-and-drop. Mark elements draggable, use dragstart to capture data, dragover to allow dropping, and drop to handle the release.",
        component: <DragDropDemo />,
        code: `// Make an element draggable
el.setAttribute('draggable', 'true');

el.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', el.id);
  e.dataTransfer.effectAllowed = 'move';
});

// Set up a drop target
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault(); // required to allow drop
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  dropZone.appendChild(document.getElementById(id));
});`,
      },
    ],
  },
];

// ─── Code Block ────────────────────────────────────────────────────────────────

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-white/10">
        <span className="text-xs text-gray-500 font-mono">{lang}</span>
        <button
          onClick={copy}
          className={`text-xs font-medium transition-colors ${copied ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"}`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-gray-300 font-mono bg-gray-900/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Demo Card ─────────────────────────────────────────────────────────────────

const langColors: Record<string, string> = {
  CSS: "text-blue-400 bg-blue-500/10 border-blue-400/20",
  HTML: "text-orange-400 bg-orange-500/10 border-orange-400/20",
  JS: "text-yellow-400 bg-yellow-500/10 border-yellow-400/20",
};

function DemoCard({ demo }: { demo: Demo }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col">
      <div className="p-5 space-y-1 border-b border-white/5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-white font-semibold">{demo.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${langColors[demo.lang] ?? "text-gray-400 bg-gray-500/10 border-gray-400/20"}`}>
            {demo.lang}
          </span>
        </div>
        <p className="text-xs text-indigo-400 font-mono">{demo.tag}</p>
        <p className="text-sm text-gray-400 leading-relaxed pt-1">{demo.description}</p>
      </div>

      <div className="p-5 border-b border-white/5">
        <p className={demoLabel}>Live Demo</p>
        <div className={demoBox}>
          {demo.component}
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={() => setShowCode((s) => !s)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${showCode ? "rotate-90" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          {showCode ? "Hide Code" : "Show Code"}
        </button>
        {showCode && (
          <div className="mt-3">
            <CodeBlock code={demo.code} lang={demo.lang} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const catAccent: Record<string, string> = {
  indigo: "bg-indigo-500 text-white",
  pink: "bg-pink-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
};
const catInactive: Record<string, string> = {
  indigo: "text-indigo-400 hover:bg-indigo-500/10",
  pink: "text-pink-400 hover:bg-pink-500/10",
  violet: "text-violet-400 hover:bg-violet-500/10",
  amber: "text-amber-400 hover:bg-amber-500/10",
};

export default function WebDevShowcase() {
  const [activeId, setActiveId] = useState("css");
  const active = categories.find((c) => c.id === activeId)!;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <Link href="/jordan" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Jordan&apos;s Section
        </Link>
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Web Dev Showcase</h1>
            <p className="text-gray-400 mt-1 max-w-2xl">
              Live examples of modern web techniques — with the name, the concept, and the code. Click any card to see how it works.
            </p>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveId(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeId === cat.id
                ? catAccent[cat.color]
                : `bg-white/[0.03] border border-white/10 ${catInactive[cat.color]}`
            }`}
          >
            {cat.label}
            <span className="ml-1.5 opacity-60 text-xs">{cat.demos.length}</span>
          </button>
        ))}
      </div>

      {/* Demo grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {active.demos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-600 text-center pb-4">
        All demos run client-side with no external dependencies · {categories.reduce((a, c) => a + c.demos.length, 0)} examples across {categories.length} categories
      </p>
    </div>
  );
}
