import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Attachment, ChatConfig, ChatSession } from './types';
import {
  readImage,
  readVideo,
  EXECUTOR_SYSTEM,
  STORAGE_KEY,
  CONFIG_KEY,
  SCRIPT_CATEGORIES,
  QUICK_PROMPTS,
} from './utils';

// ============ SIDEBAR ============
function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  activeCategory,
  onCategoryChange,
}: {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  return (
    <aside className="w-[280px] bg-[#0f0f12] border-r border-[rgba(255,255,255,0.06)] flex flex-col max-lg:hidden">
      {/* Logo */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2.5 px-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20 pulse-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-bold gradient-text">LuaForge</div>
            <div className="text-[10px] text-[#52525b] tracking-wider font-medium">EXECUTOR SCRIPTS</div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold text-white shadow-lg shadow-purple-500/15 transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Script
        </button>
      </div>

      {/* Categories */}
      <div className="px-3 pt-3 pb-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#52525b] px-2 mb-2">
          Script Categories
        </div>
        <div className="space-y-0.5">
          {SCRIPT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left transition-all duration-150 ${
                activeCategory === cat.id
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                  : 'text-[#a1a1aa] hover:bg-[rgba(255,255,255,0.03)] hover:text-white border border-transparent'
              }`}
            >
              <span className="text-[14px]">{cat.icon}</span>
              <span className="text-[12px] font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="px-3 pt-4 pb-1 flex-1 overflow-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#52525b] px-2 mb-2">
          Recent Scripts
        </div>
        <div className="space-y-0.5">
          {sessions.slice(0, 10).map((s) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all duration-150 ${
                s.id === activeId
                  ? 'bg-[rgba(255,255,255,0.05)] text-white'
                  : 'text-[#71717a] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#a1a1aa]'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40 flex-shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-[12px] truncate">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-[#52525b]">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span>Ready to generate</span>
          <span className="ml-auto text-[10px]">v2.0</span>
        </div>
      </div>
    </aside>
  );
}

// ============ SETTINGS MODAL ============
function SettingsModal({
  open,
  onClose,
  config,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  config: ChatConfig;
  onSave: (c: ChatConfig) => void;
}) {
  const [local, setLocal] = useState(config);

  useEffect(() => {
    setLocal(config);
  }, [config, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#131316] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-[500px] w-full p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Executor Settings</h2>
            <p className="text-[12px] text-[#71717a]">Configure API & generation</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">API Endpoint</label>
            <input
              className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              value={local.url}
              onChange={(e) => setLocal({ ...local, url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">API Key</label>
            <input
              type="password"
              className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              value={local.key}
              onChange={(e) => setLocal({ ...local, key: e.target.value })}
              placeholder="sk-or-..."
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">Model</label>
            <input
              className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              value={local.model}
              onChange={(e) => setLocal({ ...local, model: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">System Prompt</label>
            <textarea
              className="w-full bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all min-h-[80px] resize-y"
              value={local.system}
              onChange={(e) => setLocal({ ...local, system: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#a1a1aa] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(local); onClose(); }}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-lg shadow-purple-500/15 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ CODE BLOCK WITH COPY ============
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-4 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#0a0a0c]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[11px] font-mono font-medium text-[#71717a] ml-2">{lang}</span>
          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            Executor Script
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`text-[11px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            copied
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-[#71717a] hover:text-purple-400 hover:bg-purple-500/10'
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy Script
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-auto text-[13px] leading-relaxed m-0 max-h-[500px]">
        <code className="text-[#e5e5e5]">{code}</code>
      </pre>
    </div>
  );
}

// ============ AI MESSAGE RENDERER ============
function AIMessage({ text }: { text: string }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-[#e5e5e5]">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const m = /^```(\w+)?\n?([\s\S]*?)```$/.exec(part);
          const lang = (m && m[1]) || 'lua';
          const code = m ? m[2] : part.replace(/```/g, '');
          return <CodeBlock key={i} code={code} lang={lang} />;
        }
        if (!part) return null;
        return (
          <div key={i} className="mb-3 text-[14px] leading-[1.75]">
            {part.split('\n').map((line, j) => (
              <span key={j}>
                {line}
                {j < part.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ============ MESSAGE BUBBLE ============
function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-2">
              {message.attachments.map((a, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <img src={a.dataUrl} alt={a.name} className="max-h-[160px] object-cover" />
                </div>
              ))}
            </div>
          )}
          {message.text && (
            <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] leading-relaxed whitespace-pre-wrap shadow-lg shadow-purple-500/10">
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500/15 to-fuchsia-500/15 border border-purple-500/20 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 text-[14px] leading-relaxed pt-0.5">
        {isStreaming && !message.text ? (
          <div className="flex gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 thinking-dot" />
            <span className="w-2 h-2 rounded-full bg-purple-400 thinking-dot" />
            <span className="w-2 h-2 rounded-full bg-purple-400 thinking-dot" />
          </div>
        ) : (
          <AIMessage text={message.text || ''} />
        )}
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({
  activeCategory,
  onSuggestion,
}: {
  activeCategory: string;
  onSuggestion: (s: string) => void;
}) {
  const category = SCRIPT_CATEGORIES.find((c) => c.id === activeCategory) || SCRIPT_CATEGORIES[0];
  const prompts = QUICK_PROMPTS[activeCategory] || QUICK_PROMPTS.esp;

  return (
    <div className="flex flex-col items-center text-center py-12 animate-slide-up">
      {/* Hero */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-700 flex items-center justify-center shadow-2xl shadow-purple-500/20 pulse-glow">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#131316] border-2 border-purple-500 flex items-center justify-center text-[12px]">
          {category.icon}
        </div>
      </div>

      <h1 className="text-[26px] font-bold text-white mb-2">
        Generate <span className="gradient-text">Executor Scripts</span>
      </h1>
      <p className="text-[#a1a1aa] text-[15px] max-w-[460px] leading-relaxed mb-2">
        Complete, working Lua scripts for Synapse X, Script-Ware, KRNL, Fluxus & more.
      </p>
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[11px] text-[#52525b] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.06)]">
          {category.icon} {category.name}
        </span>
        <span className="text-[11px] text-[#52525b]">•</span>
        <span className="text-[11px] text-[#52525b]">{category.desc}</span>
      </div>

      {/* Quick prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-[560px]">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSuggestion(p)}
            className="group border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-purple-500/5 hover:border-purple-500/20 rounded-xl p-3.5 text-left transition-all duration-200"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              <span className="text-[13px] text-[#a1a1aa] group-hover:text-white transition-colors leading-snug">
                {p}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Supported executors */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] text-[#52525b] uppercase tracking-wider mr-1">Works with:</span>
        {['Synapse X', 'Script-Ware', 'KRNL', 'Fluxus', 'Hydrogen', 'Delta'].map((e) => (
          <span key={e} className="text-[10px] text-[#71717a] bg-[rgba(255,255,255,0.03)] px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.06)]">
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('esp');
  const [config, setConfig] = useState<ChatConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            url: 'https://openrouter.ai/api/v1',
            key: '',
            model: 'openai/gpt-4o-mini',
            system: EXECUTOR_SYSTEM,
          };
    } catch {
      return {
        url: 'https://openrouter.ai/api/v1',
        key: '',
        model: 'openai/gpt-4o-mini',
        system: EXECUTOR_SYSTEM,
      };
    }
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const messages = sessions.find((s) => s.id === activeId)?.messages || [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const updateMessages = useCallback(
    (newMsgs: Message[]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, messages: newMsgs } : s))
      );
    },
    [activeId]
  );

  const createNewSession = useCallback(() => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const cat = SCRIPT_CATEGORIES.find((c) => c.id === activeCategory);
    const newSession: ChatSession = {
      id,
      title: `${cat?.icon || '📜'} New ${cat?.name || 'Script'}`,
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(id);
    setAttachments([]);
    setError('');
    setMobileMenuOpen(false);
  }, [activeCategory]);

  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    } else if (!activeId) {
      setActiveId(sessions[0].id);
    }
  }, []);

  const addFiles = async (files: FileList | File[]) => {
    setError('');
    const arr = Array.from(files);
    const newAttachments: Attachment[] = [];
    for (const f of arr) {
      try {
        const item = f.type.startsWith('video/')
          ? await readVideo(f)
          : f.type.startsWith('image/')
          ? await readImage(f)
          : null;
        if (!item) throw new Error(f.name + ' is not an image or video');
        newAttachments.push(item);
      } catch (e: any) {
        setError(e.message);
      }
    }
    setAttachments((prev) => [...prev, ...newAttachments].slice(-6));
  };

  const send = async () => {
    const text = inputValue.trim();
    if ((!text && attachments.length === 0) || streaming) return;
    if (!config.key) {
      setError('No API key configured. Open settings to add your key.');
      setSettingsOpen(true);
      return;
    }
    setError('');

    const category = SCRIPT_CATEGORIES.find((c) => c.id === activeCategory);
    const contextPrefix = `[Category: ${category?.name || 'General'}] `;
    const userMsg: Message = {
      role: 'user',
      text: contextPrefix + text,
      attachments: [...attachments],
    };

    const newMessages = [...messages, userMsg];

    if (messages.length === 0) {
      const title = text.length > 35 ? text.slice(0, 35) + '...' : text;
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, title: `${category?.icon || '📜'} ${title}`, messages: newMessages } : s))
      );
    } else {
      updateMessages(newMessages);
    }

    setInputValue('');
    setAttachments([]);
    setStreaming(true);

    const apiMessages: any[] = [{ role: 'system', content: config.system }];
    for (const m of newMessages) {
      if (m.role === 'user') {
        const content: any[] = [];
        for (const a of m.attachments || []) {
          content.push({ type: 'image_url', image_url: { url: a.dataUrl } });
        }
        if (m.text) content.push({ type: 'text', text: m.text });
        apiMessages.push({
          role: 'user',
          content: content.length === 1 && content[0].type === 'text' ? content[0].text : content,
        });
      } else {
        apiMessages.push({ role: 'assistant', content: m.text || '' });
      }
    }

    const aiMsg: Message = { role: 'assistant', text: '' };
    const msgsWithAi = [...newMessages, aiMsg];
    updateMessages(msgsWithAi);

    abortRef.current = new AbortController();
    try {
      const res = await fetch(config.url + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + config.key,
        },
        body: JSON.stringify({
          model: config.model,
          messages: apiMessages,
          stream: true,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error('API ' + res.status + ': ' + t.slice(0, 300));
      }

      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          const s = line.trim();
          if (!s.startsWith('data:')) continue;
          const data = s.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta?.content || '';
            if (delta) {
              aiMsg.text += delta;
              updateMessages([...msgsWithAi.slice(0, -1), { ...aiMsg }]);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        aiMsg.text = (aiMsg.text || '') + '\n\n[Error: ' + e.message + ']';
        updateMessages([...msgsWithAi.slice(0, -1), { ...aiMsg }]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => { abortRef.current?.abort(); };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes('Files')) return;
    e.preventDefault();
    dragDepthRef.current++;
    setDragOver(true);
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = 0;
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const currentCategory = SCRIPT_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="flex h-screen bg-[#09090b] text-[#fafafa]">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={(id) => { setActiveId(id); setAttachments([]); setError(''); setMobileMenuOpen(false); }}
        onNew={createNewSession}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main
        className="flex-1 flex flex-col min-w-0 relative"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="border-2 border-dashed border-purple-500 bg-purple-500/5 rounded-2xl p-8 text-center glow-purple">
              <div className="text-4xl mb-3">📎</div>
              <p className="text-[16px] font-semibold text-white">Drop files to attach</p>
              <p className="mt-1 text-[13px] text-[#a1a1aa]">Up to 20 MB each · max 6 files</p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="h-14 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3 px-4 glass">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-purple-500/15">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[15px] gradient-text">LuaForge</span>
              <span className="text-[10px] text-[#52525b] font-medium hidden sm:inline tracking-wider">EXECUTOR SCRIPTS</span>
            </div>
          </div>

          {/* Category selector (mobile) */}
          <div className="lg:hidden ml-auto">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg px-2 py-1.5 text-[11px] text-[#a1a1aa] outline-none"
            >
              {SCRIPT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="ml-auto lg:ml-0 px-3 py-2 rounded-xl text-[12px] font-medium text-[#71717a] hover:text-white hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-[280px] h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar
                sessions={sessions}
                activeId={activeId}
                onSelect={(id) => { setActiveId(id); setAttachments([]); setError(''); setMobileMenuOpen(false); }}
                onNew={createNewSession}
                activeCategory={activeCategory}
                onCategoryChange={(c) => { setActiveCategory(c); }}
              />
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-auto" ref={scrollRef}>
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-6">
            {messages.length === 0 ? (
              <EmptyState
                activeCategory={activeCategory}
                onSuggestion={(s) => {
                  setInputValue(s);
                  textareaRef.current?.focus();
                }}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    message={m}
                    isStreaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-[rgba(255,255,255,0.06)] p-4 pb-5">
          <form
            className="max-w-[820px] mx-auto"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-[11px] text-[#71717a] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.06)]">
                <span>{currentCategory?.icon}</span>
                <span className="font-medium">{currentCategory?.name}</span>
              </div>
              <span className="text-[10px] text-[#52525b]">•</span>
              <span className="text-[10px] text-[#52525b]">Executor-ready output</span>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
                {attachments.map((a, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] group">
                    <img src={a.dataUrl} alt={a.name} className="w-24 h-16 object-cover block" />
                    {a.kind === 'video' && (
                      <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        🎬 {a.durationSec}s
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-[#f87171] text-[12px] mb-3 px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-xl animate-fade-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            {/* Input box */}
            <div className="bg-[#131316] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 focus-within:border-purple-500/30 focus-within:shadow-purple-500/5 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={`Describe the ${currentCategory?.name?.toLowerCase() || 'script'} you want...`}
                rows={1}
                className="w-full bg-transparent border-0 outline-none resize-none px-4 pt-3.5 pb-2 text-[14px] text-white placeholder-[#52525b] min-h-[48px]"
              />
              <input ref={imgInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} />
              <input ref={vidInputRef} type="file" accept="video/*" multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} />
              <div className="flex items-center gap-1 px-2 pb-2">
                <button type="button" onClick={() => imgInputRef.current?.click()} title="Attach image" className="w-8 h-8 rounded-lg text-[#52525b] hover:text-purple-400 hover:bg-purple-500/10 inline-flex items-center justify-center transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </button>
                <button type="button" onClick={() => vidInputRef.current?.click()} title="Attach video" className="w-8 h-8 rounded-lg text-[#52525b] hover:text-purple-400 hover:bg-purple-500/10 inline-flex items-center justify-center transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                </button>
                <div className="flex-1" />
                {streaming ? (
                  <button type="button" onClick={stopStreaming} className="bg-white text-black px-4 py-2 rounded-xl text-[13px] font-semibold inline-flex items-center gap-1.5 hover:bg-gray-200 transition-all shadow-md">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim() && attachments.length === 0}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 py-2 rounded-xl text-[13px] font-semibold inline-flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md shadow-purple-500/15 disabled:shadow-none"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    Generate
                  </button>
                )}
              </div>
            </div>
            <p className="text-center text-[10px] text-[#3f3f46] mt-3">
              Scripts generated for educational purposes. Use responsibly.
            </p>
          </form>
        </div>
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} config={config} onSave={setConfig} />
    </div>
  );
}
